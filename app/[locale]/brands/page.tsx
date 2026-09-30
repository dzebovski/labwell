import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ListingPage } from "@/components/patterns/listing-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getListingBlocks, getRootBreadcrumbs } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/page-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dictionary = await getDictionary(locale);
  return createPageMetadata(locale, dictionary.pages.brands, "/brands");
}

export default async function BrandsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return (
    <ListingPage
      locale={locale}
      title={dictionary.pages.brands}
      breadcrumbs={getRootBreadcrumbs("brands", locale, dictionary.pages)}
      blocks={getListingBlocks("brands", locale, dictionary.navigation.portfolio)}
    />
  );
}
