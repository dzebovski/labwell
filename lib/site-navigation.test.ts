import assert from "node:assert/strict";
import test from "node:test";

import { brands } from "../content/brands.ts";
import ukDictionary from "../i18n/dictionaries/uk.json" with { type: "json" };
import enDictionary from "../i18n/dictionaries/en.json" with { type: "json" };
import {
  brandProductsPath,
  contentPages,
  findCatalogProblems,
  getBrandProductBlocks,
  getBrandProducts,
  getCategory,
  getPageByPath,
  type ContentPage,
} from "./catalog.ts";
import { isRedirectedPath, legacyRedirects, pendingRedirects } from "./legacy-redirects.ts";
import {
  MAX_COLUMN_LINKS,
  buildHeaderNavigation,
  buildResultColumns,
  formatCount,
  type HeaderMegaGroup,
  type HeaderMegaLeaf,
  type HeaderNavigationItem,
} from "./site-navigation.ts";

const uk = ukDictionary.navigation;
const en = enDictionary.navigation;

function megaMenu(nav: HeaderNavigationItem[], id: "products" | "clinical-directions") {
  const item = nav.find((entry) => entry.id === id);
  assert.ok(item?.type === "mega" && item.panel !== "brands");
  return item.groups;
}

function brandsPanel(nav: HeaderNavigationItem[]) {
  const item = nav.find((entry) => entry.id === "brands");
  assert.ok(item?.type === "mega" && item.panel === "brands");
  return item.brands;
}

/** Every page of a group, whether it has sections or not. */
function groupPaths(group: HeaderMegaGroup, locale = "uk") {
  return group.links.map((link) => link.href.replace(`/${locale}`, ""));
}

function leaf(index: number, brandId = "snibe", brand = "Snibe"): HeaderMegaLeaf {
  return {
    id: `${brandId}-${index}`,
    label: `Item ${index}`,
    href: `/uk/products/item-${index}`,
    brandId,
    brand,
    itemType: "",
    meta: "",
    description: "",
  };
}

test("counts use the plural form of the locale", () => {
  const forms = (n: number) => formatCount(n, "uk", uk.itemCount);
  assert.equal(forms(1), "1 позиція");
  assert.equal(forms(2), "2 позиції");
  assert.equal(forms(5), "5 позицій");
  assert.equal(forms(11), "11 позицій");
  assert.equal(forms(21), "21 позиція");
  assert.equal(forms(22), "22 позиції");
  assert.equal(formatCount(1, "en", en.itemCount), "1 item");
  assert.equal(formatCount(2, "en", en.itemCount), "2 items");
  assert.equal(formatCount(21, "en", en.itemCount), "21 items");
});

test("the product catalog is product type → direction → pages", () => {
  const groups = megaMenu(buildHeaderNavigation("uk", uk), "products");
  const tree = groups.map((group) => ({
    group: group.id.replace("catalog:", ""),
    label: group.label,
    sections: group.sections.map((section) => ({
      id: section.id.split(":").pop(),
      label: section.label,
      pages: section.links.map((link) => link.href.replace("/uk/products/", "")),
    })),
    pages: group.sections.length === 0 ? groupPaths(group).map((path) => path.replace("/products/", "").replace("/test-menus/", "test-menus/")) : undefined,
  }));

  assert.deepEqual(tree, [
    {
      group: "equipment",
      label: "Лабораторне обладнання",
      sections: [
        { id: "clia", label: "Імуноаналіз", pages: ["maglumi", "maglumi-m-series", "maglumi-x10", "maglumi-x8", "maglumi-x6", "maglumi-x3"] },
        { id: "biochemistry", label: "Біохімія та електроліти", pages: ["biossays-c10", "biossays-240-plus", "biossays-e6-plus"] },
        { id: "hemostasis", label: "Гемостаз", pages: ["hemolumi-h6"] },
        { id: "molecular", label: "Молекулярна діагностика", pages: ["molecision-mp", "molecision-s6", "molecision-r8"] },
        { id: "automation", label: "Автоматизація лабораторії", pages: ["satlars"] },
        { id: "hba1c", label: "Діабет і гемоглобінопатії", pages: ["d-100", "variant-ii", "variant-ii-turbo", "variant-nbs-newborn-screening-system"] },
        { id: "blood-group", label: "Імуногематологія", pages: ["ih-500-next-system", "ih-1000", "id-card-equipment"] },
        { id: "autoimmune-infectious", label: "Автоімунні та інфекційні", pages: ["bioplex-2200-system", "phd-lx-system", "geenius-system", "evolis-system"] },
      ],
      pages: undefined,
    },
    {
      group: "reagents",
      label: "Реагенти й тести",
      sections: [],
      pages: [
        "immunohematology-reagents",
        "culture-media",
        "test-menus/snibe-clia-test-menu",
        "test-menus/snibe-biochemistry-test-menu",
      ],
    },
    {
      group: "qc-software",
      label: "Контроль якості та ПЗ",
      sections: [
        {
          id: "qc",
          label: "Контроль якості",
          pages: ["inteliq", "immunoassay-controls", "infectious-disease-controls", "liquichek-serum-indices", "chemistry-controls", "molecular-controls"],
        },
        { id: "software", label: "Програмне забезпечення", pages: ["bio-rad-software"] },
      ],
      pages: undefined,
    },
  ]);
});

