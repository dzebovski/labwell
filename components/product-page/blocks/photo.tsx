import Image from "next/image";
import { ImageIcon } from "lucide-react";

import styles from "../templates.module.css";

/**
 * A photo that fills its (relatively positioned) parent, or a quiet placeholder of the same size
 * when the file has not been added yet. The parent decides the frame and the proportions.
 */
export function Photo({
  src,
  alt,
  sizes,
  priority,
  decorative,
}: {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** The photo repeats a name printed next to it: empty alt, hidden from screen readers. */
  decorative?: boolean;
}) {
  return src ? (
    <Image src={src} alt={decorative ? "" : alt} fill sizes={sizes} priority={priority} className={styles.photo} />
  ) : (
    <span className={styles.photoEmpty} {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": alt })}>
      <ImageIcon size={32} strokeWidth={1.4} aria-hidden="true" />
    </span>
  );
}
