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

export type ServicesPageContent = z.infer<typeof servicesPageSchema>;
export type ContactsPageContent = z.infer<typeof contactsPageSchema>;
export type ServicePageId = (typeof serviceIds)[number];
