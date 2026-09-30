import type { Metadata } from "next";

import { ProductPage } from "@/components/product-page/product-page";
import { RouteTargetPage } from "@/components/patterns/route-target-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getRouteParams } from "@/lib/catalog";
import { routeMetadata } from "@/lib/content-route";
import { hasProductContent, listProductSlugs } from "@/lib/site-content/load";
import { getProductMetadata, getProductPageModel } from "@/lib/site-content/product-page";

/** A product (/products/maglumi-x10) or a catalog group (/products/equipment). */
type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = new Set([...getRouteParams("/products", ["slug"]).map(({ slug }) => slug), ...listProductSlugs()]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  // Template T: the slug has a folder in content/products/. Anything else keeps the current page.
  if (isLocale(locale) && hasProductContent(slug)) return getProductMetadata(slug, locale);
  return routeMetadata(locale, `/products/${slug}`);
}

export default async function ProductOrGroupPage({ params }: Props) {
  const { locale, slug } = await params;
  if (isLocale(locale) && hasProductContent(slug)) {
    const dictionary = await getDictionary(locale);
    return (
      <ProductPage
        page={getProductPageModel(slug, locale)}
        locale={locale}
        labels={{ ...dictionary.productPage, breadcrumbs: dictionary.accessibility.breadcrumbs }}
      />
    );
  }
  return <RouteTargetPage locale={locale} path={`/products/${slug}`} />;
}
