import assert from "node:assert/strict";
import test from "node:test";

import enDictionary from "../i18n/dictionaries/en.json" with { type: "json" };
import ukDictionary from "../i18n/dictionaries/uk.json" with { type: "json" };
import { isRedirectedPath } from "./legacy-redirects.ts";
import { buildFooter } from "./site-footer.ts";
import { buildHeaderNavigation } from "./site-navigation.ts";

const uk = buildHeaderNavigation("uk", ukDictionary.navigation);
const en = buildHeaderNavigation("en", enDictionary.navigation);

test("the footer has the catalog, clinical directions, brands and the company links", () => {
  const footer = buildFooter(uk, { companyTitle: "Компанія" });

  assert.deepEqual(
    footer.columns.map((column) => column.id),
    ["products", "clinical-directions", "brands", "company"],
  );
  const company = footer.columns.find((column) => column.id === "company")!;
  assert.deepEqual(
    company.links.map((link) => link.href),
    ["/uk/services", "/uk/about", "/uk/contacts"],
  );
  const brands = footer.columns.find((column) => column.id === "brands")!;
  assert.deepEqual(brands.links.map((link) => link.label), ["Bio-Rad", "Snibe"]);
});

test("footer links are the menu's own links, in the page language, and none redirects", () => {
  for (const [locale, nav] of [["uk", uk], ["en", en]] as const) {
    const footer = buildFooter(nav, { companyTitle: "Company" });
    for (const column of footer.columns) {
      assert.ok(column.links.length > 0, column.id);
      for (const link of [...column.links, ...(column.href ? [{ label: column.title, href: column.href }] : [])]) {
        assert.ok(link.href.startsWith(`/${locale}`), link.href);
        assert.equal(link.href.includes("#"), false, link.href);
        assert.equal(isRedirectedPath(link.href.replace(/^\/(?:uk|en)/, "")), false, link.href);
      }
    }
  }
});

test("a redirected address is dropped even if the navigation still has it", () => {
  const nav = [
    ...uk,
    { type: "link" as const, id: "old", label: "Old", href: "/uk/products/gel-testing" },
    { type: "link" as const, id: "old2", label: "Old 2", href: "/uk/products/d-10" },
  ];
  const footer = buildFooter(nav, { companyTitle: "Компанія" });
  const hrefs = footer.columns.flatMap((column) => column.links.map((link) => link.href));

  assert.equal(hrefs.includes("/uk/products/gel-testing"), false);
  assert.equal(hrefs.includes("/uk/products/d-10"), false);
});

test("placeholder contacts are not shown, real ones are", () => {
  assert.equal(buildFooter(uk, { companyTitle: "К" }).contacts, undefined);
  assert.equal(buildFooter(uk, { companyTitle: "К", contact: { phone: "[ТЕЛЕФОН]", email: "[EMAIL]" } }).contacts, undefined);

  const partial = buildFooter(uk, { companyTitle: "К", contact: { phone: "[ТЕЛЕФОН]", email: "info@example.com" } }).contacts;
  assert.deepEqual(partial, { email: { label: "info@example.com", href: "mailto:info@example.com" } });

  const full = buildFooter(uk, { companyTitle: "К", contact: { phone: "+380 44 000-00-00", email: "info@example.com" } }).contacts;
  assert.equal(full?.phone?.href, "tel:+380440000000");
  assert.equal(full?.phone?.label, "+380 44 000-00-00");
});
