import Link from "next/link";
import { Info } from "lucide-react";

import type { CompareModel } from "@/lib/site-content/compare";

import styles from "../product-page.module.css";
import t from "../templates.module.css";
import { Photo } from "./photo";
import { Section } from "./shared";

/**
 * Model comparison (G2 on a series page, C2.2 on an overview).
 * From 48rem a real table: the first column (the metric) stays in place if the table has to scroll
 * inside its card. Below that each row becomes a card (the model name is printed in front of
 * every value), so the page never scrolls sideways. Roles are explicit to keep the table
 * semantics when CSS turns the rows into blocks.
 */
export function CompareTable({
  compare,
  id,
  labels,
}: {
  compare: CompareModel;
  id: string;
  labels: { corner: string };
}) {
  const titleId = `${id}-title`;
  return (
    <Section id={id} labelledBy={titleId}>
      <div className={t.head}>
        <div className={t.headCopy}>
          {compare.eyebrow ? <span className={styles.eyebrow}>{compare.eyebrow}</span> : null}
          <h2 id={titleId} className={styles.h2}>
            {compare.h2}
          </h2>
        </div>
        {compare.caption ? <span className={styles.caption}>{compare.caption}</span> : null}
      </div>

      <div className={`${styles.card} ${t.compareCard}`}>
        <div className={t.compareScroll} role="region" aria-labelledby={titleId} tabIndex={0}>
          <table
            className={t.compare}
            role="table"
            style={{ "--cols": compare.columns.length } as React.CSSProperties}
          >
            <thead role="rowgroup">
              <tr role="row">
                <th scope="col" role="columnheader" className={t.compareCorner}>
                  <span className="sr-only">{labels.corner}</span>
                </th>
                {compare.columns.map((column) => (
                  <th key={column.title} scope="col" role="columnheader" className={t.compareHead}>
                    {column.href ? (
                      <Link href={column.href} className={t.compareModel}>
                        <ColumnHead column={column} />
                      </Link>
                    ) : (
                      <span className={t.compareModel}>
                        <ColumnHead column={column} />
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody role="rowgroup">
              {compare.rows.map((row) => (
                <tr key={row.label} role="row">
                  <th scope="row" role="rowheader" className={t.compareLabel}>
                    {row.label}
                    {row.detail ? <span className={t.compareDetail}>{row.detail}</span> : null}
                  </th>
                  {row.cells.map((cell, index) => (
                    <td
                      key={compare.columns[index].title}
                      role="cell"
                      className={t.compareCell}
                      data-label={compare.columns[index].title}
                      data-missing={cell.missing ? "true" : undefined}
                    >
                      <span className={t.compareValue}>{cell.text}</span>
                      {cell.ratio !== undefined ? (
                        <span className={t.bar} aria-hidden="true">
                          <span className={t.barFill} style={{ width: `${Math.max(4, Math.round(cell.ratio * 100))}%` }} />
                        </span>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {compare.footnote ? (
          <div className={styles.tableFoot}>
            <span className={styles.footnote}>
              <Info size={16} aria-hidden="true" />
              {compare.footnote}
            </span>
          </div>
        ) : null}
      </div>
    </Section>
  );
}

function ColumnHead({ column }: { column: CompareModel["columns"][number] }) {
  return (
    <>
      <span className={t.comparePhoto}>
        <Photo src={column.imageSrc} alt={column.imageAlt} sizes="(min-width: 64rem) 12vw, 25vw" decorative />
      </span>
      <span className={t.compareName}>{column.title}</span>
    </>
  );
}
