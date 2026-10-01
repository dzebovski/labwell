import "server-only";

import type { Metadata } from "next";

import { loadProduct, loadShared, type ContentLocale } from "./load.ts";
import { buildProductPage, type ProductPageModel } from "./model.ts";
import { contentMetadata } from "./metadata.ts";
import { mainPhoto } from "./photos.ts";

export function getProductPageModel(slug: string, locale: ContentLocale): ProductPageModel {
  return buildProductPage({
    product: loadProduct(slug, locale),
    shared: loadShared(locale),
    locale,
    imageSrc: mainPhoto(slug),
  });
}

/** Metadata of a template T page; see `contentMetadata`. */
export function getProductMetadata(slug: string, locale: ContentLocale): Metadata {
  const { seo, canonicalPath } = getProductPageModel(slug, locale);
  return contentMetadata(seo, canonicalPath, locale);
}
