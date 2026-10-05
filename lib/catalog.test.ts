import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import test from "node:test";

import { brandPages, clinicalPages, products } from "../content/index.ts";
import {
  categories,
  contentPages,
  findCatalogProblems,
  getBrandPage,
  getCategory,
  getClinicalPage,
  getListingBlocks,
  getMenuPages,
  getProduct,
  getRouteParams,
  getRouteTarget,
  listPages,
  type ContentPage,
} from "./catalog.ts";

test("content catalog is consistent", () => {
  assert.deepEqual(findCatalogProblems(), []);
});

test("every content file is registered in content/index.ts", async () => {
  const registry = { products, clinical: clinicalPages, "brand-pages": brandPages };
  for (const [folder, registered] of Object.entries(registry)) {
    const files = readdirSync(new URL(`../content/${folder}/`, import.meta.url)).filter((file) =>
      file.endsWith(".ts"),
    );
    for (const file of files) {
      const { default: entry } = await import(`../content/${folder}/${file}`);
      assert.ok(
        (registered as readonly unknown[]).includes(entry),
        `content/${folder}/${file} is not listed in content/index.ts`,
      );
    }
    assert.equal(files.length, registered.length, `content/${folder} has unregistered or duplicate entries`);
  }
});

test("derives canonical URLs from the content kind", () => {
  assert.equal(getProduct("maglumi-x10")?.path, "/products/maglumi-x10");
  assert.equal(
    getClinicalPage("oncology", "oncopanel-maglumi-oncomarkers")?.path,
    "/clinical-directions/oncology/oncopanel-maglumi-oncomarkers",
  );
  assert.equal(getBrandPage("snibe")?.path, "/brands/snibe");
  assert.equal(getBrandPage("snibe", "satlars-automation")?.path, "/brands/snibe/satlars-automation");
  assert.equal(getProduct("does-not-exist"), undefined);
  assert.equal(getClinicalPage("oncology", "maglumi-thyroid-panel"), undefined);
});

test("every product is placed in the catalog first", () => {
  for (const page of contentPages.filter((item) => item.kind === "product")) {
    assert.equal(page.placements[0].menu, "catalog", page.path);
  }
});

test("reports duplicate URLs, bad slugs and unknown menu places", () => {
  const [page] = contentPages;
  const broken: ContentPage[] = [
    page,
    page,
    { ...page, path: "/products/Bad Slug", slug: "Bad Slug" },
    { ...page, path: "/products/x", slug: "x", placements: [{ menu: "catalog", group: "nope", order: 0 }] },
    {
      ...page,
      path: "/products/y",
      slug: "y",
      placements: [{ menu: "catalog", group: "equipment", section: "nope", order: 0 }],
    },
  ];
  const problems = findCatalogProblems(broken);
  assert.ok(problems.some((item) => item.startsWith("Duplicate URL")));
  assert.ok(problems.some((item) => item.startsWith("Invalid slug")));
  assert.ok(problems.some((item) => item.includes('unknown catalog group "nope"')));
  assert.ok(problems.some((item) => item.includes('unknown section "nope"')));
});

test("category pages exist only for non-empty groups and sections", () => {
  assert.ok(getCategory("catalog", "equipment"));
  assert.ok(getCategory("catalog", "equipment", "biochemistry"));
  assert.ok(getCategory("clinical", "diabetes-and-metabolism", "hba1c-analyzers"));
  assert.equal(getCategory("catalog", "equipment", "nope"), undefined);
  assert.equal(getCategory("catalog", "reagents", "nope"), undefined);
  for (const category of categories) {
    assert.ok(getListingBlocks(category.menu, "en", "Other", category).some((block) => block.pages.length > 0));
  }
});

