import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeading } from "@/components/patterns/page-heading";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/lib/page-metadata";
import { getProductType, localizePath, productTypes } from "@/lib/site-navigation";

type ProductTypePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return productTypes.map((productType) => ({ slug: productType.slug }));
}

export async function generateMetadata({ params }: ProductTypePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const productType = getProductType(slug);

  if (!isLocale(locale) || !productType) {
    return {};
  }

  return createPageMetadata(locale, productType.name[locale], `/products/${productType.slug}`);
}

export default async function ProductTypePage({ params }: ProductTypePageProps) {
  const { locale, slug } = await params;
  const productType = getProductType(slug);

  if (!isLocale(locale) || !productType) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return (
    <PageHeading
      breadcrumbLabel={dictionary.accessibility.breadcrumbs}
      breadcrumbs={[
        { label: dictionary.pages.home, href: localizePath(locale, "/") },
        { label: dictionary.pages.products, href: localizePath(locale, "/products") },
        { label: productType.name[locale] },
      ]}
      title={productType.name[locale]}
    />
  );
}
