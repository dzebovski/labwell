import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { crumbLabels } from "@/components/patterns/crumb-labels";
import {
  AboutApproach,
  AboutAreas,
  AboutClients,
  AboutFacts,
  AboutIntro,
  AboutTeamQuality,
  AboutWhy,
} from "@/components/static-page/about-sections";
import { StaticPageHeading } from "@/components/static-page/static-page-heading";
import styles from "@/components/static-page/static-page.module.css";
import { JsonLdScripts } from "@/components/product-page/blocks/json-ld";
import { Section } from "@/components/product-page/blocks/shared";
import productStyles from "@/components/product-page/product-page.module.css";
import { buttonClassName } from "@/components/ui/primitives";
import { catalogGroups } from "@/content/taxonomy";
import { getStaticTrail, trailCrumbs } from "@/lib/breadcrumbs";
import { getCategory } from "@/lib/catalog";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { loadAboutPageAllLocales } from "@/lib/site-content/load";
import { contentMetadata } from "@/lib/site-content/metadata";
import { breadcrumbListLd } from "@/lib/site-content/jsonld";
import { organizationId } from "@/lib/site-content/jsonld-site";
import { withLocale } from "@/lib/locale-routing";
import { SITE_URL } from "@/lib/site-config";

type AboutPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = loadAboutPageAllLocales()[locale === "uk" ? 0 : 1];
  return contentMetadata(content.seo, "/about", locale);
}

/** Catalog path of a direction id, e.g. "clia" → /products/equipment/clia. */
function areaPath(id: string) {
  const group = catalogGroups.find((entry) => entry.sections.some((section) => section.id === id));
  return group ? getCategory("catalog", group.id, id)?.path : undefined;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  const content = loadAboutPageAllLocales()[locale === "uk" ? 0 : 1];
  const trail = getStaticTrail(dictionary.pages.about, locale);
  const url = `${SITE_URL}/${locale}/about`;
  const areas = content.areas.items.map((item) => {
    const path = areaPath(item.id);
    return { ...item, href: path ? withLocale(locale, path) : undefined };
  });

  return (
    <main className={productStyles.page}>
      <JsonLdScripts data={[
        breadcrumbListLd(trailCrumbs(trail), url, SITE_URL),
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": `${url}#page`,
          url,
          name: content.h1,
          description: content.seo.description,
          inLanguage: locale,
          mainEntity: { "@id": organizationId(SITE_URL) },
        },
      ]} />
      <StaticPageHeading trail={trail} labels={crumbLabels(dictionary)} title={content.h1} lead={content.lead} />
      <AboutFacts items={content.facts.items} />
      <AboutIntro intro={content.intro} audience={content.audience} />
      <AboutAreas areas={content.areas} items={areas} />
      <AboutApproach approach={content.approach} href={withLocale(locale, content.approach.link.href)} />
      <AboutTeamQuality team={content.team} quality={content.quality} />
      <AboutWhy why={content.why} />
      <AboutClients clients={content.clients} />
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
