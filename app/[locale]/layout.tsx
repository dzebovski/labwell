import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { onest } from "@/app/fonts";
import { SiteHeader } from "@/components/patterns/site-header";
import styles from "@/components/labwell-ui.module.css";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { withLocale } from "@/lib/locale-routing";
import { buildHeaderNavigation } from "@/lib/site-navigation";

import "../globals.css";

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = await getDictionary(locale);

  return {
    // Page titles come without the site name; the template appends it.
    title: { template: `%s | ${dictionary.metadata.title}`, default: dictionary.metadata.title },
    description: dictionary.metadata.description,
    alternates: {
      languages: {
        uk: "/uk",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const navItems = buildHeaderNavigation(locale, dictionary.navigation);

  return (
    <html
      lang={locale}
      className={`${onest.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div className={styles.siteHeaderWrap}>
          <SiteHeader
            navItems={navItems}
            homeHref={withLocale(locale, "/")}
            languageSwitcher={{
              currentLocale: locale,
              label: dictionary.languageSwitcher.label,
              names: {
                uk: dictionary.languageSwitcher.uk,
                en: dictionary.languageSwitcher.en,
              },
            }}
            accessibility={{
              home: dictionary.accessibility.home,
              primaryNavigation: dictionary.accessibility.primaryNavigation,
              mobileNavigation: dictionary.accessibility.mobileNavigation,
              openMenu: dictionary.accessibility.openMenu,
              closeMenu: dictionary.accessibility.closeMenu,
              openSubmenu: dictionary.accessibility.openSubmenu,
              closeSubmenu: dictionary.accessibility.closeSubmenu,
              closeMegaMenu: dictionary.accessibility.closeMegaMenu,
            }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
