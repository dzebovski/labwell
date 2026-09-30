import { Info } from "lucide-react";

import type { ItemsModel } from "@/lib/site-content/model";

import styles from "../product-page.module.css";
import { ContentLink, Section, SectionHead } from "./shared";

function Catalog({ number }: { number?: string }) {
  return number ? <span className={styles.chip}>{number}</span> : <span aria-hidden="true">—</span>;
}

export function ItemsTable({ items }: { items: ItemsModel }) {
  return (
    <Section id="items" labelledBy="items-title">
      <SectionHead
        id="items-title"
        title={items.h2}
        aside={items.summary ? <span className={styles.caption}>{items.summary}</span> : undefined}
      />
      <div className={`${styles.card} ${styles.tableCard}`}>
        {items.layout === "matrix" ? (
          // Explicit roles keep the table semantics when CSS turns rows into stacked cards on phones.
          <table className={`${styles.table} ${styles.itemsTable} ${styles.matrix}`} role="table">
            <thead role="rowgroup">
              <tr role="row">
                {items.columns.map((column) => (
                  <th key={column} scope="col" role="columnheader">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody role="rowgroup">
              {items.rows.map((row) => (
                <tr key={row.name} role="row">
                  <th scope="row" role="rowheader">
                    <span className={styles.rowName}>{row.name}</span>
                    {row.nameUk ? <span className={styles.rowNameSub}>{row.nameUk}</span> : null}
                  </th>
                  {row.catalogNumbers.map((number, index) => (
                    <td key={number} role="cell" data-label={items.columns[index + 1]}>
                      <Catalog number={number} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className={`${styles.table} ${styles.itemsTable} ${styles.list}`} role="table">
            <thead role="rowgroup">
              <tr role="row">
                {items.columns.map((column) => (
                  <th key={column} scope="col" role="columnheader">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody role="rowgroup">
              {items.rows.map((row, index) => (
                <tr key={`${row.catalogNumber ?? row.name}-${index}`} role="row">
                  <td role="cell">
                    <Catalog number={row.catalogNumber} />
                  </td>
                  <th scope="row" role="rowheader">
                    <span className={styles.rowName}>{row.name}</span>
                  </th>
                  {items.columns.length > 2 ? (
                    <td role="cell" className={styles.packSize}>{row.packSize ?? <span aria-hidden="true">—</span>}</td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {items.footnote || items.cta ? (
          <div className={styles.tableFoot}>
            {items.footnote ? (
              <span className={styles.footnote}>
                <Info size={16} aria-hidden="true" />
                {items.footnote}
              </span>
            ) : null}
            {items.cta ? <ContentLink link={items.cta} /> : null}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
