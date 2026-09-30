import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { BreadcrumbMenu } from "@/components/patterns/breadcrumb-menu";
import styles from "@/components/labwell-ui.module.css";
import type { Breadcrumb } from "@/lib/catalog";

type BreadcrumbsProps = {
  items: Breadcrumb[];
  label: string;
  /** Accessible name of the button that opens sibling categories. */
  chooseLabel: string;
};

export function Breadcrumbs({ items, label, chooseLabel }: BreadcrumbsProps) {
  return (
    <nav aria-label={label}>
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${index}-${item.label}`} className={styles.breadcrumbItem}>
              {index > 0 ? (
                <ChevronRight className={styles.breadcrumbSeparator} size={14} aria-hidden="true" />
              ) : null}
              {item.options ? (
                <BreadcrumbMenu item={item} isCurrent={isCurrent} chooseLabel={chooseLabel} />
              ) : item.href && !isCurrent ? (
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
  );
}
