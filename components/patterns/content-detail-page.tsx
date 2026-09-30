import { ArrowUpRight, ClipboardCheck } from "lucide-react";

import { Breadcrumbs } from "@/components/patterns/breadcrumbs";
import styles from "@/components/labwell-ui.module.css";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getBreadcrumbs, type ContentPage } from "@/lib/catalog";

type ContentDetailPageProps = {
  locale: Locale;
  page: ContentPage;
};

export async function ContentDetailPage({ locale, page }: ContentDetailPageProps) {
  const dictionary = await getDictionary(locale);
  const breadcrumbs = getBreadcrumbs(page, locale, dictionary.pages);

  return (
    <main className={styles.pageMain}>
      <article className={styles.contentDetail}>
        <Breadcrumbs
          items={breadcrumbs}
          label={dictionary.accessibility.breadcrumbs}
          chooseLabel={dictionary.accessibility.chooseCategory}
        />

        <div className={styles.contentDetailGrid}>
          <div className={styles.contentDetailCopy}>
            <p className={styles.contentDetailBrand}>{page.brand.name}</p>
            <h1 className={styles.contentDetailTitle}>{page.navLabel[locale]}</h1>
            {page.itemType ? <p className={styles.contentDetailType}>{page.itemType[locale]}</p> : null}
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
