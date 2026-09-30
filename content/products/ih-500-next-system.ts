import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "ih-500-next-system",
  brand: "bio-rad",
  navLabel: {
    en: "IH-500 NEXT System",
    uk: "IH-500 NEXT System",
  },
  itemType: {
    en: "Blood typing system",
    uk: "Система визначення групи крові",
  },
  seoTitle: {
    en: "IH-500 NEXT Blood Typing System | Bio-Rad",
    uk: "IH-500 NEXT Система визначення групи крові | Bio-Rad",
  },
  description: {
    en: "Fully automated immunohematology system for blood grouping and compatibility testing.",
    uk: "Повністю автоматизована імуногематологічна система для визначення групи крові та проведення проб на сумісність.",
  },
  sourceUrl: "https://www.bio-rad.com/en-uk/product/ih-500-next-system?ID=NPUFID15",
  catalog: { group: "equipment", section: "blood-group" },
  clinical: [
    {
      direction: "blood-banks",
      // Editorial note from the source sheet; "row N" refers to that sheet.
      note: {
        en: "Same model as row 13; consider one shared Labwell product page.",
        uk: "Та сама модель, що й у рядку 13; розгляньте одну спільну сторінку продукту Labwell.",
      },
    },
  ],
});
