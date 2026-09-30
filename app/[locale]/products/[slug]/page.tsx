import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ContentDetailPage } from "@/components/patterns/content-detail-page";
import { ProductPage } from "@/components/product-page/product-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPageByPath, productPages } from "@/lib/navigation-content";
import { createPageMetadata } from "@/lib/page-metadata";
import { hasProductContent, listProductSlugs } from "@/lib/site-content/load";
import { getProductMetadata, getProductPageModel } from "@/lib/site-content/product-page";
import { getCanonicalPlacement, localizePath } from "@/lib/site-navigation";

type Props = { params: Promise<{ locale: string; slug: string }> };
const legacySlugs = new Set(["equipment", "reagents-tests", "quality-control", "consumables-accessories", "software"]);
export function generateStaticParams() {
  const slugs = new Set([...productPages.map((page) => page.slug), ...listProductSlugs()]);
  return [...slugs].map((slug) => ({ slug }));
}
async function resolve({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  if (legacySlugs.has(slug)) redirect(localizePath(locale, "/products"));
  const page = getPageByPath(`/products/${slug}`);
  const placement = page?.kind === "product" ? getCanonicalPlacement(page.id) : undefined;
  if (!page || !placement) notFound();
  return { locale, page, placement };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  // Template T: the slug has a folder in content/products/. Anything else keeps the current page.
  if (isLocale(locale) && hasProductContent(slug)) return getProductMetadata(slug, locale);
  const result = await resolve({ params });
  return createPageMetadata(result.locale, result.page.title[result.locale], result.page.description[result.locale], result.page.canonicalPath);
}
export default async function ProductRoute({ params }: Props) {
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
  const resolved = await resolve({ params });
  const { page, placement } = resolved;
  const dictionary = await getDictionary(resolved.locale);
  return <ContentDetailPage locale={resolved.locale} page={page} placement={placement} labels={{ ...dictionary.pages, breadcrumbs: dictionary.accessibility.breadcrumbs }} />;
}
