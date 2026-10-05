import assert from "node:assert/strict";
import test from "node:test";

import { listPages } from "./catalog.ts";
import { clinicalTestGroups, hasClinicalContent, loadClinicalContent } from "./clinical-content.ts";
import { getRouteTarget } from "./catalog.ts";

const pages = listPages("clinical");

test("every published clinical route has validated localized template K content", () => {
  assert.equal(pages.length, 8);
  for (const entry of pages) {
    assert.equal(hasClinicalContent(entry.slug), true, entry.path);
    const uk = loadClinicalContent(entry.slug, "uk", entry.path);
    const en = loadClinicalContent(entry.slug, "en", entry.path);
    assert.equal(uk.url, en.url);
    assert.equal(uk.tests.kind, en.tests.kind);
    assert.equal(uk.qc.show, false);
    assert.equal(en.qc.show, false);
    assert.equal(uk.T10_faq.items?.length, 3);
    assert.equal(en.T10_faq.items?.length, 3);
    for (const locale of ["uk", "en"] as const) {
      const content = locale === "uk" ? uk : en;
      if (content.tests.kind === "menu-groups") {
        assert.ok(clinicalTestGroups(content, locale).every((group) => group.tests.length > 0));
      }
      for (const item of content.equipment.items ?? []) {
        assert.ok(getRouteTarget(item.href), `${entry.path}: missing ${item.href}`);
      }
    }
  }
});

test("retired clinical pages are absent from the clinical registry", () => {
  assert.equal(getRouteTarget("/clinical-directions/cardiology/cardiac-advance-qc"), undefined);
  assert.equal(getRouteTarget("/clinical-directions/blood-banks/gel-tube-testing"), undefined);
  assert.ok(getRouteTarget("/clinical-directions/diabetes-and-metabolism/hba1c-analyzers"));
});
