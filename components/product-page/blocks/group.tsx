import type { CrumbLabels } from "@/components/patterns/breadcrumbs";
import type { CSSProperties } from "react";

import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";

import { LabLink } from "@/components/ui/primitives";
import type { GroupItemModel, GroupPageModel } from "@/lib/site-content/group-model";

import styles from "../product-page.module.css";
import t from "../templates.module.css";
import { HeroShell } from "./hero";
import { OrderTable } from "./items-table";
import { Photo } from "./photo";
import { PrefillLink } from "./prefill";
import { Section } from "./shared";

export function GroupHero({
  page,
  labels,
}: {
  page: GroupPageModel;
  labels: CrumbLabels;
}) {
  const { hero } = page;
  const { media } = hero;

  return (
    <HeroShell
      trail={page.trail}
      brand={hero.brand}
      eyebrow={hero.eyebrow}
      h1Accent={hero.h1Accent}
      h1Rest={hero.h1Rest}
      lead={hero.lead}
      primaryCta={hero.primaryCta}
      secondaryCta={hero.secondaryCta}
      labels={labels}
      mediaWidth="35rem"
      extra={
        hero.chips ? (
          <div className={t.chips}>
            {hero.chips.label ? <span className={t.chipsLabel}>{hero.chips.label}</span> : null}
            <ul className={t.chipList}>
              {hero.chips.items.map((chip) => (
                <li key={chip.href}>
                  <Link href={chip.href} className={t.chip}>
                    {chip.title}
                    <ChevronDown size={14} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null
      }
      media={
        media.type === "tiles" ? (
          <ul className={t.tiles} style={{ "--count": media.items.length } as CSSProperties}>
            {media.items.map((tile) => (
              <li key={tile.href}>
                <Link href={tile.href} className={t.tile}>
                  <span className={t.tilePhoto}>
                    <Photo src={tile.imageSrc} alt={tile.imageAlt} sizes="(min-width: 64rem) 14rem, 45vw" priority decorative />
                  </span>
                  <span className={t.tileName}>{tile.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : media.type === "collage" ? (
          <div className={t.collage} role="img" aria-label={media.alt} style={{ "--count": media.items.length } as CSSProperties}>
            {media.items.map((tile) => (
              <span key={tile.href} className={t.collagePhoto}>
                <Photo src={tile.imageSrc} alt={tile.imageAlt} sizes="(min-width: 64rem) 12rem, 30vw" priority decorative />
              </span>
            ))}
          </div>
        ) : (
          <div className={`${styles.heroMedia} ${t.heroPlaceholder}`}>
            <Photo alt={media.alt} sizes="100vw" />
          </div>
        )
      }
    />
  );
}

/** G2 for a page of lines: cards that lead to the sub-sections below. */
export function GroupSections({ sections }: { sections: NonNullable<GroupPageModel["sections"]> }) {
  return (
    <Section id="lines" labelledBy="lines-title">
      <div className={t.head}>
        <div className={t.headCopy}>
          {sections.eyebrow ? <span className={styles.eyebrow}>{sections.eyebrow}</span> : null}
          <h2 id="lines-title" className={styles.h2}>
            {sections.h2}
          </h2>
        </div>
      </div>
      <ul className={t.sectionGrid} style={{ "--count": sections.items.length } as CSSProperties}>
        {sections.items.map((item) => (
          <li key={item.anchor}>
            <Link href={item.href} className={t.sectionCard}>
              <span className={t.sectionPhoto}>
                <Photo src={item.imageSrc} alt={item.imageAlt ?? item.title} sizes="(min-width: 64rem) 22rem, 90vw" decorative />
              </span>
              <span className={t.sectionBody}>
                {item.eyebrow ? <span className={styles.eyebrow}>{item.eyebrow}</span> : null}
                {/* h3 is reserved for the sub-sections below: the card title is a styled span inside the link. */}
                <span className={t.sectionTitle}>
                  {item.title}
                  <ArrowDown size={18} aria-hidden="true" />
                </span>
                <span className={t.sectionText}>{item.text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** G3: one article per product, with an anchor. */
export function GroupItems({
  items,
  labels,
}: {
  items: NonNullable<GroupPageModel["items"]>;
  labels: { positionLabel: string; askPrefill: string };
}) {
  return (
    <Section id="items" labelledBy="items-title">
      <div className={t.head}>
        <div className={t.headCopy}>
          {items.eyebrow ? <span className={styles.eyebrow}>{items.eyebrow}</span> : null}
          <h2 id="items-title" className={styles.h2}>
            {items.h2}
          </h2>
        </div>
      </div>
      <div className={t.articles}>
        {items.items.map((item) => (
          <GroupItem key={item.anchor} item={item} labels={labels} />
        ))}
      </div>
    </Section>
  );
}

function GroupItem({
  item,
  labels,
}: {
  item: GroupItemModel;
  labels: { positionLabel: string; askPrefill: string };
}) {
  return (
    <article id={item.anchor} className={`${styles.card} ${t.article}`} aria-labelledby={`${item.anchor}-title`}>
      <div className={t.articleMedia}>
        <div className={t.articlePhoto}>
          <Photo src={item.imageSrc} alt={item.imageAlt} sizes="(min-width: 64rem) 25rem, 90vw" />
        </div>
        <span className={t.position}>
          {labels.positionLabel.replace("{n}", String(item.position)).replace("{total}", String(item.total))}
        </span>
      </div>

      <div className={t.articleBody}>
        <div className={t.articleHead}>
          <span className={t.anchorChip}>#{item.anchor}</span>
          <span className={styles.eyebrow}>{item.eyebrow}</span>
        </div>
        <h3 id={`${item.anchor}-title`} className={t.articleTitle}>
          {item.h3}
        </h3>
        <p className={t.articleText}>{item.text}</p>

        {item.facts.length ? (
          <dl className={t.itemFacts} style={{ "--count": item.facts.length } as CSSProperties}>
            {item.facts.map((fact) => (
              <div key={`${fact.value}-${fact.label}`} className={t.itemFact}>
                <dt className={t.itemFactLabel}>{fact.label}</dt>
                <dd className={t.itemFactValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {item.ordering ? (
          <div className={t.ordering}>
            <h4 className={t.orderingTitle}>{item.ordering.h3}</h4>
            <OrderTable items={item.ordering.table} />
          </div>
        ) : null}

        {item.cta || item.backLink ? (
          <div className={t.articleActions}>
            {item.cta ? (
              <PrefillLink
                href={item.cta.href}
                variant="button-secondary"
                message={labels.askPrefill.replace("{name}", item.h3)}
              >
                {item.cta.label}
              </PrefillLink>
            ) : null}
            {item.backLink ? (
              <LabLink href={item.backLink.href} className={styles.textLink}>
                <ArrowUp size={16} aria-hidden="true" />
                {item.backLink.label.replace(/^↑\s*/, "")}
              </LabLink>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
