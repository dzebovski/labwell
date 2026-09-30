/**
 * Turns validated content into what the page renders: hidden blocks and rows with
 * placeholders are dropped, hrefs are resolved to pages that exist, and the
 * "labwell" block is picked from the shared content. Pure function, no I/O.
 */
import { resolveHref, type SiteLocale } from "./links.ts";
import { hasPlaceholder, publishable } from "./placeholders.ts";
import type { ProductContent, SharedContent } from "./schema.ts";

export type LinkModel = { label: string; href: string; external: boolean };
export type CardModel = {
  eyebrow: string;
  title: string;
  href?: string;
  facts: Array<[string, string]>;
};

export type ItemsModel =
  | {
      layout: "matrix";
      h2: string;
      summary?: string;
      columns: string[];
      rows: Array<{ name: string; nameUk?: string; catalogNumbers: string[] }>;
      footnote?: string;
      cta?: LinkModel;
    }
  | {
      layout: "list";
      h2: string;
      summary?: string;
      columns: string[];
      rows: Array<{ name: string; catalogNumber?: string; packSize?: string }>;
      footnote?: string;
      cta?: LinkModel;
    };

export type ContactModel = {
  h2: string;
  text: string;
  messagePrefill?: string;
  phone?: string;
  email?: string;
  consent?: string;
  submit: string;
  fields: SharedContent["contact"]["form"]["fields"];
};

export type ProductPageModel = {
  slug: string;
  kind: ProductContent["kind"];
  brand: string;
  name: string;
  canonicalPath: string;
  seo: ProductContent["seo"];
  breadcrumbs: Array<{ label: string; href?: string }>;
  hero: {
    brand: string;
    eyebrow: string;
    h1: string;
    /** Model name at the start of the H1, accented in the layout. */
    h1Accent?: string;
    h1Rest: string;
    lead: string;
    facts: Array<{ value: string; label: string }>;
    primaryCta?: LinkModel;
    secondaryCta?: LinkModel;
    imageAlt: string;
    imageSrc?: string;
  };
  about?: { h2: string; text: string };
  specs?: {
    h2: string;
    caption?: string;
    rows: Array<{ label: string; value: string }>;
    fullRows?: Array<{ label: string; value: string }>;
  };
  benefits?: { h2: string; items: Array<{ icon: string; h3: string; text: string }> };
  testMenu?: {
    h2: string;
    title: string;
    text: string;
    /** Missing when the menu has no page yet: the banner is shown without a link. */
    cta?: LinkModel;
    bigNumber?: { value: string; label: string };
  };
  items?: ItemsModel;
  storage?: {
    h2: string;
    caption?: string;
    rows: Array<{ label: string; value: string; detail?: string }>;
  };
  documents?: {
    h2: string;
    items: Array<{ title: string; meta?: string; href: string }>;
  };
  faq?: {
    h2: string;
    items: Array<{ q: string; a: string; link?: LinkModel }>;
    /** "Not found an answer?" prompt; only when the contact block exists. */
    aside?: { text: string; link: LinkModel };
  };
  labwell?: {
    h2: string;
    link?: LinkModel;
    compact: boolean;
    items: Array<{ icon: string; title: string; text: string }>;
  };
  contact?: ContactModel;
  related?: { h2: string; allLink?: LinkModel; cards: CardModel[] };
};

function link(
  item: { label: string; href: string } | undefined,
  locale: SiteLocale,
): LinkModel | undefined {
  if (!item || hasPlaceholder(item.label)) return undefined;
  const href = resolveHref(item.href, locale);
  return href ? { label: item.label, href, external: /^https?:/.test(href) } : undefined;
}

function card(
  item: { eyebrow: string; title: string; href: string; facts?: Array<[string, string]> },
  locale: SiteLocale,
): CardModel {
  return {
    eyebrow: item.eyebrow,
    title: item.title,
    href: resolveHref(item.href, locale) ?? undefined,
    facts: (item.facts ?? []).filter(([label, value]) => !hasPlaceholder(label) && !hasPlaceholder(value)),
  };
}

