import assert from "node:assert/strict";
import test from "node:test";

import {
  getBrandProductsTrail,
  getCategoryTrail,
  getFallbackTrail,
  getPageTrail,
  getRootTrail,
  getStaticTrail,
  trailCrumbs,
} from "./breadcrumbs.ts";
import { contentPages, getCategory } from "./catalog.ts";
import { breadcrumbListLd } from "./site-content/jsonld.ts";

const flat = (path: string, locale: "uk" | "en" = "uk") => {
  const trail = getPageTrail(path, locale);
  assert.ok(trail, path);
  return trailCrumbs(trail).map((crumb) => [crumb.label, crumb.href ?? null]);
};

test("a product is shown under the catalog: Home → Products → type → direction → page", () => {
  assert.deepEqual(flat("/products/maglumi-x8"), [
    ["Головна", "/uk"],
    ["Каталог продукції", "/uk/products"],
    ["Лабораторне обладнання", "/uk/products/equipment"],
    ["Імуноаналіз", "/uk/products/equipment/clia"],
    ["MAGLUMI X8", null],
  ]);
});

test("group, overview, test menu and a page without directions follow the same rule", () => {
  assert.deepEqual(flat("/products/maglumi-m-series").map(([label]) => label), [
    "Головна", "Каталог продукції", "Лабораторне обладнання", "Імуноаналіз", "MAGLUMI M Series",
  ]);
  assert.deepEqual(flat("/products/maglumi").at(-1), ["Аналізатори MAGLUMI X", null]);
  assert.deepEqual(flat("/test-menus/snibe-clia-test-menu", "en"), [
    ["Home", "/en"],
    ["Product catalog", "/en/products"],
    ["Reagents and tests", "/en/products/reagents"],
    ["MAGLUMI CLIA test menu", null],
  ]);
  assert.deepEqual(flat("/products/bio-rad-software").map(([label]) => label), [
    "Головна", "Каталог продукції", "Контроль якості та ПЗ", "Програмне забезпечення", "Програмне забезпечення Bio-Rad",
  ]);
});

test("Home comes first, ancestors are links and the last level is not", () => {
  for (const page of contentPages) {
    for (const locale of ["uk", "en"] as const) {
      const trail = getPageTrail(page.path, locale)!;
      assert.equal(trail.items[0].href, `/${locale}`, page.path);
      assert.ok(trail.items.slice(0, 2).every((crumb) => crumb.href), page.path);
      assert.equal("href" in trail.current, false, page.path);
      assert.equal(trailCrumbs(trail).at(-1)?.href, undefined, page.path);
    }
  }
});

test("clinical and brand pages keep their own roots", () => {
  assert.deepEqual(flat("/clinical-directions/oncology/oncopanel-maglumi-oncomarkers").map(([label]) => label), [
    "Головна", "Клінічні напрямки", "Онкологія", "Онкопанель MAGLUMI (Онкомаркери)",
  ]);
  assert.deepEqual(flat("/brands/snibe/satlars-automation").slice(0, 3), [
    ["Головна", "/uk"], ["Бренди", "/uk/brands"], ["Snibe", "/uk/brands/snibe"],
  ]);
  assert.deepEqual(flat("/brands/snibe").map(([label]) => label), ["Головна", "Бренди", "Про компанію Snibe"]);
});

test("the switcher appears only with two or more neighbours and lists their key figure", () => {
  const x8 = getPageTrail("/products/maglumi-x8", "uk")!.switcher!;
  assert.equal(x8.title, "Імуноаналіз · Snibe · 6 позицій");
  assert.deepEqual(x8.options.find((option) => option.current), {
    label: "MAGLUMI X8", meta: "до 600 тестів/год", href: "/uk/products/maglumi-x8", current: true,
  });
  assert.deepEqual(x8.all, { label: "Усе в розділі «Імуноаналіз»", href: "/uk/products/equipment/clia" });
  assert.equal(x8.options.filter((option) => option.current).length, 1);

  // Hemostasis holds one page: nothing to switch to.
  assert.equal(getPageTrail("/products/hemolumi-h6", "uk")!.switcher, undefined);
  // Only catalog pages have a switcher.
  assert.equal(getPageTrail("/clinical-directions/oncology/oncopanel-maglumi-oncomarkers", "uk")!.switcher, undefined);
  // The page about to be redirected is not offered.
  const hba1c = getPageTrail("/products/d-100", "uk")!.switcher!;
  assert.equal(hba1c.options.some((option) => option.href.endsWith("/d-10")), false);
  assert.equal(hba1c.options.length, 4);
});

test("a switcher of a directionless type lists the type's pages", () => {
  const trail = getPageTrail("/products/culture-media", "en")!;
  assert.equal(trail.switcher?.options.length, 4);
  assert.equal(trail.switcher?.all.href, "/en/products/reagents");
});

test("categories, roots and static pages", () => {
  const section = getCategoryTrail(getCategory("catalog", "equipment", "clia")!, "uk");
  assert.deepEqual(trailCrumbs(section).map((crumb) => crumb.label), [
    "Головна", "Каталог продукції", "Лабораторне обладнання", "Імуноаналіз",
  ]);
  const group = getCategoryTrail(getCategory("catalog", "equipment")!, "uk");
  assert.deepEqual(trailCrumbs(group).map((crumb) => crumb.label), ["Головна", "Каталог продукції", "Лабораторне обладнання"]);
  assert.deepEqual(trailCrumbs(getRootTrail("brands", "en")), [{ label: "Home", href: "/en" }, { label: "Brands" }]);
  assert.deepEqual(trailCrumbs(getStaticTrail("Контакти", "uk")), [{ label: "Головна", href: "/uk" }, { label: "Контакти" }]);
  assert.deepEqual(trailCrumbs(getBrandProductsTrail("snibe", "Усі продукти Snibe", "uk")).map((crumb) => crumb.label), [
    "Головна", "Бренди", "Snibe", "Усі продукти Snibe",
  ]);
});

test("a page outside the catalog falls back to the labels of the content", () => {
  const trail = getFallbackTrail(["Головна", "Продукція", "Реагенти", "Demo"], "uk");
  assert.deepEqual(trailCrumbs(trail), [
    { label: "Головна", href: "/uk" },
    { label: "Продукція", href: "/uk/products" },
    { label: "Реагенти", href: undefined },
    { label: "Demo" },
  ]);
});

test("BreadcrumbList is built from the visible trail", () => {
  const trail = getPageTrail("/products/maglumi-x8", "uk")!;
  const ld = breadcrumbListLd(trailCrumbs(trail), "https://example.com/uk/products/maglumi-x8", "https://example.com");
  const items = ld.itemListElement as Array<{ name: string; item: string; position: number }>;
  assert.deepEqual(items.map((item) => item.name), trailCrumbs(trail).map((crumb) => crumb.label));
  assert.equal(items.at(-1)?.item, "https://example.com/uk/products/maglumi-x8");
  assert.equal(items[0].item, "https://example.com/uk");
  assert.deepEqual(items.map((item) => item.position), [1, 2, 3, 4, 5]);
});
