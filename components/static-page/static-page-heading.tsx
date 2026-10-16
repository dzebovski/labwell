import { Breadcrumbs, type CrumbLabels } from "@/components/patterns/breadcrumbs";
import headingStyles from "@/components/labwell-ui.module.css";
import productStyles from "@/components/product-page/product-page.module.css";
import type { Trail } from "@/lib/breadcrumbs";

import styles from "./static-page.module.css";

/** PageHeading's existing panel, inside the page's single main landmark. */
export function StaticPageHeading({ trail, labels, title, lead, note }: {
  trail: Trail;
  labels: CrumbLabels;
  title: string;
  lead: string;
  /** A short line under the lead, e.g. the policy's effective date. */
  note?: string;
}) {
  return (
    <section className={headingStyles.pageHeading} aria-labelledby="page-title">
      <Breadcrumbs trail={trail} labels={labels} />
      <h1 id="page-title" className={headingStyles.pageTitle}>{title}</h1>
      <p className={`${productStyles.lead} ${styles.lead}`}>{lead}</p>
      {note ? <p className={styles.headingNote}>{note}</p> : null}
    </section>
  );
}
