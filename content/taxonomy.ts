import type { LocalizedText } from "./define.ts";

/**
 * Menu structure: groups (left rail) and their sections (middle column).
 *
 * - `id` values are referenced from content files and must not change; labels can be edited freely.
 * - The order of groups and sections here is the order in the menu.
 * - Items placed in a group without a `section` are listed in that group's default section
 *   ("Portfolio" in the catalog, "Other solutions" in clinical directions), shown last.
 */

export type TaxonomySection = Readonly<{ id: string; label: LocalizedText }>;
export type TaxonomyGroup = Readonly<{
  id: string;
  label: LocalizedText;
  sections: readonly TaxonomySection[];
}>;

/** "Product catalog" menu. Every product has exactly one place here: its canonical location. */
export const catalogGroups = [
  {
    id: "equipment",
    label: { en: "Equipment / Analyzers", uk: "Обладнання / Аналізатори" },
    sections: [
      { id: "clia", label: { en: "Immunochemical analyzers (CLIA)", uk: "Імунохімічні аналізатори (CLIA)" } },
      { id: "biochemistry", label: { en: "Biochemical analyzers", uk: "Біохімічні аналізатори" } },
      { id: "hba1c", label: { en: "HbA1c analyzers", uk: "Аналізатори HbA1c" } },
      { id: "blood-group", label: { en: "Blood group analyzers", uk: "Аналізатори груп крові" } },
      { id: "autoimmune-infectious", label: { en: "Autoimmune and infectious", uk: "Автоімунні та інфекційні" } },
      { id: "automation", label: { en: "Laboratory Automation (TLA)", uk: "Лабораторна автоматизація (TLA)" } },
      { id: "molecular", label: { en: "Molecular analyzers (PCR)", uk: "Молекулярні аналізатори (ПЛР)" } },
      { id: "hemostasis", label: { en: "Hemostasis analyzers", uk: "Аналізатори гемостазу" } },
    ],
  },
  {
    id: "reagents",
    label: { en: "Reagents and test systems", uk: "Реагенти та тест-системи" },
    sections: [],
  },
  {
    id: "qc-software",
    label: { en: "Quality Control (QC) and Software", uk: "Контроль якості (QC) та ПЗ" },
    sections: [
      { id: "qc", label: { en: "Quality Control (QC)", uk: "Контроль якості (QC)" } },
      { id: "software", label: { en: "Software", uk: "Програмне забезпечення" } },
    ],
  },
] as const satisfies readonly TaxonomyGroup[];

/**
 * "Clinical directions" menu. The id is also the URL segment of clinical pages:
 * /clinical-directions/{id}/{slug}.
 */
export const clinicalDirections = [
  {
    id: "diabetes-and-metabolism",
    label: { en: "Diabetes and metabolism", uk: "Діабет та метаболізм" },
    sections: [{ id: "hba1c-analyzers", label: { en: "HbA1c analyzers", uk: "Аналізатори HbA1c" } }],
  },
  {
    id: "thyroid-function",
    label: { en: "Thyroid function", uk: "Функція щитоподібної залози" },
    sections: [],
  },
  { id: "oncology", label: { en: "Oncology", uk: "Онкологія" }, sections: [] },
  {
    id: "infectious-diseases",
    label: { en: "Infectious diseases", uk: "Інфекційні захворювання" },
    sections: [],
  },
  {
    id: "autoimmune-diseases",
    label: { en: "Autoimmune diseases", uk: "Аутоімунні захворювання" },
    sections: [],
  },
  { id: "cardiology", label: { en: "Cardiology", uk: "Кардіологія" }, sections: [] },
  { id: "blood-banks", label: { en: "Blood banks", uk: "Банки крові" }, sections: [] },
] as const satisfies readonly TaxonomyGroup[];

type Order = {
  /** Position within the section. Defaults to 0; ties keep the order of content/index.ts. */
  order?: number;
};

type PlacementIn<Groups extends readonly TaxonomyGroup[], Key extends string> = {
  [G in Groups[number] as G["id"]]: { [K in Key]: G["id"] } & {
    section?: G["sections"][number]["id"];
  } & Order;
}[Groups[number]["id"]];

export type CatalogGroupId = (typeof catalogGroups)[number]["id"];
export type ClinicalDirectionId = (typeof clinicalDirections)[number]["id"];
export type CatalogPlacement = PlacementIn<typeof catalogGroups, "group">;
export type ClinicalPlacement = PlacementIn<typeof clinicalDirections, "direction">;
