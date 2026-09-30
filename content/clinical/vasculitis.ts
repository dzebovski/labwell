import { defineClinicalPage } from "../define.ts";

export default defineClinicalPage({
  slug: "vasculitis",
  brand: "bio-rad",
  navLabel: {
    en: "Vasculitis",
    uk: "Васкуліти",
  },
  seoTitle: {
    en: "Vasculitis Autoantibody Testing | Bio-Rad",
    uk: "Дослідження автоантитіл при васкулітах | Bio-Rad",
  },
  description: {
    en: "Explore autoantibody testing options relevant to vasculitis investigations.",
    uk: "Ознайомтеся з варіантами дослідження автоантитіл, актуальними для діагностики васкулітів.",
  },
  todoNote: {
    en: "Proposed clinical page; select exact assays and review all diagnostic claims before publishing.",
    uk: "Це запропонована клінічна сторінка; перед публікацією оберіть точні тести та перевірте всі діагностичні твердження.",
  },
  sourceUrl: "https://www.bio-rad.com/en-uk/category/autoimmune-testing?ID=1a1ffd2e-c4cf-4752-83a8-4b93663b4a15",
  clinical: { direction: "autoimmune-diseases" },
});
