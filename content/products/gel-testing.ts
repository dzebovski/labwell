import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "gel-testing",
  brand: "bio-rad",
  navLabel: {
    en: "Gel Testing",
    uk: "Gel Testing",
  },
  itemType: {
    en: "Gel testing for blood banks",
    uk: "Гелеве тестування для банків крові",
  },
  seoTitle: {
    en: "Gel Testing for Blood Banks | Bio-Rad",
    uk: "Гелеве тестування для банків крові | Bio-Rad",
  },
  description: {
    en: "Bio-Rad gel-card testing solutions for blood typing, antibody screening and other immunohematology procedures.",
    uk: "Рішення Bio-Rad для тестування з гелевими картками: визначення групи крові, скринінг антитіл та інші імуногематологічні процедури.",
  },
  todoNote: {
    en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
    uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії.",
  },
  sourceUrl: "https://www.bio-rad.com/category/instruments-for-id-system?ID=LO2Q1IFCN",
  catalog: { group: "reagents" },
});
