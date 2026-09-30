import { defineClinicalPage } from "../define.ts";

export default defineClinicalPage({
  slug: "maglumi-cardiac-markers",
  brand: "snibe",
  navLabel: {
    en: "MAGLUMI cardiac markers",
    uk: "Кардіомаркери MAGLUMI",
  },
  seoTitle: {
    en: "MAGLUMI Cardiac Markers | Snibe",
    uk: "Кардіомаркери MAGLUMI | Snibe",
  },
  description: {
    en: "Cardiac biomarker assays available through Snibe’s MAGLUMI CLIA test menu.",
    uk: "Тести на кардіальні біомаркери, доступні в меню CLIA-тестів MAGLUMI від Snibe.",
  },
  todoNote: {
    en: "Test-menu category source; define exact biomarkers and approved claims.",
    uk: "Джерелом є категорія меню тестів; визначте точний перелік біомаркерів і схвалені формулювання призначення.",
  },
  sourceUrl: "https://www.snibe.com/en/product/CLIA_menu/",
  clinical: { direction: "cardiology" },
});
