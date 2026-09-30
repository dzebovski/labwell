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

/** Slugs that have a page: a folder in `content/products/` with at least one file. */
export function listProductSlugs(): string[] {
  const dir = path.join(contentRoot(), "products");
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => readdirSync(path.join(dir, entry.name)).length > 0)
    .map((entry) => entry.name)
    .sort();
}

export function hasProductContent(slug: string): boolean {
  return listProductSlugs().includes(slug);
}

export function loadProduct(slug: string, locale: ContentLocale): ProductContent {
  const key = `${slug}/${locale}/${contentRoot()}`;
  const cached = productCache.get(key);
  if (cached) return cached;

  const file = path.join(contentRoot(), "products", slug, `${locale}.json`);
  const product = readJson(file, productSchema);

  if (product.slug !== slug) {
    throw new SiteContentError(file, `"slug" is "${product.slug}", but the folder is "${slug}"`);
  }
  if (product.url !== `/products/${slug}`) {
    throw new SiteContentError(file, `"url" is "${product.url}", expected "/products/${slug}"`);
  }

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
