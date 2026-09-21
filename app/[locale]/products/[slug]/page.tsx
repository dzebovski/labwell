import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ContentDetailPage } from "@/components/patterns/content-detail-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPageByPath, productPages } from "@/lib/navigation-content";
import { createPageMetadata } from "@/lib/page-metadata";
import { getCanonicalPlacement, localizePath } from "@/lib/site-navigation";

type Props = { params: Promise<{ locale: string; slug: string }> };
const legacySlugs = new Set(["equipment", "reagents-tests", "quality-control", "consumables-accessories", "software"]);
export function generateStaticParams() { return productPages.map((page) => ({ slug: page.slug })); }
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
  const result = await resolve({ params });
  return createPageMetadata(result.locale, result.page.title[result.locale], result.page.description[result.locale], result.page.canonicalPath);
}
export default async function ProductPage({ params }: Props) {
  const { locale, page, placement } = await resolve({ params });
  const dictionary = await getDictionary(locale);
  return <ContentDetailPage locale={locale} page={page} placement={placement} labels={{ ...dictionary.pages, breadcrumbs: dictionary.accessibility.breadcrumbs }} />;
}