function splitH1(h1: string, name: string) {
  const [head, ...rest] = h1.split(" — ");
  if (rest.length && head === name) return { accent: head, rest: ` — ${rest.join(" — ")}` };
  return { accent: undefined, rest: h1 };
}

export function buildProductPage(input: {
  product: ProductContent;
  shared: SharedContent;
  locale: SiteLocale;
  /** Public path of the main photo, when the file exists. */
  imageSrc?: string;
}): ProductPageModel {
  const { product, shared, locale, imageSrc } = input;
  const name = product.T1_breadcrumbs[product.T1_breadcrumbs.length - 1];
  const h1 = splitH1(product.T2_hero.h1, name);

  const breadcrumbs = product.T1_breadcrumbs.map((label, index) => ({
    label,
    href:
      index === 0
        ? `/${locale}`
        : index === 1
          ? `/${locale}/products`
          : undefined,
  }));
  breadcrumbs[breadcrumbs.length - 1].href = undefined;

  const t3 = product.T3_about;
  const t4 = product.T4_specs;
  const t5 = product.T5_benefits;
  const t6 = product.T6_items;
  const t7 = product.T7_storage;
  const t8 = product.T8_related;
  const t9 = product.T9_documents;
  const t10 = product.T10_faq;
  const t11 = product.T11_labwell;
  const t12 = product.T12_contact;

  const specRows = t4.show
    ? t4.rows.filter((row) => !hasPlaceholder(row.label) && !hasPlaceholder(row.value))
    : [];
  const fullRows =
    t4.show && t4.fullTechnicalData?.show
      ? t4.fullTechnicalData.rows.filter((row) => !hasPlaceholder(row.label) && !hasPlaceholder(row.value))
      : [];
  const specs =
    t4.show && specRows.length
      ? {
          h2: t4.h2,
          caption: publishable(t4.caption),
          rows: specRows,
          fullRows: fullRows.length ? fullRows : undefined,
        }
      : undefined;

  const benefitItems = t5.show ? t5.items.filter((item) => !hasPlaceholder(item.h3 + item.text)) : [];
  const benefits = t5.show && benefitItems.length ? { h2: t5.h2, items: benefitItems } : undefined;

  const storageRows = t7.show
    ? t7.rows.filter((row) => !hasPlaceholder(row.label + row.value + (row.detail ?? "")))
    : [];
  const storage =
    t7.show && storageRows.length
      ? { h2: t7.h2, caption: publishable(t7.caption), rows: storageRows }
      : undefined;

  let items: ItemsModel | undefined;
  if (t6.show) {
    const common = {
      h2: t6.h2,
      summary: publishable(t6.summary),
      footnote: publishable(t6.footnote),
      cta: link(t6.cta, locale),
    };
    if (t6.rows.some((row) => row.catalogNumbers)) {
      const rows = t6.rows
        .filter((row) => row.catalogNumbers && !hasPlaceholder(row.name + row.catalogNumbers.join("")))
        .map((row) => ({ name: row.name, nameUk: publishable(row.nameUk), catalogNumbers: row.catalogNumbers! }));
      if (rows.length) items = { layout: "matrix", columns: t6.columns, rows, ...common };
    } else {
      const rows = t6.rows
        .filter((row) => !hasPlaceholder(row.name))
        .map((row) => ({
          name: row.name,
          catalogNumber: publishable(row.catalogNumber),
          packSize: publishable(row.packSize),
        }));
      const withPack = rows.some((row) => row.packSize);
      const columns = withPack ? t6.columns : t6.columns.slice(0, 2);
      if (rows.length) items = { layout: "list", columns, rows, ...common };
    }
  }

  const testMenuSource = t8.show ? t8.testMenu : undefined;
  const testMenuCta = testMenuSource?.cta && link(testMenuSource.cta, locale);
  const testMenu =
    testMenuSource
      ? {
          h2: testMenuSource.h2,
          title: testMenuSource.title,
          text: testMenuSource.text,
          cta: testMenuCta,
          bigNumber: testMenuSource.bigNumber,
        }
      : undefined;

  let related: ProductPageModel["related"];
  if (t8.show) {
    const group = t8.models ?? (t8.cards && t8.h2 ? { h2: t8.h2, allLink: t8.allLink, cards: t8.cards } : undefined);
    if (group) {
      related = {
        h2: group.h2,
        allLink: link(group.allLink, locale),
        cards: group.cards.map((item) => card(item, locale)),
      };
    }
  }

  const documentItems = t9.show ? t9.items.filter((doc) => !hasPlaceholder(doc.title + doc.href)) : [];
  const documents =
    t9.show && documentItems.length
      ? {
          h2: t9.h2,
          items: documentItems.map((doc) => ({ title: doc.title, meta: publishable(doc.meta), href: doc.href })),
        }
      : undefined;

  const faqItems = t10.show ? t10.items.filter((item) => !hasPlaceholder(item.q + item.a)) : [];
  const faqAsideLink = t12.show
    ? link({ label: shared.faqAside.link, href: "#contact" }, locale)
    : undefined;

  const labwellSource = t11.show ? shared.labwell : undefined;

  const contactForm = shared.contact.form;
  const contact: ContactModel | undefined = t12.show
    ? {
        h2: t12.h2,
        text: t12.text,
        messagePrefill: t12.messagePrefill,
        phone: publishable(shared.contact.phone),
        email: publishable(shared.contact.email),
        consent: publishable(contactForm.consent),
        submit: contactForm.submit,
        fields: contactForm.fields,
      }
    : undefined;

  // A CTA that points at a block that is not rendered would be a dead anchor.
  const anchors = new Set<string>();
  if (contact) anchors.add("#contact");
  if (specs) anchors.add("#specs");
  if (items) anchors.add("#items");
  const usable = (cta: LinkModel | undefined) =>
    cta && (!cta.href.startsWith("#") || anchors.has(cta.href)) ? cta : undefined;

  const hero = product.T2_hero;

  return {
    slug: product.slug,
    kind: product.kind,
    brand: product.brand,
    name,
    canonicalPath: product.url,
    seo: product.seo,
    breadcrumbs,
    hero: {
      brand: hero.brand,
      eyebrow: hero.eyebrow,
      h1: hero.h1,
      h1Accent: h1.accent,
      h1Rest: h1.rest,
      lead: hero.lead,
      facts: hero.keyFacts.filter((fact) => !hasPlaceholder(fact.value + fact.label)),
      primaryCta: usable(link(hero.primaryCta, locale)),
      secondaryCta: usable(link(hero.secondaryCta, locale)),
      imageAlt: hero.image.alt,
      imageSrc,
    },
    about: t3.show ? { h2: t3.h2, text: t3.text } : undefined,
    specs,
    benefits,
    testMenu,
    items,
    storage,
    documents,
    faq:
      t10.show && faqItems.length
        ? {
            h2: t10.h2,
            items: faqItems.map((item) => ({
              q: item.q,
              a: item.a,
              link: link(item.link, locale),
            })),
            aside: faqAsideLink
              ? { text: shared.faqAside.text, link: faqAsideLink }
              : undefined,
          }
        : undefined,
    labwell: labwellSource
      ? {
          h2: labwellSource.h2,
          link: link(labwellSource.link, locale),
          compact: t11.show && t11.use === "shared.labwell.itemsForLine",
          items: t11.show && t11.use === "shared.labwell.itemsForLine" ? labwellSource.itemsForLine : labwellSource.items,
        }
      : undefined,
    contact,
    related: related && related.cards.length ? related : undefined,
  };
}
