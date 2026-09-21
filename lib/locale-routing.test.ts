import assert from "node:assert/strict";
import test from "node:test";

import {
  localizePath,
  resolvePreferredLocale,
} from "./locale-routing.ts";

test("resolves valid locale cookies", () => {
  assert.equal(resolvePreferredLocale("uk"), "uk");
  assert.equal(resolvePreferredLocale("en"), "en");
});

test("falls back to Ukrainian for missing or invalid cookies", () => {
  assert.equal(resolvePreferredLocale(), "uk");
  assert.equal(resolvePreferredLocale(null), "uk");
  assert.equal(resolvePreferredLocale("de"), "uk");
});

test("localizes only the first path segment", () => {
  assert.equal(localizePath("/uk/products/item", "en"), "/en/products/item");
  assert.equal(localizePath("/en/products/item", "uk"), "/uk/products/item");
  assert.equal(localizePath("/", "en"), "/en");
});
