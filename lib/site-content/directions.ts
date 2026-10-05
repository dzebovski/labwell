import "server-only";

import type { Metadata } from "next";

import { getDictionary } from "../../i18n/dictionaries";
import type { Locale } from "../../i18n/config.ts";
import type { Category } from "../catalog.ts";
import { buildHeaderNavigation } from "../site-navigation.ts";
import { buildDirectionPage, type DirectionPageModel } from "./direction-model.ts";
import { createDirectionSources } from "./direction-sources.ts";
import { loadDirection, loadHome, loadShared } from "./load.ts";
import { contentMetadata } from "./metadata.ts";
import { navPhoto } from "./nav-photo.ts";

/** Server-side entry points for the group and direction pages of the catalog (template D). */

function directionId(category: Category) {
  return (category.section ?? category.group).id;
}

export async function getDirectionPageModel(category: Category, locale: Locale): Promise<DirectionPageModel> {
  const dictionary = await getDictionary(locale);
  const texts = dictionary.directionPage;
  const navItems = buildHeaderNavigation(locale, dictionary.navigation, { photoFor: navPhoto });
  const catalog = navItems.find((item) => item.type === "mega" && item.panel === "catalog");
  const navGroup =
    catalog?.type === "mega" && catalog.panel === "catalog"
      ? catalog.groups.find((group) => group.id === `catalog:${category.group.id}`)
      : undefined;

  return buildDirectionPage({
    category,
    locale,
    content: loadDirection(directionId(category), locale),
    shared: loadShared(locale),
    contactText: loadHome(locale).contact.text,
    labels: {
      pagesInDirection: texts.pagesInDirection,
      pagesInGroup: texts.pagesInGroup,
      directionsInGroup: texts.directionsInGroup,
      modelsInSeries: texts.modelsInSeries,
      contactH2: texts.contactHeading,
      faqH2: texts.faqHeading,
      askPrefill: dictionary.productPage.askPrefill,
    },
    sources: createDirectionSources(locale),
    navGroup,
  });
}

export function getDirectionMetadata(category: Category, locale: Locale): Metadata {
  return contentMetadata(loadDirection(directionId(category), locale).seo, category.path, locale);
}
