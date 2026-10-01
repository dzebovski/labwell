/**
 * Turns hrefs from `content/` into hrefs that exist on the site today.
 * The content points at pages that are not built yet (test menus, the MAGLUMI
 * and Molecision overviews); those are mapped to the current address
 * from the catalog (`lib/catalog.ts`) or dropped (`null`), so the page never links to a 404.
 */
import { getRouteTarget } from "../catalog.ts";
import { hasProductContent } from "./load.ts";

export type SiteLocale = "uk" | "en";

/** Addresses the content uses → the current addresses of the same material. */
export const currentAddress: Readonly<Record<string, string>> = {
  "/test-menus/snibe-clia-test-menu": "/products/maglumi-clia-test-menu-278-parameters",
  "/test-menus/snibe-biochemistry-test-menu": "/products/biochemistry-test-menu",
  "/products/maglumi": "/brands/snibe/maglumi-immunochemistry",
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

  const path = currentAddress[href] ?? href;
  if (sectionRoots.has(path) || getRouteTarget(path)) return prefixed(locale, path);

  const productSlug = /^\/products\/([^/]+)$/.exec(path)?.[1];
  if (productSlug && hasProductContent(productSlug)) return prefixed(locale, path);

  return null;
}
