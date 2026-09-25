import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "tube-testing",
  brand: "bio-rad",
  navLabel: {
    en: "Tube Testing",
    uk: "Tube Testing",
  },
  itemType: {
    en: "Tube testing reagents",
    uk: "Реагенти для пробіркового тестування",
  },
  seoTitle: {
    en: "Tube Testing Reagents | Bio-Rad",
    uk: "Реагенти для пробіркового тестування | Bio-Rad",
  },
  description: {
    en: "Traditional tube-based blood group serology reagents and solutions for immunohematology laboratories.",
    uk: "Традиційні реагенти та рішення для пробіркової серології груп крові в імуногематологічних лабораторіях.",
  },
  todoNote: {
    en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
    uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії.",
  },
  sourceUrl: "https://www.bio-rad.com/en-uk/category/blood-typing-screening-products?ID=KVSPOY15",
  catalog: { group: "reagents" },
});
