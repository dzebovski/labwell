import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeading } from "@/components/patterns/page-heading";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/lib/page-metadata";
import { brands, getBrand, localizePath } from "@/lib/site-navigation";

type BrandPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const brand = getBrand(slug);

  if (!isLocale(locale) || !brand) {
    return {};
  }

  return createPageMetadata(locale, brand.name[locale], `/brands/${brand.slug}`);
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { locale, slug } = await params;
  const brand = getBrand(slug);

  if (!isLocale(locale) || !brand) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return (
    <PageHeading
      breadcrumbLabel={dictionary.accessibility.breadcrumbs}
      breadcrumbs={[
        { label: dictionary.pages.home, href: localizePath(locale, "/") },
        { label: dictionary.pages.brands, href: localizePath(locale, "/brands") },
        { label: brand.name[locale] },
      ]}
      title={brand.name[locale]}
    />
  );
}
