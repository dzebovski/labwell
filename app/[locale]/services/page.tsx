import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeading } from "@/components/patterns/page-heading";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/lib/page-metadata";

type ServicesPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dictionary = await getDictionary(locale);
  return createPageMetadata(locale, dictionary.pages.services, "/services");
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return (
    <PageHeading
      breadcrumbLabel={dictionary.accessibility.breadcrumbs}
      chooseLabel={dictionary.accessibility.chooseCategory}
      breadcrumbs={[{ label: dictionary.pages.services }]}
      title={dictionary.pages.services}
    />
  );
}
