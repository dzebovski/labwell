import { MessageSquare } from "lucide-react";
import Link from "next/link";

import { Breadcrumbs, type CrumbLabels } from "@/components/patterns/breadcrumbs";
import { Contact } from "@/components/product-page/blocks/contact";
import { Faq } from "@/components/product-page/blocks/faq";
import { JsonLdScripts } from "@/components/product-page/blocks/json-ld";
import { Labwell } from "@/components/product-page/blocks/labwell";
import { Section, SectionHead } from "@/components/product-page/blocks/shared";
import type { ProductPageLabels } from "@/components/product-page/product-page";
import productStyles from "@/components/product-page/product-page.module.css";
import type { Locale } from "@/i18n/config";
import { gridColumns, type DirectionPageModel } from "@/lib/site-content/direction-model";
import { buildDirectionJsonLd } from "@/lib/site-content/jsonld-directions";
import { SITE_URL } from "@/lib/site-config";

import { BrandFilter, BrandFilterBar, FilterItem, type BrandFilterLabels } from "./brand-filter";
import { BannerView, BrandLogo, DirectionCards, PageTile, WideCard, type CardLabels } from "./cards";
import styles from "./direction-page.module.css";

export type DirectionPageLabels = CardLabels & {
  consult: string;
  listDirection: string;
  listGroup: string;
  listDirections: string;
  filter: BrandFilterLabels;
};

type Props = {
  page: DirectionPageModel;
  locale: Locale;
  labels: DirectionPageLabels;
  crumbs: CrumbLabels;
  /** Labels of the contact form and the sections shared with the product pages. */
  productLabels: ProductPageLabels;
};

export function DirectionPage({ page, locale, labels, crumbs, productLabels }: Props) {
  const { pages, directions } = page;
  const showBrand = Boolean(page.filter);
  const hasPageList = Boolean(pages && pages.tiles.length + pages.wide.length > 0);
  const listTitle = directions.length ? labels.listDirections : page.id === "reagents" ? labels.listGroup : labels.listDirection;
  const filterTotal = directions.length + (pages ? pages.tiles.length + pages.wide.length + pages.banners.length : 0);

  const cards = (
    <>
      {directions.length ? <DirectionCards cards={directions} filterable={showBrand} showBrands={showBrand} /> : null}
      {pages && pages.tiles.length ? (
        <ul className={styles.tiles} data-cols={gridColumns(pages.tiles.length)}>
          {pages.tiles.map((card) => (
            <FilterItem key={card.path} brandIds={[card.brand.id]}>
              <li>
                <PageTile card={card} media={pages.media} showBrand={showBrand} labels={labels} />
              </li>
            </FilterItem>
          ))}
        </ul>
      ) : null}
      {pages && pages.wide.length ? (
        <ul className={styles.wides}>
          {pages.wide.map((card) => (
            <FilterItem key={card.path} brandIds={[card.brand.id]}>
              <li>
                <WideCard card={card} showBrand={showBrand} labels={labels} />
              </li>
            </FilterItem>
          ))}
        </ul>
      ) : null}
    </>
  );

  const banners = pages?.banners.length ? (
    <Section labelledBy="direction-links-title">
      <h2 id="direction-links-title" className="sr-only">
        {labels.overviewBadge} · {labels.menuBadge}
      </h2>
      <ul className={styles.banners} data-count={pages.banners.length}>
        {pages.banners.map((banner) => (
          <FilterItem key={banner.path} brandIds={[banner.brand.id]}>
            <li>
              <BannerView banner={banner} labels={labels} />
            </li>
          </FilterItem>
        ))}
      </ul>
    </Section>
  ) : null;

  const jsonLd = buildDirectionJsonLd({ page, locale, siteUrl: SITE_URL });

  return (
    <main className={productStyles.page}>
      <JsonLdScripts data={jsonLd} />
      <section className={`${productStyles.card} ${styles.hero}`} aria-labelledby="direction-title">
        <Breadcrumbs trail={page.trail} labels={crumbs} />
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            {page.brands.length ? (
              <div className={styles.heroLogos}>
                {page.brands.map((brand) => (
                  <BrandLogo key={brand.id} brand={brand} />
                ))}
              </div>
            ) : null}
            <h1 id="direction-title" className={styles.h1}>
              {page.h1}
            </h1>
            <p className={styles.lead}>{page.lead}</p>
          </div>
          <Link href="#contact" className={styles.cta}>
            <MessageSquare size={18} aria-hidden="true" />
            {labels.consult}
          </Link>
        </div>
      </section>

      <BrandFilter>
        {directions.length || hasPageList ? (
          <Section labelledBy="direction-list-title">
            <SectionHead
              id="direction-list-title"
              title={listTitle}
              aside={<span className={styles.count}>{page.countLabel}</span>}
            />
            <div className={styles.list}>
              {page.filter ? <BrandFilterBar options={page.filter} total={filterTotal} labels={labels.filter} /> : null}
              {cards}
            </div>
          </Section>
        ) : null}
        {banners}
      </BrandFilter>

      {page.faq ? <Faq faq={page.faq} /> : null}
      <Labwell labwell={page.labwell} />
      <Contact contact={page.contact} labels={productLabels} />
    </main>
  );
}
