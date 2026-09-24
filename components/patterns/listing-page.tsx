import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PageHeading } from "@/components/patterns/page-heading";
import styles from "@/components/labwell-ui.module.css";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Breadcrumb, ListingBlock } from "@/lib/catalog";
import { withLocale } from "@/lib/locale-routing";

type ListingPageProps = {
  locale: Locale;
  title: string;
  breadcrumbs: Breadcrumb[];
  blocks: ListingBlock[];
};

/** Menu roots and category pages: a heading followed by groups of page cards. */
export async function ListingPage({ locale, title, breadcrumbs, blocks }: ListingPageProps) {
  const dictionary = await getDictionary(locale);

  return (
    <PageHeading
      breadcrumbs={breadcrumbs}
      breadcrumbLabel={dictionary.accessibility.breadcrumbs}
      chooseLabel={dictionary.accessibility.chooseCategory}
      title={title}
    >
      <div className={styles.listing}>
        {blocks.map((block, index) => (
          <section key={block.title ?? index} className={styles.listingBlock}>
            {block.title ? (
              <h2 className={styles.listingBlockTitle}>
                {block.href ? (
                  <Link href={block.href}>
                    {block.title}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ) : (
                  block.title
                )}
              </h2>
            ) : null}
            <ul className={styles.listingGrid}>
              {block.pages.map((page) => (
                <li key={page.path}>
                  <Link href={withLocale(locale, page.path)} className={styles.listingCard}>
                    <span className={styles.listingCardBrand}>{page.brand.name}</span>
                    <span className={styles.listingCardTitle}>{page.navLabel[locale]}</span>
                    <span className={styles.listingCardDescription}>{page.description[locale]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageHeading>
  );
}
