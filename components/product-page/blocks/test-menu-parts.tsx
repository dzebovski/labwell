import { LabLink } from "@/components/ui/primitives";
import type { TestMenuPageModel } from "@/lib/site-content/menu-model";

import styles from "../product-page.module.css";
import t from "../templates.module.css";
import { HeroShell } from "./hero";
import { Section } from "./shared";

/** C1.1: breadcrumbs, H1, intro and the figures of the menu. */
export function TestMenuHero({
  page,
  labels,
}: {
  page: TestMenuPageModel;
  labels: { breadcrumbs: string; home: string };
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
      labels={labels}
      mediaWidth="26.25rem"
      alignEnd
      media={
        <dl className={t.stats} style={{ "--count": hero.stats.length } as React.CSSProperties}>
          {hero.stats.map((stat) => (
            <div key={`${stat.value}-${stat.label}`} className={t.stat}>
              <dt className={styles.factLabel}>{stat.label}</dt>
              <dd className={t.statValue}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      }
    />
  );
}

/** C1.4: analyzers that work with the menu. Rendered only when the manufacturer's link is confirmed (`show: true`). */
export function TestMenuAnalyzers({ analyzers }: { analyzers: NonNullable<TestMenuPageModel["analyzers"]> }) {
  return (
    <Section labelledBy="analyzers-title">
      <div className={`${styles.card} ${t.analyzers}`}>
        <div className={t.analyzersCopy}>
          <span className={styles.eyebrow}>{analyzers.eyebrow}</span>
          <h2 id="analyzers-title" className={t.analyzersTitle}>
            {analyzers.title}
          </h2>
        </div>
        <ul className={t.analyzersLinks}>
          {analyzers.links.map((link) => (
            <li key={link.href}>
              <LabLink href={link.href} variant="button-secondary">
                {link.label}
              </LabLink>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
