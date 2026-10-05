import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { onest } from "@/app/fonts";
import { JsonLdScripts } from "@/components/product-page/blocks/json-ld";
import { SiteFooter } from "@/components/patterns/site-footer";
import { SiteHeader } from "@/components/patterns/site-header";
import styles from "@/components/labwell-ui.module.css";
import { company } from "@/content/company";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { withLocale } from "@/lib/locale-routing";
import { SITE_URL } from "@/lib/site-config";
import { buildOrganizationLd, buildWebSiteLd } from "@/lib/site-content/jsonld-site";
import { loadShared } from "@/lib/site-content/load";
import { navPhoto } from "@/lib/site-content/nav-photo";
import { buildFooter } from "@/lib/site-footer";
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
    // Relative canonical, hreflang and image addresses of every page resolve against this.
    metadataBase: new URL(SITE_URL),
    // Page titles come without the site name; the template appends it.
    title: { template: `%s | ${dictionary.metadata.title}`, default: dictionary.metadata.title },
    description: company.description[locale],
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
  const navItems = buildHeaderNavigation(locale, dictionary.navigation, { photoFor: navPhoto });
  const { contact } = loadShared(locale);
  const footer = buildFooter(navItems, { companyTitle: dictionary.footer.company, contact });

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
            megaMenu={dictionary.megaMenu}
            mobileMenu={dictionary.mobileMenu}
            search={{ label: dictionary.header.searchLabel, unavailable: dictionary.header.searchSoon }}
            cta={{ label: dictionary.header.contact, href: withLocale(locale, "/contacts") }}
            languageSwitcher={{
              currentLocale: locale,
              label: dictionary.languageSwitcher.label,
              currentLabel: dictionary.languageSwitcher.currentLabel.replace("{name}", dictionary.languageSwitcher[locale]),
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
        <SiteFooter
          locale={locale}
          homeHref={withLocale(locale, "/")}
          model={footer}
          labels={{
            navigation: dictionary.footer.navigation,
            copyright: dictionary.footer.copyright.replace("{year}", String(new Date().getFullYear())),
            home: dictionary.accessibility.home,
            contacts: dictionary.navigation.contacts,
          }}
        />
        <JsonLdScripts
          data={[
            buildOrganizationLd({ siteUrl: SITE_URL, locale, contact }),
            buildWebSiteLd({ siteUrl: SITE_URL, locale }),
          ]}
        />
      </body>
    </html>
  );
}
