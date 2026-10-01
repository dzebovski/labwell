import type { Locale } from "@/i18n/config";
import { buildGroupJsonLd } from "@/lib/site-content/jsonld-pages";
import type { GroupPageModel } from "@/lib/site-content/group-model";
import { SITE_URL } from "@/lib/site-config";

import { CompareTable } from "./blocks/compare-table";
import { Contact } from "./blocks/contact";
import { Faq } from "./blocks/faq";
import { GroupHero, GroupItems, GroupSections } from "./blocks/group";
import { JsonLdScripts } from "./blocks/json-ld";
import { Labwell } from "./blocks/labwell";
import styles from "./product-page.module.css";
import type { ProductPageLabels } from "./product-page";

/** Group page, template G: several products on one page, each with an anchor. */
export function GroupPage({
  page,
  locale,
  labels,
}: {
  page: GroupPageModel;
  locale: Locale;
  labels: ProductPageLabels;
}) {
  return (
    <main className={styles.page}>
      <JsonLdScripts data={buildGroupJsonLd({ page, locale, siteUrl: SITE_URL })} />
      <GroupHero page={page} labels={labels} />
      {page.compare ? <CompareTable compare={page.compare} id={page.compare.id} labels={{ corner: labels.compareCorner }} /> : null}
      {page.sections ? <GroupSections sections={page.sections} /> : null}
      {page.items ? <GroupItems items={page.items} labels={labels} /> : null}
      {page.faq ? <Faq faq={page.faq} /> : null}
      {page.labwell ? <Labwell labwell={page.labwell} /> : null}
      {page.contact ? <Contact contact={page.contact} labels={labels} /> : null}
    </main>
  );
}
