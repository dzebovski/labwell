import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { crumbLabels } from "@/components/patterns/crumb-labels";
import { StaticPageHeading } from "@/components/static-page/static-page-heading";
import productStyles from "@/components/product-page/product-page.module.css";
import { getStaticTrail } from "@/lib/breadcrumbs";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { contentMetadata } from "@/lib/site-content/metadata";

type PrivacyPageProps = { params: Promise<{ locale: string }> };

/**
 * Placeholder until LabWell sends the policy text (task 13). The form consent links here,
 * so the page exists, but it stays out of the index and the sitemap.
 */
export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dictionary = await getDictionary(locale);
  const { title, description } = dictionary.privacyPage;
  return { ...contentMetadata({ title, description }, "/privacy", locale), robots: { index: false, follow: true } };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return (
    <main className={productStyles.page}>
      <StaticPageHeading
        trail={getStaticTrail(dictionary.pages.privacy, locale)}
        labels={crumbLabels(dictionary)}
        title={dictionary.pages.privacy}
        lead={dictionary.privacyPage.pending}
      />
    </main>
  );
}
