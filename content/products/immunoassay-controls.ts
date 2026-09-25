import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "immunoassay-controls",
  brand: "bio-rad",
  navLabel: {
    en: "Immunoassay Controls",
    uk: "Immunoassay Controls",
  },
  itemType: {
    en: "Immunoassay quality controls",
    uk: "Контролі якості для імуноаналізу",
  },
  seoTitle: {
    en: "Immunoassay Quality Controls | Bio-Rad",
    uk: "Контролі якості для імуноаналізу | Bio-Rad",
  },
  description: {
    en: "Independent controls for monitoring the analytical performance of immunoassay testing.",
    uk: "Незалежні контрольні матеріали для моніторингу аналітичних характеристик імуноаналітичних досліджень.",
  },
  todoNote: {
    en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
    uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії.",
  },
  sourceUrl: "https://www.bio-rad.com/en-uk/category/quality-controls?ID=b11f022f-7ced-4bf0-aaaa-dcdc8affc787",
  catalog: { group: "qc-software", section: "qc" },
});
