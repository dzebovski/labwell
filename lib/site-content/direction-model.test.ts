import assert from "node:assert/strict";
import test, { describe } from "node:test";

import { getCategory, getMenuPages } from "../catalog.ts";
import {
  buildBrandFilter,
  buildDirectionCards,
  buildDirectionPage,
  buildPageCards,
  gridColumns,
  splitKeySpec,
  type DirectionLabels,
  type DirectionSources,
  type PageDetails,
} from "./direction-model.ts";
import { buildDirectionJsonLd } from "./jsonld-directions.ts";
import { loadDirection, loadHome, loadShared } from "./load.ts";
import type { HeaderMegaGroup, HeaderMegaLeaf, HeaderMegaSection } from "../site-navigation.ts";

const labels: DirectionLabels = {
  pagesInDirection: { one: "{n} сторінка у напрямі", few: "{n} сторінки у напрямі", many: "{n} сторінок у напрямі", other: "{n} сторінки у напрямі" },
  pagesInGroup: { one: "{n} сторінка в групі", few: "{n} сторінки в групі", many: "{n} сторінок у групі", other: "{n} сторінки в групі" },
  directionsInGroup: { one: "{n} напрям", few: "{n} напрями", many: "{n} напрямів", other: "{n} напряму" },
  modelsInSeries: { one: "{n} модель у серії", few: "{n} моделі в серії", many: "{n} моделей у серії", other: "{n} моделі в серії" },
};

const facts = (n: number) => Array.from({ length: n }, (_, index) => ({ value: `v${index + 1}`, label: `l${index + 1}` }));

/** Details by slug; a slug that is not listed has no content file. */
function sources(details: Record<string, PageDetails>, photos: string[] = []): DirectionSources {
  return {
    details: (page) => details[page.slug],
    photo: (page) => (photos.includes(page.slug) ? `/products/${page.slug}/main.webp` : undefined),
  };
}

const product = (n = 5, testMenus: string[] = []): PageDetails => ({ kind: "product", keyFacts: facts(n), testMenus });

describe("page cards", () => {
  const cliaPages = getMenuPages("catalog", "equipment", "clia");

  const cliaSources = sources(
    {
      maglumi: { kind: "overview", keyFacts: [], testMenus: ["snibe-clia-test-menu"] },
      "maglumi-m-series": { kind: "group", keyFacts: [], modelCount: 4, testMenus: [] },
      "maglumi-x3": product(5, ["snibe-clia-test-menu"]),
      "maglumi-x6": product(),
      "maglumi-x8": product(),
      "maglumi-x10": product(),
      "snibe-clia-test-menu": { kind: "test-menu", keyFacts: [], testMenus: [], stat: { value: "278", label: "параметрів, за даними Snibe" } },
    },
    ["maglumi-x3", "maglumi-x6", "maglumi-x8", "maglumi-x10"],
  );

  test("products are tiles, a series is a wide card, the overview and the menu are banners", () => {
    const pages = buildPageCards(cliaPages, "uk", cliaSources, labels);

    assert.deepEqual(pages.tiles.map((card) => card.title), ["MAGLUMI X10", "MAGLUMI X8", "MAGLUMI X6", "MAGLUMI X3"]);
    assert.deepEqual(pages.wide.map((card) => card.path), ["/products/maglumi-m-series"]);
    assert.deepEqual(pages.banners.map((banner) => [banner.kind, banner.path]), [
      ["overview", "/products/maglumi"],
      ["test-menu", "/test-menus/snibe-clia-test-menu"],
    ]);
    assert.equal(pages.media, true);
  });

  test("the test menu a product links to becomes a banner even though it lives in another group", () => {
    const withoutMenuPage = cliaPages.filter((page) => page.slug !== "maglumi");
    const pages = buildPageCards(withoutMenuPage, "uk", cliaSources, labels);

    const menu = pages.banners.find((banner) => banner.kind === "test-menu");
    assert.equal(menu?.href, "/uk/test-menus/snibe-clia-test-menu");
    assert.deepEqual(menu?.stat, { value: "278", label: "параметрів, за даними Snibe" });
    assert.equal(menu?.sub, "параметрів, за даними Snibe");
    assert.equal(pages.banners.filter((banner) => banner.kind === "test-menu").length, 1);
  });

  test("cards with photos show three facts, taken from the key facts in their order", () => {
    const pages = buildPageCards(cliaPages, "uk", cliaSources, labels);

    assert.deepEqual(pages.tiles[0].facts, facts(3));
    assert.equal(pages.tiles[0].type, "CLIA-аналізатор");
    assert.equal(pages.tiles[0].photo, "/products/maglumi-x10/main.webp");
  });

  test("a series shows its model count and the key figure of the page", () => {
    const pages = buildPageCards(cliaPages, "uk", cliaSources, labels);

    assert.deepEqual(pages.wide[0].facts, [
      { value: "4", label: "моделі в серії" },
      { value: "до 180", label: "тестів/год" },
    ]);
  });

  test("lines without photos get cards without a photo zone and two facts", () => {
    const qc = getMenuPages("catalog", "qc-software", "qc");
    const lines = Object.fromEntries(qc.map((page) => [page.slug, product(3)]));
    const pages = buildPageCards(qc, "uk", sources(lines), labels);

    assert.equal(pages.media, false);
    assert.equal(pages.tiles.length, 6);
    assert.ok(pages.tiles.every((card) => card.facts.length === 2));
  });

  test("a tile without facts keeps the product type", () => {
    const pages = buildPageCards(getMenuPages("catalog", "equipment", "hemostasis").concat(cliaPages.slice(2, 3)), "uk", sources({}), labels);

    assert.ok(pages.tiles.every((card) => card.facts.length === 0 && card.type.length > 0));
  });

  test("facts with an editorial placeholder are not shown", () => {
    const pages = buildPageCards(
      cliaPages.slice(2, 4),
      "uk",
      sources({ "maglumi-x10": { kind: "product", keyFacts: [{ value: "[ФАКТ]", label: "x" }, { value: "50", label: "позицій" }], testMenus: [] }, "maglumi-x8": product() }),
      labels,
    );

    assert.deepEqual(pages.tiles.find((card) => card.title === "MAGLUMI X10")?.facts, [{ value: "50", label: "позицій" }]);
  });

  test("a direction with one page shows one wide card", () => {
    const hemostasis = getMenuPages("catalog", "equipment", "hemostasis");
    const pages = buildPageCards(hemostasis, "uk", sources({ "hemolumi-h6": product(4) }, ["hemolumi-h6"]), labels);

    assert.equal(pages.tiles.length, 0);
    assert.equal(pages.wide.length, 1);
    assert.equal(pages.wide[0].facts.length, 3);
    assert.equal(pages.wide[0].kind, "product");
  });

  test("a page that is going to be redirected is not listed", () => {
    const hba1c = getMenuPages("catalog", "equipment", "hba1c");
    assert.ok(hba1c.some((page) => page.slug === "d-10"));

    const pages = buildPageCards(hba1c, "uk", sources({}), labels);
    assert.ok(!pages.tiles.some((card) => card.path === "/products/d-10"));
  });

  test("grid columns: one or two tiles fill the row, five and six keep three columns", () => {
    assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8].map(gridColumns), [1, 2, 3, 4, 3, 3, 4, 4]);
  });
});

