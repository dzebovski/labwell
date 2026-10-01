import assert from "node:assert/strict";
import test from "node:test";

import { buildRobots, buildSitemap, listPublicPaths } from "./metadata-routes.ts";

const productionUrl = "https://labwell.com.ua";

test("builds localized sitemap entries from public route sources", () => {
  const paths = listPublicPaths();
  const sitemap = buildSitemap(productionUrl);

  assert.equal(sitemap.length, paths.length * 2);
  assert.ok(sitemap.some(({ url }) => url === `${productionUrl}/uk/products/maglumi-x3`));
  assert.ok(sitemap.some(({ url }) => url === `${productionUrl}/en/products/maglumi-x3`));
  assert.ok(sitemap.some(({ url }) => url === `${productionUrl}/uk/brands/snibe`));
  assert.ok(sitemap.some(({ url }) => url === `${productionUrl}/en/clinical-directions/oncology`));

  for (const entry of sitemap) {
    assert.ok(entry.url.startsWith(`${productionUrl}/`), entry.url);
    const languages = entry.alternates?.languages;
    assert.deepEqual(Object.keys(languages ?? {}).sort(), ["en", "uk"]);
    assert.ok(languages?.uk?.startsWith(`${productionUrl}/uk`));
    assert.ok(languages?.en?.startsWith(`${productionUrl}/en`));
  }
});

test("includes template T products and excludes service and redirect-only routes", () => {
  const paths = listPublicPaths();

  assert.ok(paths.includes("/products/variant-nbs-newborn-screening-system"));
  // Group, overview and test menu pages from content/ are public too.
  assert.ok(paths.includes("/products/maglumi-m-series"));
  assert.ok(paths.includes("/products/maglumi"));
  assert.ok(paths.includes("/test-menus/snibe-clia-test-menu"));
  assert.ok(!paths.some((path) => path.startsWith("/design")));
  assert.ok(!paths.includes("/products/software"));
  assert.ok(!paths.includes("/products/quality-control/controls"));
});

test("blocks the test hosting origin from indexing", () => {
  assert.deepEqual(buildRobots("https://labwell.vercel.app/"), {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: "https://labwell.vercel.app/sitemap.xml",
  });
});

test("allows production crawling except for service routes", () => {
  assert.deepEqual(buildRobots(productionUrl), {
    rules: { userAgent: "*", allow: "/", disallow: ["/design"] },
    sitemap: `${productionUrl}/sitemap.xml`,
  });
});
