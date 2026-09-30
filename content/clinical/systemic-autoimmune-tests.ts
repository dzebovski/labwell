import { defineClinicalPage } from "../define.ts";

export default defineClinicalPage({
  slug: "systemic-autoimmune-tests",
  brand: "bio-rad",
  navLabel: {
    en: "Systemic autoimmune tests",
    uk: "Системні аутоімунні тести",
  },
  seoTitle: {
    en: "Systemic Autoimmune Testing | Bio-Rad",
    uk: "Системні аутоімунні дослідження | Bio-Rad",
  },
  description: {
    en: "Autoantibody testing solutions for systemic autoimmune diseases from Bio-Rad.",
    uk: "Рішення Bio-Rad для дослідження автоантитіл при системних аутоімунних захворюваннях.",
  },
  todoNote: {
    en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
    uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії.",
  },
  sourceUrl: "https://www.bio-rad.com/en-uk/category/autoimmune-testing?ID=1a1ffd2e-c4cf-4752-83a8-4b93663b4a15",
  clinical: { direction: "autoimmune-diseases" },
});
