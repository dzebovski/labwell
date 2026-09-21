import type { Metadata } from "next";

import type { Locale } from "@/i18n/config";
import { localizePath } from "@/lib/site-navigation";

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
      canonical: localizePath(locale, canonicalPath),
      languages: {
        uk: localizePath("uk", canonicalPath),
        en: localizePath("en", canonicalPath),
      },
    },
  };
}
