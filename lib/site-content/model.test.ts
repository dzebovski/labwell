import assert from "node:assert/strict";
import test from "node:test";

import { product, shared } from "./fixtures.ts";
import { buildJsonLd, serializeJsonLd } from "./jsonld.ts";
import { resolveHref } from "./links.ts";
import { buildProductPage } from "./model.ts";

function build(overrides: Parameters<typeof product>[0] = {}, sharedOverrides = {}) {
  return buildProductPage({
    product: product(overrides),
    shared: shared(sharedOverrides),
    locale: "uk",
  });
}

test("blocks with show:false are not in the model", () => {
  const page = build();

  assert.equal(page.specs, undefined);
  assert.equal(page.benefits, undefined);
  assert.equal(page.items, undefined);
  assert.equal(page.faq, undefined);
  assert.ok(page.about);
  assert.ok(page.labwell);
});

test("placeholders in brackets never reach the model", () => {
  const page = build();

  assert.equal(page.contact?.phone, undefined);
  assert.equal(page.contact?.email, undefined);
  assert.equal(page.contact?.consent, undefined);

  const filled = build({}, { phone: "+380 44 000 00 00", email: "info@example.com", form: shared().contact.form });
  assert.equal(filled.contact?.phone, "+380 44 000 00 00");
  assert.equal(filled.contact?.email, "info@example.com");
});

test("rows with placeholders are dropped, the pack-size column goes when no size is known", () => {
  const page = build({
    T6_items: {
      show: true,
      h2: "Позиції",
      columns: ["Кат. №", "Назва", "Фасування"],
      rows: [
        { catalogNumber: "001", name: "One", packSize: "[ФАСУВАННЯ]" },
        { catalogNumber: "002", name: "Two [УТОЧНИТИ]" },
        { catalogNumber: "003", name: "Three" },
      ],
    },
  });

  assert.equal(page.items?.layout, "list");
  assert.deepEqual(page.items?.columns, ["Кат. №", "Назва"]);
  assert.deepEqual(
    page.items?.rows.map((row) => row.name),
    ["One", "Three"],
  );
});

test("rows with several catalog numbers become a matrix", () => {
  const page = build({
    T6_items: {
      show: true,
      h2: "Склад",
      columns: ["Контроль", "Рівень 1", "Рівень 2"],
      rows: [{ name: "Control", nameUk: "контроль", catalogNumbers: ["1", "2"] }],
    },
  });

  assert.equal(page.items?.layout, "matrix");
});

test("a CTA that points at a hidden block is dropped", () => {
  const page = build();
  assert.equal(page.hero.secondaryCta, undefined, "#specs has no table on this page");
  assert.equal(page.hero.primaryCta?.href, "#contact");

  const noContact = build({ T12_contact: { show: false } });
  assert.equal(noContact.hero.primaryCta, undefined);
});

test("test-menu and overview links go to current addresses; unknown pages lose the link", () => {
  assert.equal(
    resolveHref("/test-menus/snibe-clia-test-menu", "uk"),
    "/uk/products/maglumi-clia-test-menu-278-parameters",
  );
  assert.equal(resolveHref("/products/maglumi", "en"), "/en/brands/snibe/maglumi-immunochemistry");
  assert.equal(resolveHref("/services", "en"), "/en/services");
  assert.equal(resolveHref("/products/maglumi-x3", "uk"), "/uk/products/maglumi-x3");
  assert.equal(
    resolveHref("/products/molecision-mp", "uk"),
    "/uk/brands/snibe/molecision-molecular-diagnostics",
  );
  assert.equal(resolveHref("/products/not-built-yet", "uk"), null);
  assert.equal(resolveHref("/test-menus/unknown", "uk"), null);
  assert.equal(resolveHref("#contact", "uk"), "#contact");
  assert.equal(resolveHref("https://example.com/a.pdf", "uk"), "https://example.com/a.pdf");
});

test("related cards without a page are kept as plain text", () => {
  const page = build({
    T8_related: {
      show: true,
      h2: "Інші",
      cards: [
        { eyebrow: "Snibe", title: "Exists", href: "/products/maglumi-x3" },
        { eyebrow: "Snibe", title: "Not built", href: "/products/not-built-yet" },
      ],
    },
  });

  assert.equal(page.related?.cards[0].href, "/uk/products/maglumi-x3");
  assert.equal(page.related?.cards[1].href, undefined);
});

test("JSON-LD has Product and BreadcrumbList; FAQPage only with visible questions", () => {
  const plain = buildJsonLd({ page: build(), locale: "uk", siteUrl: "https://example.com" });
  assert.deepEqual(
    plain.map((item) => item["@type"]),
    ["Product", "BreadcrumbList"],
  );

  const withFaq = buildJsonLd({
    page: build({ T10_faq: { show: true, h2: "Питання", items: [{ q: "Q?", a: "A." }] } }),
    locale: "en",
    siteUrl: "https://example.com",
  });
  assert.deepEqual(
    withFaq.map((item) => item["@type"]),
    ["Product", "BreadcrumbList", "FAQPage"],
  );
  assert.equal(withFaq[0].url, "https://example.com/en/products/demo");
});

test("JSON-LD levels without a page are left out of the breadcrumb", () => {
  const [, breadcrumb] = buildJsonLd({ page: build(), locale: "uk", siteUrl: "https://example.com" });
  const names = (breadcrumb.itemListElement as Array<{ name: string }>).map((item) => item.name);

  assert.deepEqual(names, ["Головна", "Продукція", "Demo"]);
});

test("serialised JSON-LD cannot close the script tag", () => {
  assert.equal(serializeJsonLd({ a: "</script>" }).includes("</script>"), false);
});
