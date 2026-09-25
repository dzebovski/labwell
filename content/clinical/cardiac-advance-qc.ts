import { defineClinicalPage } from "../define.ts";

export default defineClinicalPage({
  slug: "cardiac-advance-qc",
  brand: "bio-rad",
  navLabel: {
    en: "Cardiac Advance QC",
    uk: "Cardiac Advance QC",
  },
  seoTitle: {
    en: "Cardiac Advance Control | Bio-Rad",
    uk: "Контрольний матеріал Cardiac Advance | Bio-Rad",
  },
  description: {
    en: "Multi-analyte quality control material for cardiac marker assays, including high-sensitivity troponin.",
    uk: "Багатоаналітний матеріал для контролю якості досліджень кардіомаркерів, зокрема високочутливого тропоніну.",
  },
  todoNote: {
    en: "Bio-Rad clinical diagnostics overview; locate exact control SKU and confirm Labwell range.",
    uk: "Джерелом є огляд клінічної діагностики Bio-Rad; знайдіть точний SKU контрольного матеріалу та підтвердьте його наявність в асортименті Labwell.",
  },
  sourceUrl: "https://www.bio-rad.com/en-uk/p/cd",
  clinical: { direction: "cardiology" },
});
