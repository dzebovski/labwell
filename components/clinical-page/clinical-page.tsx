import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Faq } from "@/components/product-page/blocks/faq";
import { Contact } from "@/components/product-page/blocks/contact";
import { HeroShell } from "@/components/product-page/blocks/hero";
import { Labwell } from "@/components/product-page/blocks/labwell";
import { Section, SectionHead } from "@/components/product-page/blocks/shared";
import type { ProductPageLabels } from "@/components/product-page/product-page";
import productStyles from "@/components/product-page/product-page.module.css";
import { LabLink } from "@/components/ui/primitives";
import { crumbLabels } from "@/components/patterns/crumb-labels";
import { getPageTrail, trailCrumbs } from "@/lib/breadcrumbs";
import { clinicalTestGroups, type ClinicalContent } from "@/lib/clinical-content";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { withLocale } from "@/lib/locale-routing";
import { mainPhoto } from "@/lib/site-content/photos";
import { loadShared } from "@/lib/site-content/load";
import { breadcrumbListLd, faqPageLd } from "@/lib/site-content/jsonld";
import { serializeJsonLd } from "@/lib/site-content/jsonld";
import { SITE_URL } from "@/lib/site-config";

import { ClinicalTestList } from "./clinical-test-list";
import styles from "./clinical-page.module.css";

type Props = { page: ClinicalContent; locale: Locale; labels: ProductPageLabels };

const text = {
  uk: { consult: "Отримати консультацію", tests: "Тести", panels: "Панелі", equipment: "Обладнання", qc: "Контроль якості", source: "Джерело виробника", menu: "Переглянути меню", count: "тестів у групі", panelCount: "панелей" },
  en: { consult: "Request a consultation", tests: "Tests", panels: "Panels", equipment: "Equipment", qc: "Quality control", source: "Manufacturer source", menu: "View test menu", count: "tests in group", panelCount: "panels" },
};

function localHref(locale: Locale, href: string) {
  return href.startsWith("/") ? withLocale(locale, href) : href;
}

