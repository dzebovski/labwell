import type { Locale } from "../i18n/config.ts";
import { brands, type BrandLogo } from "../content/brands.ts";
import {
  brandProductsPath,
  getBrandPage,
  getBrandProducts,
  getCategory,
  getMenuGroups,
  getMenuPages,
  type CategoryMenu,
  type ContentPage,
  type MenuId,
} from "./catalog.ts";
import { isRedirectedPath } from "./legacy-redirects.ts";
import { withLocale } from "./locale-routing.ts";

/** Most links shown in one brand column; the rest sit behind "More N · show all N" (rule 6). */
export const MAX_COLUMN_LINKS = 6;

/** Texts by plural category (`Intl.PluralRules`); `{n}` is replaced with the number. */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

export type NavigationLabels = {
  products: string;
  clinicalDirections: string;
  brands: string;
  about: string;
  services: string;
  contacts: string;
  /** Name of the last section: the pages of a group that have no direction of their own. */
  otherSolutions: string;
  /** "3 items": counts of pages in groups, sections and brand columns. */
  itemCount: PluralForms;
  /** "{hidden} more · show all {total}". */
  showAll: string;
  /** "All {brand} products". */
  allBrandProducts: string;
};

export type HeaderMegaLeaf = {
  id: string;
  label: string;
  href: string;
  brandId: string;
  brand: string;
  logo?: BrandLogo;
  /** What the item is ("CLIA analyzer"); empty when the content has no type. */
  itemType: string;
  /** Short line under the name in lists: the key figure, else the type. */
  meta: string;
  description: string;
  /** Preview photo (public path); absent until the content has one. */
  photo?: string;
};

export type HeaderMegaMore = {
  hidden: number;
  total: number;
  label: string;
  /** The listing that shows every page. */
  href: string;
};

/** The links of one brand inside a section, cut to `MAX_COLUMN_LINKS`. */
export type HeaderMegaColumn = {
  brandId: string;
  brand: string;
  logo?: BrandLogo;
  count: number;
  countLabel: string;
  links: HeaderMegaLeaf[];
  more?: HeaderMegaMore;
};

export type HeaderMegaResults = {
  total: number;
  columns: HeaderMegaColumn[];
};

export type HeaderMegaSection = {
  id: string;
  label: string;
  /** Listing page of the section; for "Other solutions" the listing of the group. */
  href: string;
  count: number;
  countLabel: string;
  /** Every page of the section (the mobile menu lists them all). */
  links: HeaderMegaLeaf[];
  results: HeaderMegaResults;
};

export type HeaderMegaGroup = {
  id: string;
  label: string;
  href: string;
  count: number;
  countLabel: string;
  /** Empty when the group has no directions (rule 3): then `results` holds its pages. */
  sections: HeaderMegaSection[];
  links: HeaderMegaLeaf[];
  results?: HeaderMegaResults;
};

export type HeaderBrandLink = { id: string; label: string; href: string; description: string };

export type HeaderBrand = {
  id: string;
  label: string;
  logo?: BrandLogo;
  count: number;
  countLabel: string;
  allHref: string;
  allLabel: string;
  /** Topic pages of the brand's portfolio. */
  lines: HeaderBrandLink[];
  /** The brand overview page, when there is one. */
  about?: HeaderBrandLink;
};

export type HeaderNavigationItem =
  | {
      type: "link";
      id: string;
      label: string;
      href: string;
    }
  | {
      type: "mega";
      id: string;
      label: string;
      href: string;
      panel: "catalog" | "clinical";
      groups: HeaderMegaGroup[];
    }
  | {
      type: "mega";
      id: string;
      label: string;
      href: string;
      panel: "brands";
      brands: HeaderBrand[];
    };

export type NavigationOptions = {
  /** Preview photo of a page; leaves have no photo without it. */
  photoFor?: (page: ContentPage) => string | undefined;
};

/** "21 items" in the plural form the locale needs (Ukrainian: 1, 21 / 2, 22 / 5, 11). */
export function formatCount(count: number, locale: Locale, forms: PluralForms): string {
  const form = forms[new Intl.PluralRules(locale).select(count)] ?? forms.other;
  return form.replace("{n}", String(count));
}

function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
}

/** A page the menu may link to: not an address that redirects now or soon. */
function isLinkable(page: ContentPage) {
  return !isRedirectedPath(page.path);
}

function toLeaf(menu: MenuId, page: ContentPage, locale: Locale, options: NavigationOptions): HeaderMegaLeaf {
  return {
    id: `${menu}:${page.path}`,
    label: page.navLabel[locale],
    href: withLocale(locale, page.path),
    brandId: page.brand.id,
    brand: page.brand.name,
    logo: page.brand.logo,
    itemType: page.itemType?.[locale] ?? "",
    meta: page.keySpec?.[locale] ?? page.itemType?.[locale] ?? "",
    description: page.description[locale],
    photo: options.photoFor?.(page),
  };
}

/**
 * Splits links into one column per brand (in order of appearance) and cuts each to six.
 * `moreHref` is where "show all" leads.
 */
