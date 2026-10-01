import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TestMenuPage } from "@/components/product-page/test-menu-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { hasTestMenuContent, listTestMenuSlugs } from "@/lib/site-content/load";
import { getTestMenuMetadata, getTestMenuPageModel } from "@/lib/site-content/pages";

/** Test menu (template C1): /test-menus/{slug}, one folder in content/test-menus/ per menu. */
type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listTestMenuSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !hasTestMenuContent(slug)) return {};
  return getTestMenuMetadata(slug, locale);
}

export default async function TestMenuRoute({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !hasTestMenuContent(slug)) notFound();

  const dictionary = await getDictionary(locale);
  return (
    <TestMenuPage
      page={getTestMenuPageModel(slug, locale)}
      locale={locale}
      labels={{ ...dictionary.productPage, breadcrumbs: dictionary.accessibility.breadcrumbs }}
    />
  );
}
