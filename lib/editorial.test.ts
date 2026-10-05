import assert from "node:assert/strict";
import test from "node:test";

import { showEditorialContent } from "./editorial.ts";

test("editorial content is shown only in development", () => {
  assert.equal(showEditorialContent("development"), true);
  assert.equal(showEditorialContent("production"), false);
  assert.equal(showEditorialContent("test"), false);
  assert.equal(showEditorialContent(undefined), showEditorialContent(process.env.NODE_ENV));
});
