import { ChevronDown } from "lucide-react";

import type { ProductPageModel } from "@/lib/site-content/model";

import styles from "../product-page.module.css";
import { Section, SectionHead } from "./shared";

function SpecRows({ rows }: { rows: Array<{ label: string; value: string }> }) {
  return (
    <table className={`${styles.table} ${styles.specsTable}`}>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Specs({
  specs,
  labels,
}: {
  specs: NonNullable<ProductPageModel["specs"]>;
  labels: { fullTechnicalData: string };
}) {
  return (
    <Section id="specs" labelledBy="specs-title">
      <SectionHead
        id="specs-title"
        title={specs.h2}
        aside={specs.caption ? <span className={styles.caption}>{specs.caption}</span> : undefined}
      />
      <div className={`${styles.card} ${styles.specsCard}`}>
        <SpecRows rows={specs.rows} />
      </div>
      {specs.fullRows ? (
        // Native <details>: the full table is in the HTML while collapsed and needs no client JS.
        <details className={styles.fullData}>
          <summary className={styles.fullDataSummary}>
            {labels.fullTechnicalData}
            <ChevronDown className={styles.chevron} size={18} aria-hidden="true" />
          </summary>
          <div className={styles.fullDataBody}>
            <SpecRows rows={specs.fullRows} />
          </div>
        </details>
      ) : null}
    </Section>
  );
}
