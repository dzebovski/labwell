import { ArrowUpRight, ChevronRight, ClipboardCheck } from "lucide-react";
import Link from "next/link";

import styles from "@/components/labwell-ui.module.css";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getBreadcrumbs, type ContentPage } from "@/lib/catalog";

type ContentDetailPageProps = {
  locale: Locale;
  page: ContentPage;
};

function visualTitle(title: string) {
  return title.replace(/\s*\|\s*Labwell\s*$/i, "");
}

export async function ContentDetailPage({ locale, page }: ContentDetailPageProps) {
  const dictionary = await getDictionary(locale);
  const breadcrumbs = getBreadcrumbs(page, locale, dictionary.pages);

  return (
    <main className={styles.pageMain}>
      <article className={styles.contentDetail}>
        <nav aria-label={dictionary.accessibility.breadcrumbs}>
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
            <p className={styles.contentDetailBrand}>{page.brand.name}</p>
            <h1 className={styles.contentDetailTitle}>{visualTitle(page.title[locale])}</h1>
            <p className={styles.contentDetailDescription}>{page.description[locale]}</p>
            <a
              href={page.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.detailSourceLink}
            >
              {dictionary.contentPage.viewSource}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>

          {page.todoNote ? (
            <aside className={styles.editorialNote}>
              <span className={styles.editorialNoteIcon} aria-hidden="true">
                <ClipboardCheck size={19} />
              </span>
              <div>
                <h2>{dictionary.contentPage.todoHeading}</h2>
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
