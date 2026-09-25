import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "d-100",
  brand: "bio-rad",
  navLabel: {
    en: "D-100",
    uk: "D-100",
  },
  itemType: {
    en: "Hemoglobin testing system",
    uk: "Система визначення гемоглобіну",
  },
  seoTitle: {
    en: "D-100 Hemoglobin Testing System | Bio-Rad",
    uk: "D-100 Система визначення гемоглобіну | Bio-Rad",
  },
  description: {
    en: "Automated HPLC system for HbA1c testing, designed to streamline diabetes laboratory workflows.",
    uk: "Автоматизована система ВЕРХ для визначення HbA1c, розроблена для оптимізації лабораторної діагностики діабету.",
  },
  todoNote: {
    en: "Source is a product family page; confirm the UK configuration and availability.",
    uk: "Джерелом є сторінка сімейства продуктів; підтвердьте конфігурацію та доступність у Великій Британії.",
  },
  sourceUrl: "https://www.bio-rad.com/en-us/category/d-100-hemoglobin-testing-solution?ID=NVVIN015",
  catalog: { group: "equipment", section: "hba1c" },
  clinical: [
    {
      direction: "diabetes-and-metabolism",
      section: "hba1c-analyzers",
      // Editorial note from the source sheet; "row N" refers to that sheet.
      note: {
        en: "Same model as row 9; consider one shared Labwell product page.",
        uk: "Та сама модель, що й у рядку 9; розгляньте одну спільну сторінку продукту Labwell.",
      },
    },
  ],
});
