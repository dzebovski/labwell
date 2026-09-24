import { defineBrandPage } from "../define.ts";

// Brand overview page: no slug, served at /brands/{brand}.
export default defineBrandPage({
  brand: "bio-rad",
  navLabel: {
    en: "About Bio-Rad Clinical Diagnostics",
    uk: "Про Clinical Diagnostics Bio-Rad",
  },
  title: {
    en: "Bio-Rad Clinical Diagnostics | Labwell",
    uk: "Клінічна діагностика Bio-Rad | Labwell",
  },
  description: {
    en: "Discover Bio-Rad’s clinical diagnostics portfolio, including diabetes testing, immunohematology, autoimmunity and quality control.",
    uk: "Ознайомтеся з портфелем клінічної діагностики Bio-Rad, що охоплює дослідження діабету, імуногематологію, аутоімунні захворювання та контроль якості.",
  },
  todoNote: {
    en: "Write a Labwell partner introduction, confirm partnership wording and choose featured lines.",
    uk: "Підготуйте партнерський вступ для Labwell, підтвердьте формулювання щодо партнерства та оберіть ключові напрями.",
  },
  sourceUrl: "https://www.bio-rad.com/en-uk/p/cd",
});
