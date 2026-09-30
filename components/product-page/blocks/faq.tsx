import type { ProductPageModel } from "@/lib/site-content/model";

import styles from "../product-page.module.css";
import { ContentLink, Section } from "./shared";

export function Faq({ faq }: { faq: NonNullable<ProductPageModel["faq"]> }) {
  return (
    <Section labelledBy="faq-title">
      <div className={styles.faqLayout}>
        <div className={styles.faqAside}>
          <h2 id="faq-title" className={styles.h2}>
            {faq.h2}
          </h2>
          {faq.aside ? (
            <p className={styles.faqAsideText}>
              {faq.aside.text} <ContentLink link={faq.aside.link} arrow={false} />
            </p>
          ) : null}
        </div>
        {/* Native <details>: answers are in the HTML while collapsed, no client JS. Shared `name` = one open at a time. */}
        <div className={`${styles.card} ${styles.faqList}`}>
          {faq.items.map((item, index) => (
            <details key={item.q} name="faq" className={styles.faqItem} open={index === 0}>
              <summary className={styles.faqSummary}>
                <h3 className={styles.faqQuestion}>{item.q}</h3>
              </summary>
              <div className={styles.faqAnswer}>
                <p>{item.a}</p>
                {item.link ? <ContentLink link={item.link} /> : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
