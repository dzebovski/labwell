import assert from "node:assert/strict";
import test from "node:test";

import { shared } from "./fixtures.ts";
import { group, overview, testMenu, tests } from "./fixtures-pages.ts";
import { buildGroupPage } from "./group-model.ts";
import { buildGroupJsonLd, buildOverviewJsonLd, buildTestMenuJsonLd } from "./jsonld-pages.ts";
import { buildTestMenuPage } from "./menu-model.ts";
import { buildOverviewPage } from "./overview-model.ts";

const photo = (slug: string) => (slug === "demo-b" ? undefined : `/products/${slug}/main.webp`);

function buildGroup(overrides: Parameters<typeof group>[0] = {}, sharedOverrides = {}) {
  return buildGroupPage({ group: group(overrides), shared: shared(sharedOverrides), locale: "uk", photo });
}

test("group: series hero has chips and tiles that lead to the anchors; the H1 splits at the series name", () => {
  const page = buildGroup();

  assert.deepEqual(page.hero.chips?.items.map((chip) => chip.href), ["#demo-a", "#demo-b"]);
  assert.equal(page.hero.media.type, "tiles");
  assert.equal(page.hero.h1Accent, "Demo Series");
  assert.equal(page.hero.secondaryCta?.href, "#compare");
  assert.equal(page.compare?.columns[0].href, "#demo-a");
  assert.equal(page.compare?.columns[1].imageSrc, undefined);
  assert.equal(page.items?.items[0].position, 1);
  assert.equal(page.items?.items[1].total, 2);
});

test("group: a CTA that points at a block that is not rendered is dropped", () => {
  const page = buildGroup({ G2_compare: { show: false }, T12_contact: { show: false } });

  assert.equal(page.compare, undefined);
  assert.equal(page.hero.secondaryCta, undefined);
  assert.equal(page.hero.primaryCta, undefined);
  assert.equal(page.items?.items[0].cta, undefined);
  assert.equal(page.items?.items[0].backLink, undefined);
});

test("group: the compare table drops all-missing rows; a hidden compare block is not in the model", () => {
  const withRows = group();
  if (withRows.G2_compare.show) withRows.G2_compare.rows.push({ label: "Пусто", values: ["н/д", "н/д"] });
  const page = buildGroupPage({ group: withRows, shared: shared(), locale: "uk", photo });

  assert.deepEqual(page.compare?.rows.map((row) => row.label), ["Зразки", "Кювети"]);
  assert.deepEqual(page.compare?.rows[0].cells.map((cell) => cell.ratio), [0.4, 1]);
  assert.equal(page.compare?.rows[1].cells[0].missing, true);
});

test("group: lines have no tiles; the hero shows the photos of the lines, or one placeholder when none exists", () => {
  const lines = group({
    kind: "group-lines",
    G1_hero: {
      breadcrumbs: ["Головна", "Продукція", "Реагенти", "Реагенти Demo"],
      eyebrow: "Лінійки",
      h1: "Реагенти Demo",
      lead: "Лід.",
      keyFacts: [{ value: "3", label: "лінійки" }],
      image: { alt: "Реагенти" },
      primaryCta: { label: "Консультація", href: "#contact" },
      secondaryCta: { label: "Переглянути", href: "#lines" },
    },
    G2_compare: { show: false },
    G2_sections: {
      show: true,
      h2: "Лінійки",
      items: [
        { anchor: "demo-a", title: "Demo A", text: "Опис A.", href: "#demo-a" },
        { anchor: "demo-b", title: "Demo B", text: "Опис B.", href: "#demo-b" },
      ],
    },
  });

  const withPhotos = buildGroupPage({ group: lines, shared: shared(), locale: "uk", photo });
  assert.equal(withPhotos.hero.media.type, "collage");
  assert.equal(withPhotos.hero.media.type === "collage" && withPhotos.hero.media.items.length, 1);
  assert.equal(withPhotos.hero.chips, undefined);
  assert.equal(withPhotos.hero.secondaryCta?.href, "#lines");
  assert.deepEqual(withPhotos.sections?.items.map((item) => item.eyebrow), ["Для лабораторій", "Для лабораторій"]);

  const noPhotos = buildGroupPage({ group: lines, shared: shared(), locale: "uk", photo: () => undefined });
  assert.deepEqual(noPhotos.hero.media, { type: "placeholder", alt: "Реагенти" });
});

test("group: order rows keep the pack column only when a size is known; placeholders become empty", () => {
  const withOrdering = group();
  if (withOrdering.G3_items.show) {
    withOrdering.G3_items.items[0].ordering = {
      show: true,
      h3: "Позиції Demo A",
      columns: ["Каталожний номер", "Назва", "Фасування"],
      rows: [
        { catalogNumber: "007140", name: "ID-Card", packSize: "72 tests" },
        { catalogNumber: "007141", name: "ID-Card 2", packSize: "[ФАСУВАННЯ НЕ ВКАЗАНО]" },
      ],
      footnote: "Вибрані позиції.",
    };
    withOrdering.G3_items.items[1].ordering = {
      show: true,
      h3: "Позиції Demo B",
      columns: ["Каталожний номер", "Назва", "Фасування"],
      rows: [{ catalogNumber: "1", name: "X", packSize: "[ФАСУВАННЯ НЕ ВКАЗАНО]" }],
    };
  }
  const page = buildGroupPage({ group: withOrdering, shared: shared(), locale: "uk", photo });
  const [first, second] = page.items!.items;

  assert.equal(first.ordering?.table.columns.length, 3);
  assert.equal(first.ordering?.table.rows[1].packSize, undefined);
  assert.equal(second.ordering?.table.columns.length, 2);
});

