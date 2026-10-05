import type { Metadata } from "next";

import { SITE_URL } from "../site-config.ts";
import { socialMetadata } from "../social-metadata.ts";
import type { ContentLocale } from "./load.ts";

/**
 * title/description from `seo`, canonical to the page itself, hreflang uk/en.
 * `seo.title` already ends with "| LabWell", so it is `absolute`: the locale layout's
 * template would otherwise append the site name a second time.
 */
export function contentMetadata(
  seo: { title: string; description: string },
  canonicalPath: string,
  locale: ContentLocale,
): Metadata {
  // The home page is `/uk`, not `/uk/`.
  const suffix = canonicalPath === "/" ? "" : canonicalPath;
  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: seo.title },
    description: seo.description,
    alternates: {
      canonical: `/${locale}${suffix}`,
      languages: {
        uk: `/uk${suffix}`,
        en: `/en${suffix}`,
        "x-default": `/uk${suffix}`,
      },
    },
    ...socialMetadata({ locale, title: seo.title, description: seo.description, path: canonicalPath }),
  };
}
