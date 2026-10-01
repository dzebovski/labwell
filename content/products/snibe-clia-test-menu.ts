import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "snibe-clia-test-menu",
  basePath: "/test-menus",
  brand: "snibe",
  navLabel: {
    en: "MAGLUMI CLIA test menu",
    uk: "Меню CLIA-тестів MAGLUMI",
  },
  itemType: {
    en: "Test menu",
    uk: "Меню тестів",
  },
  seoTitle: {
    en: "MAGLUMI CLIA test menu by Snibe",
    uk: "Меню CLIA-тестів MAGLUMI від Snibe",
  },
  description: {
    en: "MAGLUMI CLIA test menu by Snibe: 278 parameters in 22 groups, searchable by assay name. Ask LabWell about individual test availability in Ukraine.",
    uk: "Меню CLIA-тестів MAGLUMI від Snibe: 278 параметрів у 22 групах із пошуком за назвою. Доступність окремих тестів в Україні уточнюйте у LabWell.",
  },
  sourceUrl: "https://www.snibe.com/en/product/CLIA_menu/",
  catalog: { group: "reagents" },
});
