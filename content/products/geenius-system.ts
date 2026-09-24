import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "geenius-system",
  brand: "bio-rad",
  navLabel: {
    en: "Geenius System",
    uk: "Geenius System",
  },
  title: {
    en: "Geenius Confirmatory Testing System | Bio-Rad | Labwell",
    uk: "Geenius Система підтверджувального тестування | Bio-Rad | Labwell",
  },
  description: {
    en: "Rapid confirmatory assay platform for HIV and HCV antibody testing, with automated result interpretation.",
    uk: "Платформа для швидких підтверджувальних досліджень антитіл до HIV і HCV з автоматизованою інтерпретацією результатів.",
  },
  todoNote: {
    en: "Infectious disease category source; choose the exact Geenius instrument and assay pages for the Labwell page.",
    uk: "Джерелом є категорія інфекційних захворювань; для сторінки Labwell оберіть точні сторінки приладу Geenius і відповідних тестів.",
  },
  sourceUrl: "https://www.bio-rad.com/en-uk/category/infectious-disease-testing?ID=NA00OK15",
  catalog: { group: "equipment", section: "autoimmune-infectious" },
  clinical: [
    { direction: "infectious-diseases" },
  ],
});
