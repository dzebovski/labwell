/**
 * schema.org structured data of the site itself: Organization and WebSite, on every page.
 * Product pages point at the Organization through `distributorOffer`.
 */
import { company } from "../../content/company.ts";
import { publishable } from "./placeholders.ts";

type Locale = "uk" | "en";

export type CompanyContact = { phone?: string; email?: string };

export function organizationId(siteUrl: string): string {
  return `${siteUrl}/#organization`;
}

export function websiteId(siteUrl: string, locale: Locale): string {
  return `${siteUrl}/${locale}#website`;
}

/**
 * The company. Phone and e-mail appear only when they are real (placeholders in brackets are
 * dropped); there is no address in the data, so none is written.
 */
export function buildOrganizationLd(input: {
  siteUrl: string;
  locale: Locale;
  contact?: CompanyContact;
}): Record<string, unknown> {
  const { siteUrl, locale } = input;
  const telephone = publishable(input.contact?.phone);
  const email = publishable(input.contact?.email);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(siteUrl),
    name: company.name,
    // The root address only redirects to a language; the default-language home is the stable page.
    url: `${siteUrl}/uk`,
    logo: `${siteUrl}${company.logo.src}`,
    description: company.description[locale],
    areaServed: { "@type": "Country", name: company.country[locale] },
    brand: company.distributorOf.map((name) => ({ "@type": "Brand", name })),
    ...(telephone ? { telephone } : {}),
    ...(email ? { email } : {}),
    ...(company.sameAs.length ? { sameAs: [...company.sameAs] } : {}),
  };
}

export function buildWebSiteLd(input: { siteUrl: string; locale: Locale }): Record<string, unknown> {
  const { siteUrl, locale } = input;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId(siteUrl, locale),
    name: company.name,
    url: `${siteUrl}/${locale}`,
    description: company.description[locale],
    inLanguage: locale,
    publisher: { "@id": organizationId(siteUrl) },
  };
}

/**
 * schema.org has no "distributor of" link on a Product. The standard way to say who sells it is an
 * Offer whose `seller` is the Organization; the offer carries no price, because the site does not
 * publish prices.
 */
export function distributorOffer(siteUrl: string, locale: Locale = "uk"): Record<string, unknown> {
  return {
    "@type": "Offer",
    seller: { "@id": organizationId(siteUrl) },
    areaServed: { "@type": "Country", name: company.country[locale] },
  };
}
