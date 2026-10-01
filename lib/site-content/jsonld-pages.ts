/**
 * schema.org structured data for groups (G), test menus (C1) and overviews (C2).
 * Reuses the breadcrumb and FAQ builders of the product page.
 */
import { breadcrumbListLd, faqPageLd } from "./jsonld.ts";
import type { GroupPageModel } from "./group-model.ts";
import type { TestMenuPageModel } from "./menu-model.ts";
import type { OverviewPageModel } from "./overview-model.ts";

type Locale = "uk" | "en";
type JsonLd = Array<Record<string, unknown>>;

const absolute = (siteUrl: string, path: string) => (path.startsWith("http") ? path : `${siteUrl}${path}`);

/** Internal `/uk/products/x` href → absolute URL; anchors and unknown values are left out. */
function pageUrl(siteUrl: string, href: string | undefined) {
  return href?.startsWith("/") ? absolute(siteUrl, href) : undefined;
}

export function buildGroupJsonLd(input: { page: GroupPageModel; locale: Locale; siteUrl: string }): JsonLd {
  const { page, locale, siteUrl } = input;
  const url = `${siteUrl}/${locale}${page.canonicalPath}`;
  const products = page.items?.items ?? [];

  const result: JsonLd = [breadcrumbListLd(page.breadcrumbs, url, siteUrl)];
  if (products.length) {
    result.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: page.name,
      numberOfItems: products.length,
      itemListElement: products.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: item.h3,
          description: item.text,
          url: `${url}#${item.anchor}`,
          brand: { "@type": "Brand", name: page.brand },
          manufacturer: { "@type": "Organization", name: page.brand },
          ...(item.imageSrc ? { image: absolute(siteUrl, item.imageSrc) } : {}),
        },
      })),
    });
  }
  if (page.faq) result.push(faqPageLd(page.faq));
  return result;
}

export function buildTestMenuJsonLd(input: { page: TestMenuPageModel; locale: Locale; siteUrl: string }): JsonLd {
  const { page, locale, siteUrl } = input;
  const url = `${siteUrl}/${locale}${page.canonicalPath}`;

  const result: JsonLd = [
    breadcrumbListLd(page.breadcrumbs, url, siteUrl),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: page.hero.h1,
      numberOfItems: page.groups.length,
      itemListElement: page.groups.map((group, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: group.name,
        url: `${url}#group-${group.id}`,
      })),
    },
  ];
  if (page.faq) result.push(faqPageLd(page.faq));
  return result;
}

export function buildOverviewJsonLd(input: { page: OverviewPageModel; locale: Locale; siteUrl: string }): JsonLd {
  const { page, locale, siteUrl } = input;
  const url = `${siteUrl}/${locale}${page.canonicalPath}`;
  const models = page.cards?.models ?? [];

  const result: JsonLd = [breadcrumbListLd(page.breadcrumbs, url, siteUrl)];
  if (models.length) {
    result.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: page.name,
      numberOfItems: models.length,
      itemListElement: models.map((model, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: model.title,
          description: model.text,
          ...(pageUrl(siteUrl, model.href) ? { url: pageUrl(siteUrl, model.href) } : {}),
          brand: { "@type": "Brand", name: page.brand },
          manufacturer: { "@type": "Organization", name: page.brand },
          ...(model.imageSrc ? { image: absolute(siteUrl, model.imageSrc) } : {}),
        },
      })),
    });
  }
  if (page.faq) result.push(faqPageLd(page.faq));
  return result;
}
