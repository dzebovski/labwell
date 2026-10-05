import type { Metadata } from "next";

import { company } from "../content/company.ts";
import type { Locale } from "../i18n/config.ts";
import { withLocale } from "./locale-routing.ts";

const ogLocales: Record<Locale, string> = { uk: "uk_UA", en: "en_US" };

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** Address of the generated card of a page (`app/[locale]/og`): `/uk/og/products/maglumi-x8.png`; the home page is `index`. */
export function ogImagePath(locale: Locale, path: string): string {
  return `/${locale}/og${path === "/" ? "/index" : path}.png`;
}

/**
 * Open Graph and Twitter tags of one page. A page's `openGraph` replaces the layout's as a whole,
 * so every page builds the full set here instead of relying on inheritance.
 * Relative addresses are resolved against `metadataBase` (the layout sets it).
 */
export function socialMetadata(input: {
  locale: Locale;
  title: string;
  description: string;
  /** Site path without locale, e.g. `/products/maglumi-x8`. */
  path: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const { locale, title, description, path } = input;
  const images = [{ url: ogImagePath(locale, path), ...OG_IMAGE_SIZE, alt: title }];

  return {
    openGraph: {
      type: "website",
      siteName: company.name,
      locale: ogLocales[locale],
      alternateLocale: Object.entries(ogLocales)
        .filter(([other]) => other !== locale)
        .map(([, value]) => value),
      url: withLocale(locale, path),
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map(({ url }) => url),
    },
  };
}
