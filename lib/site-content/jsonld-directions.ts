/**
 * schema.org structured data for a group or direction page (template D): BreadcrumbList,
 * CollectionPage with the ItemList of its cards, and FAQPage when the page has questions.
 * The home page needs none of its own: Organization and WebSite come from the layout.
 */
import type { DirectionPageModel } from "./direction-model.ts";
import { breadcrumbListLd, faqPageLd } from "./jsonld.ts";

type Locale = "uk" | "en";

export function buildDirectionJsonLd(input: {
  page: DirectionPageModel;
  locale: Locale;
  siteUrl: string;
}): Array<Record<string, unknown>> {
  const { page, locale, siteUrl } = input;
  const url = `${siteUrl}/${locale}${page.canonicalPath}`;
  const absolute = (path: string) => (path.startsWith("http") ? path : `${siteUrl}${path}`);

  const result: Array<Record<string, unknown>> = [breadcrumbListLd(page.breadcrumbs, url, siteUrl)];

  result.push({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.h1,
    description: page.seo.description,
    url,
    inLanguage: locale,
    ...(page.jsonLdItems.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: page.jsonLdItems.length,
            itemListElement: page.jsonLdItems.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              url: absolute(item.url),
            })),
          },
        }
      : {}),
  });

  if (page.faq) result.push(faqPageLd(page.faq));
  return result;
}
