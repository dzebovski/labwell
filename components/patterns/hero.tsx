import { MediaFrame, type MediaFrameProps } from "@/components/media-frame";
import { LabLink } from "@/components/ui/primitives";
import styles from "@/components/labwell-ui.module.css";

export type HeroAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

export type HeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions: HeroAction[];
  media: MediaFrameProps;
  titleTag?: "h1" | "h2" | "h3";
};

export function Hero({
  eyebrow,
  title,
  description,
  actions,
  media,
  titleTag: TitleTag = "h1",
}: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>{eyebrow}</p>
          <TitleTag className={styles.heroTitle}>
            {title}
          </TitleTag>
          <p className={styles.heroDescription}>{description}</p>
          <div className={styles.heroActions}>
            {actions.map((action) => (
              <LabLink
                key={`${action.href}-${action.label}`}
                href={action.href}
                variant={
                  action.variant === "secondary" ? "button-secondary" : "button-primary"
                }
                size="lg"
              >
                {action.label}
              </LabLink>
            ))}
          </div>
        </div>
        <MediaFrame {...media} className={styles.heroMedia} />
      </div>
    </section>
  );
}
