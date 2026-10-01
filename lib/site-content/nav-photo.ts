import "server-only";

import type { ContentPage } from "../catalog.ts";
import { hasGroupContent, hasOverviewContent, loadGroup, loadOverview } from "./load.ts";
import { mainPhoto } from "./photos.ts";

/**
 * Preview photo of a catalog page for the mega menu: its own photo, else the photo of the first
 * model that a group or overview page presents. Undefined while the content has no photo.
 */
export function navPhoto(page: ContentPage): string | undefined {
  if (page.kind !== "product") return undefined;
  const own = mainPhoto(page.slug);
  if (own) return own;

  let models: string[] = [];
  if (hasGroupContent(page.slug)) {
    const group = loadGroup(page.slug, "uk");
    models = group.G3_items.show ? group.G3_items.items.map((item) => item.productSlug) : [];
  } else if (hasOverviewContent(page.slug)) {
    const hero = loadOverview(page.slug, "uk").C2_hero;
    models = hero.show ? hero.models.map((model) => model.productSlug) : [];
  }
  for (const slug of models) {
    const photo = mainPhoto(slug);
    if (photo) return photo;
  }
  return undefined;
}
