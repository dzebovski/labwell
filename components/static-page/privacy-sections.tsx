import { Mail, MapPin, Phone } from "lucide-react";

import productStyles from "@/components/product-page/product-page.module.css";
import type { PrivacyBlock, PrivacyPageContent } from "@/lib/site-content/schema-static-pages";

import styles from "./static-page.module.css";

type Contact = { email?: string; phone?: string; address: string };

const number = (index: number) => String(index + 1).padStart(2, "0");

function Block({ block, contact, labels }: { block: PrivacyBlock; contact: Contact; labels: PrivacyPageContent["contactLabels"] }) {
  if (typeof block === "string") return <p className={productStyles.contactText}>{block}</p>;
  if ("list" in block) {
    return (
      <ul className={styles.privacyList}>
        {block.list.map((item) => <li key={item}>{item}</li>)}
      </ul>
    );
  }
  return (
    <dl className={styles.privacyContact}>
      {contact.email ? (
        <div>
          <dt>{labels.email}</dt>
          <dd><a href={`mailto:${contact.email}`}><Mail size={16} aria-hidden="true" />{contact.email}</a></dd>
        </div>
      ) : null}
      {contact.phone ? (
        <div>
          <dt>{labels.phone}</dt>
          <dd><a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}><Phone size={16} aria-hidden="true" />{contact.phone}</a></dd>
        </div>
      ) : null}
      <div>
        <dt>{labels.address}</dt>
        <dd><span><MapPin size={16} aria-hidden="true" />{contact.address}</span></dd>
      </div>
    </dl>
  );
}

/** Policy text: numbered table of contents (sticky on desktop) and numbered sections. */
export function PrivacySections({ content, contact }: { content: PrivacyPageContent; contact: Contact }) {
  return (
    <div className={styles.privacy}>
      <nav className={`${productStyles.card} ${styles.privacyToc}`} aria-labelledby="privacy-toc-title">
        <p id="privacy-toc-title" className={styles.privacyTocTitle}>{content.contentsTitle}</p>
        <ol>
          {content.sections.map((section, index) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>
                <span className={styles.privacyNumber}>{number(index)}</span>
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className={styles.privacyBody}>
        {content.sections.map((section, index) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className={styles.privacySection}>
            <h2 id={`${section.id}-title`} className={styles.privacyH2}>
              <span className={styles.privacyNumber}>{number(index)}</span>
              {section.title}
            </h2>
            {section.blocks.map((block, blockIndex) => (
              <Block key={blockIndex} block={block} contact={contact} labels={content.contactLabels} />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
