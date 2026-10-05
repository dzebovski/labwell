/** Validated, locale-specific content for template K clinical pages. */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { z } from "zod";

import type { Locale } from "../i18n/config.ts";
import { loadTests, type ContentLocale, SiteContentError } from "./site-content/load.ts";

const linkSchema = z.object({ label: z.string().min(1), href: z.string().min(1) });
const visibleBlock = z.object({ show: z.boolean() });
const menuGroupSchema = z.object({ menuSlug: z.string().min(1), groupId: z.string().min(1) });

export const clinicalSchema = z.object({
  slug: z.string().min(1),
  url: z.string().startsWith("/clinical-directions/"),
  kind: z.literal("clinical"),
  brand: z.string().min(1),
  seo: z.object({ title: z.string().min(1), description: z.string().min(1) }),
  hero: z.object({
    breadcrumbs: z.array(z.string().min(1)).min(2),
    eyebrow: z.string().min(1),
    h1: z.string().min(1),
    lead: z.string().min(1),
  }),
  tests: z.object({
    show: z.boolean(),
    h2: z.string().min(1),
    kind: z.enum(["menu-groups", "manufacturer-panels"]),
    groups: z.array(menuGroupSchema).optional(),
    items: z.array(z.string().min(1)).optional(),
    sourceUrl: z.string().url().optional(),
    menuLink: linkSchema.optional(),
  }),
  equipment: visibleBlock.extend({
    h2: z.string().optional(),
    text: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    items: z.array(z.object({ title: z.string().min(1), href: z.string().min(1) })).optional(),
  }),
  qc: visibleBlock.extend({
    h2: z.string().optional(),
    items: z.array(linkSchema).optional(),
    sourceUrl: z.string().url().optional(),
  }),
  T10_faq: visibleBlock.extend({
    h2: z.string().optional(),
    items: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).optional(),
  }),
  T11_labwell: visibleBlock.extend({ use: z.literal("shared.labwell.items").optional() }),
  T12_contact: visibleBlock.extend({
    h2: z.string().optional(),
    text: z.string().optional(),
    messagePrefill: z.string().optional(),
  }),
}).superRefine((page, ctx) => {
  if (page.tests.show) {
    if (page.tests.kind === "menu-groups" && !page.tests.groups?.length) {
      ctx.addIssue({ code: "custom", path: ["tests", "groups"], message: "visible menu groups are required" });
    }
    if (page.tests.kind === "manufacturer-panels" && !page.tests.items?.length) {
      ctx.addIssue({ code: "custom", path: ["tests", "items"], message: "visible panels are required" });
    }
  }
  if (page.equipment.show && (!page.equipment.h2 || !page.equipment.text || !page.equipment.items?.length)) {
    ctx.addIssue({ code: "custom", path: ["equipment"], message: "visible equipment needs a heading, text, and links" });
  }
  if (page.T10_faq.show && (!page.T10_faq.h2 || page.T10_faq.items?.length !== 3)) {
    ctx.addIssue({ code: "custom", path: ["T10_faq"], message: "visible FAQ needs exactly three questions" });
  }
  if (page.T12_contact.show && (!page.T12_contact.h2 || !page.T12_contact.text)) {
    ctx.addIssue({ code: "custom", path: ["T12_contact"], message: "visible contact needs a heading and text" });
  }
});

export type ClinicalContent = z.infer<typeof clinicalSchema>;

function clinicalFile(slug: string, locale: ContentLocale) {
  const root = process.env.SITE_CONTENT_DIR ?? path.join(process.cwd(), "content");
  return path.join(root, "clinical-pages", slug, `${locale}.json`);
}

export function hasClinicalContent(slug: string) {
  return existsSync(clinicalFile(slug, "uk")) && existsSync(clinicalFile(slug, "en"));
}

export function loadClinicalContent(slug: string, locale: ContentLocale, expectedPath?: string): ClinicalContent {
  const file = clinicalFile(slug, locale);
  let value: unknown;
  try {
    value = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    throw new SiteContentError(file, `missing or invalid JSON: ${(error as Error).message}`);
  }
  const parsed = clinicalSchema.safeParse(value);
  if (!parsed.success) throw new SiteContentError(file, z.prettifyError(parsed.error));
  const page = parsed.data;
  if (page.slug !== slug || (expectedPath && page.url !== expectedPath)) {
    throw new SiteContentError(file, `identity mismatch: ${page.slug} ${page.url}`);
  }
  if (page.tests.show && page.tests.kind === "menu-groups") {
    for (const reference of page.tests.groups ?? []) {
      const menu = loadTests(reference.menuSlug);
      if (!menu.groups.some((group) => group.id === reference.groupId)) {
        throw new SiteContentError(file, `unknown test group ${reference.menuSlug}/${reference.groupId}`);
      }
    }
  }
  return page;
}

export type ClinicalTestGroup = { name: string; tests: Array<{ id: string; name: string }>; href: string };

export function clinicalTestGroups(page: ClinicalContent, locale: Locale): ClinicalTestGroup[] {
  if (!page.tests.show || page.tests.kind !== "menu-groups") return [];
  return (page.tests.groups ?? []).map(({ menuSlug, groupId }) => {
    const group = loadTests(menuSlug).groups.find((item) => item.id === groupId)!;
    return {
      name: group.name[locale],
      tests: group.tests,
      href: `/test-menus/${menuSlug}#group-${groupId}`,
    };
  });
}
