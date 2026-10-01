import type { Locale } from "@/i18n/config";
import { buildTestMenuJsonLd } from "@/lib/site-content/jsonld-pages";
import type { TestMenuPageModel } from "@/lib/site-content/menu-model";
import { SITE_URL } from "@/lib/site-config";

import { Contact } from "./blocks/contact";
import { Faq } from "./blocks/faq";
import { JsonLdScripts } from "./blocks/json-ld";
import { Labwell } from "./blocks/labwell";
import { TestMenu } from "./blocks/test-menu";
import { TestMenuAnalyzers, TestMenuHero } from "./blocks/test-menu-parts";
import styles from "./product-page.module.css";
import type { ProductPageLabels } from "./product-page";

/** Test menu, template C1: groups and test names (all in the server HTML), search and group filter on top. */
export function TestMenuPage({
  page,
  locale,
  labels,
}: {
  page: TestMenuPageModel;
  locale: Locale;
  labels: ProductPageLabels;
}) {
  return (
    <main className={styles.page}>
      <JsonLdScripts data={buildTestMenuJsonLd({ page, locale, siteUrl: SITE_URL })} />
      <TestMenuHero page={page} labels={labels} />
      <TestMenu groups={page.groups} search={page.search} labels={labels} contactAvailable={Boolean(page.contact)} />
      {page.analyzers ? <TestMenuAnalyzers analyzers={page.analyzers} /> : null}
      {page.faq ? <Faq faq={page.faq} /> : null}
      {page.labwell ? <Labwell labwell={page.labwell} /> : null}
      {page.contact ? <Contact contact={page.contact} labels={labels} /> : null}
    </main>
  );
}
