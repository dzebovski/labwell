import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import { Section, SectionHead } from "@/components/product-page/blocks/shared";
import { ContentIcon } from "@/components/product-page/icons";
import productStyles from "@/components/product-page/product-page.module.css";
import type { AboutPageContent } from "@/lib/site-content/schema-static-pages";

import { serviceIcons } from "./service-sections";
import styles from "./static-page.module.css";

type Area = AboutPageContent["areas"]["items"][number] & { href?: string };

/** Key figures right under the page heading. */
export function AboutFacts({ items }: { items: AboutPageContent["facts"]["items"] }) {
  return (
    <dl className={styles.aboutFacts}>
      {items.map((item) => (
        <div key={item.value} className={`${productStyles.card} ${styles.aboutFact}`}>
          <dt className={styles.aboutFactLabel}>{item.label}</dt>
          <dd className={styles.aboutFactValue}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function AboutIntro({ intro, audience }: Pick<AboutPageContent, "intro" | "audience">) {
  return (
    <Section labelledBy="intro-title">
      <div className={styles.aboutSplit}>
        <div className={styles.aboutProse}>
          <SectionHead id="intro-title" title={intro.title} />
          {intro.paragraphs.map((paragraph) => (
            <p key={paragraph} className={productStyles.contactText}>{paragraph}</p>
          ))}
        </div>
        <aside className={`${productStyles.card} ${styles.aboutAside}`} aria-labelledby="audience-title">
          <h3 id="audience-title" className={styles.aboutH3}>{audience.title}</h3>
          <p className={productStyles.contactText}>{audience.text}</p>
        </aside>
      </div>
    </Section>
  );
}

export function AboutAreas({ areas, items }: { areas: AboutPageContent["areas"]; items: Area[] }) {
  return (
    <Section labelledBy="areas-title">
      <SectionHead id="areas-title" title={areas.title} />
      <p className={`${productStyles.contactText} ${styles.aboutIntroText}`}>{areas.text}</p>
      <ul className={styles.aboutAreas}>
        {items.map((item) => (
          <li key={item.id}>
            {item.href ? (
              <Link href={item.href} className={styles.aboutArea}>
                <span>{item.title}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ) : (
              <span className={styles.aboutArea}>{item.title}</span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function AboutApproach({ approach, href }: { approach: AboutPageContent["approach"]; href: string }) {
  return (
    <Section labelledBy="approach-title">
      <SectionHead
        id="approach-title"
        title={approach.title}
        aside={
          <Link href={href} className={styles.aboutMore}>
            {approach.link.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        }
      />
      <ol className={styles.aboutSteps}>
        {approach.items.map((item) => (
          <li key={item.id} className={`${productStyles.card} ${styles.aboutStep}`}>
            <span className={styles.serviceIcon}><ContentIcon name={serviceIcons[item.id]} size={22} /></span>
            <h3 className={styles.aboutH3}>{item.title}</h3>
            <p className={productStyles.contactText}>{item.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** Team and quality side by side: two short confirmed facts about the company. */
export function AboutTeamQuality({ team, quality }: Pick<AboutPageContent, "team" | "quality">) {
  return (
    <Section labelledBy="team-title">
      <div className={styles.aboutPair}>
        {[
          { id: "team-title", ...team },
          { id: "quality-title", ...quality },
        ].map((block) => (
          <div key={block.id} className={`${productStyles.card} ${styles.aboutPanel}`}>
            <h2 id={block.id} className={productStyles.h2}>{block.title}</h2>
            <p className={productStyles.contactText}>{block.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function AboutWhy({ why }: { why: AboutPageContent["why"] }) {
  return (
    <Section labelledBy="why-title">
      <SectionHead id="why-title" title={why.title} />
      <ul className={styles.aboutWhy}>
        {why.items.map((item) => (
          <li key={item.title} className={`${productStyles.card} ${styles.aboutPanel}`}>
            <h3 className={styles.aboutH3}>{item.title}</h3>
            <p className={productStyles.contactText}>{item.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/**
 * Client logos. LabWell has not sent logos yet, so neutral placeholder tiles stand in
 * for them (decision of 2026-10-15). TODO(about-clients): replace with real logos.
 */
export function AboutClients({ clients, placeholders = 6 }: { clients: AboutPageContent["clients"]; placeholders?: number }) {
  return (
    <Section labelledBy="clients-title">
      <SectionHead id="clients-title" title={clients.title} />
      <p className={`${productStyles.contactText} ${styles.aboutIntroText}`}>{clients.text}</p>
      <ul className={styles.aboutLogos} aria-hidden="true">
        {Array.from({ length: placeholders }, (_, index) => (
          <li key={index} className={styles.aboutLogo}>
            <Building2 size={22} />
            <span className={styles.aboutLogoBar} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
