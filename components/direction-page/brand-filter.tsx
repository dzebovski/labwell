"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import type { BrandFilterOption } from "@/lib/site-content/direction-model";

import styles from "./direction-page.module.css";

export type BrandFilterLabels = {
  /** Accessible name of the group of buttons. */
  group: string;
  /** "Brand:" in front of the buttons. */
  brand: string;
  all: string;
  /** "Showing {shown} of {total}", announced after the choice changes. */
  status: string;
};

type State = { active: string | undefined; setActive: (brand: string | undefined) => void };

const BrandFilterState = createContext<State>({ active: undefined, setActive: () => {} });

/**
 * Brand filter of a list of cards. The cards are rendered on the server and stay in the HTML: without
 * JavaScript all of them are shown and the buttons are hidden (see `BrandFilterBar`). Put the provider around
 * every card the buttons should affect, wrap each card in `FilterItem`, and render the buttons once.
 */
export function BrandFilter({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<string | undefined>(undefined);
  return <BrandFilterState.Provider value={{ active, setActive }}>{children}</BrandFilterState.Provider>;
}

export function BrandFilterBar({
  options,
  total,
  labels,
}: {
  options: BrandFilterOption[];
  total: number;
  labels: BrandFilterLabels;
}) {
  const { active, setActive } = useContext(BrandFilterState);
  const shown = active ? (options.find((option) => option.id === active)?.count ?? total) : total;

  return (
    <div role="group" aria-label={labels.group} className={styles.filter}>
      <noscript>
        <style>{`.${styles.filter}{display:none}`}</style>
      </noscript>
      <span className={styles.filterLabel}>{labels.brand}</span>
      <button type="button" aria-pressed={!active} className={styles.chip} onClick={() => setActive(undefined)}>
        {labels.all} · {total}
      </button>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={active === option.id}
          className={styles.chip}
          onClick={() => setActive(option.id)}
        >
          {option.name} · {option.count}
        </button>
      ))}
      <span className="sr-only" role="status" aria-live="polite">
        {labels.status.replace("{shown}", String(shown)).replace("{total}", String(total))}
      </span>
    </div>
  );
}

/** Renders its card only when no brand is picked or the card belongs to the picked one. */
export function FilterItem({ brandIds, children }: { brandIds: string[]; children: ReactNode }) {
  const { active } = useContext(BrandFilterState);
  if (active && !brandIds.includes(active)) return null;
  return <>{children}</>;
}
