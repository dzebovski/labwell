import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ProductPageModel } from "@/lib/site-content/model";

import styles from "../product-page.module.css";
import { Section, SectionHead } from "./shared";

export function TestMenuBanner({ menu }: { menu: NonNullable<ProductPageModel["testMenu"]> }) {
  return (
    <Section labelledBy="test-menu-title">
      <SectionHead id="test-menu-title" title={menu.h2} />
      <Link href={menu.cta.href} className={styles.banner} data-number={menu.bigNumber ? "yes" : "none"}>
        {menu.bigNumber ? (
          <span className={styles.bannerNumber}>
            <span className={styles.bannerValue}>{menu.bigNumber.value}</span>
            <span className={styles.bannerLabel}>{menu.bigNumber.label}</span>
          </span>
        ) : null}
        <span className={styles.bannerCopy}>
          <span className={styles.bannerTitle}>{menu.title}</span>
          <span className={styles.bannerText}>{menu.text}</span>
        </span>
        <span className={styles.bannerCta}>
          {menu.cta.label}
          <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} />
        </span>
      </Link>
    </Section>
  );
}
