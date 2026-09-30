import type { Metadata } from "next";

import type { Locale } from "@/i18n/config";
import { withLocale } from "@/lib/locale-routing";

export function createPageMetadata(
  locale: Locale,
  title: string,
  descriptionOrPath: string,
  path?: string,
): Metadata {
  const canonicalPath = path ?? descriptionOrPath;
  const description = path ? descriptionOrPath : undefined;
  return {
    title,
    ...(description ? { description } : {}),
    alternates: {
      canonical: withLocale(locale, canonicalPath),
      languages: {
        uk: withLocale("uk", canonicalPath),
        en: withLocale("en", canonicalPath),
      },
    },
  };
}
