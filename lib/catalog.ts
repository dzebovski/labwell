import type { Locale } from "../i18n/config.ts";
import { brands, type Brand, type BrandId } from "../content/brands.ts";
import type { LocalizedText } from "../content/define.ts";
import { brandPages, clinicalPages, products } from "../content/index.ts";
import { catalogGroups, clinicalDirections, type TaxonomyGroup } from "../content/taxonomy.ts";
import { withLocale } from "./locale-routing.ts";

export type { LocalizedText } from "../content/define.ts";

export type ContentKind = "product" | "clinical" | "brand";
export type MenuId = "catalog" | "clinical" | "brands";

export type MenuPlacement = Readonly<{
  menu: MenuId;
  group: string;
  section?: string;
  order: number;
}>;

/** A content page with everything derived from its file: URL, brand record and menu places. */
export type ContentPage = Readonly<{
  kind: ContentKind;
  /** Last URL segment; empty for brand overview pages. */
  slug: string;
  path: string;
  brand: Brand;
  navLabel: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  todoNote?: LocalizedText;
  sourceUrl: string;
  /** The first placement is the canonical one and drives breadcrumbs. */
  placements: readonly MenuPlacement[];
}>;

export type Breadcrumb = { label: string; href?: string };

const menuGroups: Record<Exclude<MenuId, "brands">, readonly TaxonomyGroup[]> = {
  catalog: catalogGroups,
  clinical: clinicalDirections,
};

function getBrand(id: BrandId): Brand {
  const brand = brands.find((item) => item.id === id);
  if (!brand) throw new Error(`Unknown brand: ${id}`);
  return brand;
}

function buildPages(): ContentPage[] {
  const productRecords = products.map(({ catalog, clinical = [], brand, ...entry }): ContentPage => ({
    ...entry,
    kind: "product",
    path: `/products/${entry.slug}`,
    brand: getBrand(brand),
    placements: [
      { menu: "catalog", group: catalog.group, section: catalog.section, order: catalog.order ?? 0 },
      ...clinical.map((item): MenuPlacement => ({
        menu: "clinical",
        group: item.direction,
        section: item.section,
        order: item.order ?? 0,
      })),
    ],
  }));

  const clinicalRecords = clinicalPages.map(({ clinical, brand, ...entry }): ContentPage => ({
    ...entry,
    kind: "clinical",
    path: `/clinical-directions/${clinical.direction}/${entry.slug}`,
    brand: getBrand(brand),
    placements: [
      { menu: "clinical", group: clinical.direction, section: clinical.section, order: clinical.order ?? 0 },
    ],
  }));

  const brandRecords = brandPages.map(({ slug, brand, ...entry }): ContentPage => ({
    ...entry,
    kind: "brand",
    slug: slug ?? "",
    path: slug ? `/brands/${brand}/${slug}` : `/brands/${brand}`,
    brand: getBrand(brand),
    placements: [{ menu: "brands", group: brand, order: 0 }],
  }));

  return [...productRecords, ...clinicalRecords, ...brandRecords];
}

export const contentPages: readonly ContentPage[] = buildPages();

/** Returns a list of problems; an empty list means the content is consistent. */
export function findCatalogProblems(pages: readonly ContentPage[] = contentPages): string[] {
  const problems: string[] = [];
  const seenPaths = new Set<string>();

  for (const page of pages) {
    if (seenPaths.has(page.path)) problems.push(`Duplicate URL: ${page.path}`);
    seenPaths.add(page.path);

    if (page.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(page.slug)) {
      problems.push(`Invalid slug "${page.slug}" (${page.path})`);
    }

    const seenMenus = new Set<string>();
    for (const placement of page.placements) {
      const key = `${placement.menu}/${placement.group}`;
      if (seenMenus.has(key)) problems.push(`${page.path} is placed twice in ${key}`);
      seenMenus.add(key);

      if (placement.menu === "brands") continue;
      const group = menuGroups[placement.menu].find((item) => item.id === placement.group);
      if (!group) {
        problems.push(`${page.path}: unknown ${placement.menu} group "${placement.group}"`);
      } else if (placement.section && !group.sections.some((item) => item.id === placement.section)) {
        problems.push(`${page.path}: unknown section "${placement.section}" in "${group.id}"`);
      }
    }
  }

  return problems;
}

const problems = findCatalogProblems();
if (problems.length > 0) {
  throw new Error(`Content catalog is inconsistent:\n- ${problems.join("\n- ")}`);
}

const pagesByPath = new Map(contentPages.map((page) => [page.path, page]));

export function getPageByPath(path: string) {
  return pagesByPath.get(path);
}

export function listPages(kind: ContentKind) {
  return contentPages.filter((page) => page.kind === kind);
}

export function getProduct(slug: string) {
  return getPageByPath(`/products/${slug}`);
}

export function getClinicalPage(direction: string, slug: string) {
  return getPageByPath(`/clinical-directions/${direction}/${slug}`);
}

export function getBrandPage(brand: string, topic?: string) {
  return getPageByPath(topic ? `/brands/${brand}/${topic}` : `/brands/${brand}`);
}

export function getMenuGroups(menu: Exclude<MenuId, "brands">) {
  return menuGroups[menu];
}

/** Pages placed in a menu group/section, in menu order. `section: undefined` is the default section. */
export function getMenuPages(menu: MenuId, group: string, section?: string) {
  return contentPages
    .flatMap((page) =>
      page.placements
        .filter((item) => item.menu === menu && item.group === group && item.section === section)
        .map((item) => ({ page, order: item.order })),
    )
    .sort((a, b) => a.order - b.order)
    .map((item) => item.page);
}

const rootPaths: Record<MenuId, string> = {
  catalog: "/products",
  clinical: "/clinical-directions",
  brands: "/brands",
};

export function getBreadcrumbs(
  page: ContentPage,
  locale: Locale,
  labels: { home: string; products: string; clinicalDirections: string; brands: string },
): Breadcrumb[] {
  const [placement] = page.placements;
  const rootLabels: Record<MenuId, string> = {
    catalog: labels.products,
    clinical: labels.clinicalDirections,
    brands: labels.brands,
  };
  const breadcrumbs: Breadcrumb[] = [
    { label: labels.home, href: withLocale(locale, "/") },
    { label: rootLabels[placement.menu], href: withLocale(locale, rootPaths[placement.menu]) },
  ];

  if (placement.menu === "brands") {
    const isOverview = !page.slug;
    breadcrumbs.push({
      label: page.brand.name,
      href: isOverview ? undefined : withLocale(locale, `/brands/${page.brand.id}`),
    });
    if (!isOverview) breadcrumbs.push({ label: page.navLabel[locale] });
    return breadcrumbs;
  }

  const group = menuGroups[placement.menu].find((item) => item.id === placement.group)!;
  breadcrumbs.push({ label: group.label[locale] });
  const section = group.sections.find((item) => item.id === placement.section);
  if (section) breadcrumbs.push({ label: section.label[locale] });
  breadcrumbs.push({ label: page.navLabel[locale] });
  return breadcrumbs;
}
