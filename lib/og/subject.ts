import "server-only";

import { company } from "@/content/company";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getBrandsWithProducts, getRouteTarget } from "@/lib/catalog";
import { hasTestMenuContent } from "@/lib/site-content/load";
import { getTestMenuPageModel } from "@/lib/site-content/pages";
import { navPhoto } from "@/lib/site-content/nav-photo";

/** What an Open Graph card shows: the page name, a line above it and, for products, the photo. */
export type OgSubject = {
  title: string;
  eyebrow?: string;
  /** Public path of the product photo (`/products/x/main.webp`); absent when the page has none. */
  photo?: string;
};

const staticPages = {
  "/products": "products",
  "/clinical-directions": "clinicalDirections",
  "/brands": "brands",
  "/services": "services",
  "/about": "about",
  "/contacts": "contacts",
} as const;

/**
 * Name, type and photo of the page at `path` (without locale), from the same data the page itself uses.
 * An unknown path gets the company card instead of an error: a missing card must not break a build.
 */
export async function getOgSubject(locale: Locale, path: string): Promise<OgSubject> {
  const dictionary = await getDictionary(locale);
  const tagline = company.tagline[locale];
  const fallback: OgSubject = { title: company.name, eyebrow: tagline.charAt(0).toUpperCase() + tagline.slice(1) };

  if (path === "/") return fallback;

  const staticKey = staticPages[path as keyof typeof staticPages];
  if (staticKey) return { title: dictionary.pages[staticKey], eyebrow: company.name };

  const testMenu = /^\/test-menus\/([^/]+)$/.exec(path)?.[1];
  if (testMenu && hasTestMenuContent(testMenu)) {
    const page = getTestMenuPageModel(testMenu, locale);
    return { title: page.name, eyebrow: page.brand };
  }

  const brandProducts = /^\/brands\/([^/]+)\/products$/.exec(path)?.[1];
  const brand = getBrandsWithProducts().find((item) => item.id === brandProducts);
  if (brand) {
    return { title: dictionary.navigation.allBrandProducts.replace("{brand}", brand.name), eyebrow: brand.name };
  }

  const target = getRouteTarget(path);
  if (target?.type === "page") {
    const { page } = target;
    return {
      title: page.navLabel[locale],
      eyebrow: [page.brand.name, page.itemType?.[locale]].filter(Boolean).join(" · "),
      photo: navPhoto(page),
    };
  }
  if (target?.type === "category") {
    const { category } = target;
    return { title: (category.section ?? category.group).label[locale], eyebrow: company.name };
  }

  return fallback;
}
