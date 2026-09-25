import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "biochemistry-test-menu",
  brand: "snibe",
  navLabel: {
    en: "Biochemistry Test Menu",
    uk: "Biochemistry Test Menu",
  },
  itemType: {
    en: "Biochemistry test menu",
    uk: "Меню біохімічних тестів",
  },
  seoTitle: {
    en: "Biochemistry Test Menu | Snibe",
    uk: "Меню біохімічних тестів | Snibe",
  },
  description: {
    en: "Explore Snibe’s clinical chemistry and electrolyte assays for Biossays analyzers.",
    uk: "Ознайомтеся з тестами для клінічної хімії та електролітів від Snibe для аналізаторів Biossays.",
  },
  todoNote: {
    en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
    uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії.",
  },
  sourceUrl: "https://www.snibe.com/en/product/biochemistry_menu/",
  catalog: { group: "reagents" },
});
