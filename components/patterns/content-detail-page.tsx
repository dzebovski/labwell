import { ArrowUpRight, ClipboardCheck } from "lucide-react";

import { Breadcrumbs } from "@/components/patterns/breadcrumbs";
import styles from "@/components/labwell-ui.module.css";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { crumbLabels } from "@/components/patterns/crumb-labels";
import { getPageTrail } from "@/lib/breadcrumbs";
import type { ContentPage } from "@/lib/catalog";
import { showEditorialContent } from "@/lib/editorial";

type ContentDetailPageProps = {
  locale: Locale;
  page: ContentPage;
};

export async function ContentDetailPage({ locale, page }: ContentDetailPageProps) {
  const dictionary = await getDictionary(locale);
  const trail = getPageTrail(page.path, locale)!;
  const editorial = showEditorialContent();

  return (
    <main className={styles.pageMain}>
      <article className={styles.contentDetail}>
        <Breadcrumbs trail={trail} labels={crumbLabels(dictionary)} />

        <div className={styles.contentDetailGrid}>
          <div className={styles.contentDetailCopy}>
            <p className={styles.contentDetailBrand}>{page.brand.name}</p>
            <h1 className={styles.contentDetailTitle}>{page.navLabel[locale]}</h1>
            {page.itemType ? <p className={styles.contentDetailType}>{page.itemType[locale]}</p> : null}
            <p className={styles.contentDetailDescription}>{page.description[locale]}</p>
            {editorial ? (
              <a
                href={page.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.detailSourceLink}
              >
                {dictionary.contentPage.viewSource}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ) : null}
          </div>

          {editorial && page.todoNote ? (
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
