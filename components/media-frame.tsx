import type { ImageProps } from "next/image";
import Image from "next/image";

import styles from "@/components/labwell-ui.module.css";

export type LabVisualVariant = "analyzer" | "diagnostics" | "automation";

export type MediaFrameProps = {
  src?: ImageProps["src"];
  alt: string;
  variant?: LabVisualVariant;
  label?: string;
  className?: string;
  sizes?: string;
};

const variantClasses: Record<LabVisualVariant, string | undefined> = {
  analyzer: undefined,
  diagnostics: styles.mediaFrameDiagnostics,
  automation: styles.mediaFrameAutomation,
};

export function MediaFrame({
  src,
  alt,
  variant = "analyzer",
  label = "Lab visual / 01",
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: MediaFrameProps) {
  const classes = [styles.mediaFrame, variantClasses[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role={src ? undefined : "img"} aria-label={src ? undefined : alt}>
      {src ? (
        <Image className={styles.mediaImage} src={src} alt={alt} fill sizes={sizes} />
      ) : (
        <>
          <div className={styles.instrument} aria-hidden="true" />
          <div className={styles.sampleRail} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className={styles.mediaLabel} aria-hidden="true">
            {label}
          </span>
        </>
      )}
    </div>
  );
}
