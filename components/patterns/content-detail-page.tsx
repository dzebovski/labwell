import { ArrowUpRight, ChevronRight, ClipboardCheck } from "lucide-react";
import Link from "next/link";

import styles from "@/components/labwell-ui.module.css";
import type { Locale } from "@/i18n/config";
import type { ContentPageRecord, NavigationPlacement } from "@/lib/navigation-content";
import { localizePath } from "@/lib/site-navigation";

type Breadcrumb = { label: string; href?: string };

type ContentDetailPageProps = {
  locale: Locale;
  page: ContentPageRecord;
  placement: NavigationPlacement;
  labels: {
    home: string;
    products: string;
    clinicalDirections: string;
    brands: string;
    breadcrumbs: string;
  };
};

function visualTitle(title: string) {
  return title.replace(/\s*\|\s*Labwell\s*$/i, "");
}

function brandRootPath(canonicalPath: string) {
  const [, section, brandSlug] = canonicalPath.split("/");
  return section === "brands" && brandSlug ? `/brands/${brandSlug}` : undefined;
}

export function ContentDetailPage({
  locale,
  page,
  placement,
  labels,
}: ContentDetailPageProps) {
  const isBrandAbout = page.kind === "brand" && page.canonicalPath.split("/").length === 3;
  const breadcrumbs: Breadcrumb[] = [
    { label: labels.home, href: localizePath(locale, "/") },
  ];

  if (page.kind === "product") {
    breadcrumbs.push({ label: labels.products, href: localizePath(locale, "/products") });
  } else if (page.kind === "clinical") {
    breadcrumbs.push({
      label: labels.clinicalDirections,
      href: localizePath(locale, "/clinical-directions"),
    });
  } else {
    breadcrumbs.push({ label: labels.brands, href: localizePath(locale, "/brands") });
  }

  const brandPath = page.kind === "brand" ? brandRootPath(page.canonicalPath) : undefined;
  breadcrumbs.push({
    label: placement.subcategory[locale],
    href:
      brandPath && !isBrandAbout
        ? localizePath(locale, brandPath)
        : undefined,
  });

  if (placement.group) breadcrumbs.push({ label: placement.group[locale] });
  if (!isBrandAbout) breadcrumbs.push({ label: placement.navLabel[locale] });

  return (
    <main className={styles.pageMain}>
      <article className={styles.contentDetail}>
        <nav aria-label={labels.breadcrumbs}>
          <ol className={styles.breadcrumbList}>
            {breadcrumbs.map((item, index) => {
              const isCurrent = index === breadcrumbs.length - 1;
              return (
                <li key={`${item.label}-${index}`} className={styles.breadcrumbItem}>
                  {index > 0 ? (
                    <ChevronRight
                      className={styles.breadcrumbSeparator}
                      size={14}
                      aria-hidden="true"
                    />
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

        <div className={styles.contentDetailGrid}>
          <div className={styles.contentDetailCopy}>
            <p className={styles.contentDetailBrand}>{page.brand}</p>
            <h1 className={styles.contentDetailTitle}>{visualTitle(page.title[locale])}</h1>
            <p className={styles.contentDetailDescription}>{page.description[locale]}</p>
            <a
              href={page.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.detailSourceLink}
            >
              {locale === "uk" ? "Переглянути джерело" : "View source"}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>

          {page.todoNote ? (
            <aside className={styles.editorialNote}>
              <span className={styles.editorialNoteIcon} aria-hidden="true">
                <ClipboardCheck size={19} />
              </span>
              <div>
                <h2>
                  {locale === "uk" ? "Що потрібно допрацювати" : "What needs completing"}
                </h2>
                <p>{page.todoNote[locale]}</p>
              </div>
            </aside>
          ) : (
            <div className={styles.contentDetailSignal} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