test("group JSON-LD: BreadcrumbList, ItemList with a Product per item, FAQPage only with questions", () => {
  const page = buildGroup({ T10_faq: { show: true, h2: "Питання", items: [{ q: "Q?", a: "A." }] } });
  const data = buildGroupJsonLd({ page, locale: "uk", siteUrl: "https://labwell.com.ua" });

  assert.deepEqual(data.map((item) => item["@type"]), ["BreadcrumbList", "ItemList", "FAQPage"]);
  const list = data[1] as { itemListElement: Array<{ item: { "@type": string; url: string; image?: string } }> };
  assert.equal(list.itemListElement.length, 2);
  assert.equal(list.itemListElement[0].item["@type"], "Product");
  assert.equal(list.itemListElement[0].item.url, "https://labwell.com.ua/uk/products/demo-series#demo-a");
  assert.equal(list.itemListElement[0].item.image, "https://labwell.com.ua/products/demo-a/main.webp");
  assert.equal(list.itemListElement[1].item.image, undefined);

  assert.deepEqual(
    buildGroupJsonLd({ page: buildGroup(), locale: "uk", siteUrl: "https://labwell.com.ua" }).map((item) => item["@type"]),
    ["BreadcrumbList", "ItemList"],
  );
});

test("test menu: groups are named in the page language; C1.4 stays out while show is false", () => {
  const build = (locale: "uk" | "en", overrides: Parameters<typeof testMenu>[0] = {}) =>
    buildTestMenuPage({ menu: testMenu(overrides), tests: tests(), shared: shared(), locale });

  assert.deepEqual(build("uk").groups.map((g) => g.name), ["Щитоподібна залоза", "Аутоімунні захворювання"]);
  assert.deepEqual(build("en").groups.map((g) => g.name), ["Thyroid", "Autoimmune"]);
  assert.equal(build("uk").analyzers, undefined);
  assert.equal(build("uk").search?.messagePrefill, "Шукаю тест: ");
  assert.equal(build("uk").hero.h1Accent, "Меню Demo");

  const shown = build("uk", {
    C1_analyzers: { show: true, eyebrow: "Аналізатори", title: "MAGLUMI X", links: [{ label: "MAGLUMI X", href: "/products/not-built-yet" }] },
  });
  assert.equal(shown.analyzers, undefined, "a link to a page that does not exist is not rendered");
});

test("test menu: without C1_search the list is shown without controls", () => {
  const page = buildTestMenuPage({ menu: testMenu({ C1_search: { show: false } }), tests: tests(), shared: shared(), locale: "uk" });

  assert.equal(page.search, undefined);
  assert.equal(page.groups.length, 2);
});

test("test menu JSON-LD: BreadcrumbList and an ItemList of the groups", () => {
  const page = buildTestMenuPage({ menu: testMenu(), tests: tests(), shared: shared(), locale: "uk" });
  const data = buildTestMenuJsonLd({ page, locale: "uk", siteUrl: "https://labwell.com.ua" });

  assert.deepEqual(data.map((item) => item["@type"]), ["BreadcrumbList", "ItemList"]);
  const list = data[1] as { numberOfItems: number; itemListElement: Array<{ url: string }> };
  assert.equal(list.numberOfItems, 2);
  assert.equal(list.itemListElement[0].url, "https://labwell.com.ua/uk/test-menus/demo-menu#group-thyroid");
});

test("overview: compare columns link to the model pages that exist; cards without a page lose the link", () => {
  const page = buildOverviewPage({ overview: overview(), shared: shared(), locale: "en", photo });

  assert.equal(page.hero.tiles[0].title, "Demo X1");
  assert.equal(page.compare?.columns[0].href, undefined, "demo-x1 has no page in this test content");
  assert.deepEqual(page.compare?.rows[0].cells.map((cell) => cell.text), ["до 200", "до 450"]);
  assert.deepEqual(page.compare?.rows[0].cells.map((cell) => cell.ratio), [200 / 450, 1]);
  assert.equal(page.cards?.related[0].bigNumber?.value, "278");
  assert.equal(page.faq?.items.length, 1);
});

test("overview JSON-LD: BreadcrumbList, ItemList of the models, FAQPage", () => {
  const page = buildOverviewPage({ overview: overview(), shared: shared(), locale: "uk", photo });
  const data = buildOverviewJsonLd({ page, locale: "uk", siteUrl: "https://labwell.com.ua" });

  assert.deepEqual(data.map((item) => item["@type"]), ["BreadcrumbList", "ItemList", "FAQPage"]);
});
