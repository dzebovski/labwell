import type { Locale } from "@/i18n/config";

const supportedLocales = new Set<string>(["uk", "en"]);

export const LOCALE_COOKIE_NAME = "labwell-locale";

export function resolvePreferredLocale(cookieValue?: string | null): Locale {
  return cookieValue && supportedLocales.has(cookieValue)
    ? (cookieValue as Locale)
    : "uk";
}

/** Replace the first path segment when it is a locale, otherwise prefix one. */
export function localizePath(pathname: string, locale: Locale): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = normalizedPath.split("/");

  if (supportedLocales.has(segments[1] ?? "")) {
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }

  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}
