import { ExternalLink, FileText } from "lucide-react";

import type { ProductPageModel } from "@/lib/site-content/model";

import styles from "../product-page.module.css";
import { Section, SectionHead } from "./shared";

export function Documents({
  documents,
  labels,
}: {
  documents: NonNullable<ProductPageModel["documents"]>;
  labels: { newTab: string; documentBadge: string };
}) {
  return (
    <Section labelledBy="documents-title">
      <SectionHead id="documents-title" title={documents.h2} />
      <ul className={styles.docGrid}>
        {documents.items.map((doc) => (
          <li key={doc.href}>
            <a href={doc.href} target="_blank" rel="noopener noreferrer" className={styles.doc}>
              <span className={styles.docBadge} aria-hidden="true">
                {/\.pdf($|\?)/i.test(doc.href) ? labels.documentBadge : <FileText size={18} />}
              </span>
              <span className={styles.docBody}>
                <span className={styles.docTitle}>{doc.title}</span>
                {doc.meta ? <span className={styles.docMeta}>{doc.meta}</span> : null}
              </span>
              <ExternalLink className={styles.docIcon} size={18} aria-hidden="true" />
              <span className="sr-only">({labels.newTab})</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
