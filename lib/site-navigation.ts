import type { Locale } from "@/i18n/config";

export type LocalizedName = Record<Locale, string>;

export type DiagnosticArea = {
  id: `da-${string}`;
  slug: string;
  name: LocalizedName;
};

export type ProductType = {
  id: `pt-${string}`;
  slug: string;
  name: LocalizedName;
  areaSlugs: string[];
};

export type Brand = {
  id: `brd-${string}`;
  slug: string;
  name: LocalizedName;
};

export type HeaderNavigationLink = {
  label: string;
  href: string;
  children?: HeaderNavigationLink[];
};

export type HeaderNavigationItem = HeaderNavigationLink & {
  children?: HeaderNavigationLink[];
};

export const diagnosticAreas = [
  { id: "da-immunoassay", slug: "immunoassay", name: { uk: "Імуноаналіз", en: "Immunoassay" } },
  { id: "da-autoimmune-testing", slug: "autoimmune-testing", name: { uk: "Автоімунне тестування", en: "Autoimmune testing" } },
  { id: "da-biochemistry", slug: "biochemistry", name: { uk: "Біохімія", en: "Biochemistry" } },
  { id: "da-electrolytes", slug: "electrolytes", name: { uk: "Електроліти", en: "Electrolytes" } },
  { id: "da-integrated-systems", slug: "integrated-systems", name: { uk: "Інтегровані системи", en: "Integrated systems" } },
  { id: "da-lab-automation", slug: "lab-automation", name: { uk: "Автоматизація лабораторії", en: "Laboratory automation" } },
  { id: "da-molecular-diagnostics", slug: "molecular-diagnostics", name: { uk: "Молекулярна діагностика", en: "Molecular diagnostics" } },
  { id: "da-poct", slug: "poct", name: { uk: "Експрес-діагностика POCT", en: "POCT" } },
  { id: "da-immunohematology", slug: "immunohematology", name: { uk: "Імуногематологія", en: "Immunohematology" } },
  { id: "da-diabetes", slug: "diabetes", name: { uk: "Діабет", en: "Diabetes" } },
  { id: "da-hemoglobinopathies", slug: "hemoglobinopathies", name: { uk: "Гемоглобінопатії", en: "Hemoglobinopathies" } },
  { id: "da-infectious-diseases", slug: "infectious-diseases", name: { uk: "Інфекційні захворювання", en: "Infectious diseases" } },
  { id: "da-microbiology", slug: "microbiology", name: { uk: "Мікробіологія", en: "Microbiology" } },
  { id: "da-newborn-screening", slug: "newborn-screening", name: { uk: "Неонатальний скринінг", en: "Newborn screening" } },
  { id: "da-quality-control", slug: "quality-control", name: { uk: "Контроль якості", en: "Quality control" } },
  { id: "da-toxicology", slug: "toxicology", name: { uk: "Токсикологія", en: "Toxicology" } },
  { id: "da-microplate-automation", slug: "microplate-automation", name: { uk: "Автоматизація мікропланшетів", en: "Microplate automation" } },
  { id: "da-western-blot", slug: "western-blot", name: { uk: "Western Blot", en: "Western blot" } },
  { id: "da-incubation", slug: "incubation", name: { uk: "Інкубація", en: "Incubation" } },
] as const satisfies readonly DiagnosticArea[];

export const productTypes = [
  {
    id: "pt-equipment",
    slug: "equipment",
    name: { uk: "Лабораторне обладнання", en: "Laboratory equipment" },
    areaSlugs: [
      "immunoassay",
      "autoimmune-testing",
      "infectious-diseases",
      "biochemistry",
      "electrolytes",
      "integrated-systems",
      "lab-automation",
      "molecular-diagnostics",
      "immunohematology",
      "diabetes",
      "hemoglobinopathies",
      "newborn-screening",
      "toxicology",
      "microplate-automation",
      "western-blot",
      "incubation",
    ],
  },
  {
    id: "pt-reagents-tests",
    slug: "reagents-tests",
    name: { uk: "Реагенти й тести", en: "Reagents and tests" },
    areaSlugs: ["immunoassay", "biochemistry", "electrolytes", "molecular-diagnostics", "poct", "microbiology"],
  },
  {
    id: "pt-quality-control",
    slug: "quality-control",
    name: { uk: "Контроль якості", en: "Quality control" },
    areaSlugs: ["quality-control", "immunoassay", "biochemistry", "molecular-diagnostics"],
  },
  {
    id: "pt-consumables-accessories",
    slug: "consumables-accessories",
    name: { uk: "Витратні матеріали й аксесуари", en: "Consumables and accessories" },
    areaSlugs: [],
  },
  {
    id: "pt-software",
    slug: "software",
    name: { uk: "Програмне забезпечення", en: "Software" },
    areaSlugs: [],
  },
] as const satisfies readonly ProductType[];

export const brands = [
  { id: "brd-snibe", slug: "snibe", name: { uk: "SNIBE", en: "SNIBE" } },
  { id: "brd-biorad", slug: "bio-rad", name: { uk: "Bio-Rad", en: "Bio-Rad" } },
] as const satisfies readonly Brand[];

export function getProductType(slug: string) {
  return productTypes.find((productType) => productType.slug === slug);
}

export function getDiagnosticArea(slug: string) {
  return diagnosticAreas.find((area) => area.slug === slug);
}

export function getAreaForProductType(typeSlug: string, areaSlug: string) {
  const productType = getProductType(typeSlug);

  if (!productType || !productType.areaSlugs.some((slug) => slug === areaSlug)) {
    return undefined;
  }

  return getDiagnosticArea(areaSlug);
}

export function getBrand(slug: string) {
  return brands.find((brand) => brand.slug === slug);
}

export function localizePath(locale: Locale, path: string) {
  return `/${locale}${path === "/" ? "" : path}`;
}

type NavigationLabels = {
  products: string;
  allProducts: string;
  brands: string;
  allBrands: string;
  about: string;
  services: string;
  contacts: string;
};

export function buildHeaderNavigation(
  locale: Locale,
  labels: NavigationLabels,
): HeaderNavigationItem[] {
  const productsPath = localizePath(locale, "/products");
  const brandsPath = localizePath(locale, "/brands");

  return [
    {
      label: labels.products,
      href: productsPath,
      children: [
        { label: labels.allProducts, href: productsPath },
        ...productTypes.map((productType) => ({
          label: productType.name[locale],
          href: `${productsPath}/${productType.slug}`,
          children: productType.areaSlugs.map((areaSlug) => {
            const area = getDiagnosticArea(areaSlug);

            if (!area) {
              throw new Error(`Unknown diagnostic area: ${areaSlug}`);
            }

            return {
              label: area.name[locale],
              href: `${productsPath}/${productType.slug}/${area.slug}`,
            };
          }),
        })),
      ],
    },
    {
      label: labels.brands,
      href: brandsPath,
      children: [
        { label: labels.allBrands, href: brandsPath },
        ...brands.map((brand) => ({
          label: brand.name[locale],
          href: `${brandsPath}/${brand.slug}`,
        })),
      ],
    },
    { label: labels.about, href: localizePath(locale, "/about") },
    { label: labels.services, href: localizePath(locale, "/services") },
    { label: labels.contacts, href: localizePath(locale, "/contacts") },
  ];
}