test("no menu links to an address that redirects", () => {
  for (const locale of ["uk", "en"] as const) {
    const dictionary = locale === "uk" ? uk : en;
    const nav = buildHeaderNavigation(locale, dictionary);
    const hrefs = [
      ...(["products", "clinical-directions"] as const).flatMap((id) =>
        megaMenu(nav, id).flatMap((group) => [
          group.href,
          ...group.links.map((link) => link.href),
          ...group.sections.flatMap((section) => [section.href, ...section.results.columns.flatMap((column) => [...column.links.map((link) => link.href), ...(column.more ? [column.more.href] : [])])]),
        ]),
      ),
      ...brandsPanel(nav).flatMap((brand) => [brand.allHref, ...brand.lines.map((line) => line.href), ...(brand.about ? [brand.about.href] : [])]),
      ...nav.filter((item) => item.type === "link").map((item) => item.href),
    ];
    assert.ok(hrefs.length > 50);
    for (const href of hrefs) {
      const path = href.replace(`/${locale}`, "") || "/";
      assert.equal(isRedirectedPath(path), false, href);
      assert.equal(path in legacyRedirects, false, href);
    }
  }
  // D-10 still answers 200, but it is going to redirect: it must not be linked either.
  assert.deepEqual(pendingRedirects, ["/products/d-10"]);
  const hrefs = megaMenu(buildHeaderNavigation("uk", uk), "clinical-directions").flatMap((group) => groupPaths(group));
  assert.equal(hrefs.includes("/products/d-10"), false);
});

test("every menu link points at a page or a listing that exists", () => {
  const nav = buildHeaderNavigation("uk", uk);
  const brandListings = new Set(brands.map((brand) => brandProductsPath(brand.id)));
  const exists = (path: string) =>
    Boolean(
      getPageByPath(path) ||
        brandListings.has(path) ||
        ["/products", "/clinical-directions", "/brands", "/services", "/about", "/contacts"].includes(path) ||
        (/^\/(products|clinical-directions)\/([^/]+)(?:\/([^/]+))?$/.exec(path) &&
          getCategory(path.startsWith("/products") ? "catalog" : "clinical", path.split("/")[2], path.split("/")[3])),
    );
  const paths = [
    ...megaMenu(nav, "products"),
    ...megaMenu(nav, "clinical-directions"),
  ].flatMap((group) => [
    group.href,
    ...group.links.map((link) => link.href),
    ...group.sections.map((section) => section.href),
    ...[group.results, ...group.sections.map((section) => section.results)].flatMap((results) =>
      (results?.columns ?? []).flatMap((column) => (column.more ? [column.more.href] : [])),
    ),
  ]);
  for (const href of paths) assert.ok(exists(href.replace("/uk", "")), href);
});

test("a group without directions has no sections", () => {
  const nav = buildHeaderNavigation("uk", uk);
  const reagents = megaMenu(nav, "products").find((group) => group.id === "catalog:reagents");
  assert.ok(reagents);
  assert.deepEqual(reagents.sections, []);
  assert.equal(reagents.results?.total, 4);
  assert.equal(reagents.count, 4);

  // The same holds for the clinical directions that have only default pages.
  const thyroid = megaMenu(nav, "clinical-directions").find((group) => group.id === "clinical:thyroid-function");
  assert.deepEqual(thyroid?.sections, []);
  assert.ok(thyroid?.results);

  // A group with directions keeps no results of its own: the active section supplies them.
  const equipment = megaMenu(nav, "products").find((group) => group.id === "catalog:equipment");
  assert.equal(equipment?.results, undefined);
});

