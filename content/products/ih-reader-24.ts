import { defineProduct } from "../define.ts";

export default defineProduct({
  slug: "ih-reader-24",
  brand: "bio-rad",
  navLabel: {
    en: "IH-Reader 24",
    uk: "IH-Reader 24",
  },
  title: {
    en: "IH-Reader 24 System | Bio-Rad | Labwell",
    uk: "IH-Reader 24 — система зчитування | Bio-Rad | Labwell",
  },
  description: {
    en: "Semi-automated reader for manually prepared IH-Cards in blood typing and antibody testing workflows.",
    uk: "Напівавтоматичний зчитувач для вручну підготовлених IH-Cards у дослідженнях групи крові та антитіл.",
  },
  todoNote: {
    en: "Linked Bio-Rad page uses a US locale; verify local availability.",
    uk: "Пов’язана сторінка Bio-Rad має локаль US; перевірте доступність на місцевому ринку.",
  },
  sourceUrl: "https://www.bio-rad.com/en-us/product/semi-automated-systems-ih-reader-24?ID=PLX3E6E08O1Y",
  catalog: { group: "equipment", section: "blood-group" },
  clinical: [
    {
      direction: "blood-banks",
      // Editorial note from the source sheet; "row N" refers to that sheet.
      note: {
        en: "Same model as row 15; linked source uses a US locale.",
        uk: "Та сама модель, що й у рядку 15; пов’язане джерело використовує локаль US.",
      },
    },
  ],
});
