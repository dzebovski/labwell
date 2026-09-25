import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "inteliq",
  brand: "bio-rad",
  navLabel: {
    en: "InteliQ",
    uk: "InteliQ",
  },
  itemType: {
    en: "Quality controls",
    uk: "Контролі якості",
  },
  seoTitle: {
    en: "InteliQ Quality Controls | Bio-Rad",
    uk: "Контролі якості InteliQ | Bio-Rad",
  },
  description: {
    en: "Ready-to-use barcoded independent quality controls for chemistry and immunoassay laboratory platforms.",
    uk: "Готові до використання незалежні штрихкодовані контрольні матеріали для біохімічних та імуноаналітичних лабораторних платформ.",
  },
  todoNote: {
    en: "Confirm selected control levels and analytes for Labwell’s range.",
    uk: "Підтвердьте обрані рівні контролю та аналіти для асортименту Labwell.",
  },
  sourceUrl: "https://www.qcnet.com/quality-controls/inteliq",
  catalog: { group: "qc-software", section: "qc" },
});
