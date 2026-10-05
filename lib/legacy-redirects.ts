/**
 * Permanent (308) redirects from the old per-product addresses to the group pages and test menus
 * that replaced them (PRODUCT-PAGES-PLAN.md, section 5). The anchor is the old slug: it is the
 * `anchor` of the product on the target page (G3 / compare column).
 *
 * `/products/d-10` is not here on purpose: its target, the HbA1c category page, does not exist yet.
 */

/**
 * Pages that answer 200 today but are going to be redirected (discontinued). Navigation must not link
 * to them: the link would turn into a redirect as soon as the target exists.
 */
export const pendingRedirects: readonly string[] = ["/products/d-10"];

const groupMembers: Readonly<Record<string, readonly string[]>> = {
  satlars: ["satlars-t8", "satlars-tca", "satlars-mini-t8"],
  "molecision-mp": ["molecision-mp-32", "molecision-mp-96"],
  "id-card-equipment": ["ih-reader-24"],
  "immunohematology-reagents": ["gel-testing", "tube-testing", "ih-systems-reagents"],
  "culture-media": ["chromogenic-culture-media", "blood-agar-media"],
  "bio-rad-software": ["unityweb", "unity-real-time", "unity-next-peer-qc", "bricare", "ih-com"],
};

/** Old address (without locale) → new address (with the anchor, when there is one). */
export const legacyRedirects: Readonly<Record<string, string>> = {
  ...Object.fromEntries(
    Object.entries(groupMembers).flatMap(([group, slugs]) =>
      slugs.map((slug) => [`/products/${slug}`, `/products/${group}#${slug}`]),
    ),
  ),
  "/products/maglumi-clia-test-menu-278-parameters": "/test-menus/snibe-clia-test-menu",
  "/products/biochemistry-test-menu": "/test-menus/snibe-biochemistry-test-menu",
  "/clinical-directions/blood-banks/gel-tube-testing": "/products/immunohematology-reagents",
  "/clinical-directions/cardiology/cardiac-advance-qc": "/clinical-directions/cardiology",
};

/** Redirect rules for `next.config.ts`: one per old address, for both locales. */
export function legacyRedirectRules() {
  return Object.entries(legacyRedirects).map(([source, destination]) => ({
    source: `/:locale(uk|en)${source}`,
    destination: `/:locale${destination}`,
    permanent: true,
  }));
}

/** Addresses that redirect now or soon: menus must not link to them. */
export function isRedirectedPath(path: string): boolean {
  return Object.hasOwn(legacyRedirects, path) || pendingRedirects.includes(path);
}
