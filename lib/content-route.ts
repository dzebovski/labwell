import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/i18n/config";
import type { ContentPage } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/page-metadata";

/** Shared by the content detail routes: 404 for an unknown locale or page. */
export function requireContentPage(
  locale: string,
  page: ContentPage | undefined,
): { locale: Locale; page: ContentPage } {
  if (!isLocale(locale) || !page) notFound();
  return { locale, page };
}

export function contentPageMetadata(locale: string, page: ContentPage | undefined): Metadata {
  const resolved = requireContentPage(locale, page);
  return createPageMetadata(
    resolved.locale,
    resolved.page.title[resolved.locale],
    resolved.page.description[resolved.locale],
    resolved.page.path,
  );
}
