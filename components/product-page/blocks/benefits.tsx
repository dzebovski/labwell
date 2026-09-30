import type { ProductPageModel } from "@/lib/site-content/model";

import { ContentIcon } from "../icons";
import styles from "../product-page.module.css";
import { Section, SectionHead } from "./shared";

export function Benefits({ benefits }: { benefits: NonNullable<ProductPageModel["benefits"]> }) {
  // 3 cards: three columns with the icon on top. 1, 2 and 4 cards: two columns, icon on the left.
  const layout = benefits.items.length === 3 ? "three" : "wide";

  return (
    <Section labelledBy="benefits-title">
      <SectionHead id="benefits-title" title={benefits.h2} />
      <ul className={styles.benefitGrid} data-layout={layout}>
        {benefits.items.map((item) => (
          <li key={item.h3} className={styles.benefit}>
            <span className={styles.benefitIcon}>
              <ContentIcon name={item.icon} size={22} />
            </span>
            <div className={styles.benefitBody}>
              <h3 className={styles.h3}>{item.h3}</h3>
              <p className={styles.benefitText}>{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
