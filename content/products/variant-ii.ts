import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "variant-ii",
  brand: "bio-rad",
  navLabel: {
    en: "VARIANT II",
    uk: "VARIANT II",
  },
  title: {
    en: "VARIANT II Hemoglobin Testing System | Bio-Rad | Labwell",
    uk: "VARIANT II Система визначення гемоглобіну | Bio-Rad | Labwell",
  },
  description: {
    en: "HPLC hemoglobin testing system for HbA2 and HbF analysis and investigation of abnormal hemoglobins.",
    uk: "Система ВЕРХ для аналізу гемоглобіну HbA2 і HbF та дослідження аномальних гемоглобінів.",
  },
  todoNote: {
    en: "Check whether this legacy model is available for new sales in the UK.",
    uk: "Перевірте, чи доступна ця застаріла модель для нових продажів у Великій Британії.",
  },
  sourceUrl: "https://www.bio-rad.com/en-us/category/variant-ii-hemoglobin-testing-solution?ID=b91663a4-2f82-44ee-98a6-9b50dbb7e359",
  catalog: { group: "equipment", section: "hba1c" },
  clinical: [
    {
      direction: "diabetes-and-metabolism",
      section: "hba1c-analyzers",
      // Editorial note from the source sheet; "row N" refers to that sheet.
      note: {
        en: "Same model as row 11; check diabetes application and legacy availability.",
        uk: "Та сама модель, що й у рядку 11; перевірте застосування для діабету та доступність застарілої моделі.",
      },
    },
  ],
});
