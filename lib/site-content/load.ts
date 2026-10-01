/**
 * Reads and validates `content/` (product pages and shared blocks).
 * Runs at build time; every problem throws an error that names the file and the
 * offending path, so the build fails instead of producing an empty page.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { z } from "zod";

import {
  productSchema,
  sharedSchema,
  type ProductContent,
  type SharedContent,
} from "./schema.ts";
import {
  groupSchema,
  overviewSchema,
  testMenuSchema,
  testsSchema,
  type GroupContent,
  type OverviewContent,
  type TestMenuContent,
  type TestsContent,
} from "./schema-pages.ts";

export const contentLocales = ["uk", "en"] as const;
export type ContentLocale = (typeof contentLocales)[number];

/** `SITE_CONTENT_DIR` overrides the folder (used by tests). */
function contentRoot() {
  return process.env.SITE_CONTENT_DIR ?? path.join(process.cwd(), "content");
}

const productCache = new Map<string, ProductContent>();
const sharedCache = new Map<string, SharedContent>();

export class SiteContentError extends Error {
  constructor(file: string, detail: string) {
    super(`Site content error in ${path.relative(process.cwd(), file) || file}:\n${detail}`);
    this.name = "SiteContentError";
  }
}

function readJson<T>(file: string, schema: z.ZodType<T>): T {
  let raw: string;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    throw new SiteContentError(file, "file is missing or unreadable");
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    throw new SiteContentError(file, `invalid JSON: ${(error as Error).message}`);
  }

  const result = schema.safeParse(data);
  if (!result.success) throw new SiteContentError(file, z.prettifyError(result.error));
  return result.data;
}

/** Slugs that have a page: a folder in `content/{section}/` with at least one file. */
function listSlugs(section: "products" | "groups" | "overviews" | "test-menus"): string[] {
  const dir = path.join(contentRoot(), section);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => readdirSync(path.join(dir, entry.name)).length > 0)
    .map((entry) => entry.name)
    .sort();
}

export function listProductSlugs(): string[] {
  return listSlugs("products");
}

export function listGroupSlugs(): string[] {
  return listSlugs("groups");
}

export function listOverviewSlugs(): string[] {
  return listSlugs("overviews");
}

export function listTestMenuSlugs(): string[] {
  return listSlugs("test-menus");
}

export function hasProductContent(slug: string): boolean {
  return listProductSlugs().includes(slug);
}

export function hasGroupContent(slug: string): boolean {
  return listGroupSlugs().includes(slug);
}

export function hasOverviewContent(slug: string): boolean {
  return listOverviewSlugs().includes(slug);
}

export function hasTestMenuContent(slug: string): boolean {
  return listTestMenuSlugs().includes(slug);
}

/** What `/products/{slug}` renders from `content/`; products win over groups, groups over overviews. */
export type ProductsRouteKind = "product" | "group" | "overview";

export function productsRouteKind(slug: string): ProductsRouteKind | undefined {
  if (hasProductContent(slug)) return "product";
  if (hasGroupContent(slug)) return "group";
  if (hasOverviewContent(slug)) return "overview";
  return undefined;
}

function checkIdentity(
  file: string,
  page: { slug: string; url: string },
  slug: string,
  url: string,
) {
  if (page.slug !== slug) {
    throw new SiteContentError(file, `"slug" is "${page.slug}", but the folder is "${slug}"`);
  }
  if (page.url !== url) {
    throw new SiteContentError(file, `"url" is "${page.url}", expected "${url}"`);
  }
}

const pageCache = new Map<string, unknown>();

function cached<T>(key: string, read: () => T): T {
  if (pageCache.has(key)) return pageCache.get(key) as T;
  const value = read();
  pageCache.set(key, value);
  return value;
}

export function loadGroup(slug: string, locale: ContentLocale): GroupContent {
  return cached(`group/${slug}/${locale}/${contentRoot()}`, () => {
    const file = path.join(contentRoot(), "groups", slug, `${locale}.json`);
    const group = readJson(file, groupSchema);
    checkIdentity(file, group, slug, `/products/${slug}`);
    return group;
  });
}

export function loadOverview(slug: string, locale: ContentLocale): OverviewContent {
  return cached(`overview/${slug}/${locale}/${contentRoot()}`, () => {
    const file = path.join(contentRoot(), "overviews", slug, `${locale}.json`);
    const overview = readJson(file, overviewSchema);
    checkIdentity(file, overview, slug, `/products/${slug}`);
    return overview;
  });
}

export function loadTestMenu(slug: string, locale: ContentLocale): TestMenuContent {
  return cached(`menu/${slug}/${locale}/${contentRoot()}`, () => {
    const file = path.join(contentRoot(), "test-menus", slug, `${locale}.json`);
    const menu = readJson(file, testMenuSchema);
    checkIdentity(file, menu, slug, `/test-menus/${slug}`);
    return menu;
  });
}

/** Groups and test names of a menu: one file for both languages. */
export function loadTests(slug: string): TestsContent {
  return cached(`tests/${slug}/${contentRoot()}`, () =>
    readJson(path.join(contentRoot(), "test-menus", slug, "tests.json"), testsSchema),
  );
}

export function loadProduct(slug: string, locale: ContentLocale): ProductContent {
  const key = `${slug}/${locale}/${contentRoot()}`;
  const cached = productCache.get(key);
  if (cached) return cached;

  const file = path.join(contentRoot(), "products", slug, `${locale}.json`);
  const product = readJson(file, productSchema);

  checkIdentity(file, product, slug, `/products/${slug}`);

  productCache.set(key, product);
  return product;
}

export function loadShared(locale: ContentLocale): SharedContent {
  const key = `${locale}/${contentRoot()}`;
  const cached = sharedCache.get(key);
  if (cached) return cached;

  const shared = readJson(path.join(contentRoot(), "shared", `${locale}.json`), sharedSchema);
  sharedCache.set(key, shared);
  return shared;
}

/** Validates every locale file of one product; throws on the first problem. */
export function loadProductAllLocales(slug: string) {
  return contentLocales.map((locale) => loadProduct(slug, locale));
}

/** Validates all files of a group, overview or test menu; throws on the first problem. */
export function loadGroupAllLocales(slug: string) {
  return contentLocales.map((locale) => loadGroup(slug, locale));
}

export function loadOverviewAllLocales(slug: string) {
  return contentLocales.map((locale) => loadOverview(slug, locale));
}

export function loadTestMenuAllLocales(slug: string) {
  loadTests(slug);
  return contentLocales.map((locale) => loadTestMenu(slug, locale));
}
