/** Strict shapes for the authored static pages under `content/pages/`. */
import { z } from "zod";

import { text } from "./schema.ts";

const seo = z.strictObject({ title: text, description: text });
export const serviceIds = [
  "solution-selection",
  "supply",
  "installation-training",
  "maintenance",
  "application-support",
] as const;

export const servicesPageSchema = z.strictObject({
  seo,
  h1: text,
  lead: text,
  services: z.array(z.strictObject({ id: z.enum(serviceIds), title: text, text })).length(5),
  faq: z.strictObject({
    title: text,
    items: z.array(z.strictObject({ question: text, answer: text })).min(1),
  }),
  contact: z.strictObject({
    title: text,
    text,
    link: z.strictObject({ label: text, href: text }),
  }),
});

export const contactsPageSchema = z.strictObject({
  seo,
  h1: text,
  lead: text,
  details: z.strictObject({ title: text, phoneLabel: text, addressLabel: text }),
  contact: z.strictObject({ title: text, text }),
});

/** Catalog directions an «About» page may link to (the group pages themselves are not listed). */
export const aboutAreaIds = [
  "clia",
  "biochemistry",
  "hemostasis",
  "molecular",
  "hba1c",
  "blood-group",
  "autoimmune-infectious",
  "automation",
  "qc",
  "software",
] as const;

const titledText = z.strictObject({ title: text, text });
const link = z.strictObject({ label: text, href: text });

export const aboutPageSchema = z.strictObject({
  seo,
  h1: text,
  lead: text,
  facts: z.strictObject({ items: z.array(z.strictObject({ value: text, label: text })).min(2).max(4) }),
  intro: z.strictObject({ title: text, paragraphs: z.array(text).min(1) }),
  audience: titledText,
  areas: z.strictObject({
    title: text,
    text,
    items: z.array(z.strictObject({ id: z.enum(aboutAreaIds), title: text })).min(1),
  }),
  approach: z.strictObject({
    title: text,
    items: z.array(z.strictObject({ id: z.enum(serviceIds), title: text, text })).length(5),
    link,
  }),
  team: titledText,
  quality: titledText,
  why: z.strictObject({ title: text, items: z.array(titledText).min(1) }),
  clients: titledText,
  contact: z.strictObject({ title: text, text, link }),
});

const privacyBlock = z.union([
  text,
  z.strictObject({ list: z.array(text).min(1) }),
  z.strictObject({ contact: z.literal(true) }),
]);

export const privacyPageSchema = z.strictObject({
  seo,
  h1: text,
  lead: text,
  effective: text,
  contentsTitle: text,
  contactLabels: z.strictObject({ email: text, phone: text, address: text }),
  sections: z
    .array(z.strictObject({ id: z.string().regex(/^[a-z][a-z-]*$/), title: text, blocks: z.array(privacyBlock).min(1) }))
    .min(1),
});

export type PrivacyPageContent = z.infer<typeof privacyPageSchema>;
export type PrivacyBlock = z.infer<typeof privacyBlock>;
export type AboutPageContent = z.infer<typeof aboutPageSchema>;
export type ServicesPageContent = z.infer<typeof servicesPageSchema>;
export type ContactsPageContent = z.infer<typeof contactsPageSchema>;
export type ServicePageId = (typeof serviceIds)[number];
