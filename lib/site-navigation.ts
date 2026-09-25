import type { Locale } from "../i18n/config.ts";
import { brands, type BrandLogo } from "../content/brands.ts";
import {
  getMenuGroups,
  getMenuPages,
  type ContentPage,
  type MenuId,
} from "./catalog.ts";
import { withLocale } from "./locale-routing.ts";

export type HeaderMegaLeaf = {
  id: string;
  label: string;
  href: string;
  brand: string;
  logo?: BrandLogo;
  /** What the item is ("CLIA analyzer"); empty when the content has no type. */
  itemType: string;
  /** Short line under the name in lists: the key figure, else the type. */
  meta: string;
  description: string;
};

export type HeaderMegaSection = {
  id: string;
  label: string;
  links: HeaderMegaLeaf[];
};

export type HeaderMegaGroup = {
  id: string;
  label: string;
  logo?: BrandLogo;
  sections: HeaderMegaSection[];
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
      panel: "catalog" | "clinical" | "brands";
      groups: HeaderMegaGroup[];
    };

type NavigationLabels = {
  products: string;
  clinicalDirections: string;
  brands: string;
  about: string;
  services: string;
  contacts: string;
  otherSolutions: string;
  portfolio: string;
};

function toLeaf(menu: MenuId, page: ContentPage, locale: Locale): HeaderMegaLeaf {
  return {
    id: `${menu}:${page.path}`,
    label: page.navLabel[locale],
    href: withLocale(locale, page.path),
    brand: page.brand.name,
    logo: page.brand.logo,
    itemType: page.itemType?.[locale] ?? "",
    meta: page.keySpec?.[locale] ?? page.itemType?.[locale] ?? "",
    description: page.description[locale],
  };
}

/** Groups of a taxonomy menu; the default (section-less) items go last under `defaultSectionLabel`. */
function buildTaxonomyGroups(
  menu: "catalog" | "clinical",
  locale: Locale,
  defaultSectionLabel: string,
): HeaderMegaGroup[] {
  return getMenuGroups(menu)
    .map((group) => {
      const sections = [
        ...group.sections.map((section) => ({ id: section.id, label: section.label[locale] })),
        { id: undefined, label: defaultSectionLabel },
      ];
      return {
        id: group.id,
        label: group.label[locale],
        sections: sections
          .map((section) => ({
            id: `${group.id}-${section.id ?? "other"}`,
            label: section.label,
            links: getMenuPages(menu, group.id, section.id).map((page) => toLeaf(menu, page, locale)),
          }))
          .filter((section) => section.links.length > 0),
      };
    })
    .filter((group) => group.sections.length > 0);
}

function buildBrandGroups(locale: Locale): HeaderMegaGroup[] {
  return brands
    .map((brand) => ({
      id: brand.id,
      label: brand.name,
      logo: brand.logo,
      sections: [
        {
          id: `${brand.id}-portfolio`,
          label: brand.name,
          links: getMenuPages("brands", brand.id).map((page) => toLeaf("brands", page, locale)),
        },
      ],
    }))
    .filter((group) => group.sections[0].links.length > 0);
}

export function buildHeaderNavigation(
  locale: Locale,
  labels: NavigationLabels,
): HeaderNavigationItem[] {
  return [
    {
      type: "mega",
      id: "products",
      panel: "catalog",
      label: labels.products,
      href: withLocale(locale, "/products"),
      groups: buildTaxonomyGroups("catalog", locale, labels.portfolio),
    },
    {
      type: "mega",
      id: "clinical-directions",
      panel: "clinical",
      label: labels.clinicalDirections,
      href: withLocale(locale, "/clinical-directions"),
      groups: buildTaxonomyGroups("clinical", locale, labels.otherSolutions),
    },
    {
      type: "mega",
      id: "brands",
      panel: "brands",
      label: labels.brands,
      href: withLocale(locale, "/brands"),
      groups: buildBrandGroups(locale),
    },
    { type: "link", id: "services", label: labels.services, href: withLocale(locale, "/services") },
    { type: "link", id: "about", label: labels.about, href: withLocale(locale, "/about") },
    { type: "link", id: "contacts", label: labels.contacts, href: withLocale(locale, "/contacts") },
  ];
}
