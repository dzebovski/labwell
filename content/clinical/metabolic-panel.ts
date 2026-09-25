import { defineClinicalPage } from "../define.ts";

export default defineClinicalPage({
  slug: "metabolic-panel",
  brand: "snibe",
  navLabel: {
    en: "Metabolic panel",
    uk: "Метаболічна панель",
  },
  seoTitle: {
    en: "Metabolic Testing | Snibe",
    uk: "Метаболічні дослідження | Snibe",
  },
  description: {
    en: "Clinical chemistry and immunoassay options relevant to metabolic health testing.",
    uk: "Методи клінічної хімії та імуноаналізу, актуальні для дослідження метаболічного здоров'я.",
  },
  todoNote: {
    en: "Proposed Labwell clinical page; define the exact biomarkers, assays and instruments before publishing.",
    uk: "Це запропонована клінічна сторінка Labwell; перед публікацією визначте точні біомаркери, тести та прилади.",
  },
  sourceUrl: "https://www.snibe.com/en/product/biochemistry_menu/",
  clinical: { direction: "diabetes-and-metabolism" },
});
