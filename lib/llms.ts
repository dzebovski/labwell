/**
 * /llms.txt (llmstxt.org): a plain-text map of the site for language models — who the company is and
 * which pages exist, with a one-line description of each. Both languages in one file.
 * Built from `content/`, so it lists exactly the pages that have content and never a redirected address.
 */
import { company } from "../content/company.ts";
import { locales, type Locale } from "../i18n/config.ts";
import { isRedirectedPath } from "./legacy-redirects.ts";
import { withLocale } from "./locale-routing.ts";
import {
  listGroupSlugs,
  listOverviewSlugs,
  listProductSlugs,
  listTestMenuSlugs,
  loadGroup,
  loadOverview,
  loadProduct,
  loadTestMenu,
} from "./site-content/load.ts";

type Entry = { title: string; description: string; path: string };

const sectionTitles: Record<Locale, { overviews: string; groups: string; products: string }> = {
  uk: {
    overviews: "Огляди брендів і меню тестів (українська)",
    groups: "Групи продукції (українська)",
    products: "Продукти (українська)",
  },
  en: {
    overviews: "Brand overviews and test menus (English)",
    groups: "Product groups (English)",
    products: "Products (English)",
  },
};

const intro: Record<Locale, string> = {
  uk: "Сайт двомовний: українська версія — /uk, англійська — /en. Кожна сторінка існує в обох мовах.",
  en: "The site is bilingual: Ukrainian pages are under /uk, English pages under /en. Every page exists in both languages.",
};

/** `seo.title` ends with the site name ("… | LabWell"); a link text does not need it. */
function linkTitle(title: string): string {
  return title.replace(/\s*\|\s*LabWell\s*$/i, "").trim();
}

function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function isLive(entry: Entry): boolean {
  return !isRedirectedPath(entry.path);
}

function entries(locale: Locale) {
  const build = (path: string, seo: { title: string; description: string }): Entry => ({
    path,
    title: linkTitle(seo.title),
    description: oneLine(seo.description),
  });

  return {
    // C2 (overviews) and C1 (test menus).
    overviews: [
      ...listOverviewSlugs().map((slug) => build(`/products/${slug}`, loadOverview(slug, locale).seo)),
      ...listTestMenuSlugs().map((slug) => build(`/test-menus/${slug}`, loadTestMenu(slug, locale).seo)),
    ].filter(isLive),
    // G.
    groups: listGroupSlugs()
      .map((slug) => build(`/products/${slug}`, loadGroup(slug, locale).seo))
      .filter(isLive),
    // T.
    products: listProductSlugs()
      .map((slug) => build(`/products/${slug}`, loadProduct(slug, locale).seo))
      .filter(isLive),
  };
}

function section(siteUrl: string, locale: Locale, title: string, list: Entry[]): string[] {
  if (list.length === 0) return [];
  return [
    `## ${title}`,
    "",
    ...list.map((entry) => `- [${entry.title}](${siteUrl}${withLocale(locale, entry.path)}): ${entry.description}`),
    "",
  ];
}

export function buildLlmsTxt(siteUrl: string): string {
  const lines = [
    `# ${company.name}`,
    "",
    ...locales.map((locale) => `> ${company.description[locale]}`),
    "",
    ...locales.flatMap((locale) => [intro[locale], ""]),
  ];

  for (const locale of locales) {
    const { overviews, groups, products } = entries(locale);
    const titles = sectionTitles[locale];
    lines.push(
      ...section(siteUrl, locale, titles.overviews, overviews),
      ...section(siteUrl, locale, titles.groups, groups),
      ...section(siteUrl, locale, titles.products, products),
    );
  }

  return `${lines.join("\n").trimEnd()}\n`;
}
