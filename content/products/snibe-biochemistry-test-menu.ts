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
    en: "Snibe biochemistry test menu: 114 tests in 13 groups, searchable by assay name. Ask LabWell about the availability of individual tests in Ukraine.",
    uk: "Меню біохімічних тестів Snibe: 114 тестів у 13 групах із пошуком за назвою. Доступність окремих тестів в Україні уточнюйте в менеджера LabWell.",
  },
  sourceUrl: "https://www.snibe.com/en/product/biochemistry_menu/",
  catalog: { group: "reagents" },
});
