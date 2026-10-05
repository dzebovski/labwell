/**
 * Format of `content/directions/{id}/{locale}.json` (catalog groups and directions, template D)
 * and `content/home/{locale}.json` (home page). Same rules as `schema.ts`: strict objects, so a
 * misspelled or unknown key fails the build with the file and the path.
 * Numbers of pages and the facts on the cards are not stored here: the layout takes them from the data.
 */
import { z } from "zod";

import { brands } from "../../content/brands.ts";
import { catalogGroups } from "../../content/taxonomy.ts";
import { iconNames, isIconName } from "./icon-names.ts";
import { text } from "./schema.ts";

const seo = z.strictObject({ title: text, description: text });

export const directionSchema = z.strictObject({
  seo,
  h1: text,
  lead: text,
  /** Reserved for confirmed questions; the page shows no FAQ block while the list is empty. */
  faq: z.array(z.strictObject({ q: text, a: text })),
});

const serviceId = text.refine(isIconName, {
  error: (issue) => `unknown icon "${String(issue.input)}". Allowed: ${iconNames.join(", ")}`,
});

const brandDescriptions = z.strictObject(
  Object.fromEntries(brands.map((brand) => [brand.id, z.strictObject({ description: text })])) as Record<
    (typeof brands)[number]["id"],
    z.ZodObject<{ description: typeof text }, z.core.$strict>
  >,
);

export const homeSchema = z.strictObject({
  seo,
  hero: z.strictObject({ h1: text, lead: text }),
  brands: brandDescriptions,
  contact: z.strictObject({ text }),
  services: z.strictObject({
    items: z.array(z.strictObject({ id: serviceId, title: text, text })).min(1),
  }),
});

export type DirectionContent = z.infer<typeof directionSchema>;
export type HomeContent = z.infer<typeof homeSchema>;

/** Ids of the groups and directions of the catalog: the folders `content/directions/` must have. */
export const directionIds: readonly string[] = catalogGroups.flatMap((group) => [
  group.id,
  ...group.sections.map((section) => section.id),
]);
