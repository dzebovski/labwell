import type { CSSProperties } from "react";

import type { ProductPageModel } from "@/lib/site-content/model";

import { ContentIcon } from "../icons";
import styles from "../product-page.module.css";
import { ContentLink, Section } from "./shared";

export function Labwell({ labwell }: { labwell: NonNullable<ProductPageModel["labwell"]> }) {
  const count = { "--count": labwell.items.length } as CSSProperties;

  if (labwell.compact) {
    return (
      <Section labelledBy="labwell-title">
        <div className={`${styles.card} ${styles.labwellCompact}`} style={count}>
          <div className={styles.labwellHead}>
            <h2 id="labwell-title" className={styles.labwellCompactTitle}>
              {labwell.h2}
            </h2>
            {labwell.link ? <ContentLink link={labwell.link} /> : null}
          </div>
          {labwell.items.map((item) => (
            <div key={item.title} className={styles.labwellCompactItem}>
              <span className={styles.labwellCompactIcon}>
                <ContentIcon name={item.icon} size={22} />
              </span>
              <div className={styles.labwellCompactBody}>
                <strong className={styles.labwellCompactItemTitle}>{item.title}</strong>
                <span className={styles.labwellCompactItemText}>{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section labelledBy="labwell-title">
      <div className={styles.labwell}>
        <div className={styles.labwellHead}>
          <h2 id="labwell-title" className={styles.labwellTitle}>
            {labwell.h2}
          </h2>
          {labwell.link ? (
            <ContentLink link={labwell.link} className={styles.labwellLink} />
          ) : null}
        </div>
        <ul className={styles.labwellGrid} style={count}>
          {labwell.items.map((item) => (
            <li key={item.title} className={styles.labwellItem}>
              <span className={styles.labwellIcon}>
                <ContentIcon name={item.icon} size={24} />
              </span>
              <strong className={styles.labwellItemTitle}>{item.title}</strong>
              <span className={styles.labwellItemText}>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
