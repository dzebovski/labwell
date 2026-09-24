import { defineClinicalPage } from "../define.ts";

export default defineClinicalPage({
  slug: "oncopanel-maglumi-oncomarkers",
  brand: "snibe",
  navLabel: {
    en: "Oncopanel MAGLUMI (Oncomarkers)",
    uk: "Онкопанель MAGLUMI (Онкомаркери)",
  },
  title: {
    en: "MAGLUMI Tumor Marker Tests | Snibe | Labwell",
    uk: "Тести на онкомаркери MAGLUMI | Snibe | Labwell",
  },
  description: {
    en: "Explore tumor marker immunoassays in the MAGLUMI test menu for oncology laboratory workflows.",
    uk: "Ознайомтеся з імуноаналізами онкомаркерів у меню тестів MAGLUMI для робочих процесів онкологічної лабораторії.",
  },
  todoNote: {
    en: "Test-menu category source; replace the informal “Oncopanel” label with confirmed assays and claims.",
    uk: "Джерелом є категорія меню тестів; замініть неофіційну назву «Онкопанель» підтвердженим переліком тестів і формулюваннями їх призначення.",
  },
  sourceUrl: "https://www.snibe.com/en/product/CLIA_menu/",
  clinical: { direction: "oncology" },
});
