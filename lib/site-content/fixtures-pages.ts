/** Minimal valid content for group, test menu and overview tests. */
import type { GroupContent, OverviewContent, TestMenuContent, TestsContent } from "./schema-pages.ts";

const alt = (text: string) => ({ alt: text });

export function group(overrides: Partial<GroupContent> = {}): GroupContent {
  const column = (slug: string, title: string) => ({
    productSlug: slug,
    title,
    anchor: slug,
    image: alt(title),
  });
  const item = (slug: string, title: string) => ({
    productSlug: slug,
    anchor: slug,
    eyebrow: "Для лабораторій",
    h3: title,
    text: `${title} — прилад.`,
    keyFacts: [{ value: "до 180", label: "тестів/год" }],
    image: alt(title),
    ordering: { show: false as const },
    cta: { label: `Запитати про ${title}`, href: "#contact" },
    backLink: { label: "↑ До порівняння", href: "#compare" },
  });
  return {
    slug: "demo-series",
    url: "/products/demo-series",
    kind: "group-series",
    brand: "Snibe",
    seo: { title: "Demo Series | LabWell", description: "Опис." },
    G1_hero: {
      breadcrumbs: ["Головна", "Продукція", "Обладнання", "Demo Series"],
      eyebrow: "Серія",
      h1: "Demo Series — аналізатори",
      lead: "Лід.",
      modelsLabel: "Моделі на сторінці",
      models: [column("demo-a", "Demo A"), column("demo-b", "Demo B")],
      primaryCta: { label: "Консультація", href: "#contact" },
      secondaryCta: { label: "Порівняти", href: "#compare" },
    },
    G2_compare: {
      show: true,
      h2: "Порівняння",
      columns: [column("demo-a", "Demo A"), column("demo-b", "Demo B")],
      rows: [
        { label: "Зразки", values: ["16", "40"] },
        { label: "Кювети", detail: "до", values: ["н/д", "240"] },
      ],
      footnote: "н/д — немає даних.",
    },
    G2_sections: { show: false },
    G3_items: { show: true, h2: "Моделі", items: [item("demo-a", "Demo A"), item("demo-b", "Demo B")] },
    T10_faq: { show: false },
    T11_labwell: { show: true, use: "shared.labwell.items" },
    T12_contact: { show: true, h2: "Консультація", text: "Текст.", messagePrefill: "Demo. " },
    ...overrides,
  };
}

export function testMenu(overrides: Partial<TestMenuContent> = {}): TestMenuContent {
  return {
    slug: "demo-menu",
    url: "/test-menus/demo-menu",
    kind: "test-menu",
    brand: "Snibe",
    seo: { title: "Меню | LabWell", description: "Опис." },
    C1_hero: {
      show: true,
      breadcrumbs: ["Головна", "Продукція", "Тести", "Меню Demo"],
      brand: "Snibe",
      eyebrow: "Меню тестів",
      h1: "Меню Demo — 278 параметрів",
      lead: "Лід.",
      stats: [{ value: "278", label: "параметрів" }],
    },
    C1_search: {
      show: true,
      searchLabel: "Пошук",
      placeholder: "TSH",
      foundLabel: "Знайдено {count}",
      resetLabel: "Скинути",
      allGroupsLabel: "Усі групи",
      groupCountLabel: "{count} тестів",
      empty: { title: "Тест не знайдено", text: "Напишіть нам.", cta: { label: "Запитати", href: "#contact" } },
    },
    C1_analyzers: { show: false },
    T10_faq: { show: false },
    T11_labwell: { show: false },
    T12_contact: { show: true, h2: "Потрібен тест?", text: "Текст.", messagePrefill: "Шукаю тест: " },
    ...overrides,
  };
}

export function tests(overrides: Partial<TestsContent> = {}): TestsContent {
  return {
    groups: [
      {
        id: "thyroid",
        name: { uk: "Щитоподібна залоза", en: "Thyroid" },
        tests: [
          { id: "t-tsh", name: "TSH (3rd Generation)" },
          { id: "t-anti-tpo", name: "Anti-TPO" },
        ],
      },
      {
        id: "autoimmune",
        name: { uk: "Аутоімунні захворювання", en: "Autoimmune" },
        tests: [
          { id: "t-anti-tpo", name: "Anti-TPO" },
          { id: "t-afp", name: "*AFP-L3%" },
        ],
      },
    ],
    ...overrides,
  };
}

export function overview(overrides: Partial<OverviewContent> = {}): OverviewContent {
  return {
    slug: "demo-x",
    url: "/products/demo-x",
    kind: "overview",
    brand: "Snibe",
    seo: { title: "Demo X | LabWell", description: "Опис." },
    C2_hero: {
      show: true,
      breadcrumbs: ["Головна", "Продукція", "Обладнання", "Demo X"],
      eyebrow: "Огляд серії",
      h1: "Demo X — аналізатори",
      lead: "Лід.",
      primaryCta: { label: "Консультація", href: "#contact" },
      models: [
        { productSlug: "demo-x1", image: alt("Demo X1") },
        { productSlug: "demo-x2", image: alt("Demo X2") },
      ],
    },
    C2_compare: {
      show: true,
      h2: "Порівняння",
      models: [
        { productSlug: "demo-x1", name: "Demo X1", href: "/products/demo-x1", image: alt("Demo X1") },
        { productSlug: "demo-x2", name: "Demo X2", href: "/products/demo-x2", image: alt("Demo X2") },
      ],
      rows: [{ label: "Продуктивність", unit: "тестів/год", values: { "demo-x1": "до 200", "demo-x2": "до 450" } }],
    },
    C2_cards: {
      show: true,
      h2: "Моделі",
      models: [
        {
          productSlug: "demo-x1",
          eyebrow: "Малі",
          title: "Demo X1",
          text: "Текст.",
          href: "/products/demo-x1",
          image: alt("Demo X1"),
        },
      ],
      related: [
        {
          kind: "test-menu",
          eyebrow: "278 параметрів",
          title: "Меню",
          text: "Текст.",
          href: "/test-menus/demo-menu",
          bigNumber: { value: "278", label: "параметрів" },
        },
      ],
    },
    T10_faq: { show: true, h2: "Питання", items: [{ q: "Що це?", a: "Серія." }] },
    T11_labwell: { show: true, use: "shared.labwell.items" },
    T12_contact: { show: true, h2: "Консультація", text: "Текст." },
    ...overrides,
  };
}
