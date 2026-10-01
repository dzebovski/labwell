/** Turns a validated test menu (template C1) into what the page renders. Pure function, no I/O. */
import type { SiteLocale } from "./links.ts";
import {
  buildBreadcrumbs,
  buildContact,
  buildFaq,
  buildLabwell,
  link,
  splitH1,
  type LinkModel,
  type ProductPageModel,
} from "./model.ts";
import { hasPlaceholder } from "./placeholders.ts";
import type { SharedContent } from "./schema.ts";
import type { TestMenuContent, TestsContent } from "./schema-pages.ts";
import type { MenuGroup } from "./test-search.ts";

export type TestMenuPageModel = {
  slug: string;
  brand: string;
  name: string;
  canonicalPath: string;
  seo: TestMenuContent["seo"];
  breadcrumbs: Array<{ label: string; href?: string }>;
  hero: {
    brand: string;
    eyebrow: string;
    h1: string;
    h1Accent?: string;
    h1Rest: string;
    lead: string;
    stats: Array<{ value: string; label: string }>;
  };
  /** Groups and test names (all of them are in the server HTML). */
  groups: MenuGroup[];
  /** Search labels; absent when C1_search is hidden: the list is then shown without controls. */
  search?: {
    searchLabel: string;
    placeholder: string;
    foundLabel: string;
    resetLabel: string;
    allGroupsLabel: string;
    groupCountLabel: string;
    empty: { title: string; text: string; ctaLabel: string };
    /** Start of the contact message for "test not found"; the query is appended. */
    messagePrefill?: string;
  };
  analyzers?: { eyebrow: string; title: string; links: LinkModel[] };
  faq?: ProductPageModel["faq"];
  labwell?: ProductPageModel["labwell"];
  contact?: ProductPageModel["contact"];
};

export function buildTestMenuPage(input: {
  menu: TestMenuContent;
  tests: TestsContent;
  shared: SharedContent;
  locale: SiteLocale;
}): TestMenuPageModel {
  const { menu, tests, shared, locale } = input;
  const hero = menu.C1_hero;
  if (!hero.show) throw new Error(`C1_hero of "${menu.slug}" must be shown: it holds the page title`);
  const name = hero.breadcrumbs[hero.breadcrumbs.length - 1];
  const h1 = splitH1(hero.h1, name);

  const groups: MenuGroup[] = tests.groups.map((group) => ({
    id: group.id,
    name: group.name[locale],
    tests: group.tests,
  }));

  const contact = buildContact(menu.T12_contact, shared);
  const search = menu.C1_search;
  const analyzers = menu.C1_analyzers;
  const analyzerLinks = analyzers.show
    ? analyzers.links.map((item) => link(item, locale)).filter((item): item is LinkModel => Boolean(item))
    : [];

  return {
    slug: menu.slug,
    brand: menu.brand,
    name,
    canonicalPath: menu.url,
    seo: menu.seo,
    breadcrumbs: buildBreadcrumbs(hero.breadcrumbs, locale),
    hero: {
      brand: hero.brand,
      eyebrow: hero.eyebrow,
      h1: hero.h1,
      h1Accent: h1.accent,
      h1Rest: h1.rest,
      lead: hero.lead,
      stats: hero.stats.filter((stat) => !hasPlaceholder(stat.value + stat.label)),
    },
    groups,
    search: search.show
      ? {
          searchLabel: search.searchLabel,
          placeholder: search.placeholder,
          foundLabel: search.foundLabel,
          resetLabel: search.resetLabel,
          allGroupsLabel: search.allGroupsLabel,
          groupCountLabel: search.groupCountLabel,
          empty: { title: search.empty.title, text: search.empty.text, ctaLabel: search.empty.cta.label },
          messagePrefill: contact?.messagePrefill,
        }
      : undefined,
    // C1.4 stays out of the page until `show` is true and at least one link resolves.
    analyzers:
      analyzers.show && analyzerLinks.length
        ? { eyebrow: analyzers.eyebrow, title: analyzers.title, links: analyzerLinks }
        : undefined,
    faq: buildFaq(menu.T10_faq, menu.T12_contact.show, shared, locale),
    labwell: buildLabwell(menu.T11_labwell, shared, locale),
    contact,
  };
}
