"use client";

import { Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import styles from "@/components/labwell-ui.module.css";
import { locales, type Locale } from "@/i18n/config";
import { LOCALE_COOKIE_NAME, switchLocale } from "@/lib/locale-routing";

type LanguageSwitcherProps = {
  currentLocale: Locale;
  label: string;
  names: Record<Locale, string>;
};

const localeDetails: Record<Locale, { compact: string; flag: string }> = {
  uk: { compact: "Укр", flag: "🇺🇦" },
  en: { compact: "EN", flag: "🇬🇧" },
};

function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

export function LanguageSwitcher({
  currentLocale,
  label,
  names,
}: LanguageSwitcherProps) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function closeOnOutsidePointer(event: PointerEvent) {
      if (!switcherRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function selectLocale(locale: Locale) {
    setIsOpen(false);
    rememberLocale(locale);
    if (locale !== currentLocale) router.push(switchLocale(pathname, locale));
  }

  const current = localeDetails[currentLocale];

  return (
    <div ref={switcherRef} className={styles.languageSwitcher}>
      <div className={styles.languageSwitcherCompact}>
        <button
          ref={triggerRef}
          type="button"
          aria-label={label}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={() => setIsOpen((open) => !open)}
          className={styles.languageTrigger}
        >
          <span aria-hidden="true">{current.flag}</span>
          <span>{current.compact}</span>
          <ChevronDown aria-hidden="true" size={14} className={isOpen ? styles.languageChevronOpen : undefined} />
        </button>

        {isOpen ? (
          <div role="listbox" aria-label={label} className={styles.languagePopover}>
            {locales.map((locale) => {
              const isCurrent = locale === currentLocale;
              const details = localeDetails[locale];
              return (
                <button key={locale} type="button" role="option" aria-selected={isCurrent} onClick={() => selectLocale(locale)} className={`${styles.languageOption} ${isCurrent ? styles.languageOptionActive : ""}`}>
                  <span aria-hidden="true">{details.flag}</span>
                  <span>{names[locale]}</span>
                  {isCurrent ? <Check aria-hidden="true" size={16} /> : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <nav aria-label={label} className={styles.languageMobileOptions}>
        {locales.map((locale) => {
          const isCurrent = locale === currentLocale;
          return (
            <button key={locale} type="button" aria-current={isCurrent ? "page" : undefined} onClick={() => selectLocale(locale)} className={`${styles.languageMobileOption} ${isCurrent ? styles.languageMobileOptionActive : ""}`}>
              <span aria-hidden="true">{localeDetails[locale].flag}</span>
              <span>{names[locale]}</span>
              {isCurrent ? <Check aria-hidden="true" size={16} /> : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
