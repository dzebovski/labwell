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

test("allows production crawling except for service routes, AI crawlers included", () => {
  const robots = buildRobots(productionUrl);
  assert.equal(robots.sitemap, `${productionUrl}/sitemap.xml`);

  const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
  assert.deepEqual(rules[0], { userAgent: "*", allow: "/", disallow: ["/design"] });

  // No group blocks the site; every named AI crawler has its own group that allows "/" and keeps /design closed.
  assert.ok(rules.every((rule) => !([] as string[]).concat(rule.disallow ?? []).includes("/")));
  const named = rules.flatMap((rule) => ([] as string[]).concat(rule.userAgent ?? []));
  for (const bot of ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) {
    assert.ok(named.includes(bot), bot);
  }
  const aiRule = rules.find((rule) => ([] as string[]).concat(rule.userAgent ?? []).includes("GPTBot"));
  assert.deepEqual(aiRule?.allow, "/");
  assert.deepEqual(aiRule?.disallow, ["/design"]);
});
