/**
 * Turns hrefs from `content/` into hrefs that exist on the site today.
 * The content points at pages that may not be built yet (the biochemistry test menu,
 * Molecision MP); those are mapped to the current address
 * from the catalog (`lib/catalog.ts`) or dropped (`null`), so the page never links to a 404.
 * Pages that exist in `content/` (products, groups, overviews, test menus) are linked as they are.
 */
import { getRouteTarget } from "../catalog.ts";
import { hasTestMenuContent, productsRouteKind } from "./load.ts";

export type SiteLocale = "uk" | "en";

/** Addresses the content uses → the current addresses of the same material. */
export const currentAddress: Readonly<Record<string, string>> = {
  // The CLIA menu and the MAGLUMI overview now exist in content/ (test-menus, overviews): no mapping.
  "/test-menus/snibe-biochemistry-test-menu": "/products/biochemistry-test-menu",
  // Molecision MP (MP-32, MP-96) has no page of its own yet: its range overview is the closest current page.
  "/products/molecision-mp": "/brands/snibe/molecision-molecular-diagnostics",
};

const sectionRoots = new Set([
  "/",
  "/products",
  "/brands",
  "/clinical-directions",
  "/services",
  "/about",
  "/contacts",
]);

function prefixed(locale: SiteLocale, path: string) {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

/**
 * @returns the href to render, or `null` when the target does not exist and the
 * text must be shown without a link.
 */
export function resolveHref(href: string, locale: SiteLocale): string | null {
  if (href.startsWith("#") || isExternal(href)) return href;
  if (!href.startsWith("/")) return null;

  // A page from content/ may be linked with an anchor: /products/satlars#satlars-t8.
  const [pathOnly, hash] = href.split("#");
  const contentPath = pathOnly in currentAddress ? undefined : pathOnly;
  if (contentPath) {
    const productSlug = /^\/products\/([^/]+)$/.exec(contentPath)?.[1];
    const menuSlug = /^\/test-menus\/([^/]+)$/.exec(contentPath)?.[1];
    if ((productSlug && productsRouteKind(productSlug)) || (menuSlug && hasTestMenuContent(menuSlug))) {
      return prefixed(locale, contentPath) + (hash ? `#${hash}` : "");
    }
  }

  const path = currentAddress[href] ?? href;
  if (sectionRoots.has(path) || getRouteTarget(path)) return prefixed(locale, path);

  return null;
}
