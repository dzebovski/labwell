import type { Metadata } from "next";

import { GroupPage } from "@/components/product-page/group-page";
import { OverviewPage } from "@/components/product-page/overview-page";
import { ProductPage } from "@/components/product-page/product-page";
import { RouteTargetPage } from "@/components/patterns/route-target-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getRouteParams } from "@/lib/catalog";
import { routeMetadata } from "@/lib/content-route";
import { listGroupSlugs, listOverviewSlugs, listProductSlugs, productsRouteKind } from "@/lib/site-content/load";
import {
  getGroupMetadata,
  getGroupPageModel,
  getOverviewMetadata,
  getOverviewPageModel,
} from "@/lib/site-content/pages";
import { getProductMetadata, getProductPageModel } from "@/lib/site-content/product-page";

/** A product (/products/maglumi-x10), a group (/products/maglumi-m-series), an overview (/products/maglumi) or a catalog group (/products/equipment). */
type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = new Set([
    ...getRouteParams("/products", ["slug"]).map(({ slug }) => slug),
    ...listProductSlugs(),
    ...listGroupSlugs(),
    ...listOverviewSlugs(),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  // content/ decides: products/{slug} → T, groups/{slug} → G, overviews/{slug} → C2. Anything else keeps the current page.
  if (isLocale(locale)) {
    const kind = productsRouteKind(slug);
    if (kind === "product") return getProductMetadata(slug, locale);
    if (kind === "group") return getGroupMetadata(slug, locale);
    if (kind === "overview") return getOverviewMetadata(slug, locale);
  }
  return routeMetadata(locale, `/products/${slug}`);
}

export default async function ProductOrGroupPage({ params }: Props) {
  const { locale, slug } = await params;
  const kind = isLocale(locale) ? productsRouteKind(slug) : undefined;

  if (isLocale(locale) && kind) {
    const dictionary = await getDictionary(locale);
    const labels = { ...dictionary.productPage, breadcrumbs: dictionary.accessibility.breadcrumbs };
    if (kind === "product") {
      return <ProductPage page={getProductPageModel(slug, locale)} locale={locale} labels={labels} />;
    }
    if (kind === "group") {
      return <GroupPage page={getGroupPageModel(slug, locale)} locale={locale} labels={labels} />;
    }
    return <OverviewPage page={getOverviewPageModel(slug, locale)} locale={locale} labels={labels} />;
  }
  return <RouteTargetPage locale={locale} path={`/products/${slug}`} />;
}
