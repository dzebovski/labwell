/**
 * What the home page renders. Texts come from `content/home/`, links, counters and photos from the navigation
 * data (the same source as the header menu and the footer), so nothing here is typed in twice. Pure function.
 */
import type { Locale } from "../../i18n/config.ts";
import type { HeaderMegaGroup, HeaderNavigationItem } from "../site-navigation.ts";
import { buildDirectionCards, type CardBrand, type DirectionCard } from "./direction-model.ts";
import { buildContact, link, type ContactModel, type ProductPageModel } from "./model.ts";
import type { HomeContent } from "./schema-directions.ts";
import type { SharedContent } from "./schema.ts";

export type HomeStartCard = {
  id: "products" | "clinical-directions" | "brands";
  title: string;
  href: string;
  /** Short names inside the card: product types, directions or brands. */
  chips: string[];
};

export type HomeBrandCard = {
  id: string;
  brand: CardBrand;
  description: string;
  href: string;
  linkLabel: string;
};

export type HomePhoto = { src: string; alt: string };

export type HomeModel = {
  seo: HomeContent["seo"];
  h1: string;
  lead: string;
  brands: CardBrand[];
  photos: HomePhoto[];
  start: HomeStartCard[];
  directions: { title: string; href: string; cards: DirectionCard[] };
  brandCards: HomeBrandCard[];
  labwell: NonNullable<ProductPageModel["labwell"]>;
  contact: ContactModel;
};

export type HomeLabels = {
  /** "{name} by direction": the heading over the equipment directions. */
  directionsH2: string;
  contactH2: string;
};

/** The catalog group that the home page shows by direction. */
const FEATURED_GROUP = "catalog:equipment";

export function buildHome(input: {
  locale: Locale;
  content: HomeContent;
  shared: SharedContent;
  navItems: readonly HeaderNavigationItem[];
  labels: HomeLabels;
  photos: HomePhoto[];
}): HomeModel {
  const { locale, content, shared, navItems, labels } = input;

  const catalog = navItems.find((item) => item.type === "mega" && item.panel === "catalog");
  const clinical = navItems.find((item) => item.type === "mega" && item.panel === "clinical");
  const brandsItem = navItems.find((item) => item.type === "mega" && item.panel === "brands");
  if (catalog?.type !== "mega" || catalog.panel !== "catalog") throw new Error("Navigation has no catalog menu");
  if (clinical?.type !== "mega" || clinical.panel !== "clinical") throw new Error("Navigation has no clinical directions menu");
  if (brandsItem?.type !== "mega" || brandsItem.panel !== "brands") throw new Error("Navigation has no brands menu");

  const featured: HeaderMegaGroup | undefined = catalog.groups.find((group) => group.id === FEATURED_GROUP);
  if (!featured) throw new Error(`Navigation has no ${FEATURED_GROUP} group`);

  const brandCards = brandsItem.brands.map((brand): HomeBrandCard => {
    const description = (content.brands as Record<string, { description: string } | undefined>)[brand.id]?.description;
    if (!description) throw new Error(`content/home/${locale}.json has no description for the brand "${brand.id}"`);
    return {
      id: brand.id,
      brand: { id: brand.id, name: brand.label, logo: brand.logo },
      description,
      href: brand.allHref,
      linkLabel: brand.allLabel,
    };
  });

  return {
    seo: content.seo,
    h1: content.hero.h1,
    lead: content.hero.lead,
    brands: brandCards.map((card) => card.brand),
    photos: input.photos,
    start: [
      { id: "products", title: catalog.label, href: catalog.href, chips: catalog.groups.map((group) => group.label) },
      { id: "clinical-directions", title: clinical.label, href: clinical.href, chips: clinical.groups.map((group) => group.label) },
      { id: "brands", title: brandsItem.label, href: brandsItem.href, chips: brandCards.map((card) => card.brand.name) },
    ],
    directions: {
      title: labels.directionsH2.replace("{name}", featured.label),
      href: catalog.href,
      cards: buildDirectionCards(featured),
    },
    brandCards,
    labwell: {
      h2: shared.labwell.h2,
      link: link(shared.labwell.link, locale),
      compact: false,
      items: content.services.items.map((item) => ({ icon: item.id, title: item.title, text: item.text })),
    },
    contact: buildContact({ show: true, h2: labels.contactH2, text: content.contact.text }, shared)!,
  };
}
