/**
 * Format of the site content in `content/` (committed to Git, read at build time).
 * Schemas are strict: an unknown or misspelled key is an error, so a broken file
 * fails the build with a clear message instead of rendering an empty block.
 * Independent of `lib/content/` (local tooling for `_content/`).
 */
import { z } from "zod";

const text = z.string().trim().min(1);
const link = z.strictObject({ label: text, href: text });

/** `{ "show": false }` hides the block; `{ "show": true, ... }` carries its data. */
function block<Shape extends z.ZodRawShape>(shape: Shape) {
  return z.discriminatedUnion("show", [
    z.strictObject({ show: z.literal(false) }),
    z.strictObject({ show: z.literal(true), ...shape }),
  ]);
}

const labelValueRows = z.array(z.strictObject({ label: text, value: text })).min(1);

const hero = z.strictObject({
  brand: text,
  eyebrow: text,
  h1: text,
  lead: text,
  keyFacts: z.array(z.strictObject({ value: text, label: text })).min(1).max(4),
  primaryCta: link,
  secondaryCta: link.optional(),
  image: z.strictObject({ alt: text }),
});

const specs = block({
  h2: text,
  caption: text.optional(),
  rows: labelValueRows,
  fullTechnicalData: z
    .discriminatedUnion("show", [
      z.strictObject({ show: z.literal(false) }),
      z.strictObject({ show: z.literal(true), rows: labelValueRows }),
    ])
    .optional(),
});

const benefits = block({
  h2: text,
  items: z.array(z.strictObject({ icon: text, h3: text, text })).min(1).max(4),
  // No photo source in the content yet (benefit photos are not rendered); the alt is kept for later.
  image: z.strictObject({ show: z.boolean().optional(), alt: text.optional() }).optional(),
});

const items = block({
  h2: text,
  summary: text.optional(),
  columns: z.array(text).min(2),
  rows: z
    .array(
      z.strictObject({
        name: text,
        nameUk: text.optional(),
        catalogNumber: text.optional(),
        catalogNumbers: z.array(text).min(1).optional(),
        packSize: text.optional(),
      }),
    )
    .min(1),
  footnote: text.optional(),
  cta: link.optional(),
});

const storage = block({
  h2: text,
  caption: text.optional(),
  rows: z.array(z.strictObject({ label: text, value: text, detail: text.optional() })).min(1),
});

const relatedCard = z.strictObject({
  eyebrow: text,
  title: text,
  href: text,
  facts: z.array(z.tuple([text, text])).optional(),
});

const related = block({
  // Instrument variant: test menu banner + other models.
  testMenu: z
    .strictObject({
      h2: text,
      title: text,
      text,
      cta: link.optional(),
      bigNumber: z.strictObject({ value: text, label: text }).optional(),
    })
    .optional(),
  models: z
    .strictObject({
      h2: text,
      text: text.optional(),
      allLink: link.optional(),
      cards: z.array(relatedCard).min(1),
    })
    .optional(),
  // Line variant: a single group of cards.
  h2: text.optional(),
  allLink: link.optional(),
  cards: z.array(relatedCard).min(1).optional(),
});

const documents = block({
  h2: text,
  items: z.array(z.strictObject({ title: text, meta: text.optional(), href: text })).min(1),
});

const faq = block({
  h2: text,
  items: z.array(z.strictObject({ q: text, a: text, link: link.optional() })).min(1),
});

export const labwellSource = z.enum(["shared.labwell.items", "shared.labwell.itemsForLine"]);

export const productSchema = z.strictObject({
  slug: text,
  url: text,
  kind: z.enum(["instrument", "line", "software"]),
  brand: text,
  seo: z.strictObject({ title: text, description: text }),
  T1_breadcrumbs: z.array(text).min(2),
  T2_hero: hero,
  T3_about: block({ h2: text, text }),
  T4_specs: specs,
  T5_benefits: benefits,
  T6_items: items,
  T7_storage: storage,
  T8_related: related,
  T9_documents: documents,
  T10_faq: faq,
  T11_labwell: block({ use: labwellSource }),
  T12_contact: block({ h2: text, text, messagePrefill: z.string().optional() }),
});

const labwellItem = z.strictObject({ icon: text, title: text, text });

export const sharedSchema = z.strictObject({
  labwell: z.strictObject({
    eyebrow: text,
    h2: text,
    link,
    items: z.array(labwellItem).min(1),
    itemsForLine: z.array(labwellItem).min(1),
  }),
  contact: z.strictObject({
    phone: text,
    email: text,
    form: z.strictObject({
      fields: z
        .array(
          z.strictObject({
            name: z.enum(["name", "phone", "email", "message"]),
            label: text,
            type: z.enum(["text", "tel", "email", "textarea"]),
            required: z.boolean(),
          }),
        )
        .min(1),
      consent: text,
      submit: text,
    }),
  }),
  faqAside: z.strictObject({ text, link: text }),
  footer: text,
});

export type ProductContent = z.infer<typeof productSchema>;
export type SharedContent = z.infer<typeof sharedSchema>;
export type ShownBlock<B> = Extract<B, { show: true }>;
