import type { Locale } from "@/i18n/config";
import { buildOverviewJsonLd } from "@/lib/site-content/jsonld-pages";
import type { OverviewPageModel } from "@/lib/site-content/overview-model";
import { SITE_URL } from "@/lib/site-config";

import { CompareTable } from "./blocks/compare-table";
import { Contact } from "./blocks/contact";
import { Faq } from "./blocks/faq";
import { JsonLdScripts } from "./blocks/json-ld";
import { Labwell } from "./blocks/labwell";
import { ModelCards, OverviewHero } from "./blocks/overview";
import styles from "./product-page.module.css";
import type { ProductPageLabels } from "./product-page";

/** Series overview, template C2: comparison of the models and links to their pages. */
export function OverviewPage({
  page,
  locale,
  labels,
}: {
  page: OverviewPageModel;
  locale: Locale;
  labels: ProductPageLabels;
}) {
  return (
    <main className={styles.page}>
      <JsonLdScripts data={buildOverviewJsonLd({ page, locale, siteUrl: SITE_URL })} />
      <OverviewHero page={page} labels={labels} />
      {page.compare ? <CompareTable compare={page.compare} id="compare" labels={{ corner: labels.compareCorner }} /> : null}
      {page.cards ? <ModelCards cards={page.cards} /> : null}
      {page.faq ? <Faq faq={page.faq} /> : null}
      {page.labwell ? <Labwell labwell={page.labwell} /> : null}
      {page.contact ? <Contact contact={page.contact} labels={labels} /> : null}
    </main>
  );
}
