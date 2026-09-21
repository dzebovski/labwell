import type { Metadata } from "next";

import type { Locale } from "@/i18n/config";
import { localizePath } from "@/lib/site-navigation";

export function createPageMetadata(
  locale: Locale,
  title: string,
  path: string,
): Metadata {
  return {
    title: `${title} | Labwell`,
    alternates: {
      canonical: localizePath(locale, path),
      languages: {
        uk: localizePath("uk", path),
        en: localizePath("en", path),
      },
    },
  };
}
