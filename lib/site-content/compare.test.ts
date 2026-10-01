import assert from "node:assert/strict";
import test from "node:test";

import { barRatios, buildCompareRows, isMissing, numericValue } from "./compare.ts";

test("missing values are recognised in both languages", () => {
  assert.equal(isMissing("н/д"), true);
  assert.equal(isMissing(" N/A "), true);
  assert.equal(isMissing("Так"), false);
});

test("numeric values: plain numbers, 'up to', thousands with a space; words are not numbers", () => {
  assert.equal(numericValue("144"), 144);
  assert.equal(numericValue("до 450"), 450);
  assert.equal(numericValue("до 1 000"), 1000);
  assert.equal(numericValue("до 4 000"), 4000);
  assert.equal(numericValue("Так"), undefined);
  assert.equal(numericValue("72 позиції"), undefined);
});

test("bars appear only for rows of different numbers; the largest is 1", () => {
  assert.deepEqual(barRatios(["16", "40", "144", "144"]), [16 / 144, 40 / 144, 1, 1]);
  assert.deepEqual(barRatios(["180", "180", "180"]), [undefined, undefined, undefined]);
  assert.deepEqual(barRatios(["н/д", "н/д", "до 2 400", "до 4 000"]), [undefined, undefined, 0.6, 1]);
  assert.deepEqual(barRatios(["н/д", "Так", "Так"]), [undefined, undefined, undefined]);
  assert.deepEqual(barRatios(["12", "Так"]), [undefined, undefined]);
  assert.deepEqual(barRatios(["н/д", "5"]), [undefined, undefined]);
});

test("rows are dropped when every value is missing or a placeholder is in them", () => {
  const rows = buildCompareRows([
    { label: "Зразки", values: ["16", "40"] },
    { label: "Порожньо", values: ["н/д", "н/д"] },
    { label: "Чернетка", values: ["[ЗНАЧЕННЯ]", "5"] },
    { label: "Лінія", detail: "за даними Snibe", values: ["н/д", "Так"] },
  ]);

  assert.deepEqual(rows.map((row) => row.label), ["Зразки", "Лінія"]);
  assert.equal(rows[1].cells[0].missing, true);
  assert.equal(rows[1].cells[1].missing, false);
  assert.equal(rows[1].detail, "за даними Snibe");
});
