/**
 * Comparison table shared by the group page (G2) and the series overview (C2.2).
 * Pure functions: what a cell shows, which cells get a proportional bar.
 */
import { hasPlaceholder } from "./placeholders.ts";

export type CompareColumn = {
  title: string;
  /** Link to the model's section or page; absent when the target does not exist. */
  href?: string;
  imageSrc?: string;
  imageAlt: string;
};

export type CompareCell = {
  text: string;
  /** The manufacturer gives no value ("н/д" / "n/a"): shown muted. */
  missing: boolean;
  /** 0..1 share of the row maximum, only for rows of plain numbers that differ. */
  ratio?: number;
};

export type CompareModel = {
  h2: string;
  eyebrow?: string;
  caption?: string;
  columns: CompareColumn[];
  rows: Array<{ label: string; detail?: string; cells: CompareCell[] }>;
  footnote?: string;
};

const missingPattern = /^(н\/д|n\/a)$/i;

export function isMissing(value: string): boolean {
  return missingPattern.test(value.trim());
}

/** "до 1 000" → 1000, "144" → 144, "Так" → undefined. */
export function numericValue(value: string): number | undefined {
  const match = /^(?:до |up to |≤\s*)?(\d[\d\s .,]*)$/i.exec(value.trim());
  if (!match) return undefined;
  const digits = match[1].replace(/[\s ]/g, "").replace(",", ".");
  const number = Number(digits);
  return Number.isFinite(number) ? number : undefined;
}

/**
 * Bars help to compare counts at a glance. A row gets them only when every given value is a
 * number, there are at least two, and they are not all equal (a row of equal values has nothing to compare).
 */
export function barRatios(values: string[]): Array<number | undefined> {
  const numbers = values.map((value) => (isMissing(value) ? null : numericValue(value)));
  const present = numbers.filter((value): value is number => typeof value === "number");
  const comparable = numbers.every((value) => value === null || typeof value === "number");
  if (!comparable || present.length < 2 || new Set(present).size < 2) return values.map(() => undefined);
  const max = Math.max(...present);
  return numbers.map((value) => (typeof value === "number" && max > 0 ? value / max : undefined));
}

export function buildCompareRows(
  rows: Array<{ label: string; detail?: string; values: string[] }>,
): CompareModel["rows"] {
  return rows
    .filter((row) => !hasPlaceholder(row.label + row.values.join("")))
    .filter((row) => row.values.some((value) => !isMissing(value)))
    .map((row) => {
      const ratios = barRatios(row.values);
      return {
        label: row.label,
        detail: row.detail,
        cells: row.values.map((value, index) => ({
          text: value,
          missing: isMissing(value),
          ratio: ratios[index],
        })),
      };
    });
}
