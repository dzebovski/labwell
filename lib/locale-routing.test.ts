import assert from "node:assert/strict";
import test from "node:test";

import {
  resolvePreferredLocale,
  switchLocale,
  withLocale,
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

test("switches only the first path segment", () => {
  assert.equal(switchLocale("/uk/products/item", "en"), "/en/products/item");
  assert.equal(switchLocale("/en/products/item", "uk"), "/uk/products/item");
  assert.equal(switchLocale("/", "en"), "/en");
  assert.equal(switchLocale("/products", "en"), "/en/products");
});

test("prefixes site paths with a locale", () => {
  assert.equal(withLocale("uk", "/"), "/uk");
  assert.equal(withLocale("en", "/products/d-10"), "/en/products/d-10");
});
