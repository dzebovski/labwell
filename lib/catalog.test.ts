import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import test from "node:test";

import { brandPages, clinicalPages, products } from "../content/index.ts";
import {
  categories,
  contentPages,
  findCatalogProblems,
  getBrandPage,
  getBreadcrumbs,
  getCategory,
  getCategoryBreadcrumbs,
  getClinicalPage,
  getListingBlocks,
  getMenuPages,
  getProduct,
  getRouteParams,
  getRouteTarget,
  type Breadcrumb,
  type ContentPage,
} from "./catalog.ts";
import { buildHeaderNavigation } from "./site-navigation.ts";

const labels = { products: "Products", clinicalDirections: "Clinical", brands: "Brands" };
const navLabels = {
  products: "Products",
  clinicalDirections: "Clinical",
  brands: "Brands",
  about: "About",
  services: "Services",
  contacts: "Contacts",
  otherSolutions: "Other solutions",
  portfolio: "Portfolio",
};

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

const simplify = (crumbs: Breadcrumb[]) =>
  crumbs.map((item) => ({
    label: item.label,
    href: item.href ?? null,
    options: item.options?.map((option) => `${option.current ? "*" : ""}${option.href}`) ?? null,
  }));

test("breadcrumbs skip Home, keep the root as text and offer sibling categories", () => {
  const crumbs = simplify(getBreadcrumbs(getProduct("biossays-240-plus")!, "uk", labels));
  assert.deepEqual(
    crumbs.map((item) => [item.label, item.href]),
    [
      ["Products", null],
      ["Обладнання / Аналізатори", "/uk/products/equipment"],
      ["Біохімічні аналізатори", "/uk/products/equipment/biochemistry"],
      ["Biossays 240 Plus", null],
    ],
  );
  assert.equal(crumbs[0].options, null);
  assert.deepEqual(crumbs[1].options, [
    "*/uk/products/equipment",
    "/uk/products/reagents",
    "/uk/products/qc-software",
  ]);
  assert.equal(crumbs[2].options?.length, 8);
  assert.ok(crumbs[2].options?.includes("*/uk/products/equipment/biochemistry"));
  assert.equal(crumbs[3].options, null);
});

test("breadcrumbs of section-less pages and brand pages", () => {
  assert.deepEqual(
    simplify(getBreadcrumbs(getProduct("gel-testing")!, "en", labels)).map((item) => item.label),
    ["Products", "Reagents and test systems", "Gel Testing"],
  );
  const clinical = simplify(getBreadcrumbs(getClinicalPage("oncology", "oncopanel-maglumi-oncomarkers")!, "en", labels));
  assert.deepEqual(clinical[1].href, "/en/clinical-directions/oncology");
  assert.equal(clinical[1].options?.length, 7);

  const overview = simplify(getBreadcrumbs(getBrandPage("snibe")!, "en", labels));
  assert.deepEqual(overview.map((item) => [item.label, item.href]), [["Brands", null], ["Snibe", null]]);
  assert.deepEqual(overview[1].options, ["/en/brands/bio-rad", "*/en/brands/snibe"]);

  const topic = simplify(getBreadcrumbs(getBrandPage("snibe", "satlars-automation")!, "en", labels));
  assert.deepEqual(topic.map((item) => [item.label, item.href]), [
    ["Brands", null],
    ["Snibe", "/en/brands/snibe"],
    ["SATLARS (Automation)", null],
  ]);
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

test("category breadcrumbs mark the category itself as current", () => {
  const crumbs = simplify(getCategoryBreadcrumbs(getCategory("catalog", "equipment", "biochemistry")!, "en", labels));
  assert.deepEqual(crumbs.map((item) => [item.label, item.href]), [
    ["Products", null],
    ["Equipment / Analyzers", "/en/products/equipment"],
    ["Biochemical analyzers", null],
  ]);
  assert.equal(crumbs[2].options?.length, 8);
  const group = simplify(getCategoryBreadcrumbs(getCategory("catalog", "equipment")!, "en", labels));
  assert.deepEqual(group.map((item) => item.href), [null, null]);
});

test("listing blocks for a group list named sections, then the default one", () => {
  const blocks = getListingBlocks("clinical", "en", "Other solutions", getCategory("clinical", "diabetes-and-metabolism"));
  assert.deepEqual(
    blocks.map((block) => [block.title, block.href ?? null, block.pages.map((page) => page.slug)]),
    [
      ["HbA1c analyzers", "/en/clinical-directions/diabetes-and-metabolism/hba1c-analyzers", ["d-100", "d-10", "variant-ii", "variant-ii-turbo"]],
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

test("header navigation links products from both catalog and clinical menus", () => {
  const nav = buildHeaderNavigation("uk", navLabels);
  const mega = (id: string) => {
    const item = nav.find((entry) => entry.id === id);
    assert.ok(item?.type === "mega");
    return item;
  };

  const diabetes = mega("clinical-directions").groups.find((group) => group.id === "diabetes-and-metabolism");
  assert.deepEqual(
    diabetes?.sections.map((section) => section.label),
    ["Аналізатори HbA1c", "Other solutions"],
  );
  assert.ok(diabetes?.sections[0].links.some((link) => link.href === "/uk/products/d-100"));

  const reagents = mega("products").groups.find((group) => group.id === "reagents");
  assert.equal(reagents?.sections[0].label, "Portfolio");

  const brandGroups = mega("brands").groups;
  assert.deepEqual(brandGroups.map((group) => group.label), ["Bio-Rad", "Snibe"]);
  assert.ok(brandGroups.every((group) => group.logo));
});
