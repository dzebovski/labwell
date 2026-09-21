import type { Locale } from "@/i18n/config";
import {
  contentPages,
  getPageById,
  navigationPlacements,
  type ContentPageRecord,
  type LocalizedText,
  type NavigationPlacement,
} from "@/lib/navigation-content";

export type { ContentPageRecord, LocalizedText, NavigationPlacement } from "@/lib/navigation-content";
export {
  brandPages,
  clinicalPages,
  contentPages,
  getPageById,
  getPageByPath,
  getPageBySlug,
  navigationPlacements,
  productPages,
} from "@/lib/navigation-content";

export type HeaderMegaLeaf = {
  id: string;
  label: string;
  href: string;
  brand: string;
  title: string;
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

export function localizePath(locale: Locale, path: string) {
  return `/${locale}${path === "/" ? "" : path}`;
}

function stableId(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniqueBy<T>(items: readonly T[], getKey: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function toLeaf(
  placement: NavigationPlacement,
  page: ContentPageRecord,
  locale: Locale,
): HeaderMegaLeaf {
  return {
    id: `${placement.id}-${placement.sourceRow}`,
    label: placement.navLabel[locale],
    href: localizePath(locale, page.canonicalPath),
    brand: page.brand,
    title: page.title[locale],
    description: page.description[locale],
  };
}

function getPage(placement: NavigationPlacement) {
  const page = getPageById(placement.id);
  if (!page) throw new Error(`Navigation placement references unknown page: ${placement.id}`);
  return page;
}

function groupPlacements(
  placements: readonly NavigationPlacement[],
  locale: Locale,
  fallbackSection: LocalizedText,
) {
  return uniqueBy(placements, (placement) => placement.subcategory.en).map((groupPlacement) => {
    const groupRows = placements.filter(
      (placement) => placement.subcategory.en === groupPlacement.subcategory.en,
    );
    const sectionKeys = uniqueBy(groupRows, (placement) => placement.group?.en ?? "__other__");

    return {
      id: stableId(groupPlacement.subcategory.en),
      label: groupPlacement.subcategory[locale],
      sections: sectionKeys.map((sectionPlacement) => {
        const groupKey = sectionPlacement.group?.en ?? "__other__";
        const rows = groupRows.filter(
          (placement) => (placement.group?.en ?? "__other__") === groupKey,
        );
        return {
          id: `${stableId(groupPlacement.subcategory.en)}-${stableId(groupKey) || "other"}`,
          label: sectionPlacement.group?.[locale] ?? fallbackSection[locale],
          links: rows.map((placement) => toLeaf(placement, getPage(placement), locale)),
        };
      }),
    } satisfies HeaderMegaGroup;
  });
}

function buildBrandGroups(locale: Locale) {
  const placements = navigationPlacements.filter((placement) => placement.kind === "brand");
  return uniqueBy(placements, (placement) => placement.subcategory.en).map((brandPlacement) => {
    const rows = placements.filter(
      (placement) => placement.subcategory.en === brandPlacement.subcategory.en,
    );
    return {
      id: stableId(brandPlacement.subcategory.en),
      label: brandPlacement.subcategory[locale],
      sections: [
        {
          id: `${stableId(brandPlacement.subcategory.en)}-portfolio`,
          label: brandPlacement.subcategory[locale],
          links: rows.map((placement) => toLeaf(placement, getPage(placement), locale)),
        },
      ],
    } satisfies HeaderMegaGroup;
  });
}

export function buildHeaderNavigation(
  locale: Locale,
  labels: NavigationLabels,
): HeaderNavigationItem[] {
  const productsPath = localizePath(locale, "/products");
  const clinicalPath = localizePath(locale, "/clinical-directions");
  const brandsPath = localizePath(locale, "/brands");
  const productPlacements = navigationPlacements.filter(
    (placement) => placement.category.en === "Product catalog",
  );
  const clinicalPlacements = navigationPlacements.filter(
    (placement) => placement.category.en === "Clinical directions",
  );

  return [
    {
      type: "mega",
      id: "products",
      panel: "catalog",
      label: labels.products,
      href: productsPath,
      groups: groupPlacements(productPlacements, locale, {
        en: labels.portfolio,
        uk: labels.portfolio,
      }),
    },
    {
      type: "mega",
      id: "clinical-directions",
      panel: "clinical",
      label: labels.clinicalDirections,
      href: clinicalPath,
      groups: groupPlacements(clinicalPlacements, locale, {
        en: labels.otherSolutions,
        uk: labels.otherSolutions,
      }),
    },
    {
      type: "mega",
      id: "brands",
      panel: "brands",
      label: labels.brands,
      href: brandsPath,
      groups: buildBrandGroups(locale),
    },
    { type: "link", id: "services", label: labels.services, href: localizePath(locale, "/services") },
    { type: "link", id: "about", label: labels.about, href: localizePath(locale, "/about") },
    { type: "link", id: "contacts", label: labels.contacts, href: localizePath(locale, "/contacts") },
  ];
}

export function getCanonicalPlacement(pageId: string) {
  const page = contentPages.find((item) => item.id === pageId);
  if (!page) return undefined;

  if (page.kind === "product") {
    return navigationPlacements.find(
      (placement) => placement.id === pageId && placement.category.en === "Product catalog",
    );
  }

  return navigationPlacements.find((placement) => placement.id === pageId);
}
