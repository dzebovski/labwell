import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "ih-com",
  brand: "bio-rad",
  navLabel: {
    en: "IH-Com",
    uk: "IH-Com",
  },
  itemType: {
    en: "LIS connectivity software",
    uk: "ПЗ для інтеграції з ЛІС",
  },
  seoTitle: {
    en: "IH-Com Connectivity Software | Bio-Rad",
    uk: "Програмне забезпечення для інтеграції IH-Com | Bio-Rad",
  },
  description: {
    en: "Connectivity solution supporting immunohematology instruments and laboratory information workflows.",
    uk: "Рішення для інтеграції, що підтримує імуногематологічні прилади та процеси обміну даними лабораторної інформаційної системи.",
  },
  todoNote: {
    en: "Connectivity category source; confirm IH-Com product details and local integration scope.",
    uk: "Джерелом є категорія інтеграційних рішень; підтвердьте відомості про продукт IH-Com та обсяг локальної інтеграції.",
  },
  sourceUrl: "https://www.bio-rad.com/category/connectivity?ID=LO52HFBOL",
  catalog: { group: "qc-software", section: "software" },
});
