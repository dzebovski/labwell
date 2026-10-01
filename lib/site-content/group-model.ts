/**
 * Turns a validated group page (template G) into what the page renders: hidden blocks and
 * placeholder rows are dropped, hrefs are resolved, photos are looked up by product slug.
 * Pure function, no I/O (the caller passes `photo`).
 */
import { trailCrumbs, type Trail } from "../breadcrumbs.ts";
import { buildCompareRows, type CompareModel } from "./compare.ts";
import type { SiteLocale } from "./links.ts";
import {
  buildTrail,
  buildContact,
  buildFaq,
  buildLabwell,
  buildListItems,
  link,
  splitH1,
  usableLink,
  type ItemsModel,
  type LinkModel,
  type ProductPageModel,
} from "./model.ts";
import { hasPlaceholder } from "./placeholders.ts";
import type { SharedContent } from "./schema.ts";
import type { GroupContent } from "./schema-pages.ts";

export type PhotoOf = (productSlug: string) => string | undefined;

export type GroupItemModel = {
  productSlug: string;
  anchor: string;
  eyebrow: string;
  h3: string;
  text: string;
  facts: Array<{ value: string; label: string }>;
  imageSrc?: string;
  imageAlt: string;
  /** Order table of this item: `h3` is its heading. */
  ordering?: { h3: string; table: Extract<ItemsModel, { layout: "list" }> };
  cta?: LinkModel;
  backLink?: LinkModel;
  /** "1 / 4 on the page". */
  position: number;
  total: number;
};

export type HeroTile = { title: string; href: string; imageSrc?: string; imageAlt: string };

export type GroupPageModel = {
  slug: string;
  kind: GroupContent["kind"];
  brand: string;
  name: string;
  canonicalPath: string;
  seo: GroupContent["seo"];
  breadcrumbs: Array<{ label: string; href?: string }>;
  trail: Trail;
  hero: {
    brand: string;
    eyebrow: string;
    h1: string;
    h1Accent?: string;
    h1Rest: string;
    lead: string;
    primaryCta?: LinkModel;
    secondaryCta?: LinkModel;
    /** Series: chips with the models. */
    chips?: { label?: string; items: Array<{ title: string; href: string }> };
    /** Series: photo tiles; lines: the photos of the lines side by side, or one placeholder. */
    media:
      | { type: "tiles"; items: HeroTile[] }
      | { type: "collage"; items: HeroTile[]; alt: string }
      | { type: "placeholder"; alt: string };
  };
  compare?: CompareModel & { id: string };
  sections?: {
    h2: string;
    eyebrow?: string;
    items: Array<{
      anchor: string;
      title: string;
      eyebrow?: string;
      text: string;
      href: string;
      imageSrc?: string;
      imageAlt?: string;
    }>;
  };
  items?: { h2: string; eyebrow?: string; items: GroupItemModel[] };
  faq?: ProductPageModel["faq"];
  labwell?: ProductPageModel["labwell"];
  contact?: ProductPageModel["contact"];
};

