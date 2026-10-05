/**
 * Template D: what a group or direction page of the catalog renders.
 *
 * Cards come from the catalog (`lib/catalog.ts`) and from the pages they point at (key facts of T / G / C pages);
 * nothing is written by hand. A card without facts shows the product type only. Direction cards of a group page
 * come from the navigation data, so the counters match the menu. Pure functions: file access sits behind
 * `DirectionSources` (see `direction-sources.ts`).
 */
import type { Brand, BrandLogo } from "../../content/brands.ts";
import type { Locale } from "../../i18n/config.ts";
import { getCategoryTrail, trailCrumbs, type Crumb, type Trail } from "../breadcrumbs.ts";
import { getMenuPages, getPageByPath, type Category, type ContentPage } from "../catalog.ts";
import { isRedirectedPath } from "../legacy-redirects.ts";
import { withLocale } from "../locale-routing.ts";
import type { HeaderMegaGroup, PluralForms } from "../site-navigation.ts";
import { formatCount } from "../site-navigation.ts";
import { buildContact, buildFaq, link, type ContactModel, type ProductPageModel } from "./model.ts";
import { hasPlaceholder } from "./placeholders.ts";
import type { DirectionContent } from "./schema-directions.ts";
import type { SharedContent } from "./schema.ts";

export type Fact = { value: string; label?: string };
export type CardBrand = { id: string; name: string; logo?: BrandLogo };

export type PageKind = "product" | "group" | "overview" | "test-menu";

/** What the page behind a card says about itself (read from its content file). */
export type PageDetails = {
  kind: PageKind;
  keyFacts: Fact[];
  /** Series group (G): how many models it presents. */
  modelCount?: number;
  /** Test menus (`/test-menus/{slug}`) that the page links to. */
  testMenus: string[];
  /** Test menu (C1): its first figure, e.g. `278` / `parameters, as stated by Snibe`. */
  stat?: Fact;
};

export type DirectionSources = {
  details(page: ContentPage): PageDetails | undefined;
  photo(page: ContentPage): string | undefined;
};

export type DirectionLabels = {
  /** "{n}" is replaced with the number; the form depends on it. */
  pagesInDirection: PluralForms;
  pagesInGroup: PluralForms;
  directionsInGroup: PluralForms;
  /** "model in the series" without the number. */
  modelsInSeries: PluralForms;
};

export type PageCard = {
  path: string;
  href: string;
  title: string;
  type: string;
  brand: CardBrand;
  photo?: string;
  facts: Fact[];
  /** Series group, other group, or a product page: the badge of a wide card. */
  kind: PageKind;
};

export type BannerCard = {
  kind: "overview" | "test-menu";
  path: string;
  href: string;
  title: string;
  sub: string;
  stat?: Fact;
  brand: CardBrand;
};

export type DirectionCard = {
  id: string;
  href: string;
  title: string;
  countLabel: string;
  photo?: string;
  brands: CardBrand[];
};

export type BrandFilterOption = CardBrand & { count: number };

export type DirectionPageModel = {
  id: string;
  canonicalPath: string;
  seo: DirectionContent["seo"];
  h1: string;
  lead: string;
  name: string;
  trail: Trail;
  breadcrumbs: Crumb[];
  /** Logos above the heading: the brands whose pages are in the list. */
  brands: CardBrand[];
  /** Direction cards: the page of a group that has directions. */
  directions: DirectionCard[];
  /** Page cards: tiles (products), wide cards (groups, or the only page) and link banners. */
  pages?: {
    tiles: PageCard[];
    wide: PageCard[];
    banners: BannerCard[];
    /** Whether tiles reserve a photo zone: false when no tile has a photo (lines). */
    media: boolean;
    /** Catalog pages of the category (the same number as in the menu), banners included. */
    count: number;
  };
  countLabel: string;
  /** Only when the list has two or more brands. */
  filter?: BrandFilterOption[];
  faq?: ProductPageModel["faq"];
  labwell: NonNullable<ProductPageModel["labwell"]>;
  contact: ContactModel;
  jsonLdItems: Array<{ name: string; url: string }>;
};

const MAX_FACTS_WITH_PHOTO = 3;
const MAX_FACTS_TEXT_ONLY = 2;
const MAX_FACTS_MULTI_BRAND = 2;

/** Columns of a grid of tiles at the widest layout: one or two tiles fill the row; five and six stay in three columns. */
export function gridColumns(count: number): number {
  if (count <= 2) return Math.max(count, 1);
  if (count === 3 || count === 5 || count === 6) return 3;
  return 4;
}