test('pages without a direction come last as "Other solutions"', () => {
  const nav = buildHeaderNavigation("uk", uk);
  const diabetes = megaMenu(nav, "clinical-directions").find((group) => group.id === "clinical:diabetes-and-metabolism");
  assert.deepEqual(
    diabetes?.sections.map((section) => section.label),
    ["Аналізатори HbA1c", "Інші рішення"],
  );
  const other = diabetes?.sections.at(-1);
  assert.equal(other?.links.length, 1);
  // It has no listing of its own: it leads to the group's listing.
  assert.equal(other?.href, diabetes?.href);
  assert.ok(diabetes?.sections[0].href.endsWith("/hba1c-analyzers"));

  // The catalog never invents a section: the old "Portfolio" is gone.
  assert.equal("portfolio" in uk, false);
  for (const group of megaMenu(nav, "products")) {
    assert.ok(group.sections.every((section) => section.label !== "Асортимент" && section.label !== "Інші рішення"));
  }
});

test("a brand column shows at most six links and counts the rest", () => {
  const labels = { itemCount: uk.itemCount, showAll: uk.showAll };
  const six = buildResultColumns(Array.from({ length: 6 }, (_, index) => leaf(index)), "uk", labels, "/uk/all");
  assert.equal(MAX_COLUMN_LINKS, 6);
  assert.equal(six[0].links.length, 6);
  assert.equal(six[0].more, undefined);
  assert.equal(six[0].countLabel, "6 позицій");

  const eleven = buildResultColumns(Array.from({ length: 11 }, (_, index) => leaf(index)), "uk", labels, "/uk/all");
  assert.equal(eleven[0].links.length, 6);
  assert.deepEqual(eleven[0].links.map((link) => link.label), ["Item 0", "Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]);
  assert.deepEqual(eleven[0].more, { hidden: 5, total: 11, label: "Ще 5 · показати всі 11", href: "/uk/all" });
  assert.equal(eleven[0].countLabel, "11 позицій");

  const seven = buildResultColumns(Array.from({ length: 7 }, (_, index) => leaf(index)), "en", { itemCount: en.itemCount, showAll: en.showAll }, "/en/all");
  assert.equal(seven[0].more?.label, "1 more · show all 7");

  const twentyOne = buildResultColumns(Array.from({ length: 21 }, (_, index) => leaf(index)), "uk", labels, "/uk/all");
  assert.equal(twentyOne[0].countLabel, "21 позиція");
  const twentyTwo = buildResultColumns(Array.from({ length: 22 }, (_, index) => leaf(index)), "uk", labels, "/uk/all");
  assert.equal(twentyTwo[0].countLabel, "22 позиції");
});

test("each brand gets its own column, in order of appearance, cut separately", () => {
  const labels = { itemCount: uk.itemCount, showAll: uk.showAll };
  const mixed = [
    ...Array.from({ length: 8 }, (_, index) => leaf(index, "bio-rad", "Bio-Rad")),
    leaf(100),
    ...Array.from({ length: 2 }, (_, index) => leaf(200 + index, "other", "Other")),
  ];
  const columns = buildResultColumns(mixed, "uk", labels, "/uk/all");
  assert.deepEqual(columns.map((column) => [column.brandId, column.count, column.links.length, column.more?.hidden ?? 0]), [
    ["bio-rad", 8, 6, 2],
    ["snibe", 1, 1, 0],
    ["other", 2, 2, 0],
  ]);
});

test("section and group counts add up to the pages they hold", () => {
  const nav = buildHeaderNavigation("uk", uk);
  for (const id of ["products", "clinical-directions"] as const) {
    for (const group of megaMenu(nav, id)) {
      assert.equal(group.count, group.links.length, group.id);
      if (group.sections.length > 0) {
        assert.equal(group.count, group.sections.reduce((sum, section) => sum + section.count, 0), group.id);
      }
      for (const section of group.sections) {
        assert.equal(section.count, section.links.length, section.id);
        assert.equal(section.results.total, section.count, section.id);
        assert.equal(section.results.columns.reduce((sum, column) => sum + column.count, 0), section.count, section.id);
      }
    }
  }
  const equipment = megaMenu(nav, "products")[0];
  assert.equal(equipment.countLabel, "25 позицій");
  assert.equal(equipment.sections[0].countLabel, "6 позицій");
  assert.equal(equipment.sections[2].countLabel, "1 позиція");
});

test("menu leaves carry the type, a meta line from the key figure and the description", () => {
  const nav = buildHeaderNavigation("uk", uk, { photoFor: (page) => (page.slug === "maglumi-x8" ? "/products/maglumi-x8/main.webp" : undefined) });
  const leaves = megaMenu(nav, "products").flatMap((group) => group.links);
  const x8 = leaves.find((item) => item.href === "/uk/products/maglumi-x8");
  assert.deepEqual(
    { label: x8?.label, itemType: x8?.itemType, meta: x8?.meta, photo: x8?.photo },
    { label: "MAGLUMI X8", itemType: "CLIA-аналізатор", meta: "до 600 тестів/год", photo: "/products/maglumi-x8/main.webp" },
  );
  const nbs = leaves.find((item) => item.href.endsWith("/variant-nbs-newborn-screening-system"));
  assert.equal(nbs?.meta, "Система неонатального скринінгу");
  assert.equal(nbs?.photo, undefined);
  assert.ok(leaves.every((item) => item.description.length > 0));
  assert.ok(leaves.every((item) => !("title" in item)));
});

test("the English menu is built from the same pages", () => {
  const nav = buildHeaderNavigation("en", en);
  const equipment = megaMenu(nav, "products")[0];
  assert.equal(equipment.label, "Laboratory equipment");
  assert.equal(equipment.countLabel, "25 items");
  assert.equal(equipment.sections[2].countLabel, "1 item");
  assert.ok(equipment.links.every((link) => link.href.startsWith("/en/")));
});

test("the brands panel counts products and lists the portfolio directions", () => {
  const panel = brandsPanel(buildHeaderNavigation("uk", uk));
  assert.deepEqual(panel.map((brand) => brand.id), ["bio-rad", "snibe"]);

  for (const brand of panel) {
    const products = getBrandProducts(brand.id);
    assert.equal(brand.count, products.length);
    assert.equal(brand.allHref, `/uk/brands/${brand.id}/products`);
    assert.equal(brand.allLabel, `Усі продукти ${brand.label}`);
    assert.ok(brand.logo);
    assert.equal(brand.lines.length, 4);
    assert.ok(brand.lines.every((line) => line.href.startsWith(`/uk/brands/${brand.id}/`) && line.description));
    assert.equal(brand.about?.href, `/uk/brands/${brand.id}`);
  }

  // Together the brands cover every catalog page except the one that is going to redirect.
  const catalogPages = contentPages.filter((page) => page.kind === "product" && !isRedirectedPath(page.path));
  assert.equal(panel.reduce((sum, brand) => sum + brand.count, 0), catalogPages.length);
  assert.deepEqual(panel.map((brand) => brand.countLabel), ["20 позицій", "16 позицій"]);
});

test("the product listing of a brand groups its pages by type and direction", () => {
  const blocks = getBrandProductBlocks("snibe", "uk", uk.otherSolutions);
  assert.deepEqual(
    blocks.map((block) => [block.title, block.pages.length]),
    [
      ["Імуноаналіз", 6],
      ["Біохімія та електроліти", 3],
      ["Гемостаз", 1],
      ["Молекулярна діагностика", 3],
      ["Автоматизація лабораторії", 1],
      ["Реагенти й тести", 2],
    ],
  );
  assert.equal(blocks[0].href, "/uk/products/equipment/clia");
  assert.equal(blocks.at(-1)?.href, "/uk/products/reagents");
  const listed = blocks.flatMap((block) => block.pages.map((page) => page.path));
  assert.deepEqual(new Set(listed), new Set(getBrandProducts("snibe").map((page) => page.path)));
});

test("a brand page cannot take the address of the product listing", () => {
  const [page] = contentPages.filter((item) => item.kind === "brand");
  const clash: ContentPage = { ...page, slug: "products", path: `/brands/${page.brand.id}/products` };
  assert.ok(findCatalogProblems([clash]).some((item) => item.includes("clashes with the brand product listing")));
});
