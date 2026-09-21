import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeading } from "@/components/patterns/page-heading";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  getAreaForProductType,
  getProductType,
  localizePath,
  productTypes,
} from "@/lib/site-navigation";

type DiagnosticAreaPageProps = {
  params: Promise<{ locale: string; slug: string; areaSlug: string }>;
};

export function generateStaticParams() {
  return productTypes.flatMap((productType) =>
    productType.areaSlugs.map((areaSlug) => ({
      slug: productType.slug,
      areaSlug,
    })),
  );
}

export async function generateMetadata({ params }: DiagnosticAreaPageProps): Promise<Metadata> {
  const { locale, slug, areaSlug } = await params;
  const area = getAreaForProductType(slug, areaSlug);

  if (!isLocale(locale) || !area) {
    return {};
  }

  return createPageMetadata(locale, area.name[locale], `/products/${slug}/${areaSlug}`);
}

export default async function DiagnosticAreaPage({ params }: DiagnosticAreaPageProps) {
  const { locale, slug, areaSlug } = await params;
  const productType = getProductType(slug);
  const area = getAreaForProductType(slug, areaSlug);

  if (!isLocale(locale) || !productType || !area) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return (
    <PageHeading
      breadcrumbLabel={dictionary.accessibility.breadcrumbs}
      breadcrumbs={[
        { label: dictionary.pages.home, href: localizePath(locale, "/") },
        { label: dictionary.pages.products, href: localizePath(locale, "/products") },
        {
          label: productType.name[locale],
          href: localizePath(locale, `/products/${productType.slug}`),
        },
        { label: area.name[locale] },
      ]}
      title={area.name[locale]}
    />
  );
}
