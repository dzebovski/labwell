import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { tests } from "./fixtures-pages.ts";
import {
  countUniqueTests,
  fillCount,
  filterMenu,
  isFilterActive,
  missingTestPrefill,
  normalizeQuery,
  type MenuGroup,
} from "./test-search.ts";

const groups: MenuGroup[] = tests().groups.map((group) => ({ id: group.id, name: group.name.uk, tests: group.tests }));

test("without a search or a filter everything is listed and there is no counter", () => {
  const result = filterMenu(groups, { query: "  ", groupId: undefined });

  assert.equal(result.found, null);
  assert.equal(result.groups, groups);
  assert.equal(isFilterActive({ query: "" }), false);
  assert.equal(isFilterActive({ query: " tsh " }), true);
  assert.equal(isFilterActive({ query: "", groupId: "thyroid" }), true);
});

test("the counter counts unique tests: a test in two groups counts once, both groups still list it", () => {
  const result = filterMenu(groups, { query: "anti-tpo" });

  assert.equal(result.found, 1);
  assert.deepEqual(result.groups.map((group) => group.id), ["thyroid", "autoimmune"]);
  assert.equal(countUniqueTests(groups), 3);
});

test("search ignores case and extra spaces and matches names with a leading asterisk", () => {
  assert.equal(normalizeQuery("  TSH   (3rd  Generation) "), "tsh (3rd generation)");
  assert.deepEqual(filterMenu(groups, { query: "tsh (3rd  GENERATION)" }).groups.map((g) => g.id), ["thyroid"]);
  assert.equal(filterMenu(groups, { query: "afp" }).found, 1);
});

test("a group filter shows one group; with a query it narrows that group only", () => {
  const onlyGroup = filterMenu(groups, { query: "", groupId: "autoimmune" });
  assert.equal(onlyGroup.found, 2);
  assert.deepEqual(onlyGroup.groups.map((group) => group.id), ["autoimmune"]);

  const both = filterMenu(groups, { query: "tsh", groupId: "autoimmune" });
  assert.equal(both.found, 0);
  assert.deepEqual(both.groups, []);
});

test("nothing found gives zero groups and a counter of 0", () => {
  const result = filterMenu(groups, { query: "no such test" });

  assert.equal(result.found, 0);
  assert.deepEqual(result.groups, []);
});

test("labels get their numbers; the contact prefill carries the query", () => {
  assert.equal(fillCount("Знайдено {count}", 12), "Знайдено 12");
  assert.equal(fillCount("{count} tests", 3), "3 tests");
  assert.equal(missingTestPrefill("Шукаю тест: ", "  Ferritin2 "), "Шукаю тест: Ferritin2");
  assert.equal(missingTestPrefill(undefined, "TSH"), "TSH");
});

test("CLIA menu: 298 rows, 277 unique ids; the page never states those numbers in a counter without a filter", () => {
  const file = path.join(process.cwd(), "content", "test-menus", "snibe-clia-test-menu", "tests.json");
  const data = JSON.parse(readFileSync(file, "utf8")) as { groups: Array<{ id: string; name: { uk: string }; tests: Array<{ id: string; name: string }> }> };
  const menu: MenuGroup[] = data.groups.map((group) => ({ id: group.id, name: group.name.uk, tests: group.tests }));

  assert.equal(menu.length, 22);
  assert.equal(menu.reduce((sum, group) => sum + group.tests.length, 0), 298);
  assert.equal(countUniqueTests(menu), 277);
  assert.equal(filterMenu(menu, { query: "" }).found, null);
  // TSH is in one group; Anti-TPO stands in two (thyroid and autoimmune) but is one test.
  assert.equal(filterMenu(menu, { query: "Anti-TPO" }).found, 1);
  assert.ok(filterMenu(menu, { query: "Anti-TPO" }).groups.length >= 2);
});
