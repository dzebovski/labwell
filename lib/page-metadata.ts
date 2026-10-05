import type { Metadata } from "next";

import { company } from "@/content/company";
import type { Locale } from "@/i18n/config";
import { withLocale } from "@/lib/locale-routing";
import { socialMetadata } from "@/lib/social-metadata";

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
        "x-default": withLocale("uk", canonicalPath),
      },
    },
    // Pages without a text of their own share the company description.
    ...socialMetadata({ locale, title, description: description ?? company.description[locale], path: canonicalPath }),
  };
}