test("listing blocks for a group list named sections, then the default one", () => {
  const blocks = getListingBlocks("clinical", "en", "Other solutions", getCategory("clinical", "diabetes-and-metabolism"));
  assert.deepEqual(
    blocks.map((block) => [block.title, block.href ?? null, block.pages.map((page) => page.slug)]),
    [
      ["HbA1c analyzers", "/en/clinical-directions/diabetes-and-metabolism/hba1c-analyzers", ["d-100", "variant-ii", "variant-ii-turbo"]],
      ["Other solutions", null, ["metabolic-panel"]],
    ],
  );
  const reagents = getListingBlocks("catalog", "en", "Portfolio", getCategory("catalog", "reagents"));
  assert.equal(reagents.length, 1);
  assert.equal(reagents[0].title, undefined);
  assert.deepEqual(
    getListingBlocks("brands", "en", "Portfolio").map((block) => [block.title, block.href, block.pages.length]),
    [["Bio-Rad", "/en/brands/bio-rad", 5], ["Snibe", "/en/brands/snibe", 5]],
  );
});

test("routes resolve both content pages and categories", () => {
  assert.equal(getRouteTarget("/products/maglumi-x10")?.type, "page");
  assert.equal(getRouteTarget("/products/equipment")?.type, "category");
  assert.equal(getRouteTarget("/clinical-directions/diabetes-and-metabolism/hba1c-analyzers")?.type, "category");
  assert.equal(getRouteTarget("/clinical-directions/diabetes-and-metabolism/metabolic-panel")?.type, "page");
  assert.equal(getRouteTarget("/products/unknown"), undefined);

  const oneLevel = getRouteParams("/products", ["slug"]).map((params) => params.slug);
  assert.ok(oneLevel.includes("maglumi-x10") && oneLevel.includes("equipment"));
  assert.deepEqual(getRouteParams("/products", ["slug", "sectionSlug"]).find((params) => params.sectionSlug === "clia"), {
    slug: "equipment",
    sectionSlug: "clia",
  });
});

test("reports category URLs that clash with content pages", () => {
  const [page] = contentPages;
  const clash = { ...page, path: "/products/equipment", slug: "equipment" };
  assert.ok(findCatalogProblems([clash]).some((item) => item.includes("Category URL /products/equipment")));
});

test("menu order follows the registry, with explicit order overrides", () => {
  const autoimmune = getMenuPages("clinical", "autoimmune-diseases").map((page) => page.path);
  assert.deepEqual(autoimmune, [
    "/clinical-directions/autoimmune-diseases/systemic-autoimmune-tests",
    "/clinical-directions/autoimmune-diseases/vasculitis",
    "/products/bioplex-2200-system",
  ]);
});

test("reports SEO titles with the site name, duplicate titles and missing item types", () => {
  const product = getProduct("maglumi-x8")!;
  const other = getProduct("maglumi-x6")!;
  const x3 = getProduct("maglumi-x3")!;
  const problems = findCatalogProblems([
    product,
    { ...other, seoTitle: product.seoTitle, itemType: undefined, description: { uk: " ", en: "" } },
    { ...x3, seoTitle: { uk: "MAGLUMI X3 | Labwell", en: "MAGLUMI X3 | Labwell" } },
  ]);
  assert.ok(problems.some((item) => item.includes('must not end with "Labwell" (uk)')));
  assert.ok(problems.some((item) => item.includes("seoTitle duplicates /products/maglumi-x8 (en)")));
  assert.ok(problems.some((item) => item.includes("products need an itemType (uk)")));
  assert.ok(problems.some((item) => item.includes("empty description (en)")));
});

test("every product has a name, type and SEO title in both languages", () => {
  for (const page of listPages("product")) {
    for (const locale of ["uk", "en"] as const) {
      assert.ok(page.navLabel[locale], `${page.path}: navLabel (${locale})`);
      assert.ok(page.itemType?.[locale], `${page.path}: itemType (${locale})`);
      assert.ok(!page.seoTitle[locale].includes("Labwell"), `${page.path}: seoTitle (${locale})`);
    }
  }
});
