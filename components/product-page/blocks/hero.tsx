import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ChevronRight, House, ImageIcon } from "lucide-react";

import globalStyles from "@/components/labwell-ui.module.css";
import { LabLink } from "@/components/ui/primitives";
import type { ProductPageModel } from "@/lib/site-content/model";

import styles from "../product-page.module.css";

const logos: Record<string, { src: string; width: number; height: number }> = {
  "Bio-Rad": { src: "/bio-rad-logo 1.png", width: 133, height: 36 },
  Snibe: { src: "/snibe-logo-1.png", width: 113, height: 36 },
};

export function Hero({
  page,
  labels,
}: {
  page: ProductPageModel;
  labels: { breadcrumbs: string; home: string; photoPlaceholder: string };
}) {
  const { hero } = page;
  const logo = logos[hero.brand];

  return (
    <section className={styles.heroCard + " " + styles.card} aria-labelledby="product-title">
      <nav aria-label={labels.breadcrumbs} className={styles.crumbs}>
        <ol className={globalStyles.breadcrumbList}>
          {page.breadcrumbs.map((crumb, index) => {
            const isCurrent = index === page.breadcrumbs.length - 1;
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

      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <div className={styles.brandLine}>
            {logo ? (
              <>
                <Image
                  src={logo.src}
                  alt={hero.brand}
                  width={logo.width}
                  height={logo.height}
                  className={styles.brandLogo}
                />
                <span className={styles.brandDivider} aria-hidden="true" />
              </>
            ) : (
              <strong>{hero.brand}</strong>
            )}
            <span className={styles.eyebrow}>{hero.eyebrow}</span>
          </div>

          <div className={styles.titleGroup}>
            <h1 id="product-title" className={styles.h1}>
              {hero.h1Accent ? <span className={styles.h1Accent}>{hero.h1Accent}</span> : null}
              {hero.h1Rest}
            </h1>
            <p className={styles.lead}>{hero.lead}</p>
          </div>

          {hero.facts.length ? (
            <dl className={styles.facts} style={{ "--count": hero.facts.length } as React.CSSProperties}>
              {hero.facts.map((fact) => (
                <div key={`${fact.value}-${fact.label}`} className={styles.fact}>
                  <dt className={styles.factLabel}>{fact.label}</dt>
                  <dd className={styles.factValue}>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {hero.primaryCta || hero.secondaryCta ? (
            <div className={styles.ctaRow}>
              {hero.primaryCta ? (
                <LabLink href={hero.primaryCta.href} variant="button-primary" size="lg">
                  {hero.primaryCta.label}
                </LabLink>
              ) : null}
              {hero.secondaryCta ? (
                <LabLink href={hero.secondaryCta.href} className={styles.textLink}>
                  {hero.secondaryCta.label}
                  <ArrowDown aria-hidden="true" size={16} strokeWidth={1.8} />
                </LabLink>
              ) : null}
            </div>
          ) : null}
        </div>

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
      </div>
    </section>
  );
}
