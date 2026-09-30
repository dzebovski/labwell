import type { ProductPageModel } from "@/lib/site-content/model";

import styles from "../product-page.module.css";
import { Section, SectionHead } from "./shared";

export function Storage({ storage }: { storage: NonNullable<ProductPageModel["storage"]> }) {
  return (
    <Section labelledBy="storage-title">
      <SectionHead
        id="storage-title"
        title={storage.h2}
        aside={
          storage.caption ? (
            <span className={styles.caption} style={{ maxWidth: "28.75rem" }}>
              {storage.caption}
            </span>
          ) : undefined
        }
      />
      <ul className={styles.storageGrid}>
        {storage.rows.map((row) => (
          <li key={row.label} className={styles.storageItem}>
            <span className={styles.storageLabel}>{row.label}</span>
            <p className={styles.storageValue}>{row.value}</p>
            {row.detail ? <p className={styles.storageDetail}>{row.detail}</p> : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
