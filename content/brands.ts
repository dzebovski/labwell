/**
 * Manufacturers shown on the site. The id is also the URL segment: /brands/{id}.
 * The order here is the order of the brand columns in the "Brands" menu.
 */
export const brands = [
  {
    id: "bio-rad",
    name: "Bio-Rad",
    logo: { src: "/bio-rad-logo 1.png", width: 133, height: 36 },
  },
  {
    id: "snibe",
    name: "Snibe",
    logo: { src: "/snibe-logo-1.png", width: 113, height: 36 },
  },
] as const satisfies readonly Brand[];

export type BrandLogo = Readonly<{ src: string; width: number; height: number }>;
export type Brand = Readonly<{ id: string; name: string; logo?: BrandLogo }>;
export type BrandId = (typeof brands)[number]["id"];
