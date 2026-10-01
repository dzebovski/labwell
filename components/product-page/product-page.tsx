import type { Locale } from "@/i18n/config";
import { buildJsonLd, serializeJsonLd } from "@/lib/site-content/jsonld";
import type { ProductPageModel } from "@/lib/site-content/model";
import { SITE_URL } from "@/lib/site-config";

import { About } from "./blocks/about";
import { Benefits } from "./blocks/benefits";
import { Contact } from "./blocks/contact";
import { Documents } from "./blocks/documents";
import { Faq } from "./blocks/faq";
import { Hero } from "./blocks/hero";
import { ItemsTable } from "./blocks/items-table";
import { Labwell } from "./blocks/labwell";
import { Related } from "./blocks/related";
import { Specs } from "./blocks/specs";
import { Storage } from "./blocks/storage";
import { TestMenuBanner } from "./blocks/test-menu-banner";
import styles from "./product-page.module.css";

export type ProductPageLabels = {
  breadcrumbs: string;
  home: string;
  showHidden: string;
  up: string;
  fullTechnicalData: string;
  newTab: string;
  photoPlaceholder: string;
  phone: string;
  email: string;
  documentBadge: string;
  positionLabel: string;
  groupFilter: string;
  askPrefill: string;
  compareCorner: string;
  form: { required: string; phone: string; email: string };
};

/** Product page, template T. Blocks without data are not in the model, so they are not rendered. */
export function ProductPage({
  page,
  locale,
  labels,
}: {
  page: ProductPageModel;
  locale: Locale;
  labels: ProductPageLabels;
}) {
  const jsonLd = buildJsonLd({ page, locale, siteUrl: SITE_URL });

  return (
    <main className={styles.page}>
      {jsonLd.map((data) => (
        <script
          key={String(data["@type"])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
        />
      ))}
      <Hero page={page} labels={labels} />
      {page.about ? <About about={page.about} /> : null}
      {page.specs ? <Specs specs={page.specs} labels={labels} /> : null}
      {page.benefits ? <Benefits benefits={page.benefits} /> : null}
      {page.testMenu ? <TestMenuBanner menu={page.testMenu} /> : null}
      {page.items ? <ItemsTable items={page.items} /> : null}
      {page.storage ? <Storage storage={page.storage} /> : null}
      {page.documents ? <Documents documents={page.documents} labels={labels} /> : null}
      {page.faq ? <Faq faq={page.faq} /> : null}
      {page.labwell ? <Labwell labwell={page.labwell} /> : null}
      {page.contact ? <Contact contact={page.contact} labels={labels} /> : null}
      {page.related ? <Related related={page.related} /> : null}
    </main>
  );
}
