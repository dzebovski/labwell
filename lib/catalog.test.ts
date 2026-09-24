import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import test from "node:test";

import { brandPages, clinicalPages, products } from "../content/index.ts";
import {
  contentPages,
  findCatalogProblems,
  getBrandPage,
  getBreadcrumbs,
  getClinicalPage,
  getMenuPages,
  getProduct,
  type ContentPage,
} from "./catalog.ts";
import { buildHeaderNavigation } from "./site-navigation.ts";

const labels = { home: "Home", products: "Products", clinicalDirections: "Clinical", brands: "Brands" };
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

test("builds breadcrumbs from the canonical placement", () => {
  const crumbs = (page: ContentPage | undefined) =>
    getBreadcrumbs(page!, "en", labels).map((item) => [item.label, item.href ?? null]);

  assert.deepEqual(crumbs(getProduct("maglumi-x10")), [
    ["Home", "/en"],
    ["Products", "/en/products"],
    ["Equipment / Analyzers", null],
    ["Immunochemical analyzers (CLIA)", null],
    ["MAGLUMI X10", null],
  ]);
  assert.deepEqual(crumbs(getProduct("gel-testing")).slice(2), [
    ["Reagents and test systems", null],
    ["Gel Testing", null],
  ]);
  assert.deepEqual(crumbs(getClinicalPage("oncology", "oncopanel-maglumi-oncomarkers")).slice(1, 3), [
    ["Clinical", "/en/clinical-directions"],
    ["Oncology", null],
  ]);
  assert.deepEqual(crumbs(getBrandPage("snibe")).slice(2), [["Snibe", null]]);
  assert.deepEqual(crumbs(getBrandPage("snibe", "satlars-automation")).slice(2), [
    ["Snibe", "/en/brands/snibe"],
    ["SATLARS (Automation)", null],
  ]);
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
