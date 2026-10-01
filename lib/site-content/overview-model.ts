/** Turns a validated series overview (template C2) into what the page renders. Pure function, no I/O. */
import { buildCompareRows, type CompareModel } from "./compare.ts";
import type { SiteLocale } from "./links.ts";
import {
  buildBreadcrumbs,
  buildContact,
  buildFaq,
  buildLabwell,
  link,
  splitH1,
  usableLink,
  type LinkModel,
  type ProductPageModel,
} from "./model.ts";
import type { PhotoOf } from "./group-model.ts";
import { hasPlaceholder } from "./placeholders.ts";
import type { OverviewContent } from "./schema-pages.ts";
import type { SharedContent } from "./schema.ts";

export type ModelCardModel = {
  productSlug: string;
  eyebrow: string;
  title: string;
  text: string;
  /** Absent when the model page does not exist: the card is shown without a link. */
  href?: string;
  imageSrc?: string;
  imageAlt: string;
};

export type RelatedWideModel = {
  kind: "group" | "test-menu";
  eyebrow: string;
  title: string;
  text: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  bigNumber?: { value: string; label: string };
};

export type OverviewPageModel = {
  slug: string;
  brand: string;
  name: string;
  canonicalPath: string;
  seo: OverviewContent["seo"];
  breadcrumbs: Array<{ label: string; href?: string }>;
  hero: {
    brand: string;
    eyebrow: string;
    h1: string;
    h1Accent?: string;
    h1Rest: string;
    lead: string;
    primaryCta?: LinkModel;
    /** Photos of the models side by side. */
    tiles: Array<{ title: string; imageSrc?: string; imageAlt: string }>;
  };
  compare?: CompareModel;
  cards?: { h2: string; eyebrow?: string; models: ModelCardModel[]; related: RelatedWideModel[] };
  faq?: ProductPageModel["faq"];
  labwell?: ProductPageModel["labwell"];
  contact?: ProductPageModel["contact"];
};

export function buildOverviewPage(input: {
  overview: OverviewContent;
  shared: SharedContent;
  locale: SiteLocale;
  photo: PhotoOf;
  /** Photo for a card that points at a page (the first model of a group, for example). */
  relatedPhoto?: (href: string) => string | undefined;
}): OverviewPageModel {
  const { overview, shared, locale, photo, relatedPhoto } = input;
  const hero = overview.C2_hero;
  if (!hero.show) throw new Error(`C2_hero of "${overview.slug}" must be shown: it holds the page title`);
  const name = hero.breadcrumbs[hero.breadcrumbs.length - 1];
  const h1 = splitH1(hero.h1, name);

  const contact = buildContact(overview.T12_contact, shared);
  const anchors = new Set<string>(contact ? ["#contact"] : []);

  const c2c = overview.C2_compare;
  const titleOf = new Map<string, string>(c2c.show ? c2c.models.map((model) => [model.productSlug, model.name]) : []);

  const compare: OverviewPageModel["compare"] = c2c.show
    ? (() => {
        const rows = buildCompareRows(
          c2c.rows.map((row) => ({
            label: row.label,
            detail: row.unit,
            values: c2c.models.map((model) => row.values[model.productSlug]),
          })),
        );
        if (!rows.length) return undefined;
        return {
          h2: c2c.h2,
          eyebrow: c2c.eyebrow,
          caption: c2c.caption,
          columns: c2c.models.map((model) => ({
            title: model.name,
            href: link({ label: model.name, href: model.href }, locale)?.href,
            imageSrc: photo(model.productSlug),
            imageAlt: model.image.alt,
          })),
          rows,
          footnote: c2c.footnote && !hasPlaceholder(c2c.footnote) ? c2c.footnote : undefined,
        };
      })()
    : undefined;

  const c2k = overview.C2_cards;
  const cards: OverviewPageModel["cards"] = c2k.show
    ? {
        h2: c2k.h2,
        eyebrow: c2k.eyebrow,
        models: c2k.models
          .filter((model) => !hasPlaceholder(model.title + model.text))
          .map((model) => ({
            productSlug: model.productSlug,
            eyebrow: model.eyebrow,
            title: model.title,
            text: model.text,
            href: link({ label: model.title, href: model.href }, locale)?.href,
            imageSrc: photo(model.productSlug),
            imageAlt: model.image.alt,
          })),
        related: (c2k.related ?? [])
          .filter((item) => !hasPlaceholder(item.title + item.text))
          .map((item) => ({
            kind: item.kind,
            eyebrow: item.eyebrow,
            title: item.title,
            text: item.text,
            href: link({ label: item.title, href: item.href }, locale)?.href,
            imageSrc: relatedPhoto?.(item.href),
            imageAlt: item.image?.alt,
            bigNumber: item.bigNumber,
          })),
      }
    : undefined;

  return {
    slug: overview.slug,
    brand: overview.brand,
    name,
    canonicalPath: overview.url,
    seo: overview.seo,
    breadcrumbs: buildBreadcrumbs(hero.breadcrumbs, locale),
    hero: {
      brand: overview.brand,
      eyebrow: hero.eyebrow,
      h1: hero.h1,
      h1Accent: h1.accent,
      h1Rest: h1.rest,
      lead: hero.lead,
      primaryCta: usableLink(link(hero.primaryCta, locale), anchors),
      tiles: hero.models.map((model) => ({
        title: titleOf.get(model.productSlug) ?? model.image.alt,
        imageSrc: photo(model.productSlug),
        imageAlt: model.image.alt,
      })),
    },
    compare,
    cards: cards && cards.models.length ? cards : undefined,
    faq: buildFaq(overview.T10_faq, overview.T12_contact.show, shared, locale),
    labwell: buildLabwell(overview.T11_labwell, shared, locale),
    contact,
  };
}
