import assert from "node:assert/strict";
import test from "node:test";

import { getProduct } from "./catalog.ts";
import { legacyRedirectRules, legacyRedirects } from "./legacy-redirects.ts";
import { listPublicPaths } from "./metadata-routes.ts";
import { loadGroup, loadTests, productsRouteKind } from "./site-content/load.ts";

const expected: Record<string, string> = {
  "/products/satlars-t8": "/products/satlars#satlars-t8",
  "/products/satlars-tca": "/products/satlars#satlars-tca",
  "/products/satlars-mini-t8": "/products/satlars#satlars-mini-t8",
  "/products/molecision-mp-32": "/products/molecision-mp#molecision-mp-32",
  "/products/molecision-mp-96": "/products/molecision-mp#molecision-mp-96",
  "/products/ih-reader-24": "/products/id-card-equipment#ih-reader-24",
  "/products/gel-testing": "/products/immunohematology-reagents#gel-testing",
  "/products/tube-testing": "/products/immunohematology-reagents#tube-testing",
  "/products/ih-systems-reagents": "/products/immunohematology-reagents#ih-systems-reagents",
  "/products/chromogenic-culture-media": "/products/culture-media#chromogenic-culture-media",
  "/products/blood-agar-media": "/products/culture-media#blood-agar-media",
  "/products/unityweb": "/products/bio-rad-software#unityweb",
  "/products/unity-real-time": "/products/bio-rad-software#unity-real-time",
  "/products/unity-next-peer-qc": "/products/bio-rad-software#unity-next-peer-qc",
  "/products/bricare": "/products/bio-rad-software#bricare",
  "/products/ih-com": "/products/bio-rad-software#ih-com",
  "/products/maglumi-clia-test-menu-278-parameters": "/test-menus/snibe-clia-test-menu",
  "/products/biochemistry-test-menu": "/test-menus/snibe-biochemistry-test-menu",
};

test("the redirect table matches section 5 of the plan", () => {
  assert.deepEqual(legacyRedirects, expected);
});

test("D-10 is not redirected: the HbA1c category page does not exist yet", () => {
  assert.equal("/products/d-10" in legacyRedirects, false);
  assert.ok(getProduct("d-10"));
});

test("every target is a built page and every anchor exists on it", () => {
  for (const destination of Object.values(legacyRedirects)) {
    const [path, anchor] = destination.split("#");
    const [, section, slug] = path.split("/");
    if (section === "test-menus") {
      assert.ok(loadTests(slug).groups.length > 0, destination);
      assert.equal(anchor, undefined, destination);
      continue;
    }
    assert.equal(productsRouteKind(slug), "group", destination);
    const items = loadGroup(slug, "uk").G3_items;
    assert.ok(items.show, destination);
    const anchors = items.items.map((item) => item.anchor);
    assert.ok(anchors.includes(anchor), `${destination}: no #${anchor}`);
  }
});

test("old addresses are gone from the catalog and the sitemap", () => {
  const publicPaths = new Set(listPublicPaths());
  for (const source of Object.keys(legacyRedirects)) {
    assert.equal(getProduct(source.replace("/products/", "")), undefined, source);
    assert.equal(publicPaths.has(source), false, source);
  }
});

test("rules are permanent and cover both locales", () => {
  const rules = legacyRedirectRules();
  assert.equal(rules.length, Object.keys(legacyRedirects).length);
  for (const rule of rules) {
    assert.equal(rule.permanent, true);
    assert.match(rule.source, /^\/:locale\(uk\|en\)\/products\//);
    assert.match(rule.destination, /^\/:locale\/(products|test-menus)\//);
  }
});
