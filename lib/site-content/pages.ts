import "server-only";

import type { Metadata } from "next";

import { buildGroupPage, type GroupPageModel } from "./group-model.ts";
import { hasGroupContent, loadGroup, loadOverview, loadShared, loadTestMenu, loadTests, type ContentLocale } from "./load.ts";
import { contentMetadata } from "./metadata.ts";
import { buildTestMenuPage, type TestMenuPageModel } from "./menu-model.ts";
import { buildOverviewPage, type OverviewPageModel } from "./overview-model.ts";
import { mainPhoto } from "./photos.ts";

/** Server-side entry points for the group (G), test menu (C1) and overview (C2) pages. */

export function getGroupPageModel(slug: string, locale: ContentLocale): GroupPageModel {
  return buildGroupPage({ group: loadGroup(slug, locale), shared: loadShared(locale), locale, photo: mainPhoto });
}

export function getGroupMetadata(slug: string, locale: ContentLocale): Metadata {
  const { seo, canonicalPath } = getGroupPageModel(slug, locale);
  return contentMetadata(seo, canonicalPath, locale);
}

export function getOverviewPageModel(slug: string, locale: ContentLocale): OverviewPageModel {
  return buildOverviewPage({
    overview: loadOverview(slug, locale),
    shared: loadShared(locale),
    locale,
    photo: mainPhoto,
    // A card that points at a group has no photo of its own: show the group's first item.
    relatedPhoto: (href) => {
      const slugInHref = /^\/products\/([^/#]+)$/.exec(href)?.[1];
      if (!slugInHref) return undefined;
      const own = mainPhoto(slugInHref);
      if (own) return own;
      if (!hasGroupContent(slugInHref)) return undefined;
      const items = loadGroup(slugInHref, locale).G3_items;
      return items.show ? mainPhoto(items.items[0].productSlug) : undefined;
    },
  });
}

export function getOverviewMetadata(slug: string, locale: ContentLocale): Metadata {
  const { seo, canonicalPath } = getOverviewPageModel(slug, locale);
  return contentMetadata(seo, canonicalPath, locale);
}

export function getTestMenuPageModel(slug: string, locale: ContentLocale): TestMenuPageModel {
  return buildTestMenuPage({
    menu: loadTestMenu(slug, locale),
    tests: loadTests(slug),
    shared: loadShared(locale),
    locale,
  });
}

export function getTestMenuMetadata(slug: string, locale: ContentLocale): Metadata {
  const { seo, canonicalPath } = getTestMenuPageModel(slug, locale);
  return contentMetadata(seo, canonicalPath, locale);
}
