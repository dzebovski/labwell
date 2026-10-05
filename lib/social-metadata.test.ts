import assert from "node:assert/strict";
import test from "node:test";

import { ogImagePath, socialMetadata } from "./social-metadata.ts";

test("Open Graph and Twitter carry site name, both locales, url, text and a 1200×630 card", () => {
  const { openGraph, twitter } = socialMetadata({
    locale: "uk",
    title: "MAGLUMI X8 | LabWell",
    description: "Опис.",
    path: "/products/maglumi-x8",
  });

  assert.equal(openGraph?.siteName, "LabWell");
  assert.equal(openGraph?.locale, "uk_UA");
  assert.deepEqual(openGraph?.alternateLocale, ["en_US"]);
  assert.equal(openGraph?.url, "/uk/products/maglumi-x8");
  assert.equal(openGraph?.title, "MAGLUMI X8 | LabWell");
  assert.equal(openGraph?.description, "Опис.");
  assert.deepEqual(openGraph?.images, [
    { url: "/uk/og/products/maglumi-x8.png", width: 1200, height: 630, alt: "MAGLUMI X8 | LabWell" },
  ]);

  assert.equal((twitter as { card?: string } | null | undefined)?.card, "summary_large_image");
  assert.equal(twitter?.title, "MAGLUMI X8 | LabWell");
  assert.deepEqual(twitter?.images, ["/uk/og/products/maglumi-x8.png"]);
});

test("English pages swap the locales; the home card is index.png", () => {
  const { openGraph } = socialMetadata({ locale: "en", title: "LabWell", description: "d", path: "/" });

  assert.equal(openGraph?.locale, "en_US");
  assert.deepEqual(openGraph?.alternateLocale, ["uk_UA"]);
  assert.equal(openGraph?.url, "/en");
  assert.equal(ogImagePath("en", "/"), "/en/og/index.png");
});
