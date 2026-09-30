/** Minimal valid content for the site-content tests. */
import type { ProductContent, SharedContent } from "./schema.ts";

export function product(overrides: Partial<ProductContent> = {}): ProductContent {
  return {
    slug: "demo",
    url: "/products/demo",
    kind: "instrument",
    brand: "Snibe",
    seo: { title: "Demo — analyzer | LabWell", description: "Demo analyzer." },
    T1_breadcrumbs: ["Головна", "Продукція", "Обладнання", "Demo"],
    T2_hero: {
      brand: "Snibe",
      eyebrow: "Аналізатор",
      h1: "Demo — аналізатор",
      lead: "Лід.",
      keyFacts: [{ value: "10", label: "тестів" }],
      primaryCta: { label: "Консультація", href: "#contact" },
      secondaryCta: { label: "Характеристики", href: "#specs" },
      image: { alt: "Demo" },
    },
    T3_about: { show: true, h2: "Що таке Demo", text: "Demo — це аналізатор." },
    T4_specs: { show: false },
    T5_benefits: { show: false },
    T6_items: { show: false },
    T7_storage: { show: false },
    T8_related: { show: false },
    T9_documents: { show: false },
    T10_faq: { show: false },
    T11_labwell: { show: true, use: "shared.labwell.items" },
    T12_contact: { show: true, h2: "Консультація", text: "Текст.", messagePrefill: "Demo. " },
    ...overrides,
  };
}

export function shared(overrides: Partial<SharedContent["contact"]> = {}): SharedContent {
  return {
    labwell: {
      eyebrow: "LabWell",
      h2: "Що робить LabWell",
      link: { label: "Сервіс", href: "/services" },
      items: [{ icon: "truck", title: "Постачання", text: "Текст." }],
      itemsForLine: [{ icon: "message", title: "Консультація", text: "Текст." }],
    },
    contact: {
      phone: "[ТЕЛЕФОН]",
      email: "[EMAIL]",
      form: {
        fields: [{ name: "name", label: "Ім’я", type: "text", required: true }],
        consent: "Надсилаючи форму, ви погоджуєтеся з [політикою конфіденційності].",
        submit: "Надіслати",
      },
      ...overrides,
    },
    faqAside: { text: "Не знайшли відповідь?", link: "Запитайте спеціаліста" },
    footer: "© LabWell",
  };
}
