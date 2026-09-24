import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "infectious-disease-controls",
  brand: "bio-rad",
  navLabel: {
    en: "Infectious Disease Controls",
    uk: "Infectious Disease Controls",
  },
  title: {
    en: "Infectious Disease Controls | Bio-Rad | Labwell",
    uk: "Контролі для досліджень інфекційних захворювань | Bio-Rad | Labwell",
  },
  description: {
    en: "Quality controls for laboratory infectious disease assays and serology workflows.",
    uk: "Контрольні матеріали для лабораторних досліджень інфекційних захворювань і серологічних процесів.",
  },
  todoNote: {
    en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
    uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії.",
  },
  sourceUrl: "https://www.bio-rad.com/en-uk/category/quality-controls?ID=b11f022f-7ced-4bf0-aaaa-dcdc8affc787",
  catalog: { group: "qc-software", section: "qc" },
});
