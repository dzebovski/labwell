import "server-only";

import type { Metadata } from "next";

import { getDictionary } from "../../i18n/dictionaries";
import type { Locale } from "../../i18n/config.ts";
import { getProduct } from "../catalog.ts";
import { buildHeaderNavigation } from "../site-navigation.ts";
import { buildHome, type HomeModel, type HomePhoto } from "./home-model.ts";
import { loadHome, loadShared } from "./load.ts";
import { contentMetadata } from "./metadata.ts";
import { navPhoto } from "./nav-photo.ts";
import { mainPhoto } from "./photos.ts";

/** Products whose photos make up the hero picture: one analyzer per brand and direction, first with a photo wins. */
const HERO_PRODUCTS = ["maglumi-x8", "d-100", "biossays-c10", "ih-1000"] as const;

function heroPhotos(locale: Locale): HomePhoto[] {
  return HERO_PRODUCTS.flatMap((slug) => {
    const page = getProduct(slug);
    const src = mainPhoto(slug);
    return page && src ? [{ src, alt: `${page.brand.name} ${page.navLabel[locale]}` }] : [];
  });
}

export async function getHomeModel(locale: Locale): Promise<HomeModel> {
  const dictionary = await getDictionary(locale);
  const texts = dictionary.homePage;
  return buildHome({
    locale,
    content: loadHome(locale),
    shared: loadShared(locale),
    navItems: buildHeaderNavigation(locale, dictionary.navigation, { photoFor: navPhoto }),
    labels: { directionsH2: texts.directionsHeading, contactH2: texts.contactHeading },
    photos: heroPhotos(locale),
  });
}

export function getHomeMetadata(locale: Locale): Metadata {
  return contentMetadata(loadHome(locale).seo, "/", locale);
}
