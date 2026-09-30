import type { Locale } from "../i18n/config.ts";
import type { BrandId } from "./brands.ts";
import type { CatalogPlacement, ClinicalPlacement } from "./taxonomy.ts";

export type LocalizedText = Readonly<Record<Locale, string>>;

type EntryBase = {
  /** URL segment: lowercase latin letters, digits and hyphens. Never change after publishing. */
  slug: string;
  brand: BrandId;
  /** Name: the page H1, the link in menus and the last breadcrumb. */
  navLabel: LocalizedText;
  /** What the item is ("CLIA analyzer"), shown under the name. Required for products. */
  itemType?: LocalizedText;
  /** One confirmed key figure ("up to 600 tests/h") for menus and the model switcher. */
  keySpec?: LocalizedText;
  /** Browser/SEO title without the site name: the layout appends "| Labwell". */
  seoTitle: LocalizedText;
  description: LocalizedText;
  /** Editorial note shown on the page under "What needs completing". */
  todoNote?: LocalizedText;
  sourceUrl: string;
};

export type ProductEntry = EntryBase & {
  itemType: LocalizedText;
  /** Canonical place in the "Product catalog" menu; the page lives at /products/{slug}. */
  catalog: CatalogPlacement;
  /** Extra links from "Clinical directions" to this same product page. */
  clinical?: readonly (ClinicalPlacement & { note?: LocalizedText })[];
};

export type ClinicalEntry = EntryBase & {
  /** Menu place; the page lives at /clinical-directions/{direction}/{slug}. */
  clinical: ClinicalPlacement;
};

export type BrandPageEntry = Omit<EntryBase, "slug"> & {
  /** Omit for the brand overview page (/brands/{brand}); otherwise /brands/{brand}/{slug}. */
  slug?: string;
};

// Identity helpers: they only give content files type checking and autocomplete.
// Non-generic on purpose, so misspelled fields are reported as errors.
export const defineProduct = (entry: ProductEntry): ProductEntry => entry;
export const defineClinicalPage = (entry: ClinicalEntry): ClinicalEntry => entry;
export const defineBrandPage = (entry: BrandPageEntry): BrandPageEntry => entry;
