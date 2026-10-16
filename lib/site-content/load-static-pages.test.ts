import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test, { afterEach, beforeEach, describe } from "node:test";

import {
  loadAboutPage,
  loadAboutPageAllLocales,
  loadContactsPage,
  loadContactsPageAllLocales,
  loadPrivacyPage,
  loadPrivacyPageAllLocales,
  loadServicesPage,
  loadServicesPageAllLocales,
} from "./load.ts";
import { aboutAreaIds, serviceIds } from "./schema-static-pages.ts";

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

const aboutPage = () => ({
  seo: { title: "About | LabWell", description: "About description" },
  h1: "About us",
  lead: "Introductory text.",
  facts: { items: [{ value: "15", label: "years" }, { value: "10", label: "specialists" }] },
  intro: { title: "What we do", paragraphs: ["Paragraph."] },
  audience: { title: "Who we work with", text: "Laboratories." },
  areas: { title: "Areas", text: "Catalog areas.", items: aboutAreaIds.map((id) => ({ id, title: id })) },
  approach: {
    title: "How we work",
    items: serviceIds.map((id) => ({ id, title: id, text: "Description" })),
    link: { label: "Services", href: "/services" },
  },
  team: { title: "Team", text: "Engineers." },
  quality: { title: "Quality", text: "ISO 13485." },
  why: { title: "Why us", items: [{ title: "Reason", text: "Because." }] },
  clients: { title: "Clients", text: "Laboratories." },
  contact: { title: "Contact", text: "Get in touch.", link: { label: "Contact us", href: "/contacts" } },
});

describe("static page content (temporary folder)", () => {
  let root: string;

  function write(section: "services" | "contacts" | "about" | "privacy", locale: "uk" | "en", data: unknown) {
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

  test("loads a valid about page", () => {
    write("about", "uk", aboutPage());
    assert.equal(loadAboutPage("uk").facts.items[0].value, "15");
  });

  test("rejects an about area that is not a catalog direction", () => {
    const page = aboutPage();
    page.areas.items[0].id = "equipment" as (typeof page.areas.items)[number]["id"];
    write("about", "uk", page);
    assert.throws(() => loadAboutPage("uk"), /pages\/about\/uk\.json[\s\S]*areas/);
  });

  test("privacy blocks are text, a list or the contact card, nothing else", () => {
    const page = {
      seo: { title: "Privacy | LabWell", description: "Privacy description" },
      h1: "Privacy",
      lead: "Lead.",
      effective: "From today.",
      contentsTitle: "Contents",
      contactLabels: { email: "Email", phone: "Phone", address: "Address" },
      sections: [{ id: "data", title: "Data", blocks: ["Text.", { list: ["a", "b"] }, { contact: true }] }],
    };
    write("privacy", "uk", page);
    assert.equal(loadPrivacyPage("uk").sections[0].blocks.length, 3);

    write("privacy", "en", { ...page, sections: [{ id: "data", title: "Data", blocks: [{ table: [] }] }] });
    assert.throws(() => loadPrivacyPage("en"), /pages\/privacy\/en\.json[\s\S]*sections/);
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
    assert.equal(loadAboutPageAllLocales().length, 2);
    assert.equal(loadPrivacyPageAllLocales().length, 2);
  });
});
