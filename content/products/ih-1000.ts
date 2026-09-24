import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "ih-1000",
  brand: "bio-rad",
  navLabel: {
    en: "IH-1000",
    uk: "IH-1000",
  },
  title: {
    en: "IH-1000 Immunohematology System | Bio-Rad | Labwell",
    uk: "IH-1000 Імуно-гематологічна система | Bio-Rad | Labwell",
  },
  description: {
    en: "Fully automated gel-card system for blood group serology, with continuous loading of samples and reagents.",
    uk: "Повністю автоматизована система з гелевими картками для серологічних досліджень груп крові з безперервним завантаженням зразків і реагентів.",
  },
  sourceUrl: "https://www.bio-rad.com/en-uk/product/ih-1000-system?ID=M0FPV8IVK",
  catalog: { group: "equipment", section: "blood-group" },
  clinical: [
    {
      direction: "blood-banks",
      // Editorial note from the source sheet; "row N" refers to that sheet.
      note: {
        en: "Same model as row 14; consider one shared Labwell product page.",
        uk: "Та сама модель, що й у рядку 14; розгляньте одну спільну сторінку продукту Labwell.",
      },
    },
  ],
});
