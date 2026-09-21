import "server-only";

import type { Locale } from "./config";

const dictionaries = {
  uk: () => import("./dictionaries/uk.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
