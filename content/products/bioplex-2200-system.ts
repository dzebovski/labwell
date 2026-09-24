import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "bioplex-2200-system",
  brand: "bio-rad",
  navLabel: {
    en: "BioPlex 2200 System",
    uk: "BioPlex 2200 System",
  },
  title: {
    en: "BioPlex 2200 Multiplex System | Bio-Rad | Labwell",
    uk: "BioPlex 2200 Мультиплексна система | Bio-Rad | Labwell",
  },
  description: {
    en: "Fully automated random-access multiplex platform for autoimmune and infectious disease assays.",
    uk: "Повністю автоматизована мультиплексна платформа з довільним доступом для досліджень аутоімунних та інфекційних захворювань.",
  },
  todoNote: {
    en: "Linked Bio-Rad page uses a US locale; confirm UK assay availability.",
    uk: "Пов’язана сторінка Bio-Rad має локаль US; підтвердьте доступність тестів у Великій Британії.",
  },
  sourceUrl: "https://www.bio-rad.com/en-us/product/bioplex-2200-system?ID=179032f7-5b80-4a4d-a5c9-9218a62c6eb3",
  catalog: { group: "equipment", section: "autoimmune-infectious" },
  clinical: [
    {
      direction: "autoimmune-diseases",
      order: 1,
      // Editorial note from the source sheet; "row N" refers to that sheet.
      note: {
        en: "Same system as row 16; list the exact autoimmune assays for this clinical page.",
        uk: "Та сама система, що й у рядку 16; перелічіть точні аутоімунні тести для цієї клінічної сторінки.",
      },
    },
  ],
});
