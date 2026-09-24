import { isLocale, type Locale } from "../i18n/config.ts";

export const LOCALE_COOKIE_NAME = "labwell-locale";

export function resolvePreferredLocale(cookieValue?: string | null): Locale {
  return cookieValue && isLocale(cookieValue) ? cookieValue : "uk";
}

/** Build a link to a site path in the given locale: withLocale("en", "/products") → "/en/products". */
export function withLocale(locale: Locale, path: string): string {
  return `/${locale}${path === "/" ? "" : path}`;
}

/** Move the current URL to another locale: replace the first segment when it is a locale, otherwise prefix one. */
export function switchLocale(pathname: string, locale: Locale): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = normalizedPath.split("/");

  if (isLocale(segments[1] ?? "")) {
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }

  return withLocale(locale, normalizedPath);
}
