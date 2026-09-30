import type { ProductPageModel } from "@/lib/site-content/model";

import styles from "../product-page.module.css";

export function About({ about }: { about: NonNullable<ProductPageModel["about"]> }) {
  return (
    <section className={styles.section} aria-labelledby="about-title">
      <div className={styles.about}>
        <h2 id="about-title" className={styles.h2}>
          {about.h2}
        </h2>
        <p className={styles.aboutText}>{about.text}</p>
      </div>
    </section>
  );
}
