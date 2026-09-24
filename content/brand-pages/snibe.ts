import { defineBrandPage } from "../define.ts";

// Brand overview page: no slug, served at /brands/{brand}.
export default defineBrandPage({
  brand: "snibe",
  navLabel: {
    en: "About Snibe",
    uk: "Про компанію Snibe",
  },
  title: {
    en: "About Snibe | Labwell",
    uk: "Про Snibe | Labwell",
  },
  description: {
    en: "Learn about Snibe, a manufacturer of clinical laboratory instruments and in vitro diagnostic reagents.",
    uk: "Дізнайтеся про Snibe — виробника приладів для клінічних лабораторій і реагентів для діагностики in vitro.",
  },
  todoNote: {
    en: "Create Labwell’s own About Snibe page; confirm partner status, UK offering and approved brand wording.",
    uk: "Створіть власну сторінку Labwell про Snibe; підтвердьте статус партнерства, пропозицію для Великої Британії та схвалені формулювання щодо бренду.",
  },
  sourceUrl: "https://www.snibe.com/en/about/",
});
