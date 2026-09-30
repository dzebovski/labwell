/** schema.org structured data for a product page: Product, BreadcrumbList, FAQPage. */
import type { ProductPageModel } from "./model.ts";

type Locale = "uk" | "en";

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
    ...(category ? { category } : {}),
    ...(page.hero.imageSrc ? { image: absolute(page.hero.imageSrc) } : {}),
  };

  // Levels without a page of their own are left out: a breadcrumb item needs a URL.
  const crumbs = page.breadcrumbs
    .map((crumb, index, all) => ({
      name: crumb.label,
      item: index === all.length - 1 ? url : crumb.href ? absolute(crumb.href) : undefined,
    }))
    .filter((crumb) => crumb.item);
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };

  const result: Array<Record<string, unknown>> = [product, breadcrumbList];

  if (page.faq) {
    result.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return result;
}

/** Serialises for a <script> tag; `<` is escaped so content cannot close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
