"use client";

import { useState } from "react";

import styles from "./clinical-page.module.css";

export function ClinicalTestList({
  tests,
  locale,
}: {
  tests: Array<{ id: string; name: string }>;
  locale: "uk" | "en";
}) {
  const [expanded, setExpanded] = useState(false);
  const canCollapse = tests.length > 8;
  return (
    <>
      <ul className={styles.testGrid} data-expanded={expanded}>
        {tests.map((test) => <li key={test.id}>{test.name}</li>)}
      </ul>
      {canCollapse ? (
        <button
          type="button"
          className={styles.expandButton}
          data-desktop-visible={tests.length > 12}
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded
            ? locale === "uk" ? "Згорнути" : "Show less"
            : locale === "uk" ? `Показати всі ${tests.length} тестів` : `Show all ${tests.length} tests`}
        </button>
      ) : null}
    </>
  );
}
