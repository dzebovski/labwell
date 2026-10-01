import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test, { afterEach, beforeEach } from "node:test";

import { product, shared } from "./fixtures.ts";
import { hasProductContent, listProductSlugs, loadProduct, loadShared } from "./load.ts";

let root: string;

function write(relative: string, data: unknown) {
  const file = path.join(root, relative);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, typeof data === "string" ? data : JSON.stringify(data));
}

beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), "site-content-"));
  process.env.SITE_CONTENT_DIR = root;
});

afterEach(() => {
  delete process.env.SITE_CONTENT_DIR;
  rmSync(root, { recursive: true, force: true });
});

test("loads a valid product and the shared blocks", () => {
  write("products/demo/uk.json", product());
  write("shared/uk.json", shared());

  assert.equal(loadProduct("demo", "uk").T2_hero.h1, "Demo — аналізатор");
  assert.equal(loadShared("uk").labwell.items[0].title, "Постачання");
});

test("lists folders that have files and ignores empty ones", () => {
  write("products/demo/uk.json", product());
  mkdirSync(path.join(root, "products", "empty"));

  assert.deepEqual(listProductSlugs(), ["demo"]);
  assert.equal(hasProductContent("demo"), true);
  assert.equal(hasProductContent("empty"), false);
  assert.equal(hasProductContent("missing"), false);
});

test("invalid JSON fails with the file name and the parser message", () => {
  write("products/demo/uk.json", '{ "slug": "demo" "url": "x" }');

  assert.throws(() => loadProduct("demo", "uk"), /products\/demo\/uk\.json[\s\S]*invalid JSON/);
});

test("a missing locale file fails clearly instead of returning an empty page", () => {
  write("products/demo/uk.json", product());

  assert.throws(() => loadProduct("demo", "en"), /products\/demo\/en\.json[\s\S]*missing/);
});

test("a misspelled key is an error that names the path", () => {
  const broken = { ...product(), T2_hero: { ...product().T2_hero, keyfacts: [] } };
  write("products/demo/uk.json", broken);

  assert.throws(() => loadProduct("demo", "uk"), /T2_hero/);
});

test("a shown block without its data is an error", () => {
  write("products/demo/uk.json", product({ T4_specs: { show: true } as never }));

  assert.throws(() => loadProduct("demo", "uk"), /T4_specs/);
});

test("slug and url must match the folder", () => {
  write("products/other/uk.json", product());

  assert.throws(() => loadProduct("other", "uk"), /"slug" is "demo", but the folder is "other"/);

  write("products/demo/uk.json", product({ url: "/products/elsewhere" }));
  assert.throws(() => loadProduct("demo", "uk"), /"url" is "\/products\/elsewhere"/);
});

test("shared content with an unknown form field is rejected", () => {
  const broken = shared();
  (broken.contact.form.fields[0] as { name: string }).name = "company";
  write("shared/uk.json", broken);

  assert.throws(() => loadShared("uk"), /shared\/uk\.json/);
});

test("an unknown benefit icon fails at load time with the file, the path and the name", () => {
  write(
    "products/demo/uk.json",
    product({
      T5_benefits: {
        show: true,
        h2: "Переваги",
        items: [
          { icon: "truck", h3: "Одна", text: "Текст." },
          { icon: "ruller" as never, h3: "Друга", text: "Текст." },
        ],
      },
    }),
  );

  assert.throws(
    () => loadProduct("demo", "uk"),
    (error: Error) =>
      /products\/demo\/uk\.json/.test(error.message) &&
      /T5_benefits\.items\[1\]\.icon/.test(error.message) &&
      /unknown icon "ruller"/.test(error.message) &&
      /ruler/.test(error.message),
  );
});

test("an icon that is in the list (ruler) is accepted", () => {
  write(
    "products/demo/uk.json",
    product({
      T5_benefits: { show: true, h2: "Переваги", items: [{ icon: "ruler", h3: "Розмір", text: "Текст." }] },
    }),
  );

  assert.equal(loadProduct("demo", "uk").T5_benefits.show, true);
});

test("an unknown icon in the shared LabWell block fails at load time", () => {
  const broken = shared();
  broken.labwell.items[0].icon = "no-such-icon" as never;
  write("shared/uk.json", broken);

  assert.throws(
    () => loadShared("uk"),
    /shared\/uk\.json[\s\S]*unknown icon "no-such-icon"[\s\S]*labwell\.items\[0\]\.icon/,
  );
});
