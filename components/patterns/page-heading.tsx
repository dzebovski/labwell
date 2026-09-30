import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/patterns/breadcrumbs";
import styles from "@/components/labwell-ui.module.css";
import type { Breadcrumb } from "@/lib/catalog";

export type BreadcrumbItem = Breadcrumb;

type PageHeadingProps = {
  breadcrumbs: Breadcrumb[];
  title: string;
  breadcrumbLabel: string;
  chooseLabel: string;
  children?: ReactNode;
};

export function PageHeading({
  breadcrumbs,
  title,
  breadcrumbLabel,
  chooseLabel,
  children,
}: PageHeadingProps) {
  return (
    <main className={styles.pageMain}>
      <section className={styles.pageHeading}>
        <Breadcrumbs items={breadcrumbs} label={breadcrumbLabel} chooseLabel={chooseLabel} />
        <h1 className={styles.pageTitle}>{title}</h1>
        {children}
      </section>
    </main>
  );
}
