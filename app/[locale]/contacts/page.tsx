import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { crumbLabels } from "@/components/patterns/crumb-labels";
import { PageHeading } from "@/components/patterns/page-heading";
import { getStaticTrail } from "@/lib/breadcrumbs";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/lib/page-metadata";

type ContactsPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: ContactsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dictionary = await getDictionary(locale);
  return createPageMetadata(locale, dictionary.pages.contacts, "/contacts");
}

export default async function ContactsPage({ params }: ContactsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return (
    <PageHeading
      trail={getStaticTrail(dictionary.pages.contacts, locale)}
      crumbLabels={crumbLabels(dictionary)}
      title={dictionary.pages.contacts}
    />
  );
}
