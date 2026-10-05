import assert from "node:assert/strict";
import test from "node:test";

import { buildGroupJsonLd } from "./jsonld-pages.ts";
import { buildJsonLd, serializeJsonLd } from "./jsonld.ts";
import { buildOrganizationLd, buildWebSiteLd, distributorOffer, organizationId, websiteId } from "./jsonld-site.ts";
import { product, shared } from "./fixtures.ts";
import { buildProductPage } from "./model.ts";

const siteUrl = "https://labwell.com.ua";

test("Organization has a stable @id, the distributor description and no invented contact data", () => {
  const org = buildOrganizationLd({ siteUrl, locale: "uk", contact: { phone: "[ТЕЛЕФОН]", email: "[EMAIL]" } });

  assert.equal(org["@context"], "https://schema.org");
  assert.equal(org["@type"], "Organization");
  assert.equal(org["@id"], `${siteUrl}/#organization`);
  assert.equal(org["@id"], organizationId(siteUrl));
  assert.equal(org.name, "LabWell");
  assert.equal(org.url, `${siteUrl}/uk`);
  assert.equal(org.logo, `${siteUrl}/logo_LABWELL.png`);
  assert.match(String(org.description), /офіційний дистриб'ютор Snibe і Bio-Rad/);
  assert.deepEqual(org.brand, [
    { "@type": "Brand", name: "Snibe" },
    { "@type": "Brand", name: "Bio-Rad" },
  ]);

  // Placeholders and the unknown address are not written at all.
  for (const key of ["telephone", "email", "address", "sameAs", "contactPoint"]) {
    assert.equal(Object.hasOwn(org, key), false, key);
  }
});

test("Organization lists phone and e-mail once they are real", () => {
  const org = buildOrganizationLd({ siteUrl, locale: "en", contact: { phone: "+380 44 000 00 00", email: "info@example.com" } });

  assert.equal(org.telephone, "+380 44 000 00 00");
  assert.equal(org.email, "info@example.com");
  assert.match(String(org.description), /official distributor of Snibe and Bio-Rad in Ukraine/);
});

test("WebSite points at the Organization and carries the page language", () => {
  const uk = buildWebSiteLd({ siteUrl, locale: "uk" });
  const en = buildWebSiteLd({ siteUrl, locale: "en" });

  assert.equal(uk["@type"], "WebSite");
  assert.equal(uk["@id"], websiteId(siteUrl, "uk"));
  assert.notEqual(uk["@id"], en["@id"]);
  assert.equal(uk.url, `${siteUrl}/uk`);
  assert.equal(uk.inLanguage, "uk");
  assert.equal(en.inLanguage, "en");
  assert.deepEqual(uk.publisher, { "@id": `${siteUrl}/#organization` });
  // No search on the site yet, so no SearchAction.
  assert.equal(Object.hasOwn(uk, "potentialAction"), false);
});

test("serialization cannot close the script tag", () => {
  const org = buildOrganizationLd({ siteUrl, locale: "uk", contact: { email: "a</script><script>alert(1)</script>@x.ua" } });
  const text = serializeJsonLd(org);

  assert.equal(text.includes("<"), false);
  assert.equal(JSON.parse(text).email, "a</script><script>alert(1)</script>@x.ua");
});

test("products reference the Organization as the seller of an offer without a price", () => {
  const offer = distributorOffer(siteUrl, "uk") as { seller: unknown; price?: unknown };
  assert.deepEqual(offer.seller, { "@id": `${siteUrl}/#organization` });
  assert.equal(offer.price, undefined);

  const page = buildProductPage({ product: product(), shared: shared(), locale: "uk" });
  const [productLd] = buildJsonLd({ page, locale: "uk", siteUrl });
  assert.deepEqual((productLd.offers as { seller: unknown }).seller, { "@id": `${siteUrl}/#organization` });
});

test("products inside a group list carry the same seller", () => {
  const groupLd = buildGroupJsonLd({
    page: {
      canonicalPath: "/products/demo-series",
      name: "Demo series",
      brand: "Snibe",
      breadcrumbs: [{ label: "Demo series" }],
      items: { items: [{ h3: "Demo A", text: "Text", anchor: "demo-a", imageSrc: undefined }] },
    } as never,
    locale: "en",
    siteUrl,
  });
  const list = groupLd[1] as { itemListElement: Array<{ item: { offers: { seller: unknown } } }> };
  assert.deepEqual(list.itemListElement[0].item.offers.seller, { "@id": `${siteUrl}/#organization` });
});