describe("brand filter", () => {
  const snibe = { id: "snibe", name: "Snibe" };
  const bioRad = { id: "bio-rad", name: "Bio-Rad" };

  test("two brands give a filter with the number of items of each", () => {
    assert.deepEqual(buildBrandFilter([[snibe], [snibe], [bioRad], [snibe, bioRad]]), [
      { ...snibe, count: 3 },
      { ...bioRad, count: 2 },
    ]);
  });

  test("one brand needs no filter", () => {
    assert.equal(buildBrandFilter([[snibe], [snibe]]), undefined);
    assert.equal(buildBrandFilter([]), undefined);
  });
});

describe("key figure of a series", () => {
  test("splits the number from the unit", () => {
    assert.deepEqual(splitKeySpec("до 180 тестів/год"), { value: "до 180", label: "тестів/год" });
    assert.deepEqual(splitKeySpec("до 1 000 тестів/год"), { value: "до 1 000", label: "тестів/год" });
    assert.deepEqual(splitKeySpec("up to 180 tests/h"), { value: "up to 180", label: "tests/h" });
  });

  test("a text without a unit stays one value", () => {
    assert.deepEqual(splitKeySpec("RFID"), { value: "RFID" });
    assert.deepEqual(splitKeySpec("180"), { value: "180" });
  });
});

describe("direction cards of a group", () => {
  const leaf = (brandId: string, photo?: string): HeaderMegaLeaf => ({
    id: brandId,
    label: "x",
    href: "/uk/x",
    brandId,
    brand: brandId === "snibe" ? "Snibe" : "Bio-Rad",
    itemType: "",
    meta: "",
    description: "",
    photo,
  });
  const section = (id: string, links: HeaderMegaLeaf[]): HeaderMegaSection => ({
    id: `catalog:equipment:${id}`,
    label: id.toUpperCase(),
    href: `/uk/products/equipment/${id}`,
    count: links.length,
    countLabel: `${links.length} позиції`,
    links,
    results: { total: links.length, columns: [] },
  });

  test("come from the navigation sections: label, counter, first photo, brands; 'other' is skipped", () => {
    const group = {
      id: "catalog:equipment",
      label: "Обладнання",
      href: "/uk/products/equipment",
      count: 3,
      countLabel: "3",
      links: [],
      sections: [section("a", [leaf("snibe"), leaf("snibe", "/p.webp"), leaf("bio-rad")]), section("other", [leaf("snibe")])],
    } satisfies HeaderMegaGroup;

    const [card, ...rest] = buildDirectionCards(group);

    assert.equal(rest.length, 0);
    assert.equal(card.title, "A");
    assert.equal(card.countLabel, "3 позиції");
    assert.equal(card.photo, "/p.webp");
    assert.deepEqual(card.brands.map((brand) => brand.id), ["snibe", "bio-rad"]);
  });
});

