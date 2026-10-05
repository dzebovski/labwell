import assert from "node:assert/strict";
import test from "node:test";

import { buildLlmsTxt } from "./llms.ts";
import { legacyRedirects, pendingRedirects } from "./legacy-redirects.ts";
import { listGroupSlugs, listOverviewSlugs, listProductSlugs, listTestMenuSlugs } from "./site-content/load.ts";

const siteUrl = "https://labwell.com.ua";
const text = buildLlmsTxt(siteUrl);
const links = [...text.matchAll(/^- \[([^\]]+)\]\((\S+)\): (.+)$/gm)].map(([, title, url, description]) => ({
  title,
  url,
  description,
}));

test("llms.txt follows the llmstxt.org shape: H1, summary quote, H2 sections of links", () => {
  assert.match(text, /^# LabWell\n\n> LabWell — офіційний дистриб'ютор Snibe і Bio-Rad в Україні/);
  assert.match(text, /\n> LabWell is an official distributor of Snibe and Bio-Rad in Ukraine/);
  assert.ok(text.endsWith("\n") && !text.endsWith("\n\n"));
  assert.equal(text.match(/^# /gm)?.length, 1);
  assert.ok((text.match(/^## /gm)?.length ?? 0) >= 6);
});

test("every T, G, C1 and C2 page is listed in both languages", () => {
  const paths = [
    ...listProductSlugs().map((slug) => `/products/${slug}`),
    ...listGroupSlugs().map((slug) => `/products/${slug}`),
    ...listOverviewSlugs().map((slug) => `/products/${slug}`),
    ...listTestMenuSlugs().map((slug) => `/test-menus/${slug}`),
  ];
  assert.ok(paths.length >= 30);

  for (const path of paths) {
    for (const locale of ["uk", "en"]) {
      assert.ok(links.some((link) => link.url === `${siteUrl}/${locale}${path}`), `${locale}${path}`);
    }
  }
  assert.equal(links.length, paths.length * 2);
});

test("links are absolute, unique, have a short description and never point at a redirect", () => {
  const redirected = new Set([...Object.keys(legacyRedirects), ...pendingRedirects]);

  assert.equal(new Set(links.map((link) => link.url)).size, links.length);
  for (const link of links) {
    assert.ok(link.url.startsWith(`${siteUrl}/`), link.url);
    assert.ok(link.description.length > 40, link.url);
    assert.equal(link.title.endsWith("LabWell"), false, link.title);
    const path = link.url.replace(/^https:\/\/labwell\.com\.ua\/(?:uk|en)/, "");
    assert.equal(redirected.has(path), false, link.url);
  }
  // Specific pages that used to be separate addresses now live on group pages.
  assert.equal(/\/products\/gel-testing(?![\w-])/.test(text), false);
  assert.equal(/\/products\/d-10(?![\w-])/.test(text), false);
});
