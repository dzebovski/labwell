import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChartLine, ImageIcon } from "lucide-react";

import type { BannerCard, CardBrand, DirectionCard, Fact, PageCard } from "@/lib/site-content/direction-model";

import { FilterItem } from "./brand-filter";
import styles from "./direction-page.module.css";

export type CardLabels = {
  details: string;
  badgeProduct: string;
  badgeGroup: string;
  overviewBadge: string;
  menuBadge: string;
};

const PHOTO_SIZES = "(min-width: 80rem) 300px, (min-width: 48rem) 45vw, 96px";

export function BrandLogo({ brand }: { brand: CardBrand }) {
  return brand.logo ? (
    <Image src={brand.logo.src} alt={brand.name} width={brand.logo.width} height={brand.logo.height} className={styles.cardLogo} />
  ) : (
    <strong className={styles.cardBrandName}>{brand.name}</strong>
  );
}

/** Photo of a card, or a quiet empty frame that keeps the row aligned when its neighbours have photos. */
function Media({ photo, alt, className }: { photo?: string; alt: string; className: string }) {
  return (
    <div className={className}>
      {photo ? (
        <Image src={photo} alt={alt} fill sizes={PHOTO_SIZES} className={styles.photo} />
      ) : (
        <ImageIcon size={28} strokeWidth={1.4} aria-hidden="true" className={styles.photoEmpty} />
      )}
    </div>
  );
}

function Facts({ facts, className }: { facts: Fact[]; className: string }) {
  if (!facts.length) return null;
  return (
    <dl className={className}>
      {facts.map((fact) => (
        <div key={`${fact.value}|${fact.label ?? ""}`} className={styles.fact}>
          {fact.label ? <dt className={styles.factLabel}>{fact.label}</dt> : null}
          <dd className={styles.factValue}>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PageTile({ card, media, showBrand, labels }: { card: PageCard; media: boolean; showBrand: boolean; labels: CardLabels }) {
  return (
    <article className={styles.tile} data-media={media ? "true" : undefined}>
      {media ? <Media photo={card.photo} alt="" className={styles.tileMedia} /> : null}
      <div className={styles.tileBody}>
        {showBrand ? <BrandLogo brand={card.brand} /> : null}
        <h3 className={styles.tileTitle}>
          <Link href={card.href} className={styles.stretch}>
            {card.title}
          </Link>
        </h3>
        {card.type ? <p className={styles.tileType}>{card.type}</p> : null}
        <Facts facts={card.facts} className={styles.tileFacts} />
        <span className={styles.more} aria-hidden="true">
          {labels.details}
          <ArrowRight size={15} />
        </span>
      </div>
    </article>
  );
}

export function WideCard({ card, showBrand, labels }: { card: PageCard; showBrand: boolean; labels: CardLabels }) {
  return (
    <article className={styles.wide}>
      {card.photo ? <Media photo={card.photo} alt="" className={styles.wideMedia} /> : null}
      <div className={styles.wideBody} data-media={card.photo ? "true" : undefined}>
        {showBrand ? <BrandLogo brand={card.brand} /> : null}
        <span className={styles.badge}>{card.kind === "group" ? labels.badgeGroup : labels.badgeProduct}</span>
        <h3 className={styles.wideTitle}>
          <Link href={card.href} className={styles.stretch}>
            {card.title}
          </Link>
        </h3>
        {card.type ? <p className={styles.wideType}>{card.type}</p> : null}
      </div>
      <Facts facts={card.facts} className={styles.wideStats} />
      <ArrowRight size={22} aria-hidden="true" className={styles.wideArrow} />
    </article>
  );
}

export function BannerView({ banner, labels }: { banner: BannerCard; labels: CardLabels }) {
  const menu = banner.kind === "test-menu";
  return (
    <article className={styles.banner} data-tone={menu ? "menu" : "overview"}>
      {menu && banner.stat ? (
        <span className={styles.bannerNumber} aria-hidden="true">
          {banner.stat.value}
        </span>
      ) : (
        <span className={styles.bannerIcon} aria-hidden="true">
          <ChartLine size={24} />
        </span>
      )}
      <div className={styles.bannerBody}>
        <span className={styles.bannerEyebrow}>{menu ? labels.menuBadge : labels.overviewBadge}</span>
        <h3 className={styles.bannerTitle}>
          <Link href={banner.href} className={styles.stretch}>
            {banner.title}
          </Link>
        </h3>
        {banner.sub ? <p className={styles.bannerSub}>{banner.sub}</p> : null}
      </div>
      <ArrowRight size={20} aria-hidden="true" className={styles.bannerArrow} />
    </article>
  );
}

/**
 * Direction cards: photo, name, count of items. `filterable` wraps each one in `FilterItem`
 * (the group page with two or more brands); the home page leaves them plain.
 */
export function DirectionCards({
  cards,
  filterable = false,
  showBrands = false,
  className,
}: {
  cards: DirectionCard[];
  filterable?: boolean;
  showBrands?: boolean;
  className?: string;
}) {
  return (
    <ul className={[styles.directions, className].filter(Boolean).join(" ")} data-count={cards.length}>
      {cards.map((card) => {
        const item = (
          <li key={card.id} className={styles.directionItem}>
            <article className={styles.directionCard}>
              <Media photo={card.photo} alt="" className={styles.directionMedia} />
              <div className={styles.directionBody}>
                {showBrands ? (
                  <span className={styles.directionLogos}>
                    {card.brands.map((brand) => (
                      <BrandLogo key={brand.id} brand={brand} />
                    ))}
                  </span>
                ) : null}
                <h3 className={styles.directionTitle}>
                  <Link href={card.href} className={styles.stretch}>
                    {card.title}
                  </Link>
                  <ArrowRight size={16} aria-hidden="true" className={styles.directionArrow} />
                </h3>
                <p className={styles.directionCount}>{card.countLabel}</p>
              </div>
            </article>
          </li>
        );
        return filterable ? (
          <FilterItem key={card.id} brandIds={card.brands.map((brand) => brand.id)}>
            {item}
          </FilterItem>
        ) : (
          item
        );
      })}
    </ul>
  );
}
