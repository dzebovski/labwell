import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "variant-ii-turbo",
  brand: "bio-rad",
  navLabel: {
    en: "VARIANT II TURBO",
    uk: "VARIANT II TURBO",
  },
  title: {
    en: "VARIANT II TURBO Hemoglobin Testing System | Bio-Rad | Labwell",
    uk: "VARIANT II TURBO Система визначення гемоглобіну | Bio-Rad | Labwell",
  },
  description: {
    en: "Automated HPLC system for high-volume HbA1c testing with integrated data management.",
    uk: "Автоматизована система ВЕРХ для великого обсягу досліджень HbA1c з інтегрованим керуванням даними.",
  },
  sourceUrl: "https://www.bio-rad.com/en-uk/product/variant-ii-turbo-hemoglobin-testing-system?ID=41158308-b08b-4921-af0d-465d46b3f1b5",
  catalog: { group: "equipment", section: "hba1c" },
  clinical: [
    {
      direction: "diabetes-and-metabolism",
      section: "hba1c-analyzers",
      // Editorial note from the source sheet; "row N" refers to that sheet.
      note: {
        en: "Same model as row 12; consider one shared Labwell product page.",
        uk: "Та сама модель, що й у рядку 12; розгляньте одну спільну сторінку продукту Labwell.",
      },
    },
  ],
});
