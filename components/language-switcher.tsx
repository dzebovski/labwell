"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/i18n/config";

type LanguageSwitcherProps = {
  currentLocale: Locale;
  label: string;
  names: Record<Locale, string>;
};

function localizePath(pathname: string, locale: Locale) {
  const segments = pathname.split("/");
  segments[1] = locale;

  return segments.join("/") || `/${locale}`;
}

export function LanguageSwitcher({
  currentLocale,
  label,
  names,
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="flex items-center gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-900">
      {locales.map((locale) => {
        const isCurrent = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={localizePath(pathname, locale)}
            hrefLang={locale}
            aria-current={isCurrent ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              isCurrent
                ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-700 dark:text-white"
                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            {names[locale]}
          </Link>
        );
      })}
    </nav>
  );
}
