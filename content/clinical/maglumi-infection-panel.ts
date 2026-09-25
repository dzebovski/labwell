import { defineClinicalPage } from "../define.ts";

export default defineClinicalPage({
  slug: "maglumi-infection-panel",
  brand: "snibe",
  navLabel: {
    en: "MAGLUMI Infection Panel",
    uk: "Інфекційна панель MAGLUMI",
  },
  seoTitle: {
    en: "MAGLUMI Infectious Disease Tests | Snibe",
    uk: "Тести MAGLUMI для інфекційних захворювань | Snibe",
  },
  description: {
    en: "Explore infectious disease assays in Snibe’s MAGLUMI CLIA menu.",
    uk: "Ознайомтеся з тестами на інфекційні захворювання в меню CLIA-тестів MAGLUMI від Snibe.",
  },
  todoNote: {
    en: "Test-menu category source; identify the exact infections and approved UK assays.",
    uk: "Джерелом є категорія меню тестів; визначте точний перелік інфекцій і тестів, схвалених для Великої Британії.",
  },
  sourceUrl: "https://www.snibe.com/en/product/CLIA_menu/",
  clinical: { direction: "infectious-diseases" },
});
