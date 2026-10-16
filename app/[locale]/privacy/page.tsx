import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { crumbLabels } from "@/components/patterns/crumb-labels";
import { JsonLdScripts } from "@/components/product-page/blocks/json-ld";
import productStyles from "@/components/product-page/product-page.module.css";
import { PrivacySections } from "@/components/static-page/privacy-sections";
import { StaticPageHeading } from "@/components/static-page/static-page-heading";
import { company } from "@/content/company";
import { getStaticTrail, trailCrumbs } from "@/lib/breadcrumbs";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { loadPrivacyPageAllLocales, loadShared } from "@/lib/site-content/load";
import { contentMetadata } from "@/lib/site-content/metadata";
import { breadcrumbListLd } from "@/lib/site-content/jsonld";
import { publishable } from "@/lib/site-content/placeholders";
import { SITE_URL } from "@/lib/site-config";

type PrivacyPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = loadPrivacyPageAllLocales()[locale === "uk" ? 0 : 1];
  return contentMetadata(content.seo, "/privacy", locale);
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  const content = loadPrivacyPageAllLocales()[locale === "uk" ? 0 : 1];
  const shared = loadShared(locale);
  const trail = getStaticTrail(dictionary.pages.privacy, locale);

  return (
    <main className={productStyles.page}>
      <JsonLdScripts data={[breadcrumbListLd(trailCrumbs(trail), `${SITE_URL}/${locale}/privacy`, SITE_URL)]} />
      <StaticPageHeading trail={trail} labels={crumbLabels(dictionary)} title={content.h1} lead={content.lead} note={content.effective} />
      <PrivacySections
        content={content}
        contact={{
          email: publishable(shared.contact.email),
          phone: publishable(shared.contact.phone),
          address: `${company.legalName[locale]}, ${company.address[locale]}`,
        }}
      />
    </main>
  );
}
