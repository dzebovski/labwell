import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, Phone } from "lucide-react";

import { crumbLabels } from "@/components/patterns/crumb-labels";
import { StaticPageHeading } from "@/components/static-page/static-page-heading";
import styles from "@/components/static-page/static-page.module.css";
import { Contact } from "@/components/product-page/blocks/contact";
import { JsonLdScripts } from "@/components/product-page/blocks/json-ld";
import { Section, SectionHead } from "@/components/product-page/blocks/shared";
import productStyles from "@/components/product-page/product-page.module.css";
import { company } from "@/content/company";
import { getStaticTrail, trailCrumbs } from "@/lib/breadcrumbs";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { loadContactsPageAllLocales, loadShared } from "@/lib/site-content/load";
import { contentMetadata } from "@/lib/site-content/metadata";
import { buildContact } from "@/lib/site-content/model";
import { publishable } from "@/lib/site-content/placeholders";
import { breadcrumbListLd } from "@/lib/site-content/jsonld";
import { buildOrganizationLd, organizationId } from "@/lib/site-content/jsonld-site";
import { SITE_URL } from "@/lib/site-config";

type ContactsPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: ContactsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = loadContactsPageAllLocales()[locale === "uk" ? 0 : 1];
  return contentMetadata(content.seo, "/contacts", locale);
}

export default async function ContactsPage({ params }: ContactsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  const content = loadContactsPageAllLocales()[locale === "uk" ? 0 : 1];
  const shared = loadShared(locale);
  const phone = publishable(shared.contact.phone);
  const email = publishable(shared.contact.email);
  const trail = getStaticTrail(dictionary.pages.contacts, locale);
  const url = `${SITE_URL}/${locale}/contacts`;
  const contact = buildContact({ show: true, h2: content.contact.title, text: content.contact.text }, shared)!;
  // Details above already display the public contacts; the form panel contains only its copy.
  const formContact = { ...contact, phone: undefined, email: undefined };
  const postal = company.postalAddress;

  return (
    <main className={productStyles.page}>
      <JsonLdScripts data={[
        breadcrumbListLd(trailCrumbs(trail), url, SITE_URL),
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "@id": `${url}#page`,
          url,
          name: content.h1,
          description: content.seo.description,
          inLanguage: locale,
          mainEntity: { "@id": organizationId(SITE_URL) },
        },
        {
          ...buildOrganizationLd({ siteUrl: SITE_URL, locale, contact: shared.contact }),
          legalName: company.legalName[locale],
          address: {
            "@type": "PostalAddress",
            streetAddress: postal.streetAddress[locale],
            addressLocality: postal.addressLocality[locale],
            postalCode: postal.postalCode,
            addressCountry: postal.addressCountry,
          },
        },
      ]} />
      <StaticPageHeading trail={trail} labels={crumbLabels(dictionary)} title={content.h1} lead={content.lead} />
      <Section labelledBy="details-title">
        <SectionHead id="details-title" title={content.details.title} />
        <dl className={`${productStyles.card} ${styles.details}`}>
          {phone ? (
            <div>
              <dt>{content.details.phoneLabel}</dt>
              <dd>
                <a className={productStyles.contactLink} href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
                  <Phone size={18} aria-hidden="true" />{phone}
                </a>
              </dd>
            </div>
          ) : null}
          <div>
            <dt>{content.details.addressLabel}</dt>
            <dd>
              <strong>{company.legalName[locale]}</strong>
              <address className={styles.address}>{company.address[locale]}</address>
            </dd>
          </div>
          {email ? (
            <div>
              <dt>{dictionary.productPage.email}</dt>
              <dd>
                <a className={productStyles.contactLink} href={`mailto:${email}`}>
                  <Mail size={18} aria-hidden="true" />{email}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </Section>
      <Contact contact={formContact} labels={dictionary.productPage} />
    </main>
  );
}
