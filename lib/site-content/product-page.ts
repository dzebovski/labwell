import "server-only";

import type { Metadata } from "next";

import { SITE_URL } from "../site-config.ts";
import { loadProduct, loadShared, type ContentLocale } from "./load.ts";
import { buildProductPage, type ProductPageModel } from "./model.ts";
import { mainPhoto } from "./photos.ts";

export function getProductPageModel(slug: string, locale: ContentLocale): ProductPageModel {
  return buildProductPage({
    product: loadProduct(slug, locale),
    shared: loadShared(locale),
    locale,
    imageSrc: mainPhoto(slug),
  });
}

/** title/description from `seo`, canonical to the page itself, hreflang uk/en. */
export function getProductMetadata(slug: string, locale: ContentLocale): Metadata {
  const { seo, canonicalPath } = getProductPageModel(slug, locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `/${locale}${canonicalPath}`,
      languages: {
        uk: `/uk${canonicalPath}`,
        en: `/en${canonicalPath}`,
        "x-default": `/uk${canonicalPath}`,
      },
    },
    openGraph: {
      type: "website",
      title: seo.title,
      description: seo.description,
      url: `/${locale}${canonicalPath}`,
      locale: locale === "uk" ? "uk_UA" : "en_US",
    },
  };
}