export function buildGroupPage(input: {
  group: GroupContent;
  shared: SharedContent;
  locale: SiteLocale;
  photo: PhotoOf;
}): GroupPageModel {
  const { group, shared, locale, photo } = input;
  const hero = group.G1_hero;
  const name = hero.breadcrumbs[hero.breadcrumbs.length - 1];
  const h1 = splitH1(hero.h1, name);
  const trail = buildTrail(hero.breadcrumbs, locale, group.url);

  const contact = buildContact(group.T12_contact, shared);

  // ---- G3: sub-sections with an anchor each ----
  const g3 = group.G3_items;
  const sourceItems = g3.show ? g3.items.filter((item) => !hasPlaceholder(item.h3 + item.text)) : [];

  // ---- G2: comparison table or the list of sub-sections ----
  const compareId = "compare";
  const sectionsId = "lines";
  const g2c = group.G2_compare;
  const g2s = group.G2_sections;
  const anchors = new Set<string>(sourceItems.map((item) => `#${item.anchor}`));
  if (contact) anchors.add("#contact");
  if (g2c.show) anchors.add(`#${compareId}`);
  if (g2s.show) anchors.add(`#${sectionsId}`);
  const usable = (cta: Parameters<typeof link>[0]) => usableLink(link(cta, locale), anchors);

  const compare: GroupPageModel["compare"] = g2c.show
    ? (() => {
        const columns = g2c.columns.map((column) => ({
          title: column.title,
          href: anchors.has(`#${column.anchor}`) ? `#${column.anchor}` : undefined,
          imageSrc: photo(column.productSlug),
          imageAlt: column.image.alt,
        }));
        const rows = buildCompareRows(g2c.rows);
        if (!rows.length) return undefined;
        return {
          id: compareId,
          h2: g2c.h2,
          eyebrow: g2c.eyebrow,
          caption: g2c.caption,
          columns,
          rows,
          footnote: g2c.footnote && !hasPlaceholder(g2c.footnote) ? g2c.footnote : undefined,
        };
      })()
    : undefined;

  const byAnchor = new Map(sourceItems.map((item) => [item.anchor, item]));
  const sections: GroupPageModel["sections"] = g2s.show
    ? (() => {
        const items = g2s.items
          .filter((item) => byAnchor.has(item.anchor) && !hasPlaceholder(item.title + item.text))
          .map((item) => {
            const target = byAnchor.get(item.anchor)!;
            return {
              anchor: item.anchor,
              title: item.title,
              eyebrow: target.eyebrow,
              text: item.text,
              href: `#${item.anchor}`,
              imageSrc: photo(target.productSlug),
              imageAlt: target.image.alt,
            };
          });
        return items.length ? { h2: g2s.h2, eyebrow: g2s.eyebrow, items } : undefined;
      })()
    : undefined;

  const items: GroupPageModel["items"] = sourceItems.length
    ? {
        h2: (g3 as Extract<typeof g3, { show: true }>).h2,
        eyebrow: (g3 as Extract<typeof g3, { show: true }>).eyebrow,
        items: sourceItems.map((item, index): GroupItemModel => {
          const table =
            item.ordering.show
              ? buildListItems({
                  h2: item.ordering.h3,
                  columns: item.ordering.columns,
                  rows: item.ordering.rows,
                  footnote: item.ordering.footnote,
                })
              : undefined;
          return {
            productSlug: item.productSlug,
            anchor: item.anchor,
            eyebrow: item.eyebrow,
            h3: item.h3,
            text: item.text,
            facts: item.keyFacts.filter((fact) => !hasPlaceholder(fact.value + fact.label)),
            imageSrc: photo(item.productSlug),
            imageAlt: item.image.alt,
            ordering: table && item.ordering.show ? { h3: item.ordering.h3, table } : undefined,
            cta: usable(item.cta),
            backLink: usable(item.backLink),
            position: index + 1,
            total: sourceItems.length,
          };
        }),
      }
    : undefined;

  // ---- G1: hero ----
  const chipItems = (hero.models ?? [])
    .filter((model) => anchors.has(`#${model.anchor}`))
    .map((model) => ({ title: model.title, href: `#${model.anchor}` }));
  const tileItems: HeroTile[] = (hero.models ?? [])
    .filter((model) => anchors.has(`#${model.anchor}`))
    .map((model) => ({
      title: model.title,
      href: `#${model.anchor}`,
      imageSrc: photo(model.productSlug),
      imageAlt: model.image.alt,
    }));
  const collageItems: HeroTile[] = sourceItems
    .filter((item) => photo(item.productSlug))
    .map((item) => ({
      title: item.h3,
      href: `#${item.anchor}`,
      imageSrc: photo(item.productSlug),
      imageAlt: item.image.alt,
    }));

  const media: GroupPageModel["hero"]["media"] = tileItems.length
    ? { type: "tiles", items: tileItems }
    : collageItems.length
      ? { type: "collage", items: collageItems, alt: hero.image?.alt ?? hero.h1 }
      : { type: "placeholder", alt: hero.image?.alt ?? hero.h1 };

  return {
    slug: group.slug,
    kind: group.kind,
    brand: group.brand,
    name,
    canonicalPath: group.url,
    seo: group.seo,
    breadcrumbs: trailCrumbs(trail),
    trail,
    hero: {
      brand: group.brand,
      eyebrow: hero.eyebrow,
      h1: hero.h1,
      h1Accent: h1.accent,
      h1Rest: h1.rest,
      lead: hero.lead,
      primaryCta: usable(hero.primaryCta),
      secondaryCta: hero.secondaryCta ? usable(hero.secondaryCta) : undefined,
      chips: chipItems.length ? { label: hero.modelsLabel, items: chipItems } : undefined,
      media,
    },
    compare,
    sections,
    items,
    faq: buildFaq(group.T10_faq, group.T12_contact.show, shared, locale),
    labwell: buildLabwell(group.T11_labwell, shared, locale),
    contact,
  };
}