function toBrand(brand: Brand): CardBrand {
  return { id: brand.id, name: brand.name, logo: brand.logo };
}

function uniqueBrands(brands: readonly CardBrand[]): CardBrand[] {
  return [...new Map(brands.map((brand) => [brand.id, brand])).values()];
}

/** The form of a plural pattern without the number: "{n} model" with n = 4 → "models". */
function pluralLabel(count: number, locale: Locale, forms: PluralForms): string {
  const form = forms[new Intl.PluralRules(locale).select(count)] ?? forms.other;
  return form.replace("{n}", "").trim();
}

/** "up to 180 tests/h" → value "up to 180", label "tests/h"; no number → the whole text as a value. */
export function splitKeySpec(spec: string): Fact {
  const match = /^(.*?\d[\d\s.,]*?)\s+(\D.*)$/u.exec(spec.trim());
  return match ? { value: match[1].trim(), label: match[2].trim() } : { value: spec.trim() };
}

function publishableFacts(facts: readonly Fact[]): Fact[] {
  return facts.filter((fact) => !hasPlaceholder(fact.value) && !(fact.label && hasPlaceholder(fact.label)));
}

function pageFacts(page: ContentPage, details: PageDetails | undefined, locale: Locale, labels: DirectionLabels): Fact[] {
  if (!details) return [];
  if (details.kind === "group" && details.modelCount) {
    const spec = page.keySpec?.[locale];
    return [
      { value: String(details.modelCount), label: pluralLabel(details.modelCount, locale, labels.modelsInSeries) },
      ...(spec ? [splitKeySpec(spec)] : []),
    ];
  }
  return publishableFacts(details.keyFacts);
}

function toPageCard(page: ContentPage, locale: Locale, sources: DirectionSources, labels: DirectionLabels): PageCard {
  const details = sources.details(page);
  return {
    path: page.path,
    href: withLocale(locale, page.path),
    title: page.navLabel[locale],
    type: page.itemType?.[locale] ?? "",
    brand: toBrand(page.brand),
    photo: sources.photo(page),
    facts: pageFacts(page, details, locale, labels),
    kind: details?.kind ?? "product",
  };
}

function toBanner(page: ContentPage, details: PageDetails, locale: Locale): BannerCard {
  return {
    kind: details.kind === "test-menu" ? "test-menu" : "overview",
    path: page.path,
    href: withLocale(locale, page.path),
    title: page.navLabel[locale],
    sub: details.stat?.label ?? page.itemType?.[locale] ?? "",
    stat: details.stat,
    brand: toBrand(page.brand),
  };
}

/**
 * The page cards of a list of catalog pages.
 * - one page → one wide card; otherwise products are tiles and groups are wide cards below them;
 * - overviews and test menus become banners (a direction also gets the menus its products link to).
 */
export function buildPageCards(
  pages: readonly ContentPage[],
  locale: Locale,
  sources: DirectionSources,
  labels: DirectionLabels,
): NonNullable<DirectionPageModel["pages"]> {
  const live = pages.filter((page) => !isRedirectedPath(page.path));
  const cards: PageCard[] = [];
  const banners: BannerCard[] = [];
  const linkedMenus: string[] = [];

  for (const page of live) {
    const details = sources.details(page);
    if (details && (details.kind === "overview" || details.kind === "test-menu")) {
      banners.push(toBanner(page, details, locale));
    } else {
      cards.push(toPageCard(page, locale, sources, labels));
    }
    for (const slug of details?.testMenus ?? []) if (!linkedMenus.includes(slug)) linkedMenus.push(slug);
  }

  for (const slug of linkedMenus) {
    const menu = getPageByPath(`/test-menus/${slug}`);
    const details = menu && sources.details(menu);
    if (menu && details && !banners.some((banner) => banner.path === menu.path)) {
      banners.push(toBanner(menu, details, locale));
    }
  }
  // Overviews first, then menus: the order of the mock-up.
  banners.sort((a, b) => Number(a.kind === "test-menu") - Number(b.kind === "test-menu"));

  const multiBrand = uniqueBrands([...cards.map((card) => card.brand), ...banners.map((banner) => banner.brand)]).length > 1;
  const media = cards.some((card) => card.kind !== "group" && card.photo);
  const trim = (card: PageCard, withPhoto: boolean): PageCard => ({
    ...card,
    facts: card.facts.slice(0, multiBrand ? MAX_FACTS_MULTI_BRAND : withPhoto ? MAX_FACTS_WITH_PHOTO : MAX_FACTS_TEXT_ONLY),
  });

  if (cards.length === 1) {
    return { tiles: [], wide: [{ ...cards[0], facts: cards[0].facts.slice(0, MAX_FACTS_WITH_PHOTO) }], banners, media, count: live.length };
  }
  return {
    tiles: cards.filter((card) => card.kind !== "group").map((card) => trim(card, media)),
    wide: cards.filter((card) => card.kind === "group").map((card) => ({ ...card, facts: card.facts.slice(0, MAX_FACTS_WITH_PHOTO) })),
    banners,
    media,
    count: live.length,
  };
}

