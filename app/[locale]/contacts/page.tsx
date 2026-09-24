import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeading } from "@/components/patterns/page-heading";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/lib/page-metadata";
import { withLocale } from "@/lib/locale-routing";

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
      breadcrumbLabel={dictionary.accessibility.breadcrumbs}
      breadcrumbs={[
        { label: dictionary.pages.home, href: withLocale(locale, "/") },
        { label: dictionary.pages.contacts },
      ]}
      title={dictionary.pages.contacts}
    />
  );
}
