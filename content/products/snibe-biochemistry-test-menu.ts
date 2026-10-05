import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "snibe-biochemistry-test-menu",
  basePath: "/test-menus",
  brand: "snibe",
  navLabel: {
    en: "Biochemistry test menu",
    uk: "Меню біохімічних тестів",
  },
  itemType: {
    en: "Test menu",
    uk: "Меню тестів",
  },
  seoTitle: {
    en: "Snibe biochemistry test menu: 114 tests",
    uk: "Меню біохімічних тестів Snibe: 114 тестів",
  },
  description: {
    en: "Snibe biochemistry test menu: 114 tests in 13 groups with search by assay name. Explore clinical chemistry and electrolyte assays with LabWell in Ukraine.",
    uk: "Меню біохімічних тестів Snibe: 114 тестів у 13 групах із пошуком за назвою. Перегляньте біохімічні та електролітні дослідження з LabWell в Україні.",
  },
  sourceUrl: "https://www.snibe.com/en/product/biochemistry_menu/",
  catalog: { group: "reagents" },
});
