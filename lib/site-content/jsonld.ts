/** schema.org structured data for a product page: Product, BreadcrumbList, FAQPage. */
import { distributorOffer } from "./jsonld-site.ts";
import type { ProductPageModel } from "./model.ts";

type Locale = "uk" | "en";

/** Levels without a page of their own are left out: a breadcrumb item needs a URL. */
export function breadcrumbListLd(
  breadcrumbs: Array<{ label: string; href?: string }>,
  url: string,
  siteUrl: string,
): Record<string, unknown> {
  const absolute = (path: string) => (path.startsWith("http") ? path : `${siteUrl}${path}`);
  const crumbs = breadcrumbs
    .map((crumb, index, all) => ({
      name: crumb.label,
      item: index === all.length - 1 ? url : crumb.href ? absolute(crumb.href) : undefined,
    }))
    .filter((crumb) => crumb.item);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

export function faqPageLd(faq: { items: Array<{ q: string; a: string }> }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function buildJsonLd(input: {
  page: ProductPageModel;
  locale: Locale;
  siteUrl: string;
}): Array<Record<string, unknown>> {
  const { page, locale, siteUrl } = input;
  const url = `${siteUrl}/${locale}${page.canonicalPath}`;
  const absolute = (path: string) => (path.startsWith("http") ? path : `${siteUrl}${path}`);
  const category = page.breadcrumbs.at(-2)?.label;

  const product: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: page.name,
    description: page.seo.description,
    url,
    inLanguage: locale,
    brand: { "@type": "Brand", name: page.brand },
    manufacturer: { "@type": "Organization", name: page.brand },
    offers: distributorOffer(siteUrl, locale),
    ...(category ? { category } : {}),
    ...(page.hero.imageSrc ? { image: absolute(page.hero.imageSrc) } : {}),
  };

  const breadcrumbList = breadcrumbListLd(page.breadcrumbs, url, siteUrl);

  const result: Array<Record<string, unknown>> = [product, breadcrumbList];

  if (page.faq) result.push(faqPageLd(page.faq));

  return result;
}

/** Serialises for a <script> tag; `<` is escaped so content cannot close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
