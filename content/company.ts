/**
 * What the site says about LabWell itself: the Organization and WebSite structured data, the
 * llms.txt summary and the default social-card text.
 *
 * Only confirmed facts live here (LabWell's answers of 2026-10-01: an official distributor of
 * Snibe and Bio-Rad in Ukraine). The phone number and e-mail come from `content/shared/`, where they
 * are placeholders until LabWell sends them; the address is not known and is not listed at all.
 */
import type { LocalizedText } from "./define.ts";

export const company = {
  name: "LabWell",
  /**
   * Legal name and address. Temporary data from LabWell (2026-10-05): replace before launch (task 16).
   * Not rendered yet — the contacts page and Organization address come with task 12.
   */
  legalName: { uk: "ТОВ «ЛАБВЕЛЛ»", en: "LABWELL LLC" } satisfies LocalizedText,
  address: {
    uk: "04050, м. Київ, вул. Глибочицька, 40У",
    en: "40U Hlybochytska St., Kyiv, 04050, Ukraine",
  } satisfies LocalizedText,
  /** Public path of the logo (the same file the header uses). */
  logo: { src: "/logo_LABWELL.png", width: 4000, height: 893 },
  /** Manufacturers LabWell distributes; the names match `content/brands.ts`. */
  distributorOf: ["Snibe", "Bio-Rad"],
  country: { uk: "Україна", en: "Ukraine" } satisfies LocalizedText,
  /** The home page title after "LabWell — ". */
  tagline: {
    uk: "офіційний дистриб'ютор Snibe і Bio-Rad в Україні",
    en: "official distributor of Snibe and Bio-Rad in Ukraine",
  } satisfies LocalizedText,
  /** One sentence: who LabWell is. The first sentence of a page description answers "what is this". */
  description: {
    uk: "LabWell — офіційний дистриб'ютор Snibe і Bio-Rad в Україні: обладнання, реагенти та контролі для клінічних лабораторій.",
    en: "LabWell is an official distributor of Snibe and Bio-Rad in Ukraine: instruments, reagents and controls for clinical laboratories.",
  } satisfies LocalizedText,
  /** Profiles on other sites (Facebook, LinkedIn…). Empty until LabWell names them. */
  sameAs: [] as readonly string[],
} as const;
