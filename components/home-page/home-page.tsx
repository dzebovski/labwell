import { ArrowRight, BadgeCheck, ChevronRight, ImageIcon, LayoutGrid, Stethoscope, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { BrandLogo, DirectionCards } from "@/components/direction-page/cards";
import { Contact } from "@/components/product-page/blocks/contact";
import { Labwell } from "@/components/product-page/blocks/labwell";
import { Section, SectionHead } from "@/components/product-page/blocks/shared";
import type { ProductPageLabels } from "@/components/product-page/product-page";
import productStyles from "@/components/product-page/product-page.module.css";
import type { HomeModel } from "@/lib/site-content/home-model";

import styles from "./home-page.module.css";

export type HomePageLabels = {
  consult: string;
  official: string;
  startHeading: string;
  allCatalog: string;
  brandsHeading: string;
  heroPhotos: string;
};

const startIcons: Record<HomeModel["start"][number]["id"], LucideIcon> = {
  products: LayoutGrid,
  "clinical-directions": Stethoscope,
  brands: BadgeCheck,
};

export function HomePage({
  model,
  labels,
  productLabels,
}: {
  model: HomeModel;
  labels: HomePageLabels;
  productLabels: ProductPageLabels;
}) {
  const catalog = model.start[0];

  return (
    <main className={productStyles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}>
          <h1 id="home-title" className={styles.h1}>
            {model.h1}
          </h1>
          <p className={styles.lead}>{model.lead}</p>
          <div className={styles.ctaRow}>
            <Link href={catalog.href} className={styles.ctaPrimary}>
              {catalog.title}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="#contact" className={styles.ctaSecondary}>
              {labels.consult}
            </Link>
          </div>
          <div className={styles.official}>
            <span className={styles.officialLabel}>{labels.official}</span>
            {model.brands.map((brand) => (
              <BrandLogo key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
        <div
          className={styles.heroMedia}
          data-count={model.photos.length}
          role={model.photos.length ? undefined : "img"}
          aria-label={model.photos.length ? undefined : labels.heroPhotos}
        >
          {model.photos.length ? (
            model.photos.map((photo, index) => (
              <span key={photo.src} className={styles.heroPhotoCell}>
                {/* The first screen: the two photos that are visible on a phone load right away. */}
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 64rem) 240px, 45vw"
                  className={styles.heroPhoto}
                  {...(index < 2 ? { loading: "eager", fetchPriority: "high" } : {})}
                />
              </span>
            ))
          ) : (
            <ImageIcon size={40} strokeWidth={1.4} aria-hidden="true" className={styles.heroEmpty} />
          )}
        </div>
      </section>

      <Section labelledBy="home-start-title">
        <SectionHead id="home-start-title" title={labels.startHeading} />
        <ul className={styles.start}>
          {model.start.map((card) => {
            const Icon = startIcons[card.id];
            return (
              <li key={card.id}>
                <article className={styles.startCard}>
                  <span className={styles.startIcon} aria-hidden="true">
                    <Icon size={24} />
                  </span>
                  <div className={styles.startBody}>
                    <h3 className={styles.startTitle}>
                      <Link href={card.href} className={styles.stretch}>
                        {card.title}
                      </Link>
                      <ArrowRight size={18} aria-hidden="true" className={styles.startArrow} />
                    </h3>
                    <ul className={styles.chips} aria-label={card.title}>
                      {card.chips.map((chip) => (
                        <li key={chip} className={styles.chipItem}>
                          {chip}
                        </li>
                      ))}
                    </ul>
                    <p className={styles.startSummary}>{card.chips.join(", ")}</p>
                  </div>
                  <ChevronRight size={20} aria-hidden="true" className={styles.startChevron} />
                </article>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section labelledBy="home-directions-title">
        <SectionHead
          id="home-directions-title"
          title={model.directions.title}
          aside={
            <Link href={model.directions.href} className={styles.allLink}>
              {labels.allCatalog}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          }
        />
        <DirectionCards cards={model.directions.cards} />
      </Section>

      <Section labelledBy="home-brands-title">
        <SectionHead id="home-brands-title" title={labels.brandsHeading} />
        <ul className={styles.brands}>
          {model.brandCards.map((card) => (
            <li key={card.id}>
              <article className={styles.brandCard}>
                <span className={styles.brandLogoBox}>
                  <BrandLogo brand={card.brand} />
                </span>
                <div className={styles.brandBody}>
                  <h3 className={styles.brandName}>{card.brand.name}</h3>
                  <p className={styles.brandText}>{card.description}</p>
                  <Link href={card.href} className={styles.allLink}>
                    {card.linkLabel}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <Labwell labwell={model.labwell} />
      <Contact contact={model.contact} labels={productLabels} />
    </main>
  );
}