export function buildResultColumns(
  links: readonly HeaderMegaLeaf[],
  locale: Locale,
  labels: Pick<NavigationLabels, "itemCount" | "showAll">,
  moreHref: string,
): HeaderMegaColumn[] {
  const byBrand = new Map<string, HeaderMegaLeaf[]>();
  for (const link of links) byBrand.set(link.brandId, [...(byBrand.get(link.brandId) ?? []), link]);

  return [...byBrand.entries()].map(([brandId, all]) => {
    const hidden = all.length - MAX_COLUMN_LINKS;
    return {
      brandId,
      brand: all[0].brand,
      logo: all[0].logo,
      count: all.length,
      countLabel: formatCount(all.length, locale, labels.itemCount),
      links: all.slice(0, MAX_COLUMN_LINKS),
      more:
        hidden > 0
          ? { hidden, total: all.length, label: fill(labels.showAll, { hidden, total: all.length }), href: moreHref }
          : undefined,
    };
  });
}

function buildResults(
  links: readonly HeaderMegaLeaf[],
  locale: Locale,
  labels: NavigationLabels,
  moreHref: string,
): HeaderMegaResults {
  return { total: links.length, columns: buildResultColumns(links, locale, labels, moreHref) };
}

function categoryHref(locale: Locale, menu: CategoryMenu, group: string, section?: string) {
  const category = getCategory(menu, group, section) ?? getCategory(menu, group);
  return withLocale(locale, category?.path ?? "/");
}

/**
 * Groups of a taxonomy menu (product type or clinical direction) → sections → pages.
 * A group without directions has no sections (rule 3); pages without a direction come
 * last as "Other solutions" (rule 4).
 */
function buildTaxonomyGroups(
  menu: CategoryMenu,
  locale: Locale,
  labels: NavigationLabels,
  options: NavigationOptions,
): HeaderMegaGroup[] {
  const leavesOf = (group: string, section?: string) =>
    getMenuPages(menu, group, section)
      .filter(isLinkable)
      .map((page) => toLeaf(menu, page, locale, options));

  return getMenuGroups(menu).flatMap((group): HeaderMegaGroup[] => {
    const href = categoryHref(locale, menu, group.id);
    const named = group.sections
      .map((section) => ({ section, links: leavesOf(group.id, section.id) }))
      .filter((entry) => entry.links.length > 0);
    const other = leavesOf(group.id);
    const links = [...named.flatMap((entry) => entry.links), ...other];
    if (links.length === 0) return [];

    const section = (id: string, label: string, sectionHref: string, sectionLinks: HeaderMegaLeaf[]): HeaderMegaSection => ({
      id: `${menu}:${group.id}:${id}`,
      label,
      href: sectionHref,
      count: sectionLinks.length,
      countLabel: formatCount(sectionLinks.length, locale, labels.itemCount),
      links: sectionLinks,
      results: buildResults(sectionLinks, locale, labels, sectionHref),
    });

    const sections =
      named.length === 0
        ? []
        : [
            ...named.map((entry) =>
              section(entry.section.id, entry.section.label[locale], categoryHref(locale, menu, group.id, entry.section.id), entry.links),
            ),
            ...(other.length > 0 ? [section("other", labels.otherSolutions, href, other)] : []),
          ];

    return [
      {
        id: `${menu}:${group.id}`,
        label: group.label[locale],
        href,
        count: links.length,
        countLabel: formatCount(links.length, locale, labels.itemCount),
        sections,
        links,
        results: sections.length === 0 ? buildResults(links, locale, labels, href) : undefined,
      },
    ];
  });
}

function toBrandLink(page: ContentPage, locale: Locale): HeaderBrandLink {
  return {
    id: page.path,
    label: page.navLabel[locale],
    href: withLocale(locale, page.path),
    description: page.description[locale],
  };
}

function buildBrands(locale: Locale, labels: NavigationLabels): HeaderBrand[] {
  return brands.flatMap((brand): HeaderBrand[] => {
    const count = getBrandProducts(brand.id).length;
    if (count === 0) return [];
    const overview = getBrandPage(brand.id);
    return [
      {
        id: brand.id,
        label: brand.name,
        logo: brand.logo,
        count,
        countLabel: formatCount(count, locale, labels.itemCount),
        allHref: withLocale(locale, brandProductsPath(brand.id)),
        allLabel: fill(labels.allBrandProducts, { brand: brand.name }),
        lines: getMenuPages("brands", brand.id)
          .filter((page) => page.slug && isLinkable(page))
          .map((page) => toBrandLink(page, locale)),
        about: overview ? toBrandLink(overview, locale) : undefined,
      },
    ];
  });
}

export function buildHeaderNavigation(
  locale: Locale,
  labels: NavigationLabels,
  options: NavigationOptions = {},
): HeaderNavigationItem[] {
  return [
    {
      type: "mega",
      id: "products",
      panel: "catalog",
      label: labels.products,
      href: withLocale(locale, "/products"),
      groups: buildTaxonomyGroups("catalog", locale, labels, options),
    },
    {
      type: "mega",
      id: "clinical-directions",
      panel: "clinical",
      label: labels.clinicalDirections,
      href: withLocale(locale, "/clinical-directions"),
      groups: buildTaxonomyGroups("clinical", locale, labels, options),
    },
    {
      type: "mega",
      id: "brands",
      panel: "brands",
      label: labels.brands,
      href: withLocale(locale, "/brands"),
      brands: buildBrands(locale, labels),
    },
    { type: "link", id: "services", label: labels.services, href: withLocale(locale, "/services") },
    { type: "link", id: "about", label: labels.about, href: withLocale(locale, "/about") },
    { type: "link", id: "contacts", label: labels.contacts, href: withLocale(locale, "/contacts") },
  ];
}
