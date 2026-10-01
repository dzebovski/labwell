import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test, { afterEach, beforeEach } from "node:test";

import { group, overview, testMenu, tests } from "./fixtures-pages.ts";
import {
  listGroupSlugs,
  listOverviewSlugs,
  listTestMenuSlugs,
  loadGroup,
  loadGroupAllLocales,
  loadOverview,
  loadOverviewAllLocales,
  loadTestMenu,
  loadTestMenuAllLocales,
  loadTests,
  productsRouteKind,
} from "./load.ts";
import { product } from "./fixtures.ts";

let root: string;

function write(relative: string, data: unknown) {
  const file = path.join(root, relative);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, typeof data === "string" ? data : JSON.stringify(data));
}

beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), "site-content-pages-"));
  process.env.SITE_CONTENT_DIR = root;
});

afterEach(() => {
  delete process.env.SITE_CONTENT_DIR;
  rmSync(root, { recursive: true, force: true });
});

test("loads a group, a test menu with its tests.json and an overview", () => {
  write("groups/demo-series/uk.json", group());
  write("test-menus/demo-menu/uk.json", testMenu());
  write("test-menus/demo-menu/tests.json", tests());
  write("overviews/demo-x/uk.json", overview());

  assert.equal(loadGroup("demo-series", "uk").G1_hero.h1, "Demo Series — аналізатори");
  assert.equal(loadTestMenu("demo-menu", "uk").kind, "test-menu");
  assert.equal(loadTests("demo-menu").groups.length, 2);
  assert.equal(loadOverview("demo-x", "uk").C2_compare.show, true);
});

test("/products/{slug} is decided by content/: product, then group, then overview", () => {
  write("products/a/uk.json", product({ slug: "a", url: "/products/a" }));
  write("groups/b/uk.json", group({ slug: "b", url: "/products/b" }));
  write("overviews/c/uk.json", overview({ slug: "c", url: "/products/c" }));
  write("groups/a/uk.json", group({ slug: "a", url: "/products/a" }));

  assert.equal(productsRouteKind("a"), "product");
  assert.equal(productsRouteKind("b"), "group");
  assert.equal(productsRouteKind("c"), "overview");
  assert.equal(productsRouteKind("d"), undefined);
  assert.deepEqual(listGroupSlugs(), ["a", "b"]);
  assert.deepEqual(listOverviewSlugs(), ["c"]);
});

test("test menu slugs come from content/test-menus", () => {
  write("test-menus/demo-menu/uk.json", testMenu());
  mkdirSync(path.join(root, "test-menus", "empty"));

  assert.deepEqual(listTestMenuSlugs(), ["demo-menu"]);
});

test("slug and url must match the folder and the route", () => {
  write("groups/demo-series/uk.json", group({ slug: "other" }));
  assert.throws(() => loadGroup("demo-series", "uk"), /groups\/demo-series\/uk\.json[\s\S]*"slug" is "other"/);

  write("test-menus/demo-menu/uk.json", testMenu({ url: "/products/demo-menu" }));
  assert.throws(() => loadTestMenu("demo-menu", "uk"), /expected "\/test-menus\/demo-menu"/);

  write("overviews/demo-x/uk.json", overview({ url: "/test-menus/demo-x" }));
  assert.throws(() => loadOverview("demo-x", "uk"), /expected "\/products\/demo-x"/);
});

test("a misspelled key in a group names the file and the path", () => {
  const broken = group();
  (broken.G3_items as { items: Array<Record<string, unknown>> }).items[0].keyfacts = [];
  write("groups/demo-series/uk.json", broken);

  assert.throws(() => loadGroup("demo-series", "uk"), /groups\/demo-series\/uk\.json[\s\S]*G3_items\.items\[0\]/);
});

test("a group with both G2 blocks shown, or a dead anchor, or a wrong value count, fails", () => {
  write("groups/both/uk.json", group({ slug: "both", url: "/products/both", G2_sections: { show: true, h2: "Лінійки", items: [{ anchor: "demo-a", title: "A", text: "T", href: "#demo-a" }] } }));
  assert.throws(() => loadGroup("both", "uk"), /G2_compare and G2_sections are both shown/);

  const deadAnchor = group({ slug: "dead", url: "/products/dead" });
  deadAnchor.G1_hero.models![0].anchor = "nowhere";
  write("groups/dead/uk.json", deadAnchor);
  assert.throws(() => loadGroup("dead", "uk"), /anchor "nowhere" has no item[\s\S]*G1_hero\.models\[0\]\.anchor/);

  const wrongCount = group({ slug: "count", url: "/products/count" });
  if (wrongCount.G2_compare.show) wrongCount.G2_compare.rows[0].values = ["16"];
  write("groups/count/uk.json", wrongCount);
  assert.throws(() => loadGroup("count", "uk"), /G2_compare\.rows\[0\]/);
});

test("duplicate anchors in G3 fail", () => {
  const dup = group({ slug: "dup", url: "/products/dup" });
  if (dup.G3_items.show) dup.G3_items.items[1].anchor = "demo-a";
  write("groups/dup/uk.json", dup);

  assert.throws(() => loadGroup("dup", "uk"), /duplicate anchor "demo-a"/);
});

test("tests.json: one id means one test name; group ids are unique", () => {
  const conflicting = tests();
  conflicting.groups[1].tests[0] = { id: "t-anti-tpo", name: "Anti-TPO IgG" };
  write("test-menus/demo-menu/tests.json", conflicting);
  assert.throws(() => loadTests("demo-menu"), /one id must mean one test name/);

  const duplicateGroup = tests();
  duplicateGroup.groups[1].id = "thyroid";
  write("test-menus/other/tests.json", duplicateGroup);
  assert.throws(() => loadTests("other"), /duplicate group id "thyroid"/);
});

test("a test menu label without {count} fails", () => {
  const menu = testMenu();
  if (menu.C1_search.show) menu.C1_search.foundLabel = "Знайдено";
  write("test-menus/demo-menu/uk.json", menu);

  assert.throws(() => loadTestMenu("demo-menu", "uk"), /\{count\}[\s\S]*C1_search\.foundLabel/);
});

test("an overview row must have a value for every model and nothing else", () => {
  const missing = overview();
  if (missing.C2_compare.show) missing.C2_compare.rows[0].values = { "demo-x1": "до 200" };
  write("overviews/demo-x/uk.json", missing);
  assert.throws(() => loadOverview("demo-x", "uk"), /no value for "demo-x2"/);

  const extra = overview({ slug: "extra", url: "/products/extra" });
  if (extra.C2_compare.show) extra.C2_compare.rows[0].values["demo-x9"] = "1";
  write("overviews/extra/uk.json", extra);
  assert.throws(() => loadOverview("extra", "uk"), /"demo-x9" is not a model/);
});

test("a missing language file fails with the file name", () => {
  write("groups/demo-series/uk.json", group());

  assert.throws(() => loadGroupAllLocales("demo-series"), /groups\/demo-series\/en\.json[\s\S]*missing/);
});

test("the pilot pages in content/ are valid in both languages", () => {
  delete process.env.SITE_CONTENT_DIR;

  for (const slug of ["maglumi-m-series", "immunohematology-reagents"]) {
    const [uk, en] = loadGroupAllLocales(slug);
    assert.equal(uk.slug, slug);
    assert.equal(en.url, `/products/${slug}`);
  }
  loadOverviewAllLocales("maglumi");
  loadTestMenuAllLocales("snibe-clia-test-menu");
});
