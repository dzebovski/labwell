import { Section, SectionHead } from "@/components/product-page/blocks/shared";
import { ContentIcon } from "@/components/product-page/icons";
import productStyles from "@/components/product-page/product-page.module.css";
import type { IconName } from "@/lib/site-content/icon-names";
import type { ServicesPageContent } from "@/lib/site-content/schema-static-pages";

import styles from "./static-page.module.css";

/** Same icons as Labwell; content ids also serve as stable section anchors. */
const serviceIcons: Record<ServicesPageContent["services"][number]["id"], IconName> = {
  "solution-selection": "message",
  supply: "truck",
  "installation-training": "graduation-cap",
  maintenance: "wrench",
  "application-support": "flask",
};

export function ServiceSections({ items }: { items: ServicesPageContent["services"] }) {
  return items.map((item) => (
    <Section key={item.id} labelledBy={`${item.id}-title`}>
      <div id={item.id} className={`${productStyles.card} ${styles.service}`}>
        <span className={styles.serviceIcon}><ContentIcon name={serviceIcons[item.id]} size={24} /></span>
        <div className={styles.serviceCopy}>
          <SectionHead id={`${item.id}-title`} title={item.title} />
          <p className={productStyles.contactText}>{item.text}</p>
        </div>
      </div>
    </Section>
  ));
}
