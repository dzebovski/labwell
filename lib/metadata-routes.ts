import type { MetadataRoute } from "next";

import { locales, type Locale } from "../i18n/config.ts";
import { brandProductsPath, getBrandsWithProducts, getRouteParams } from "./catalog.ts";
import { withLocale } from "./locale-routing.ts";
import { listGroupSlugs, listOverviewSlugs, listProductSlugs, listTestMenuSlugs } from "./site-content/load.ts";

/** Public static pages that do not need their own generateStaticParams. */
const staticPaths = [
  "/",
  "/products",
  "/clinical-directions",
  "/brands",
  "/services",
  "/about",
  "/contacts",
] as const;

/** Non-public routes that production crawlers must not visit. */
export const servicePaths = ["/design"] as const;

function joinRouteParams(
  prefix: string,
  names: readonly string[],
  params: readonly Record<string, string>[],
): string[] {
  return params.map((entry) => `${prefix}/${names.map((name) => entry[name]).join("/")}`);
}

/**
 * Canonical public paths, using the same registries as the dynamic routes'
 * generateStaticParams functions.
 */
export function listPublicPaths(): string[] {
  const productSlugs = new Set([
    ...getRouteParams("/products", ["slug"]).map(({ slug }) => slug),
    ...listProductSlugs(),
    ...listGroupSlugs(),
    ...listOverviewSlugs(),
  ]);

  const paths = [
    ...staticPaths,
    ...[...productSlugs].map((slug) => `/products/${slug}`),
    ...listTestMenuSlugs().map((slug) => `/test-menus/${slug}`),
    ...joinRouteParams(
      "/products",
      ["slug", "sectionSlug"],
      getRouteParams("/products", ["slug", "sectionSlug"]),
    ),
    ...joinRouteParams(
      "/clinical-directions",
      ["directionSlug"],
      getRouteParams("/clinical-directions", ["directionSlug"]),
    ),
    ...joinRouteParams(
      "/clinical-directions",
      ["directionSlug", "slug"],
      getRouteParams("/clinical-directions", ["directionSlug", "slug"]),
    ),
    ...joinRouteParams(
      "/brands",
      ["brandSlug"],
      getRouteParams("/brands", ["brandSlug"]),
    ),
    ...joinRouteParams(
      "/brands",
      ["brandSlug", "topicSlug"],
      getRouteParams("/brands", ["brandSlug", "topicSlug"]),
    ),
    ...getBrandsWithProducts().map((brand) => brandProductsPath(brand.id)),
  ];

  return [...new Set(paths)];
}

function absoluteUrl(siteUrl: string, path: string): string {
  return new URL(path, `${new URL(siteUrl).origin}/`).toString();
}

function localizedUrls(siteUrl: string, path: string): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, absoluteUrl(siteUrl, withLocale(locale, path))]),
  ) as Record<Locale, string>;
}

/** Build one sitemap entry per canonical locale URL, with reciprocal hreflang links. */
export function buildSitemap(siteUrl: string): MetadataRoute.Sitemap {
  return listPublicPaths().flatMap((path) => {
    const languages = localizedUrls(siteUrl, path);
    return locales.map((locale) => ({
      url: languages[locale],
      alternates: { languages },
    }));
  });
}

/** Build crawl rules without reading process state, so preview/production behavior is testable. */
export function buildRobots(siteUrl: string): MetadataRoute.Robots {
  const origin = new URL(siteUrl).origin;
  const isTestHosting = new URL(origin).hostname === "labwell.vercel.app";

  return {
    rules: isTestHosting
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/", disallow: [...servicePaths] },
    sitemap: absoluteUrl(origin, "/sitemap.xml"),
  };
}
