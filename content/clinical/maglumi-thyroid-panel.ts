import { defineClinicalPage } from "../define.ts";

export default defineClinicalPage({
  slug: "maglumi-thyroid-panel",
  brand: "snibe",
  navLabel: {
    en: "MAGLUMI Thyroid Panel",
    uk: "Тиреоїдна панель MAGLUMI",
  },
  title: {
    en: "MAGLUMI Thyroid Tests | Snibe | Labwell",
    uk: "Тиреоїдні тести MAGLUMI | Snibe | Labwell",
  },
  description: {
    en: "Explore thyroid function assays in Snibe’s MAGLUMI CLIA test menu.",
    uk: "Ознайомтеся з тестами для оцінювання функції щитоподібної залози в меню CLIA-тестів MAGLUMI від Snibe.",
  },
  todoNote: {
    en: "Test-menu category source; specify the exact thyroid assays and local availability.",
    uk: "Джерелом є категорія меню тестів; зазначте точний перелік тиреоїдних тестів і їхню локальну доступність.",
  },
  sourceUrl: "https://www.snibe.com/en/product/CLIA_menu/",
  clinical: { direction: "thyroid-function" },
});
