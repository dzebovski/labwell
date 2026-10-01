/**
 * Format of the group pages (G), test menus (C1) and series overviews (C2) in `content/`.
 * Same rules as `schema.ts`: strict objects, `{ "show": false }` hides a block, and
 * cross-references (anchors, product slugs, column counts) are checked here so a
 * broken file fails the build with a clear message instead of rendering a dead link.
 */
import { z } from "zod";

import { block, contactBlock, faq, labwellBlock, link, text } from "./schema.ts";

const image = z.strictObject({ alt: text });
const fact = z.strictObject({ value: text, label: text });
const breadcrumbs = z.array(text).min(2);

const seo = z.strictObject({ title: text, description: text });

// ---------- G: group page ----------

const groupModel = z.strictObject({ productSlug: text, title: text, anchor: text, image });

const groupHero = z.strictObject({
  breadcrumbs,
  eyebrow: text,
  h1: text,
  lead: text,
  primaryCta: link,
  secondaryCta: link.optional(),
  // Series: chips and photo tiles for the models.
  modelsLabel: text.optional(),
  models: z.array(groupModel).min(1).optional(),
  // Lines: key facts and one photo.
  keyFacts: z.array(fact).min(1).max(4).optional(),
  image: image.optional(),
});

const groupCompare = block({
  eyebrow: text.optional(),
  h2: text,
  caption: text.optional(),
  columns: z.array(groupModel).min(2),
  rows: z
    .array(z.strictObject({ label: text, detail: text.optional(), values: z.array(text).min(2) }))
    .min(1),
  footnote: text.optional(),
});

const groupSections = block({
  eyebrow: text.optional(),
  h2: text,
  items: z.array(z.strictObject({ anchor: text, title: text, text, href: text })).min(1),
});

const ordering = z.discriminatedUnion("show", [
  z.strictObject({ show: z.literal(false) }),
  z.strictObject({
    show: z.literal(true),
    h3: text,
    columns: z.array(text).min(2),
    rows: z.array(z.strictObject({ catalogNumber: text, name: text, packSize: text })).min(1),
    footnote: text.optional(),
  }),
]);

const groupItem = z.strictObject({
  productSlug: text,
  anchor: text,
  eyebrow: text,
  h3: text,
  text,
  keyFacts: z.array(fact).min(1).max(5),
  image,
  ordering,
  cta: link,
  backLink: link,
});

const groupItems = block({
  eyebrow: text.optional(),
  h2: text,
  items: z.array(groupItem).min(1),
});

export const groupSchema = z
  .strictObject({
    slug: text,
    url: text,
    kind: z.enum(["group-series", "group-lines"]),
    brand: text,
    seo,
    G1_hero: groupHero,
    G2_compare: groupCompare,
    G2_sections: groupSections,
    G3_items: groupItems,
    T10_faq: faq,
    T11_labwell: labwellBlock,
    T12_contact: contactBlock,
  })
  .superRefine((group, ctx) => {
    const issue = (path: Array<string | number>, message: string) =>
      ctx.addIssue({ code: "custom", path, message });

    if (group.G2_compare.show && group.G2_sections.show) {
      issue(["G2_sections"], 'G2_compare and G2_sections are both shown; show only one ("show": false on the other)');
    }
    if (!group.G3_items.show) return;

    const anchors = new Set<string>();
    const slugs = new Set<string>();
    group.G3_items.items.forEach((item, index) => {
      if (anchors.has(item.anchor)) issue(["G3_items", "items", index, "anchor"], `duplicate anchor "${item.anchor}"`);
      if (slugs.has(item.productSlug)) {
        issue(["G3_items", "items", index, "productSlug"], `duplicate productSlug "${item.productSlug}"`);
      }
      anchors.add(item.anchor);
      slugs.add(item.productSlug);
    });

    const knownAnchor = (path: Array<string | number>, anchor: string) => {
      if (!anchors.has(anchor)) issue(path, `anchor "${anchor}" has no item in G3_items`);
    };
    group.G1_hero.models?.forEach((model, index) => knownAnchor(["G1_hero", "models", index, "anchor"], model.anchor));
    if (group.G2_compare.show) {
      const { columns, rows } = group.G2_compare;
      columns.forEach((column, index) => knownAnchor(["G2_compare", "columns", index, "anchor"], column.anchor));
      rows.forEach((row, index) => {
        if (row.values.length !== columns.length) {
          issue(
            ["G2_compare", "rows", index, "values"],
            `${row.values.length} values for ${columns.length} columns`,
          );
        }
      });
    }
    if (group.G2_sections.show) {
      group.G2_sections.items.forEach((item, index) => {
        knownAnchor(["G2_sections", "items", index, "anchor"], item.anchor);
      });
    }
  });

// ---------- C1: test menu ----------

