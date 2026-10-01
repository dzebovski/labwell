import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ListingPage } from "@/components/patterns/listing-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  brandProductsPath,
  getBrandProductBlocks,
  getBrandProductsBreadcrumbs,
  getBrandsWithProducts,
} from "@/lib/catalog";
import { createPageMetadata } from "@/lib/page-metadata";

/** Every product of a brand, grouped by product type and direction (/brands/snibe/products). */
type Props = { params: Promise<{ locale: string; brandSlug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getBrandsWithProducts().map((brand) => ({ brandSlug: brand.id }));
}

function findBrand(locale: string, brandSlug: string) {
  const brand = getBrandsWithProducts().find((item) => item.id === brandSlug);
  if (!isLocale(locale) || !brand) notFound();
  return { locale, brand };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, brandSlug } = await params;
  const { locale, brand } = findBrand(rawLocale, brandSlug);
  const dictionary = await getDictionary(locale);
  const title = dictionary.navigation.allBrandProducts.replace("{brand}", brand.name);
  return createPageMetadata(locale, title, brandProductsPath(brand.id));
}

export default async function BrandProductsPage({ params }: Props) {
  const { locale: rawLocale, brandSlug } = await params;
  const { locale, brand } = findBrand(rawLocale, brandSlug);
  const dictionary = await getDictionary(locale);
  const title = dictionary.navigation.allBrandProducts.replace("{brand}", brand.name);

  return (
    <ListingPage
      locale={locale}
      title={title}
      breadcrumbs={getBrandProductsBreadcrumbs(brand, locale, dictionary.pages, title)}
      blocks={getBrandProductBlocks(brand.id, locale, dictionary.navigation.otherSolutions)}
    />
  );
}
