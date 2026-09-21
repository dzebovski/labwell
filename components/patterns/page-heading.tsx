import { ChevronRight } from "lucide-react";
import Link from "next/link";

import styles from "@/components/labwell-ui.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeadingProps = {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  breadcrumbLabel: string;
};

export function PageHeading({
  breadcrumbs,
  title,
  breadcrumbLabel,
}: PageHeadingProps) {
  return (
    <main className={styles.pageMain}>
      <section className={styles.pageHeading}>
        <nav aria-label={breadcrumbLabel}>
          <ol className={styles.breadcrumbList}>
            {breadcrumbs.map((item, index) => {
              const isCurrent = index === breadcrumbs.length - 1;

              return (
                <li key={`${item.href ?? "current"}-${item.label}`} className={styles.breadcrumbItem}>
                  {index > 0 ? (
                    <ChevronRight className={styles.breadcrumbSeparator} size={14} aria-hidden="true" />
                  ) : null}
                  {item.href && !isCurrent ? (
                    <Link href={item.href} className={styles.breadcrumbLink}>
                      {item.label}
                    </Link>
                  ) : (
                    <span aria-current={isCurrent ? "page" : undefined}>{item.label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <h1 className={styles.pageTitle}>{title}</h1>
      </section>
    </main>
  );
}
