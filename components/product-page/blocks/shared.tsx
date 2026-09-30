import type { ReactNode } from "react";

import { LabLink } from "@/components/ui/primitives";
import type { LinkModel } from "@/lib/site-content/model";

import styles from "../product-page.module.css";

export function Section({
  id,
  labelledBy,
  className,
  children,
}: {
  id?: string;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={[styles.section, className].filter(Boolean).join(" ")}
    >
      {children}
    </section>
  );
}

export function SectionHead({
  id,
  title,
  aside,
}: {
  id: string;
  title: string;
  aside?: ReactNode;
}) {
  return (
    <div className={styles.sectionHead}>
      <h2 id={id} className={styles.h2}>
        {title}
      </h2>
      {aside}
    </div>
  );
}

/** A link from content: same-tab for site pages, new tab for external documents. */
export function ContentLink({
  link,
  className,
  arrow = true,
  newTabLabel,
}: {
  link: LinkModel;
  className?: string;
  arrow?: boolean;
  newTabLabel?: string;
}) {
  return (
    <LabLink
      href={link.href}
      className={[styles.textLink, className].filter(Boolean).join(" ")}
      trailingArrow={arrow}
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {link.label}
      {link.external && newTabLabel ? <span className="sr-only"> ({newTabLabel})</span> : null}
    </LabLink>
  );
}
