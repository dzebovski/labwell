import { locales, type Locale } from "../i18n/config.ts";
import { brands, type Brand, type BrandId } from "../content/brands.ts";
import type { LocalizedText } from "../content/define.ts";
import { brandPages, clinicalPages, products } from "../content/index.ts";
import {
  catalogGroups,
  clinicalDirections,
  type TaxonomyGroup,
  type TaxonomySection,
} from "../content/taxonomy.ts";
import { isRedirectedPath } from "./legacy-redirects.ts";
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
  itemType?: LocalizedText;
  keySpec?: LocalizedText;
  seoTitle: LocalizedText;
  description: LocalizedText;
  todoNote?: LocalizedText;
  sourceUrl: string;
  /** The first placement is the canonical one and drives breadcrumbs. */
  placements: readonly MenuPlacement[];
}>;

export type CategoryMenu = Exclude<MenuId, "brands">;

/** A menu group, or one of its named sections, that has its own listing page. */
export type Category = Readonly<{
  menu: CategoryMenu;
  group: TaxonomyGroup;
  section?: TaxonomySection;
  path: string;
}>;

/** A block of links on a listing page; `href` links the block title to its own page. */
export type ListingBlock = { title?: string; href?: string; pages: ContentPage[] };

export type RouteTarget =
  | { type: "page"; page: ContentPage }
  | { type: "category"; category: Category };

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
  const productRecords = products.map(({ catalog, clinical = [], brand, basePath = "/products", ...entry }): ContentPage => ({
    ...entry,
    kind: "product",
    path: `${basePath}/${entry.slug}`,
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
  const seenTitles = new Map<string, string>();

  for (const page of pages) {
    for (const locale of locales) {
      const title = page.seoTitle[locale]?.trim() ?? "";
      if (!title) problems.push(`${page.path}: empty seoTitle (${locale})`);
      // The layout's title template appends the site name.
      if (/labwell\s*$/i.test(title)) problems.push(`${page.path}: seoTitle must not end with "Labwell" (${locale})`);
      const titleKey = `${locale}:${title.toLowerCase()}`;
      const titleOwner = seenTitles.get(titleKey);
      if (title && titleOwner) problems.push(`${page.path}: seoTitle duplicates ${titleOwner} (${locale})`);
      seenTitles.set(titleKey, page.path);
      if (!page.description[locale]?.trim()) problems.push(`${page.path}: empty description (${locale})`);
      if (page.kind === "product" && !page.itemType?.[locale]?.trim()) {
        problems.push(`${page.path}: products need an itemType (${locale})`);
      }
    }

    if (seenPaths.has(page.path)) problems.push(`Duplicate URL: ${page.path}`);
    seenPaths.add(page.path);

    if (page.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(page.slug)) {
      problems.push(`Invalid slug "${page.slug}" (${page.path})`);
    }
    if (page.kind === "brand" && page.slug === brandProductsSlug) {
      problems.push(`${page.path} clashes with the brand product listing`);
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

  for (const menu of ["catalog", "clinical"] as const) {
    for (const group of menuGroups[menu]) {
      for (const section of [undefined, ...group.sections]) {
        const path = categoryPath(menu, group.id, section?.id);
        if (seenPaths.has(path)) problems.push(`Category URL ${path} is also used by a content page`);
      }
    }
  }

  return problems;
}

/** Last segment of `/brands/{brand}/products`, the listing of every product of a brand. */
export const brandProductsSlug = "products";

const rootPaths: Record<MenuId, string> = {
  catalog: "/products",
  clinical: "/clinical-directions",
  brands: "/brands",
};

function categoryPath(menu: CategoryMenu, group: string, section?: string) {
  return `${rootPaths[menu]}/${group}${section ? `/${section}` : ""}`;
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

export function getMenuGroups(menu: CategoryMenu) {
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

/** All pages of a group: named sections in taxonomy order, then the default section. */
function getGroupPages(menu: CategoryMenu, group: TaxonomyGroup) {
  return [...group.sections.map((section) => section.id), undefined].flatMap((section) =>
    getMenuPages(menu, group.id, section),
  );
}

/** Categories with at least one page; empty groups and sections get no listing page. */
export const categories: readonly Category[] = (["catalog", "clinical"] as const).flatMap((menu) =>
  menuGroups[menu].flatMap((group): Category[] => {
    if (getGroupPages(menu, group).length === 0) return [];
    const sections = group.sections
      .filter((section) => getMenuPages(menu, group.id, section.id).length > 0)
      .map((section) => ({ menu, group, section, path: categoryPath(menu, group.id, section.id) }));
    return [{ menu, group, path: categoryPath(menu, group.id) }, ...sections];
  }),
);

const categoriesByPath = new Map(categories.map((category) => [category.path, category]));

export function getCategory(menu: CategoryMenu, group: string, section?: string) {
  return categoriesByPath.get(categoryPath(menu, group, section));
}

/** What a site path (without locale) renders: a content page or a category listing. */
export function getRouteTarget(path: string): RouteTarget | undefined {
  const page = pagesByPath.get(path);
  if (page) return { type: "page", page };
  const category = categoriesByPath.get(path);
  return category ? { type: "category", category } : undefined;
}

/** Route params for every page or category path `prefix/{a}/{b}…` with exactly `names.length` segments. */
export function getRouteParams<Name extends string>(prefix: string, names: readonly Name[]) {
  return [...pagesByPath.keys(), ...categoriesByPath.keys()]
    .filter((path) => path.startsWith(`${prefix}/`))
    .map((path) => path.slice(prefix.length + 1).split("/"))
    .filter((segments) => segments.length === names.length)
    .map((segments) => Object.fromEntries(names.map((name, index) => [name, segments[index]])) as Record<Name, string>);
}

/** Link blocks for a listing page: a menu root (one block per group or brand) or a category. */
export function getListingBlocks(
  menu: MenuId,
  locale: Locale,
  defaultSectionLabel: string,
  category?: Category,
): ListingBlock[] {
  if (menu === "brands") {
    return brands
      .map((brand) => ({
        title: brand.name,
        href: getBrandPage(brand.id) ? withLocale(locale, `/brands/${brand.id}`) : undefined,
        pages: getMenuPages("brands", brand.id),
      }))
      .filter((block) => block.pages.length > 0);
  }

  if (!category) {
    return categories
      .filter((item) => item.menu === menu && !item.section)
      .map((item) => ({
        title: item.group.label[locale],
        href: withLocale(locale, item.path),
        pages: getGroupPages(menu, item.group),
      }));
  }

  if (category.section) {
    return [{ pages: getMenuPages(menu, category.group.id, category.section.id) }];
  }

  const named = categories
    .filter((item) => item.menu === menu && item.group.id === category.group.id && item.section)
    .map((item) => ({
      title: item.section!.label[locale],
      href: withLocale(locale, item.path),
      pages: getMenuPages(menu, category.group.id, item.section!.id),
    }));
  const other = getMenuPages(menu, category.group.id);
  const blocks = other.length > 0 ? [...named, { title: defaultSectionLabel, pages: other }] : named;
  // A group without named sections needs no block heading.
  return named.length === 0 ? blocks.map((block) => ({ pages: block.pages })) : blocks;
}

export function brandProductsPath(brandId: string) {
  return `/brands/${brandId}/${brandProductsSlug}`;
}

/** Catalog pages of a brand (products, groups, overviews, test menus), without addresses that redirect. */
export function getBrandProducts(brandId: string) {
  return contentPages.filter(
    (page) =>
      page.kind === "product" && page.brand.id === brandId && !isRedirectedPath(page.path),
  );
}

/** Brands that have a product listing at `/brands/{brand}/products`. */
export function getBrandsWithProducts(): Brand[] {
  return brands.filter((brand) => getBrandProducts(brand.id).length > 0);
}

/** The pages of one brand, grouped by their place in the catalog menu (type, then direction). */
export function getBrandProductBlocks(brandId: string, locale: Locale, otherLabel: string): ListingBlock[] {
  const owned = new Set(getBrandProducts(brandId).map((page) => page.path));
  const blocks: ListingBlock[] = [];
  for (const group of catalogGroups) {
    const hasSections = group.sections.some((section) => getMenuPages("catalog", group.id, section.id).length > 0);
    for (const section of [...group.sections, undefined]) {
      const pages = getMenuPages("catalog", group.id, section?.id).filter((page) => owned.has(page.path));
      if (pages.length === 0) continue;
      const category = getCategory("catalog", group.id, section?.id);
      blocks.push({
        title: section ? section.label[locale] : hasSections ? otherLabel : group.label[locale],
        href: category ? withLocale(locale, category.path) : undefined,
        pages,
      });
    }
  }
  return blocks;
}
