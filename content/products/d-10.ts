import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "d-10",
  brand: "bio-rad",
  navLabel: {
    en: "D-10",
    uk: "D-10",
  },
  itemType: {
    en: "Hemoglobin testing system",
    uk: "Система визначення гемоглобіну",
  },
  seoTitle: {
    en: "D-10 Hemoglobin Testing System | Bio-Rad",
    uk: "D-10 Система визначення гемоглобіну | Bio-Rad",
  },
  description: {
    en: "Compact HPLC system for HbA1c and hemoglobin testing, with straightforward laboratory workflow.",
    uk: "Компактна система ВЕРХ для визначення HbA1c і гемоглобіну зі зручним лабораторним робочим процесом.",
  },
  sourceUrl: "https://www.bio-rad.com/applications-technologies/ion-exchange-hplc-systems-d-10?ID=PZ8US5MKSK1O",
  catalog: { group: "equipment", section: "hba1c" },
  clinical: [
    {
      direction: "diabetes-and-metabolism",
      section: "hba1c-analyzers",
      // Editorial note from the source sheet; "row N" refers to that sheet.
      note: {
        en: "Same model as row 10; consider one shared Labwell product page.",
        uk: "Та сама модель, що й у рядку 10; розгляньте одну спільну сторінку продукту Labwell.",
      },
    },
  ],
});
