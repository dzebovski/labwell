"use client";

import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import styles from "@/components/labwell-ui.module.css";
import { IconButton, LabLink, SearchField } from "@/components/ui/primitives";
import type { Locale } from "@/i18n/config";
import type { HeaderNavigationItem, HeaderNavigationLink } from "@/lib/site-navigation";

export type HeaderNavItem = HeaderNavigationItem;

export type SiteHeaderProps = {
  navItems: HeaderNavItem[];
  search?: {
    label: string;
    placeholder: string;
  };
  cta?: {
    label: string;
    href: string;
  };
  homeHref?: string;
  languageSwitcher?: {
    currentLocale: Locale;
    label: string;
    names: Record<Locale, string>;
  };
  accessibility?: {
    home: string;
    primaryNavigation: string;
    mobileNavigation: string;
    openMenu: string;
    closeMenu: string;
    openSubmenu: string;
    closeSubmenu: string;
  };
};

const defaultAccessibility = {
  home: "LabWell — головна",
  primaryNavigation: "Основна навігація",
  mobileNavigation: "Мобільна навігація",
  openMenu: "Відкрити меню",
  closeMenu: "Закрити меню",
  openSubmenu: "Відкрити підменю",
  closeSubmenu: "Закрити підменю",
};

function isCurrentPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navigationKey(item: HeaderNavigationLink) {
  return item.href;
}

