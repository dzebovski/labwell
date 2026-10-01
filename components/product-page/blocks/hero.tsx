import type { CSSProperties, ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ChevronRight, House, ImageIcon } from "lucide-react";

import globalStyles from "@/components/labwell-ui.module.css";
import { LabLink } from "@/components/ui/primitives";
import type { LinkModel, ProductPageModel } from "@/lib/site-content/model";

import styles from "../product-page.module.css";

const logos: Record<string, { src: string; width: number; height: number }> = {
  "Bio-Rad": { src: "/bio-rad-logo 1.png", width: 133, height: 36 },
  Snibe: { src: "/snibe-logo-1.png", width: 113, height: 36 },
};

type Crumb = { label: string; href?: string };

/** Breadcrumb trail: used by every template (T, G, C1, C2). */
export function Breadcrumbs({
  crumbs,
  labels,
}: {
  crumbs: Crumb[];
  labels: { breadcrumbs: string; home: string };
}) {
  return (
    <nav aria-label={labels.breadcrumbs} className={styles.crumbs}>
      <ol className={globalStyles.breadcrumbList}>
        {crumbs.map((crumb, index) => {
          const isCurrent = index === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className={globalStyles.breadcrumbItem}>
              {index > 0 ? (
                <ChevronRight
                  className={globalStyles.breadcrumbSeparator}
                  size={14}
                  aria-hidden="true"
                />
              ) : null}
              {isCurrent ? (
                <span aria-current="page">{crumb.label}</span>
              ) : crumb.href ? (
                <Link
                  href={crumb.href}
                  className={`${globalStyles.breadcrumbLink}${index === 0 ? ` ${styles.homeLink}` : ""}`}
                  aria-label={index === 0 ? labels.home : undefined}
                >
                  {index === 0 ? <House size={17} aria-hidden="true" /> : crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export type HeroShellProps = {
  crumbs: Crumb[];
  brand: string;
  eyebrow: string;
  h1Accent?: string;
  h1Rest: string;
  lead: string;
  facts?: Array<{ value: string; label: string }>;
  primaryCta?: LinkModel;
  secondaryCta?: LinkModel;
  /** Between the lead and the buttons (model chips on a series page). */
  extra?: ReactNode;
  /** The right column, complete with its own frame. */
  media: ReactNode;
  /** Width of the right column on wide screens, as a CSS length. */
  mediaWidth?: string;
  alignEnd?: boolean;
  labels: { breadcrumbs: string; home: string };
};

/**
 * Breadcrumbs and first screen. Template T puts the product photo in `media`;
 * G, C1 and C2 put photo tiles, a collage or the figures of the menu there.
 */
export function HeroShell(props: HeroShellProps) {
  const { brand, facts = [], primaryCta, secondaryCta } = props;
  const logo = logos[brand];

  return (
    <section className={styles.heroCard + " " + styles.card} aria-labelledby="product-title">
      <Breadcrumbs crumbs={props.crumbs} labels={props.labels} />

      <div
        className={styles.heroGrid}
        data-align={props.alignEnd ? "end" : undefined}
        style={props.mediaWidth ? ({ "--hero-media": props.mediaWidth } as CSSProperties) : undefined}
      >
        <div className={styles.heroCopy}>
          <div className={styles.brandLine}>
            {logo ? (
              <>
                <Image
                  src={logo.src}
                  alt={brand}
                  width={logo.width}
                  height={logo.height}
                  className={styles.brandLogo}
                />
                <span className={styles.brandDivider} aria-hidden="true" />
              </>
            ) : (
              <strong>{brand}</strong>
            )}
            <span className={styles.eyebrow}>{props.eyebrow}</span>
          </div>

          <div className={styles.titleGroup}>
            <h1 id="product-title" className={styles.h1}>
              {props.h1Accent ? <span className={styles.h1Accent}>{props.h1Accent}</span> : null}
              {props.h1Rest}
            </h1>
            <p className={styles.lead}>{props.lead}</p>
          </div>

          {props.extra}

          {facts.length ? (
            <dl className={styles.facts} style={{ "--count": facts.length } as CSSProperties}>
              {facts.map((fact) => (
                <div key={`${fact.value}-${fact.label}`} className={styles.fact}>
                  <dt className={styles.factLabel}>{fact.label}</dt>
                  <dd className={styles.factValue}>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {primaryCta || secondaryCta ? (
            <div className={styles.ctaRow}>
              {primaryCta ? (
                <LabLink href={primaryCta.href} variant="button-primary" size="lg">
                  {primaryCta.label}
                </LabLink>
              ) : null}
              {secondaryCta ? (
                <LabLink href={secondaryCta.href} className={styles.textLink}>
                  {secondaryCta.label}
                  <ArrowDown aria-hidden="true" size={16} strokeWidth={1.8} />
                </LabLink>
              ) : null}
            </div>
          ) : null}
        </div>

        {props.media}
      </div>
    </section>
  );
}

export function Hero({
  page,
  labels,
}: {
  page: ProductPageModel;
  labels: { breadcrumbs: string; home: string; photoPlaceholder: string };
}) {
  const { hero } = page;

  return (
    <HeroShell
      crumbs={page.breadcrumbs}
      brand={hero.brand}
      eyebrow={hero.eyebrow}
      h1Accent={hero.h1Accent}
      h1Rest={hero.h1Rest}
      lead={hero.lead}
      facts={hero.facts}
      primaryCta={hero.primaryCta}
      secondaryCta={hero.secondaryCta}
      labels={labels}
      media={
        <div className={styles.heroMedia}>
          {hero.imageSrc ? (
            <Image
              src={hero.imageSrc}
              alt={hero.imageAlt}
              fill
              priority
              sizes="(min-width: 64rem) 520px, 100vw"
              className={styles.heroPhoto}
            />
          ) : (
            <div className={styles.photoPlaceholder} role="img" aria-label={hero.imageAlt}>
              <ImageIcon size={40} strokeWidth={1.4} aria-hidden="true" />
              <span className={styles.photoPlaceholderTitle} aria-hidden="true">
                {labels.photoPlaceholder}
              </span>
              <span className={styles.photoPlaceholderAlt} aria-hidden="true">
                {hero.imageAlt}
              </span>
            </div>
          )}
        </div>
      }
    />
  );
}
