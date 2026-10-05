import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test, { afterEach, beforeEach, describe } from "node:test";

import {
  loadContactsPage,
  loadContactsPageAllLocales,
  loadServicesPage,
  loadServicesPageAllLocales,
} from "./load.ts";
import { serviceIds } from "./schema-static-pages.ts";

const servicesPage = () => ({
  seo: { title: "Services | LabWell", description: "Services description" },
  h1: "Services",
  lead: "Introductory text.",
  services: serviceIds.map((id) => ({ id, title: id, text: "Description" })),
  faq: { title: "FAQ", items: [{ question: "Question?", answer: "Answer." }] },
  contact: { title: "Contact", text: "Get in touch.", link: { label: "Contact us", href: "/contacts" } },
});

const contactsPage = () => ({
  seo: { title: "Contacts | LabWell", description: "Contact description" },
  h1: "Contacts",
  lead: "Contact us.",
  details: { title: "Reach us", phoneLabel: "Phone", addressLabel: "Address" },
  contact: { title: "Send an enquiry", text: "Tell us about your needs." },
});

describe("static page content (temporary folder)", () => {
  let root: string;

  function write(section: "services" | "contacts", locale: "uk" | "en", data: unknown) {
    const file = path.join(root, "pages", section, `${locale}.json`);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, typeof data === "string" ? data : JSON.stringify(data));
  }

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), "site-static-pages-"));
    process.env.SITE_CONTENT_DIR = root;
  });

  afterEach(() => {
    delete process.env.SITE_CONTENT_DIR;
    rmSync(root, { recursive: true, force: true });
  });

  test("loads valid services and contacts pages", () => {
    write("services", "uk", servicesPage());
    write("contacts", "uk", contactsPage());
    assert.equal(loadServicesPage("uk").services.length, 5);
    assert.equal(loadContactsPage("uk").details.phoneLabel, "Phone");
  });

  test("rejects an extra field and reports its file and path", () => {
    write("contacts", "uk", { ...contactsPage(), phone: "123" });
    assert.throws(() => loadContactsPage("uk"), /pages\/contacts\/uk\.json[\s\S]*phone/);
  });

  test("rejects a missing field and reports its file and path", () => {
    const incomplete: Partial<ReturnType<typeof servicesPage>> = servicesPage();
    delete incomplete.lead;
    write("services", "uk", incomplete);
    assert.throws(() => loadServicesPage("uk"), /pages\/services\/uk\.json[\s\S]*lead/);
  });

  test("rejects an unknown service id and reports its field path", () => {
    const page = servicesPage();
    page.services[0].id = "unknown" as (typeof page.services)[number]["id"];
    write("services", "uk", page);
    assert.throws(() => loadServicesPage("uk"), /pages\/services\/uk\.json[\s\S]*services\.\[0\]\.id|services\[0\]\.id/);
  });

  test("AllLocales detects mismatched uk/en keys", () => {
    write("contacts", "uk", contactsPage());
    write("contacts", "en", { ...contactsPage(), extra: "x" });
    assert.throws(() => loadContactsPageAllLocales(), /pages\/contacts\/en\.json[\s\S]*extra/);
  });
});

describe("static page content (real files)", () => {
  test("all locales of both pages validate and their keys match", () => {
    assert.equal(loadServicesPageAllLocales().length, 2);
    assert.equal(loadContactsPageAllLocales().length, 2);
  });
});
