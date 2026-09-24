import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "unityweb",
  brand: "bio-rad",
  navLabel: {
    en: "UnityWeb",
    uk: "UnityWeb",
  },
  title: {
    en: "UnityWeb QC Software | Bio-Rad | Labwell",
    uk: "Програмне забезпечення QC UnityWeb | Bio-Rad | Labwell",
  },
  description: {
    en: "Online quality control data management for laboratory performance monitoring and peer comparison.",
    uk: "Онлайн-система керування даними контролю якості для моніторингу показників лабораторії та міжлабораторного порівняння.",
  },
  todoNote: {
    en: "Software category source; confirm current product naming and Labwell support scope.",
    uk: "Джерелом є категорія програмного забезпечення; підтвердьте актуальну назву продукту та обсяг підтримки Labwell.",
  },
  sourceUrl: "https://www.bio-rad.com/en-uk/category/software-data-analysis?ID=MZQ28F15",
  catalog: { group: "qc-software", section: "software" },
});
