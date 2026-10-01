import type { CrumbLabels } from "@/components/patterns/breadcrumbs";
import type { CSSProperties } from "react";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ModelCardModel, OverviewPageModel, RelatedWideModel } from "@/lib/site-content/overview-model";

import styles from "../product-page.module.css";
import t from "../templates.module.css";
import { HeroShell } from "./hero";
import { Photo } from "./photo";
import { Section } from "./shared";

/** C2.1: breadcrumbs, H1, intro and the photos of the models side by side. */
export function OverviewHero({
  page,
  labels,
}: {
  page: OverviewPageModel;
  labels: CrumbLabels;
}) {
  const { hero } = page;
  return (
    <HeroShell
      trail={page.trail}
      brand={hero.brand}
      eyebrow={hero.eyebrow}
      h1Accent={hero.h1Accent}
      h1Rest={hero.h1Rest}
      lead={hero.lead}
      primaryCta={hero.primaryCta}
      labels={labels}
      mediaWidth="35rem"
      media={
        <ul className={t.lineup} style={{ "--count": hero.tiles.length } as CSSProperties}>
          {hero.tiles.map((tile) => (
            <li key={tile.title} className={t.lineupItem}>
              <Photo src={tile.imageSrc} alt={tile.imageAlt} sizes="(min-width: 64rem) 9rem, 22vw" priority />
            </li>
          ))}
        </ul>
      }
    />
  );
}

function ModelCard({ model }: { model: ModelCardModel }) {
  const body = (
    <>
      <span className={t.modelPhoto}>
        <Photo src={model.imageSrc} alt={model.imageAlt} sizes="(min-width: 64rem) 20vw, 50vw" decorative />
      </span>
      <span className={t.modelBody}>
        <span className={styles.eyebrow}>{model.eyebrow}</span>
        <span className={t.modelTitle}>
          {model.title}
          {model.href ? <ArrowUpRight size={18} aria-hidden="true" /> : null}
        </span>
        <span className={t.modelText}>{model.text}</span>
      </span>
    </>
  );
  return model.href ? (
    <Link href={model.href} className={t.modelCard}>
      {body}
    </Link>
  ) : (
    <div className={t.modelCard}>{body}</div>
  );
}

function RelatedWide({ item }: { item: RelatedWideModel }) {
  const dark = item.kind === "test-menu";
  const body = (
    <>
      {item.bigNumber ? (
        <span className={t.wideNumber}>
          <span className={t.wideNumberValue}>{item.bigNumber.value}</span>
          <span className={t.wideNumberLabel}>{item.bigNumber.label}</span>
        </span>
      ) : item.imageSrc ? (
        <span className={t.widePhoto}>
          <Photo src={item.imageSrc} alt={item.imageAlt ?? item.title} sizes="(min-width: 64rem) 12rem, 40vw" decorative />
        </span>
      ) : null}
      <span className={t.wideCopy}>
        <span className={dark ? t.wideEyebrowDark : styles.eyebrow}>{item.eyebrow}</span>
        <span className={t.wideTitle}>{item.title}</span>
        <span className={dark ? t.wideTextDark : t.wideText}>{item.text}</span>
      </span>
      {item.href ? <ArrowUpRight className={t.wideArrow} size={22} aria-hidden="true" /> : null}
    </>
  );
  const className = `${t.wide} ${dark ? t.wideDark : ""}`;
  return item.href ? (
    <Link href={item.href} className={className} data-has-media={item.bigNumber || item.imageSrc ? "true" : undefined}>
      {body}
    </Link>
  ) : (
    <div className={className} data-has-media={item.bigNumber || item.imageSrc ? "true" : undefined}>
      {body}
    </div>
  );
}

/** C2.3: model cards, then the M Series and test menu cards. */
export function ModelCards({ cards }: { cards: NonNullable<OverviewPageModel["cards"]> }) {
  return (
    <Section id="models" labelledBy="models-title">
      <div className={t.head}>
        <div className={t.headCopy}>
          {cards.eyebrow ? <span className={styles.eyebrow}>{cards.eyebrow}</span> : null}
          <h2 id="models-title" className={styles.h2}>
            {cards.h2}
          </h2>
        </div>
      </div>
      <ul className={t.modelGrid} style={{ "--count": cards.models.length } as CSSProperties}>
        {cards.models.map((model) => (
          <li key={model.productSlug}>
            <ModelCard model={model} />
          </li>
        ))}
      </ul>
      {cards.related.length ? (
        <ul className={t.wideGrid}>
          {cards.related.map((item) => (
            <li key={item.title}>
              <RelatedWide item={item} />
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}
