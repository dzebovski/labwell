import { defineClinicalPage } from "../define.ts";

export default defineClinicalPage({
  slug: "bioplex-2200-infection-panels",
  brand: "bio-rad",
  navLabel: {
    en: "BioPlex 2200 Infection Panels",
    uk: "BioPlex 2200 Інфекційні панелі",
  },
  seoTitle: {
    en: "BioPlex 2200 Infectious Disease Assays | Bio-Rad",
    uk: "Тести BioPlex 2200 для інфекційних захворювань | Bio-Rad",
  },
  description: {
    en: "Multiplex infectious disease testing on the fully automated BioPlex 2200 platform.",
    uk: "Мультиплексні дослідження інфекційних захворювань на повністю автоматизованій платформі BioPlex 2200.",
  },
  todoNote: {
    en: "Category source; identify the exact infection panels available for Labwell.",
    uk: "Джерелом є категорія продуктів; визначте точний перелік панелей для інфекційних захворювань, доступних для Labwell.",
  },
  sourceUrl: "https://www.bio-rad.com/en-uk/category/infectious-disease-testing?ID=NA00OK15",
  clinical: { direction: "infectious-diseases" },
});
