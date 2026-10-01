"use client";

import { ChevronDown, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useCallback, useEffect, useId, useRef, useState, type FocusEvent } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import styles from "@/components/labwell-ui.module.css";
import { MegaPanel, type MegaMenuLabels } from "@/components/patterns/mega-menu";
import { MobileMenu, type MobileMenuLabels } from "@/components/patterns/mobile-menu";
import { IconButton, LabLink } from "@/components/ui/primitives";
import type { Locale } from "@/i18n/config";
import type { HeaderNavigationItem } from "@/lib/site-navigation";

export type HeaderNavItem = HeaderNavigationItem;

type MegaItem = Extract<HeaderNavigationItem, { type: "mega" }>;

export type SiteHeaderProps = {
  navItems: HeaderNavItem[];
  /** Search is not built: the button is visible but inactive and explains why. */
  search?: { label: string; unavailable: string };
  cta?: { label: string; href: string };
  megaMenu: MegaMenuLabels;
  mobileMenu: MobileMenuLabels;
  homeHref?: string;
  languageSwitcher?: {
    currentLocale: Locale;
    label: string;
    currentLabel?: string;
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
    closeMegaMenu?: string;
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
  closeMegaMenu: "Закрити меню",
};

function isCurrentPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({
  navItems,
  search,
  cta,
  megaMenu,
  mobileMenu,
  homeHref = "/",
  languageSwitcher,
  accessibility = defaultAccessibility,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  /** How the open panel was opened: a click on the tab pins it, hovering does not. */
  const [pinned, setPinned] = useState(false);
  const [focusPanel, setFocusPanel] = useState(false);
  const panelId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);

  const activeItem = navItems.find((item): item is MegaItem => item.type === "mega" && item.id === desktopOpen);

  function closeDesktopNavigation({ restoreFocus = false } = {}) {
    setDesktopOpen(null);
    setPinned(false);
    setFocusPanel(false);
    if (restoreFocus) activeTriggerRef.current?.focus();
  }

  function closeNavigation() {
    closeDesktopNavigation();
    setIsOpen(false);
  }

  const closeMobileMenu = useCallback(() => {
    setIsOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  function openMegaMenu(item: MegaItem, trigger?: HTMLButtonElement | null, options: { pin?: boolean } = {}) {
    if (trigger) activeTriggerRef.current = trigger;
    setDesktopOpen(item.id);
    setPinned(Boolean(options.pin));
    setFocusPanel(false);
  }

  function switchPanel(panel: MegaItem["panel"]) {
    const target = navItems.find((item): item is MegaItem => item.type === "mega" && item.panel === panel);
    if (!target) return;
    activeTriggerRef.current = document.getElementById(`${panelId}-${target.id}-trigger`) as HTMLButtonElement | null;
    setDesktopOpen(target.id);
    setPinned(true);
    setFocusPanel(true);
  }

  // Following any link, or going back and forth in history, closes the panels.
  const [shownPathname, setShownPathname] = useState(pathname);
  if (shownPathname !== pathname) {
    setShownPathname(pathname);
    setDesktopOpen(null);
    setPinned(false);
    setIsOpen(false);
  }

  useEffect(() => {
    function closeOnPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) closeDesktopNavigation();
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (desktopOpen) {
        closeDesktopNavigation({ restoreFocus: true });
        return;
      }
      if (isOpen) closeMobileMenu();
    }
    document.addEventListener("pointerdown", closeOnPointerDown);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [desktopOpen, isOpen, closeMobileMenu]);

  function closeOnFocusLeave(event: FocusEvent<HTMLElement>) {
    // relatedTarget is null for clicks on non-focusable areas; outside clicks are handled by pointerdown.
    const next = event.relatedTarget;
    if (next && !event.currentTarget.contains(next as Node)) closeDesktopNavigation();
  }

  const logo = (
    <Image src="/logo_LABWELL.png" alt="LabWell" width={180} height={40} className={styles.headerLogo} priority />
  );

  return (
    <header ref={headerRef} className={styles.headerFrame}>
      <div className={styles.headerBar}>
        {pathname === homeHref ? (
          // Already on the home page: the logo is not a link to itself.
          <span className={styles.headerLogoLink}>{logo}</span>
        ) : (
          <Link href={homeHref} className={styles.headerLogoLink} aria-label={accessibility.home}>
            {logo}
          </Link>
        )}

        <nav className={styles.headerDesktopNav} aria-label={accessibility.primaryNavigation} onBlur={closeOnFocusLeave}>
          {navItems.map((item) => {
            const isActive = isCurrentPath(pathname, item.href);
            if (item.type === "link") {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`${styles.headerNavLink} ${isActive ? styles.headerNavLinkActive : ""}`}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onPointerEnter={(event) => event.pointerType === "mouse" && closeDesktopNavigation()}
                  onFocus={() => closeDesktopNavigation()}
                  onClick={closeNavigation}
                >
                  <span className={styles.headerNavLabel} data-label={item.label}>{item.label}</span>
                </Link>
              );
            }

            const isDropdownOpen = desktopOpen === item.id;
            return (
              <Fragment key={item.id}>
                <button
                  id={`${panelId}-${item.id}-trigger`}
                  type="button"
                  className={`${styles.headerNavButton} ${isActive ? styles.headerNavLinkActive : ""}`}
                  aria-expanded={isDropdownOpen}
                  aria-controls={`${panelId}-${item.id}`}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse" && !isDropdownOpen) openMegaMenu(item, event.currentTarget);
                  }}
                  onFocus={() => {
                    if (desktopOpen && !isDropdownOpen) closeDesktopNavigation();
                  }}
                  onClick={(event) => {
                    // Opened by hovering: the first click keeps the panel open instead of closing it.
                    if (isDropdownOpen && pinned) closeDesktopNavigation();
                    else openMegaMenu(item, event.currentTarget, { pin: true });
                  }}
                >
                  <span className={styles.headerNavLabel} data-label={item.label}>{item.label}</span>
                  <ChevronDown size={14} aria-hidden="true" />
                </button>
                {/* Rendered right after its trigger so Tab moves from the trigger into the panel. */}
                {isDropdownOpen && activeItem ? (
                  <MegaPanel
                    key={activeItem.id}
                    item={activeItem}
                    id={`${panelId}-${activeItem.id}`}
                    labels={megaMenu}
                    closeLabel={accessibility.closeMegaMenu ?? accessibility.closeMenu}
                    contactHref={cta?.href ?? "/contacts"}
                    onNavigate={closeNavigation}
                    onClose={() => closeDesktopNavigation({ restoreFocus: true })}
                    onSwitch={switchPanel}
                    autoFocus={focusPanel}
                  />
                ) : null}
              </Fragment>
            );
          })}
        </nav>

        <div className={styles.headerActions}>
          {search ? (
            <div className={styles.headerSearch}>
              <button
                type="button"
                className={styles.headerSearchButton}
                aria-label={search.label}
                aria-disabled="true"
                aria-describedby={`${panelId}-search-tip`}
              >
                <Search size={18} aria-hidden="true" />
              </button>
              <span id={`${panelId}-search-tip`} role="tooltip" className={styles.headerSearchTip}>
                {search.unavailable}
              </span>
            </div>
          ) : null}
          {languageSwitcher ? <LanguageSwitcher {...languageSwitcher} /> : null}
          {cta ? <LabLink href={cta.href} variant="button-primary" className={styles.headerCta}>{cta.label}</LabLink> : null}
        </div>

        <IconButton ref={menuButtonRef} label={isOpen ? accessibility.closeMenu : accessibility.openMenu} aria-expanded={isOpen} aria-controls={panelId} className={styles.headerMenuButton} onClick={() => setIsOpen((open) => !open)}>
          {isOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </IconButton>
      </div>

      {isOpen ? (
        <MobileMenu
          navItems={navItems}
          pathname={pathname}
          labels={{ mobile: mobileMenu, mega: megaMenu }}
          menuLabel={accessibility.mobileNavigation}
          closeLabel={accessibility.closeMenu}
          contact={cta ? { label: mobileMenu.contact, href: cta.href } : undefined}
          searchLabel={search?.label}
          searchHint={search?.unavailable}
          language={languageSwitcher ? <LanguageSwitcher {...languageSwitcher} /> : undefined}
          onClose={closeMobileMenu}
          onNavigate={closeNavigation}
        />
      ) : null}
    </header>
  );
}