export function SiteHeader({
  navItems,
  search,
  cta,
  homeHref = "/",
  languageSwitcher,
  accessibility = defaultAccessibility,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const [mobileSections, setMobileSections] = useState<string[]>([]);
  const panelId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);

  function closeNavigation() {
    setDesktopOpen(null);
    setMobileOpen(null);
    setMobileSections([]);
    setIsOpen(false);
  }

  useEffect(() => {
    function closeOnPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setDesktopOpen(null);
        setMobileOpen(null);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      if (desktopOpen || mobileOpen) {
        setDesktopOpen(null);
        setMobileOpen(null);
        activeTriggerRef.current?.focus();
        return;
      }

      if (isOpen) {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnPointerDown);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [desktopOpen, isOpen, mobileOpen]);

  function toggleMobileSection(key: string) {
    setMobileSections((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  }

  return (
    <header ref={headerRef} className={styles.headerFrame}>
      <div className={styles.headerBar}>
        <Link href={homeHref} className={styles.headerLogoLink} aria-label={accessibility.home}>
          <Image
            src="/logo_LABWELL.png"
            alt="LabWell"
            width={180}
            height={40}
            className={styles.headerLogo}
            priority
          />
        </Link>

        <nav className={styles.headerDesktopNav} aria-label={accessibility.primaryNavigation}>
          {navItems.map((item) => {
            const key = navigationKey(item);
            const isActive = isCurrentPath(pathname, item.href);

            if (!item.children?.length) {
              return (
                <Link
                  key={key}
                  href={item.href}
                  className={`${styles.headerNavLink} ${isActive ? styles.headerNavLinkActive : ""}`}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            }

            const isDropdownOpen = desktopOpen === key;

            return (
              <div
                key={key}
                className={styles.headerDropdown}
                onMouseEnter={() => setDesktopOpen(key)}
                onMouseLeave={() => setDesktopOpen(null)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setDesktopOpen(null);
                  }
                }}
              >
                <button
                  ref={(node) => {
                    if (isDropdownOpen) {
                      activeTriggerRef.current = node;
                    }
                  }}
                  type="button"
                  className={`${styles.headerNavButton} ${isActive ? styles.headerNavLinkActive : ""}`}
                  aria-expanded={isDropdownOpen}
                  aria-controls={`${panelId}-${key}`}
                  onClick={() => setDesktopOpen((current) => (current === key ? null : key))}
                >
                  {item.label}
                  <ChevronDown size={14} aria-hidden="true" />
                </button>

                {isDropdownOpen ? (
                  <div id={`${panelId}-${key}`} className={styles.headerDropdownPanel}>
                    <ul className={styles.headerDropdownList}>
                      {item.children.map((child) => {
                        const childKey = navigationKey(child);
                        const hasChildren = Boolean(child.children?.length);

                        return (
                          <li key={childKey} className={styles.headerDropdownItem}>
                            <Link
                              href={child.href}
                              className={`${styles.headerDropdownLink} ${
                                isCurrentPath(pathname, child.href) ? styles.headerDropdownLinkActive : ""
                              }`}
                              aria-current={pathname === child.href ? "page" : undefined}
                              onClick={closeNavigation}
                            >
                              {child.label}
                              {hasChildren ? <ChevronRight size={15} aria-hidden="true" /> : null}
                            </Link>

                            {hasChildren ? (
                              <div className={styles.headerNestedPanel}>
                                <p className={styles.headerNestedTitle}>{child.label}</p>
                                <ul className={styles.headerNestedList}>
                                  {child.children?.map((nestedItem) => (
                                    <li key={navigationKey(nestedItem)}>
                                      <Link
                                        href={nestedItem.href}
                                        className={`${styles.headerNestedLink} ${
                                          pathname === nestedItem.href ? styles.headerDropdownLinkActive : ""
                                        }`}
                                        aria-current={pathname === nestedItem.href ? "page" : undefined}
                                        onClick={closeNavigation}
                                      >
                                        {nestedItem.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className={styles.headerActions}>
          {search ? (
            <SearchField
              id={`${panelId}-desktop-search`}
              label={search.label}
              placeholder={search.placeholder}
              hideLabel
              containerClassName={styles.headerSearch}
            />
          ) : null}
          {languageSwitcher ? <LanguageSwitcher {...languageSwitcher} /> : null}
          {cta ? (
            <LabLink href={cta.href} variant="button-primary">
              {cta.label}
            </LabLink>
          ) : null}
        </div>

        <IconButton
          ref={menuButtonRef}
          label={isOpen ? accessibility.closeMenu : accessibility.openMenu}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={styles.headerMenuButton}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </IconButton>
      </div>

      {isOpen ? (
        <div id={panelId} className={styles.headerMobilePanel}>
          <nav className={styles.headerMobileNav} aria-label={accessibility.mobileNavigation}>
            {navItems.map((item) => {
              const key = navigationKey(item);

              if (!item.children?.length) {
                return (
                  <Link
                    key={key}
                    href={item.href}
                    className={`${styles.headerNavLink} ${
                      isCurrentPath(pathname, item.href) ? styles.headerNavLinkActive : ""
                    }`}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={closeNavigation}
                  >
                    {item.label}
                  </Link>
                );
              }

              const isGroupOpen = mobileOpen === key;

              return (
                <div key={key} className={styles.headerMobileGroup}>
                  <button
                    ref={(node) => {
                      if (isGroupOpen) {
                        activeTriggerRef.current = node;
                      }
                    }}
                    type="button"
                    className={`${styles.headerMobileGroupButton} ${
                      isCurrentPath(pathname, item.href) ? styles.headerNavLinkActive : ""
                    }`}
                    aria-expanded={isGroupOpen}
                    onClick={() => setMobileOpen((current) => (current === key ? null : key))}
                  >
                    {item.label}
                    <ChevronDown size={16} aria-hidden="true" />
                  </button>

                  {isGroupOpen ? (
                    <div className={styles.headerMobileSubmenu}>
                      {item.children.map((child) => {
                        const childKey = navigationKey(child);
                        const isSectionOpen = mobileSections.includes(childKey);

                        return (
                          <div key={childKey} className={styles.headerMobileSubmenuItem}>
                            <div className={styles.headerMobileSubmenuRow}>
                              <Link
                                href={child.href}
                                className={`${styles.headerMobileSubmenuLink} ${
                                  isCurrentPath(pathname, child.href) ? styles.headerDropdownLinkActive : ""
                                }`}
                                aria-current={pathname === child.href ? "page" : undefined}
                                onClick={closeNavigation}
                              >
                                {child.label}
                              </Link>
                              {child.children?.length ? (
                                <button
                                  type="button"
                                  className={styles.headerMobileExpandButton}
                                  aria-label={`${
                                    isSectionOpen ? accessibility.closeSubmenu : accessibility.openSubmenu
                                  }: ${child.label}`}
                                  aria-expanded={isSectionOpen}
                                  onClick={() => toggleMobileSection(childKey)}
                                >
                                  <ChevronDown size={16} aria-hidden="true" />
                                </button>
                              ) : null}
                            </div>
                            {isSectionOpen ? (
                              <div className={styles.headerMobileNestedList}>
                                {child.children?.map((nestedItem) => (
                                  <Link
                                    key={navigationKey(nestedItem)}
                                    href={nestedItem.href}
                                    className={`${styles.headerMobileNestedLink} ${
                                      pathname === nestedItem.href ? styles.headerDropdownLinkActive : ""
                                    }`}
                                    aria-current={pathname === nestedItem.href ? "page" : undefined}
                                    onClick={closeNavigation}
                                  >
                                    {nestedItem.label}
                                  </Link>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
          {search ? (
            <SearchField
              id={`${panelId}-mobile-search`}
              label={search.label}
              placeholder={search.placeholder}
              hideLabel
            />
          ) : null}
          {languageSwitcher ? <LanguageSwitcher {...languageSwitcher} /> : null}
          {cta ? (
            <LabLink href={cta.href} variant="button-primary">
              {cta.label}
            </LabLink>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
