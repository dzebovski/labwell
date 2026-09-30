import type { CSSProperties } from "react";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ImageIcon } from "lucide-react";

import { mainPhoto } from "@/lib/site-content/photos";
import type { CardModel, ProductPageModel } from "@/lib/site-content/model";

import styles from "../product-page.module.css";
import { ContentLink, Section, SectionHead } from "./shared";

function CardBody({ card, photo }: { card: CardModel; photo?: string }) {
  // Model cards (with key facts) carry a photo area; plain cards do not.
  const hasMedia = card.facts.length > 0;
  return (
    <>
      {hasMedia ? (
        <div className={styles.relatedMedia} aria-hidden="true">
          {photo ? (
            <Image src={photo} alt="" fill sizes="(min-width: 64rem) 25vw, 50vw" className={styles.relatedPhoto} />
          ) : (
            <ImageIcon size={32} strokeWidth={1.4} />
          )}
        </div>
      ) : null}
      <div className={styles.relatedBody}>
        <span className={styles.eyebrow}>{card.eyebrow}</span>
        <span className={styles.relatedTitle}>
          {card.title}
          {card.href ? <ArrowUpRight size={18} aria-hidden="true" /> : null}
        </span>
        {card.facts.length ? (
          <dl className={styles.relatedFacts}>
            {card.facts.map(([label, value]) => (
              <div key={label} className={styles.relatedFact}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </>
  );
}

export function Related({ related }: { related: NonNullable<ProductPageModel["related"]> }) {
  return (
    <Section labelledBy="related-title">
      <SectionHead
        id="related-title"
        title={related.h2}
        aside={related.allLink ? <ContentLink link={related.allLink} /> : undefined}
      />
      <ul className={styles.cardGrid} style={{ "--count": related.cards.length } as CSSProperties}>
        {related.cards.map((card) => {
          const slug = card.href ? /\/products\/([^/]+)$/.exec(card.href)?.[1] : undefined;
          const photo = slug ? mainPhoto(slug) : undefined;
          return (
            <li key={card.title}>
              {card.href ? (
                <Link href={card.href} className={styles.relatedCard}>
                  <CardBody card={card} photo={photo} />
                </Link>
              ) : (
                <div className={styles.relatedCard}>
                  <CardBody card={card} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