describe("the whole page", () => {
  const shared = loadShared("uk");
  const pageLabels = { ...labels, contactH2: "Отримати консультацію", faqH2: "Питання й відповіді", askPrefill: "Цікавить {name}. " };

  function build(group: string, section: string | undefined, details: Record<string, PageDetails>) {
    const category = getCategory("catalog", group, section)!;
    return buildDirectionPage({
      category,
      locale: "uk",
      content: loadDirection(section ?? group, "uk"),
      shared,
      contactText: loadHome("uk").contact.text,
      labels: pageLabels,
      sources: sources(details),
    });
  }

  test("a direction page carries the text of content/directions, breadcrumbs and the shared blocks", () => {
    const page = build("equipment", "hemostasis", { "hemolumi-h6": product(3) });

    assert.equal(page.h1, loadDirection("hemostasis", "uk").h1);
    assert.deepEqual(page.trail.items.map((crumb) => crumb.label), ["Головна", "Каталог продукції", "Лабораторне обладнання"]);
    assert.equal(page.trail.current.label, "Гемостаз");
    assert.equal(page.countLabel, "1 сторінка у напрямі");
    assert.equal(page.labwell.compact, true);
    assert.equal(page.labwell.items.length, shared.labwell.items.length);
    assert.equal(page.contact.messagePrefill, "Цікавить Гемостаз. ");
    assert.equal(page.contact.text, loadHome("uk").contact.text);
    assert.equal(page.filter, undefined);
    assert.equal(page.faq, undefined);
  });

  test("a group page lists the directions of its navigation data", () => {
    const category = getCategory("catalog", "equipment")!;
    const navGroup = {
      id: "catalog:equipment",
      label: "x",
      href: "/uk/products/equipment",
      count: 1,
      countLabel: "1",
      links: [],
      sections: [
        {
          id: "catalog:equipment:clia",
          label: "Імуноаналіз",
          href: "/uk/products/equipment/clia",
          count: 1,
          countLabel: "1 позиція",
          links: [{ id: "a", label: "a", href: "/uk/a", brandId: "snibe", brand: "Snibe", itemType: "", meta: "", description: "" }],
          results: { total: 1, columns: [] },
        },
        {
          id: "catalog:equipment:hba1c",
          label: "Діабет",
          href: "/uk/products/equipment/hba1c",
          count: 1,
          countLabel: "1 позиція",
          links: [{ id: "b", label: "b", href: "/uk/b", brandId: "bio-rad", brand: "Bio-Rad", itemType: "", meta: "", description: "" }],
          results: { total: 1, columns: [] },
        },
      ],
    } satisfies HeaderMegaGroup;

    const page = buildDirectionPage({
      category,
      locale: "uk",
      content: loadDirection("equipment", "uk"),
      shared,
      contactText: "x",
      labels: pageLabels,
      sources: sources({}),
      navGroup,
    });

    assert.equal(page.directions.length, 2);
    assert.equal(page.countLabel, "2 напрями");
    assert.deepEqual(page.filter?.map((option) => [option.id, option.count]), [["snibe", 1], ["bio-rad", 1]]);
    assert.equal(page.pages, undefined);
  });

  test("structured data: breadcrumbs and a collection with the list of its cards", () => {
    const page = build("equipment", "hemostasis", { "hemolumi-h6": product(3) });
    const data = buildDirectionJsonLd({ page, locale: "uk", siteUrl: "https://example.test" });

    assert.deepEqual(data.map((item) => item["@type"]), ["BreadcrumbList", "CollectionPage"]);
    const collection = data[1] as { url: string; mainEntity: { itemListElement: Array<{ name: string; url: string; position: number }> } };
    assert.equal(collection.url, "https://example.test/uk/products/equipment/hemostasis");
    assert.deepEqual(collection.mainEntity.itemListElement, [
      { "@type": "ListItem", position: 1, name: "Hemolumi H6", url: "https://example.test/uk/products/hemolumi-h6" },
    ]);
  });
});
