import type { ReactNode } from "react";

import { Breadcrumbs, type CrumbLabels } from "@/components/patterns/breadcrumbs";
import styles from "@/components/labwell-ui.module.css";
import type { Trail } from "@/lib/breadcrumbs";

type PageHeadingProps = {
  trail: Trail;
  crumbLabels: CrumbLabels;
  title: string;
  children?: ReactNode;
};

export function PageHeading({ trail, crumbLabels, title, children }: PageHeadingProps) {
  return (
    <main className={styles.pageMain}>
      <section className={styles.pageHeading}>
        <Breadcrumbs trail={trail} labels={crumbLabels} />
        <h1 className={styles.pageTitle}>{title}</h1>
        {children}
      </section>
    </main>
  );
}
