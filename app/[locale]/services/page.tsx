import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { crumbLabels } from "@/components/patterns/crumb-labels";
import { StaticPageHeading } from "@/components/static-page/static-page-heading";
import { ServiceSections } from "@/components/static-page/service-sections";
import styles from "@/components/static-page/static-page.module.css";
import { Faq } from "@/components/product-page/blocks/faq";
import { JsonLdScripts } from "@/components/product-page/blocks/json-ld";
import { Section } from "@/components/product-page/blocks/shared";
import productStyles from "@/components/product-page/product-page.module.css";
import { buttonClassName } from "@/components/ui/primitives";
import { getStaticTrail, trailCrumbs } from "@/lib/breadcrumbs";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { loadServicesPageAllLocales } from "@/lib/site-content/load";
import { contentMetadata } from "@/lib/site-content/metadata";
import { breadcrumbListLd, faqPageLd } from "@/lib/site-content/jsonld";
import { withLocale } from "@/lib/locale-routing";
import { SITE_URL } from "@/lib/site-config";

type ServicesPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = loadServicesPageAllLocales()[locale === "uk" ? 0 : 1];
  return contentMetadata(content.seo, "/services", locale);
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  const content = loadServicesPageAllLocales()[locale === "uk" ? 0 : 1];
  const trail = getStaticTrail(dictionary.pages.services, locale);
  const faq = { h2: content.faq.title, items: content.faq.items.map((item) => ({ q: item.question, a: item.answer })) };

  return (
    <main className={productStyles.page}>
      <JsonLdScripts data={[
        breadcrumbListLd(trailCrumbs(trail), `${SITE_URL}/${locale}/services`, SITE_URL),
        faqPageLd(faq),
      ]} />
      <StaticPageHeading trail={trail} labels={crumbLabels(dictionary)} title={content.h1} lead={content.lead} />
      <ServiceSections items={content.services} />
      <Faq faq={faq} />
      <Section id="contact" labelledBy="contact-title">
        <div className={`${productStyles.card} ${styles.callToAction}`}>
          <div className={styles.callToActionCopy}>
            <h2 id="contact-title" className={productStyles.h2}>{content.contact.title}</h2>
            <p className={productStyles.contactText}>{content.contact.text}</p>
          </div>
          <Link href={withLocale(locale, content.contact.link.href)} className={buttonClassName({ size: "lg" })}>
            {content.contact.link.label}
          </Link>
        </div>
      </Section>
    </main>
  );
}
