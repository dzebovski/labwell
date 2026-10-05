import "server-only";

import type { Locale } from "../../i18n/config.ts";
import type { ContentPage } from "../catalog.ts";
import type { DirectionSources, PageDetails } from "./direction-model.ts";
import { hasTestMenuContent, loadGroup, loadOverview, loadProduct, loadTestMenu, productsRouteKind } from "./load.ts";
import { navPhoto } from "./nav-photo.ts";

/** `/test-menus/{slug}` → slug, when that menu exists in `content/`. */
function menuSlug(href: string): string[] {
  const slug = /^\/test-menus\/([^/#]+)$/.exec(href)?.[1];
  return slug && hasTestMenuContent(slug) ? [slug] : [];
}

/** Reads the content file behind a catalog page: its key facts and the menus it links to. */
export function createDirectionSources(locale: Locale): DirectionSources {
  return {
    photo: navPhoto,
    details(page: ContentPage): PageDetails | undefined {
      if (page.kind !== "product") return undefined;

      const menu = /^\/test-menus\/([^/]+)$/.exec(page.path)?.[1];
      if (menu) {
        if (!hasTestMenuContent(menu)) return undefined;
        const hero = loadTestMenu(menu, locale).C1_hero;
        return { kind: "test-menu", keyFacts: [], testMenus: [], stat: hero.show ? hero.stats[0] : undefined };
      }

      switch (productsRouteKind(page.slug)) {
        case "product": {
          const product = loadProduct(page.slug, locale);
          const related = product.T8_related;
          const href = related.show ? related.testMenu?.cta?.href : undefined;
          return { kind: "product", keyFacts: product.T2_hero.keyFacts, testMenus: href ? menuSlug(href) : [] };
        }
        case "group": {
          const hero = loadGroup(page.slug, locale).G1_hero;
          return {
            kind: "group",
            keyFacts: hero.keyFacts ?? [],
            modelCount: hero.models?.length,
            testMenus: [],
          };
        }
        case "overview": {
          const cards = loadOverview(page.slug, locale).C2_cards;
          const related = cards.show ? (cards.related ?? []) : [];
          return {
            kind: "overview",
            keyFacts: [],
            testMenus: related.filter((item) => item.kind === "test-menu").flatMap((item) => menuSlug(item.href)),
          };
        }
        default:
          return undefined;
      }
    },
  };
}
