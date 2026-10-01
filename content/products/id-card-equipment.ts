import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "id-card-equipment",
  brand: "bio-rad",
  navLabel: {
    en: "ID-Card equipment",
    uk: "Обладнання для ID-карт",
  },
  itemType: {
    en: "ID-Card testing equipment",
    uk: "Обладнання для ID-карт",
  },
  seoTitle: {
    en: "Bio-Rad ID-Card equipment",
    uk: "Обладнання для ID-карт Bio-Rad",
  },
  description: {
    en: "Bio-Rad ID-Card equipment: the ID-Centrifuge L centrifuge, the ID-Incubator L incubator and the semi-automated IH-Reader 24. Supplied in Ukraine by LabWell.",
    uk: "Обладнання Bio-Rad для ID-карт: центрифуга ID-Centrifuge L, інкубатор ID-Incubator L і напівавтоматичний IH-Reader 24. Постачання в Україні — LabWell.",
  },
  sourceUrl: "https://www.bio-rad.com/en-us/product/semi-automated-systems-ih-reader-24?ID=PLX3E6E08O1Y",
  catalog: { group: "equipment", section: "blood-group" },
  clinical: [{ direction: "blood-banks" }],
});
