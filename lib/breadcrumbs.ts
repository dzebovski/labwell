/**
 * Breadcrumbs v2: one model for every page. Home → canonical path → current page.
 *
 * - A product page is always shown under the product catalog, wherever the visitor came from (rule 1).
 * - Ancestors are plain links; a level without a page of its own is text (rule 3).
 * - The last level is not a link; for a catalog page with two or more neighbours it carries a switcher.
 * - The flat list `trailCrumbs` is what schema.org BreadcrumbList is built from, so markup and page agree.
 */
import type { Locale } from "../i18n/config.ts";
import enDictionary from "../i18n/dictionaries/en.json" with { type: "json" };
import ukDictionary from "../i18n/dictionaries/uk.json" with { type: "json" };
import { brands, type Brand } from "../content/brands.ts";
import {
  getBrandPage,
  getCategory,
  getMenuGroups,
  getMenuPages,
  getPageByPath,
  type Category,
  type CategoryMenu,
  type ContentPage,
  type MenuId,
} from "./catalog.ts";
import { isRedirectedPath } from "./legacy-redirects.ts";
import { withLocale } from "./locale-routing.ts";
import { formatCount } from "./site-navigation.ts";

export type Crumb = { label: string; href?: string };

export type SwitcherOption = { label: string; meta: string; href: string; current: boolean };

export type TrailSwitcher = {
  /** "CLIA · Snibe · 4 models". */
  title: string;
  options: SwitcherOption[];
  /** "All CLIA →": the listing of the category. */
  all: { label: string; href: string };
};

export type Trail = {
  /** Home and every ancestor, in order. */
  items: Crumb[];
  /** The page itself: never a link. */
  current: Crumb;
  switcher?: TrailSwitcher;
};

const dictionaries = { uk: ukDictionary, en: enDictionary };

function texts(locale: Locale) {
  const dictionary = dictionaries[locale];
  return {
    home: dictionary.pages.home,
    roots: {
      catalog: { label: dictionary.pages.products, path: "/products" },
      clinical: { label: dictionary.pages.clinicalDirections, path: "/clinical-directions" },
      brands: { label: dictionary.pages.brands, path: "/brands" },
    } satisfies Record<MenuId, { label: string; path: string }>,
    itemCount: dictionary.navigation.itemCount,
    allIn: dictionary.breadcrumbs.allIn,
  };
}

function homeCrumb(locale: Locale): Crumb {
  return { label: texts(locale).home, href: withLocale(locale, "/") };
}

function rootCrumb(menu: MenuId, locale: Locale): Crumb {
  const root = texts(locale).roots[menu];
  return { label: root.label, href: withLocale(locale, root.path) };
}

function categoryCrumb(menu: CategoryMenu, group: string, section: string | undefined, locale: Locale): Crumb {
  const taxonomy = getMenuGroups(menu).find((item) => item.id === group)!;
  const target = section ? taxonomy.sections.find((item) => item.id === section)! : taxonomy;
  const category = getCategory(menu, group, section);
  return { label: target.label[locale], href: category ? withLocale(locale, category.path) : undefined };
}

function brandCrumb(brand: Brand, locale: Locale): Crumb {
  return { label: brand.name, href: getBrandPage(brand.id) ? withLocale(locale, `/brands/${brand.id}`) : undefined };
}

function buildSwitcher(page: ContentPage, locale: Locale): TrailSwitcher | undefined {
  const [placement] = page.placements;
  if (page.kind !== "product" || placement.menu !== "catalog") return undefined;

  const neighbours = getMenuPages("catalog", placement.group, placement.section).filter(
    (item) => !isRedirectedPath(item.path),
  );
  if (neighbours.length < 2 || !neighbours.some((item) => item.path === page.path)) return undefined;

  const label = categoryCrumb("catalog", placement.group, placement.section, locale);
  const category = getCategory("catalog", placement.group, placement.section) ?? getCategory("catalog", placement.group);
  if (!category) return undefined;

  const brandNames = new Set(neighbours.map((item) => item.brand.name));
  const title = [
    label.label,
    brandNames.size === 1 ? [...brandNames][0] : undefined,
    formatCount(neighbours.length, locale, texts(locale).itemCount),
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    title,
    options: neighbours.map((item) => ({
      label: item.navLabel[locale],
      meta: item.keySpec?.[locale] ?? item.itemType?.[locale] ?? "",
      href: withLocale(locale, item.path),
      current: item.path === page.path,
    })),
    all: { label: texts(locale).allIn.replace("{name}", label.label), href: withLocale(locale, category.path) },
  };
}

/**
 * Trail of a content page; `currentLabel` overrides the name of the last level
 * (the page shows its own name there). Undefined when the path is not in the catalog.
 */
export function getPageTrail(path: string, locale: Locale, currentLabel?: string): Trail | undefined {
  const page = getPageByPath(path);
  if (!page) return undefined;

  const [placement] = page.placements;
  const current: Crumb = { label: currentLabel ?? page.navLabel[locale] };
  const items: Crumb[] = [homeCrumb(locale), rootCrumb(placement.menu, locale)];

  if (placement.menu === "brands") {
    if (page.slug) items.push(brandCrumb(page.brand, locale));
    return { items, current };
  }

  items.push(categoryCrumb(placement.menu, placement.group, undefined, locale));
  if (placement.section) items.push(categoryCrumb(placement.menu, placement.group, placement.section, locale));
  return { items, current, switcher: buildSwitcher(page, locale) };
}

export function getCategoryTrail(category: Category, locale: Locale): Trail {
  const { menu, group, section } = category;
  const items = [homeCrumb(locale), rootCrumb(menu, locale)];
  if (section) {
    items.push(categoryCrumb(menu, group.id, undefined, locale));
    return { items, current: { label: section.label[locale] } };
  }
  return { items, current: { label: group.label[locale] } };
}

export function getRootTrail(menu: MenuId, locale: Locale): Trail {
  return { items: [homeCrumb(locale)], current: { label: texts(locale).roots[menu].label } };
}

/** Pages that live directly under Home: services, about, contacts. */
export function getStaticTrail(label: string, locale: Locale): Trail {
  return { items: [homeCrumb(locale)], current: { label } };
}

export function getBrandProductsTrail(brandId: string, label: string, locale: Locale): Trail {
  const brand = brands.find((item) => item.id === brandId)!;
  return {
    items: [homeCrumb(locale), rootCrumb("brands", locale), brandCrumb(brand, locale)],
    current: { label },
  };
}

/** Same shape for a page that is not in the catalog (test fixtures): Home, Products, then the content's labels. */
export function getFallbackTrail(labels: string[], locale: Locale): Trail {
  const crumbs: Crumb[] = labels.map((label, index) => ({
    label,
    href: index === 0 ? withLocale(locale, "/") : index === 1 ? withLocale(locale, "/products") : undefined,
  }));
  const current = crumbs.pop()!;
  return { items: crumbs, current: { label: current.label } };
}

/** The flat list for schema.org BreadcrumbList: every level, the last one without a link. */
export function trailCrumbs(trail: Trail): Crumb[] {
  return [...trail.items, { label: trail.current.label }];
}
