import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test, { afterEach, beforeEach, describe } from "node:test";

import { directionIds } from "./schema-directions.ts";
import {
  hasDirectionContent,
  listDirectionIds,
  loadDirection,
  loadDirectionAllLocales,
  loadHome,
  loadHomeAllLocales,
} from "./load.ts";

const direction = () => ({
  seo: { title: "Імуноаналіз — CLIA-аналізатори Snibe | LabWell", description: "Опис" },
  h1: "Імуноаналіз — CLIA-аналізатори Snibe",
  lead: "Перше речення. Друге речення.",
  faq: [],
});

const home = () => ({
  seo: { title: "LabWell", description: "Опис" },
  hero: { h1: "Заголовок", lead: "Лід" },
  brands: { snibe: { description: "Snibe" }, "bio-rad": { description: "Bio-Rad" } },
  contact: { text: "Запрошення" },
  services: { items: [{ id: "truck", title: "Постачання", text: "Текст" }] },
});

describe("content/directions and content/home (temporary folder)", () => {
  let root: string;

  function write(relative: string, data: unknown) {
    const file = path.join(root, relative);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, typeof data === "string" ? data : JSON.stringify(data));
  }

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), "site-directions-"));
    process.env.SITE_CONTENT_DIR = root;
  });

  afterEach(() => {
    delete process.env.SITE_CONTENT_DIR;
    rmSync(root, { recursive: true, force: true });
  });

  test("loads a direction and the home page", () => {
    write("directions/clia/uk.json", direction());
    write("home/uk.json", home());

    assert.equal(loadDirection("clia", "uk").h1, "Імуноаналіз — CLIA-аналізатори Snibe");
    assert.equal(loadHome("uk").hero.h1, "Заголовок");
  });

  test("lists direction folders that have files", () => {
    write("directions/clia/uk.json", direction());
    mkdirSync(path.join(root, "directions", "empty"));

    assert.deepEqual(listDirectionIds(), ["clia"]);
    assert.equal(hasDirectionContent("clia"), true);
    assert.equal(hasDirectionContent("empty"), false);
  });

  test("an id that is not in the taxonomy fails with the file and the known ids", () => {
    write("directions/not-a-direction/uk.json", direction());

    assert.throws(
      () => loadDirection("not-a-direction", "uk"),
      /directions\/not-a-direction\/uk\.json[\s\S]*not a group or direction[\s\S]*clia/,
    );
  });

  test("a misspelled key names its path", () => {
    write("directions/clia/uk.json", { ...direction(), heading: "x" });

    assert.throws(() => loadDirection("clia", "uk"), /directions\/clia\/uk\.json[\s\S]*heading/);
  });

  test("a missing locale file fails clearly", () => {
    write("directions/clia/uk.json", direction());

    assert.throws(() => loadDirection("clia", "en"), /directions\/clia\/en\.json[\s\S]*missing/);
    assert.throws(() => loadDirectionAllLocales("clia"), /directions\/clia\/en\.json/);
  });

  test("a broken FAQ entry is an error", () => {
    write("directions/clia/uk.json", { ...direction(), faq: [{ q: "Питання" }] });

    assert.throws(() => loadDirection("clia", "uk"), /faq/);
  });

  test("home: an unknown service icon names the icon and the path", () => {
    write("home/uk.json", { ...home(), services: { items: [{ id: "rocket", title: "a", text: "b" }] } });

    assert.throws(() => loadHome("uk"), /home\/uk\.json[\s\S]*unknown icon "rocket"[\s\S]*services\.items\[0\]\.id/);
  });

  test("home: a brand without a description is an error", () => {
    write("home/en.json", { ...home(), brands: { snibe: { description: "Snibe" } } });

    assert.throws(() => loadHome("en"), /home\/en\.json[\s\S]*bio-rad/);
  });

  test("home: an empty list of services is an error", () => {
    write("home/uk.json", { ...home(), services: { items: [] } });
    write("home/en.json", home());

    assert.throws(() => loadHomeAllLocales(), /home\/uk\.json[\s\S]*services/);
  });
});

describe("content/directions and content/home (the real files)", () => {
  test("every group and direction of the catalog has both languages and nothing else is there", () => {
    assert.deepEqual([...listDirectionIds()].sort(), [...directionIds].sort());
    assert.equal(directionIds.length, 13);
    for (const id of directionIds) loadDirectionAllLocales(id);
  });

  test("the home page loads in both languages", () => {
    const [uk, en] = loadHomeAllLocales();
    assert.equal(uk.services.items.length, 5);
    assert.equal(en.services.items.length, 5);
  });
});