/** Direction cards of a group: its named sections from the navigation data (same counters as the menu). */
export function buildDirectionCards(group: HeaderMegaGroup): DirectionCard[] {
  return group.sections
    .filter((section) => !section.id.endsWith(":other"))
    .map((section) => ({
      id: section.id,
      href: section.href,
      title: section.label,
      countLabel: section.countLabel,
      photo: section.links.find((leaf) => leaf.photo)?.photo,
      brands: uniqueBrands(
        section.links.map((leaf) => ({ id: leaf.brandId, name: leaf.brand, logo: leaf.logo })),
      ),
    }));
}

/** Brands of a list with the number of items of each; undefined when there is no choice to filter by. */
export function buildBrandFilter(items: ReadonlyArray<readonly CardBrand[]>): BrandFilterOption[] | undefined {
  const brands = uniqueBrands(items.flat());
  if (brands.length < 2) return undefined;
  return brands.map((brand) => ({
    ...brand,
    count: items.filter((item) => item.some((candidate) => candidate.id === brand.id)).length,
  }));
}

export function buildDirectionPage(input: {
  category: Category;
  locale: Locale;
  content: DirectionContent;
  shared: SharedContent;
  /** Text of the invitation under "Get a consultation" (from the home content). */
  contactText: string;
  labels: DirectionLabels & { contactH2: string; askPrefill: string; faqH2: string };
  sources: DirectionSources;
  /** The group, with its sections, from the navigation data; used for the direction cards of a group. */
  navGroup?: HeaderMegaGroup;
}): DirectionPageModel {
  const { category, locale, content, shared, labels, sources } = input;
  const id = (category.section ?? category.group).id;
  const name = (category.section ?? category.group).label[locale];
  const trail = getCategoryTrail(category, locale);

  const showsDirections = !category.section && category.group.sections.length > 0;
  const directions = showsDirections && input.navGroup ? buildDirectionCards(input.navGroup) : [];
  const pages = buildPageCards(getMenuPages(category.menu, category.group.id, category.section?.id), locale, sources, labels);
  const hasPages = pages.tiles.length + pages.wide.length + pages.banners.length > 0;

  const countLabel = directions.length
    ? formatCount(directions.length, locale, labels.directionsInGroup)
    : formatCount(pages.count, locale, category.section ? labels.pagesInDirection : labels.pagesInGroup);

  const pageBrands = [...pages.tiles, ...pages.wide, ...pages.banners].map((item) => [item.brand] as const);
  const filterItems = [...directions.map((direction) => direction.brands), ...pageBrands];

  const contact = buildContact(
    { show: true, h2: labels.contactH2, text: input.contactText, messagePrefill: labels.askPrefill.replace("{name}", name) },
    shared,
  )!;
  const faq = content.faq.length
    ? buildFaq({ show: true, h2: labels.faqH2, items: content.faq }, true, shared, locale)
    : undefined;
  const labwellLink = link(shared.labwell.link, locale);

  const listed = [...pages.tiles, ...pages.wide, ...pages.banners];
  return {
    id,
    canonicalPath: category.path,
    seo: content.seo,
    h1: content.h1,
    lead: content.lead,
    name,
    trail,
    breadcrumbs: trailCrumbs(trail),
    brands: uniqueBrands(filterItems.flat()),
    directions,
    pages: hasPages ? pages : undefined,
    countLabel,
    filter: buildBrandFilter(filterItems),
    faq,
    labwell: { h2: shared.labwell.h2, link: labwellLink, compact: true, items: shared.labwell.items },
    contact,
    jsonLdItems: [
      ...directions.map((direction) => ({ name: direction.title, url: direction.href })),
      ...listed.map((item) => ({ name: item.title, url: item.href })),
    ],
  };
}