export async function ClinicalPage({ page, locale, labels }: Props) {
  const dictionary = await getDictionary(locale);
  const shared = loadShared(locale);
  const copy = text[locale];
  const trail = getPageTrail(page.url, locale, page.hero.breadcrumbs.at(-1))!;
  const groups = clinicalTestGroups(page, locale);
  const faq = page.T10_faq.show && page.T10_faq.h2 && page.T10_faq.items?.length
    ? {
        h2: page.T10_faq.h2,
        items: page.T10_faq.items,
        aside: page.T12_contact.show
          ? { text: shared.faqAside.text, link: { label: shared.faqAside.link, href: "#contact", external: false } }
          : undefined,
      }
    : undefined;
  const labwell = page.T11_labwell.show
    ? { h2: shared.labwell.h2, link: { ...shared.labwell.link, href: localHref(locale, shared.labwell.link.href), external: false }, compact: false, items: shared.labwell.items }
    : undefined;
  const contact = page.T12_contact.show && page.T12_contact.h2 && page.T12_contact.text
    ? {
        h2: page.T12_contact.h2,
        text: page.T12_contact.text,
        messagePrefill: page.T12_contact.messagePrefill,
        phone: shared.contact.phone.startsWith("[") ? undefined : shared.contact.phone,
        email: shared.contact.email.startsWith("[") ? undefined : shared.contact.email,
        submit: shared.contact.form.submit,
        fields: shared.contact.form.fields,
      }
    : undefined;
  const steps = [
    ...(page.tests.show ? [{ id: "tests", label: page.tests.kind === "menu-groups" ? copy.tests : copy.panels }] : []),
    ...(page.equipment.show ? [{ id: "equipment", label: copy.equipment }] : []),
    ...(page.qc.show ? [{ id: "qc", label: copy.qc }] : []),
    ...(contact ? [{ id: "contact", label: copy.consult }] : []),
  ];
  const url = `${SITE_URL}/${locale}${page.url}`;
  const jsonLd = [breadcrumbListLd(trailCrumbs(trail), url, SITE_URL), ...(faq ? [faqPageLd(faq)] : [])];

  return (
    <main className={productStyles.page}>
      {jsonLd.map((data) => (
        <script key={String(data["@type"])} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
      ))}
      <HeroShell
        trail={trail}
        brand={page.brand}
        eyebrow={page.hero.eyebrow}
        h1Rest={page.hero.h1}
        lead={page.hero.lead}
        primaryCta={contact ? { label: copy.consult, href: "#contact", external: false } : undefined}
        labels={crumbLabels(dictionary)}
        mediaWidth="23rem"
        media={
          <nav className={styles.steps} aria-label={locale === "uk" ? "На цій сторінці" : "On this page"}>
            {steps.map((step, index) => (
              <a key={step.id} href={`#${step.id}`} className={styles.step}>
                <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span>{step.label}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ))}
          </nav>
        }
      />
      {page.tests.show ? (
        <Section id="tests" labelledBy="clinical-tests-title">
          <SectionHead id="clinical-tests-title" title={page.tests.h2} />
          <div className={`${productStyles.card} ${styles.testCard}`}>
            {page.tests.kind === "menu-groups" ? groups.map((group) => (
              <div key={group.href} className={styles.testGroup}>
                <div className={styles.groupHeader}>
                  <h3>{group.name}</h3>
                  <span>{group.tests.length} {copy.count}</span>
                </div>
                <ClinicalTestList tests={group.tests} locale={locale} />
                <LabLink href={localHref(locale, group.href)} className={styles.groupLink} trailingArrow>
                  {page.tests.menuLink?.label ?? copy.menu}
                </LabLink>
              </div>
            )) : (
              <>
                <span className={styles.panelCount}>{page.tests.items?.length ?? 0} {copy.panelCount}</span>
                <ul className={styles.panelGrid}>
                  {(page.tests.items ?? []).map((item) => <li key={item}>{item}</li>)}
                </ul>
                {page.tests.sourceUrl ? (
                  <a href={page.tests.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                    {copy.source} <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ) : null}
              </>
            )}
          </div>
        </Section>
      ) : null}
      {page.equipment.show && page.equipment.h2 && page.equipment.text ? (
        <Section id="equipment" labelledBy="clinical-equipment-title">
          <SectionHead id="clinical-equipment-title" title={page.equipment.h2} aside={page.equipment.sourceUrl ? (
            <a href={page.equipment.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
              {copy.source} <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ) : undefined} />
          <p className={styles.equipmentText}>{page.equipment.text}</p>
          <ul className={styles.equipmentGrid}>
            {(page.equipment.items ?? []).map((item) => {
              const slug = /^\/products\/([^/]+)$/.exec(item.href)?.[1];
              const photo = slug ? mainPhoto(slug) : undefined;
              return (
                <li key={item.href} className={`${productStyles.card} ${styles.equipmentCard}`}>
                  <LabLink href={localHref(locale, item.href)} className={styles.equipmentLink}>
                    <span className={styles.equipmentVisual}>
                      {photo ? <Image src={photo} alt="" fill sizes="(min-width: 64rem) 260px, 80vw" className={styles.equipmentPhoto} /> : <span className={styles.equipmentMonogram} aria-hidden="true">{page.brand === "Snibe" ? "S" : "B"}</span>}
                    </span>
                    <strong>{item.title}</strong>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </LabLink>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}
      {page.qc.show && page.qc.h2 && page.qc.items?.length ? (
        <Section id="qc" labelledBy="clinical-qc-title">
          <SectionHead id="clinical-qc-title" title={page.qc.h2} />
          <ul className={styles.equipmentGrid}>
            {page.qc.items.map((item) => <li key={item.href} className={`${productStyles.card} ${styles.qcCard}`}><LabLink href={localHref(locale, item.href)} trailingArrow>{item.label}</LabLink></li>)}
          </ul>
        </Section>
      ) : null}
      {faq ? <Faq faq={faq} /> : null}
      {labwell ? <Labwell labwell={labwell} /> : null}
      {contact ? <Contact contact={contact} labels={labels} /> : null}
    </main>
  );
}
