import type { Metadata } from "next";
import { notFound } from "next/navigation";

import styles from "@/components/labwell-ui.module.css";
import { company } from "@/content/company";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/page-metadata";

type HomePageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const title = `${company.name} — ${company.tagline[locale]}`;
  return {
    ...createPageMetadata(locale, title, company.description[locale], "/"),
    // The home page is not "… | LabWell": the title already names the site.
    title: { absolute: title },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <main className={styles.homeMain} />;
}
