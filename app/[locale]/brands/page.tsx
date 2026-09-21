import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeading } from "@/components/patterns/page-heading";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/lib/page-metadata";
import { localizePath } from "@/lib/site-navigation";

type BrandsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BrandsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = await getDictionary(locale);
  return createPageMetadata(locale, dictionary.pages.brands, "/brands");
}

export default async function BrandsPage({ params }: BrandsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return (
    <PageHeading
      breadcrumbLabel={dictionary.accessibility.breadcrumbs}
      breadcrumbs={[
        { label: dictionary.pages.home, href: localizePath(locale, "/") },
        { label: dictionary.pages.brands },
      ]}
      title={dictionary.pages.brands}
    />
  );
}