const testMenuStats = z.array(z.strictObject({ value: text, label: text })).min(1).max(3);

export const testMenuSchema = z.strictObject({
  slug: text,
  url: text,
  kind: z.literal("test-menu"),
  brand: text,
  seo,
  C1_hero: block({
    breadcrumbs,
    brand: text,
    eyebrow: text,
    h1: text,
    lead: text,
    stats: testMenuStats,
  }),
  // Labels contain `{count}` placeholders filled by the search component.
  C1_search: block({
    searchLabel: text,
    placeholder: text,
    foundLabel: text.refine((value) => value.includes("{count}"), 'must contain "{count}"'),
    resetLabel: text,
    allGroupsLabel: text,
    groupCountLabel: text.refine((value) => value.includes("{count}"), 'must contain "{count}"'),
    empty: z.strictObject({ title: text, text, cta: link }),
  }),
  // Analyzers that work with the menu: hidden until the manufacturer confirms the link.
  C1_analyzers: block({ eyebrow: text, title: text, links: z.array(link).min(1) }),
  T10_faq: faq,
  T11_labwell: labwellBlock,
  T12_contact: contactBlock,
});

/** `tests.json`: groups and verbatim test names, shared by both languages. */
export const testsSchema = z
  .strictObject({
    groups: z
      .array(
        z.strictObject({
          id: text,
          name: z.strictObject({ uk: text, en: text }),
          tests: z.array(z.strictObject({ id: text, name: text })).min(1),
        }),
      )
      .min(1),
  })
  .superRefine((menu, ctx) => {
    const groupIds = new Set<string>();
    const namesById = new Map<string, string>();
    menu.groups.forEach((group, groupIndex) => {
      if (groupIds.has(group.id)) {
        ctx.addIssue({ code: "custom", path: ["groups", groupIndex, "id"], message: `duplicate group id "${group.id}"` });
      }
      groupIds.add(group.id);
      group.tests.forEach((test, testIndex) => {
        const known = namesById.get(test.id);
        if (known !== undefined && known !== test.name) {
          ctx.addIssue({
            code: "custom",
            path: ["groups", groupIndex, "tests", testIndex, "id"],
            message: `id "${test.id}" is used for "${known}" and for "${test.name}"; one id must mean one test name`,
          });
        }
        namesById.set(test.id, test.name);
      });
    });
  });

// ---------- C2: series overview ----------

const overviewModel = z.strictObject({ productSlug: text, image });

export const overviewSchema = z
  .strictObject({
    slug: text,
    url: text,
    kind: z.literal("overview"),
    brand: text,
    seo,
    C2_hero: block({
      breadcrumbs,
      eyebrow: text,
      h1: text,
      lead: text,
      primaryCta: link,
      models: z.array(overviewModel).min(1),
    }),
    C2_compare: block({
      eyebrow: text.optional(),
      h2: text,
      caption: text.optional(),
      models: z.array(z.strictObject({ productSlug: text, name: text, href: text, image })).min(2),
      rows: z
        .array(
          z.strictObject({
            label: text,
            unit: text.optional(),
            values: z.record(text, text),
          }),
        )
        .min(1),
      footnote: text.optional(),
    }),
    C2_cards: block({
      eyebrow: text.optional(),
      h2: text,
      models: z
        .array(
          z.strictObject({
            productSlug: text,
            eyebrow: text,
            title: text,
            text,
            href: text,
            image,
          }),
        )
        .min(1),
      related: z
        .array(
          z.strictObject({
            kind: z.enum(["group", "test-menu"]),
            eyebrow: text,
            title: text,
            text,
            href: text,
            image: image.optional(),
            bigNumber: z.strictObject({ value: text, label: text }).optional(),
          }),
        )
        .optional(),
    }),
    T10_faq: faq,
    T11_labwell: labwellBlock,
    T12_contact: contactBlock,
  })
  .superRefine((overview, ctx) => {
    if (!overview.C2_compare.show) return;
    const slugs = overview.C2_compare.models.map((model) => model.productSlug);
    overview.C2_compare.rows.forEach((row, index) => {
      for (const slug of slugs) {
        if (!(slug in row.values)) {
          ctx.addIssue({
            code: "custom",
            path: ["C2_compare", "rows", index, "values"],
            message: `no value for "${slug}"`,
          });
        }
      }
      for (const key of Object.keys(row.values)) {
        if (!slugs.includes(key)) {
          ctx.addIssue({
            code: "custom",
            path: ["C2_compare", "rows", index, "values", key],
            message: `"${key}" is not a model of C2_compare.models`,
          });
        }
      }
    });
  });

export type GroupContent = z.infer<typeof groupSchema>;
export type TestMenuContent = z.infer<typeof testMenuSchema>;
export type TestsContent = z.infer<typeof testsSchema>;
export type OverviewContent = z.infer<typeof overviewSchema>;
