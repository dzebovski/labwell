import Image from "next/image";
import Link from "next/link";

import styles from "@/components/patterns/site-footer.module.css";
import { company } from "@/content/company";
import type { Locale } from "@/i18n/config";
import type { FooterModel } from "@/lib/site-footer";

export type SiteFooterLabels = {
  navigation: string;
  /** "© {year} LabWell. …" */
  copyright: string;
  home: string;
  contacts: string;
};

type SiteFooterProps = {
  locale: Locale;
  homeHref: string;
  model: FooterModel;
  labels: SiteFooterLabels;
};

/**
 * Server-rendered site map: the header's mega menu opens on the client, so these links are
 * what a crawler finds in the HTML. Contacts appear only once they are real (see `buildFooter`).
 */
export function SiteFooter({ locale, homeHref, model, labels }: SiteFooterProps) {
  const { contacts } = model;

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.about}>
          <Link href={homeHref} className={styles.logoLink} aria-label={labels.home}>
            <Image src={company.logo.src} alt={company.name} width={180} height={40} className={styles.logo} />
          </Link>
          <p className={styles.tagline}>{company.description[locale]}</p>
        </div>

        <nav aria-label={labels.navigation} className={styles.columns}>
          {model.columns.map((column) => (
            <div key={column.id}>
              <h2 className={styles.heading}>
                {column.href ? <Link href={column.href}>{column.title}</Link> : column.title}
              </h2>
              <ul className={styles.list}>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.bottom}>
        <p>{labels.copyright}</p>
        {contacts ? (
          <ul className={styles.contacts} aria-label={labels.contacts}>
            {contacts.phone ? (
              <li>
                <a href={contacts.phone.href} className={styles.contactLink}>
                  {contacts.phone.label}
                </a>
              </li>
            ) : null}
            {contacts.email ? (
              <li>
                <a href={contacts.email.href} className={styles.contactLink}>
                  {contacts.email.label}
                </a>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </footer>
  );
}
