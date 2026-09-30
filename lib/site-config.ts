/** Public origin of the site, for canonical URLs and JSON-LD. Test hosting by default; set NEXT_PUBLIC_SITE_URL to the production domain at launch. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://labwell.vercel.app").replace(/\/$/, "");
