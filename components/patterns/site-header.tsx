"use client";

import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import styles from "@/components/labwell-ui.module.css";
import { IconButton, LabLink, SearchField } from "@/components/ui/primitives";
import type { Locale } from "@/i18n/config";
import type {
  HeaderMegaGroup,
  HeaderMegaLeaf,
  HeaderMegaSection,
  HeaderNavigationItem,
} from "@/lib/site-navigation";

export type HeaderNavItem = HeaderNavigationItem;

export type SiteHeaderProps = {
  navItems: HeaderNavItem[];
  search?: { label: string; placeholder: string };
  cta?: { label: string; href: string };
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

function logoForBrand(brand: string) {
  if (brand === "Bio-Rad") {
    return { src: "/bio-rad-logo 1.png", width: 133, height: 36 };
  }
  if (brand === "Snibe") {
    return { src: "/snibe-logo-1.png", width: 113, height: 36 };
  }
  return undefined;
}

function groupLinksByBrand(links: HeaderMegaLeaf[]) {
  const groups = new Map<string, HeaderMegaLeaf[]>();
  links.forEach((link) => groups.set(link.brand, [...(groups.get(link.brand) ?? []), link]));
  return Array.from(groups.entries());
}

function firstSection(group: HeaderMegaGroup | undefined) {
  return group?.sections[0];
}

function firstLeaf(section: HeaderMegaSection | undefined) {
  return section?.links[0];
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
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeLeafId, setActiveLeafId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const [mobileSections, setMobileSections] = useState<string[]>([]);
  const panelId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const suppressNextTriggerFocusRef = useRef(false);

  const activeItem = useMemo(
    () =>
      navItems.find(
        (item): item is Extract<HeaderNavigationItem, { type: "mega" }> =>
          item.type === "mega" && item.id === desktopOpen,
      ),
    [desktopOpen, navItems],
  );
  const activeGroup =
    activeItem?.groups.find((group) => group.id === activeGroupId) ?? activeItem?.groups[0];
  const activeSection =
    activeGroup?.sections.find((section) => section.id === activeSectionId) ??
    firstSection(activeGroup);
  const activeLeaf =
    activeSection?.links.find((leaf) => leaf.id === activeLeafId) ?? firstLeaf(activeSection);

  function closeDesktopNavigation({ restoreFocus = false } = {}) {
    setDesktopOpen(null);
    if (restoreFocus) {
      suppressNextTriggerFocusRef.current = true;
      requestAnimationFrame(() => activeTriggerRef.current?.focus());
    }
  }

  function closeNavigation() {
    setDesktopOpen(null);
    setMobileOpen(null);
    setMobileSections([]);
    setIsOpen(false);
  }

  function activateMegaMenu(
    item: Extract<HeaderNavigationItem, { type: "mega" }>,
    trigger?: HTMLButtonElement,
  ) {
    if (trigger) activeTriggerRef.current = trigger;
    const group = item.groups[0];
    const section = firstSection(group);
    setDesktopOpen(item.id);
    setActiveGroupId(group?.id ?? null);
    setActiveSectionId(section?.id ?? null);
    setActiveLeafId(firstLeaf(section)?.id ?? null);
  }

  function activateGroup(group: HeaderMegaGroup) {
    const section = firstSection(group);
    setActiveGroupId(group.id);
    setActiveSectionId(section?.id ?? null);
    setActiveLeafId(firstLeaf(section)?.id ?? null);
  }

  function activateSection(section: HeaderMegaSection) {
    setActiveSectionId(section.id);
    setActiveLeafId(firstLeaf(section)?.id ?? null);
  }

  useEffect(() => {
    function closeOnPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) closeDesktopNavigation();
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (desktopOpen || mobileOpen) {
        setMobileOpen(null);
        closeDesktopNavigation({ restoreFocus: true });
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
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  }

  return (
    <header ref={headerRef} className={styles.headerFrame}>
      <div className={styles.headerBar}>
        <Link href={homeHref} className={styles.headerLogoLink} aria-label={accessibility.home}>
          <Image src="/logo_LABWELL.png" alt="LabWell" width={180} height={40} className={styles.headerLogo} priority />
        </Link>

        <nav className={styles.headerDesktopNav} aria-label={accessibility.primaryNavigation}>
          {navItems.map((item) => {
            const isActive = isCurrentPath(pathname, item.href);
            if (item.type === "link") {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`${styles.headerNavLink} ${isActive ? styles.headerNavLinkActive : ""}`}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onPointerEnter={() => closeDesktopNavigation()}
                  onFocus={() => closeDesktopNavigation()}
                  onClick={closeNavigation}
                >
                  {item.label}
                </Link>
              );
            }

            const isDropdownOpen = desktopOpen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.headerNavButton} ${isActive ? styles.headerNavLinkActive : ""}`}
                aria-expanded={isDropdownOpen}
                aria-controls={`${panelId}-${item.id}`}
                onPointerEnter={(event) => activateMegaMenu(item, event.currentTarget)}
                onFocus={(event) => {
                  if (suppressNextTriggerFocusRef.current) {
                    suppressNextTriggerFocusRef.current = false;
                    return;
                  }
                  activateMegaMenu(item, event.currentTarget);
                }}
                onClick={(event) => activateMegaMenu(item, event.currentTarget)}
              >
                {item.label}
                <ChevronDown size={14} aria-hidden="true" />
              </button>
            );
          })}
        </nav>

        <div className={styles.headerActions}>
          {search ? <SearchField id={`${panelId}-desktop-search`} label={search.label} placeholder={search.placeholder} hideLabel containerClassName={styles.headerSearch} /> : null}
          {languageSwitcher ? <LanguageSwitcher {...languageSwitcher} /> : null}
          {cta ? <LabLink href={cta.href} variant="button-primary">{cta.label}</LabLink> : null}
        </div>

        <IconButton ref={menuButtonRef} label={isOpen ? accessibility.closeMenu : accessibility.openMenu} aria-expanded={isOpen} aria-controls={panelId} className={styles.headerMenuButton} onClick={() => setIsOpen((open) => !open)}>
          {isOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </IconButton>
      </div>

      {activeItem ? (
        <div id={`${panelId}-${activeItem.id}`} className={styles.megaPanel} aria-label={activeItem.label}>
          <div className={styles.megaPanelHeader}>
            <div className={styles.megaBreadcrumb}>
              <span>LABWELL</span><ChevronRight size={13} aria-hidden="true" />
              <Link href={activeItem.href} onClick={closeNavigation}>{activeItem.label}</Link>
            </div>
            <IconButton label={accessibility.closeMegaMenu ?? accessibility.closeMenu} className={styles.megaCloseButton} onClick={() => closeDesktopNavigation({ restoreFocus: true })}>
              <X size={18} aria-hidden="true" />
            </IconButton>
          </div>

          {activeItem.panel === "brands" ? (
            <div className={styles.brandMegaGrid}>
              {activeItem.groups.map((group) => {
                const logo = logoForBrand(group.label);
                return (
                  <section key={group.id} className={styles.brandMegaColumn}>
                    <div className={styles.brandMegaHeading}>
                      <h2>{group.label}</h2>
                      {logo ? <Image src={logo.src} alt={`${group.label} logo`} width={logo.width} height={logo.height} /> : null}
                    </div>
                    <div className={styles.brandMegaLinks}>
                      {group.sections.flatMap((section) => section.links).map((leaf) => (
                        <Link key={leaf.id} href={leaf.href} className={styles.megaLeafLink} onClick={closeNavigation}>
                          <span>{leaf.label}</span><ChevronRight size={15} aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className={styles.megaGrid}>
              <div className={styles.megaRail}>
                {activeItem.groups.map((group) => (
                  <button key={group.id} type="button" className={`${styles.megaRailButton} ${activeGroup?.id === group.id ? styles.megaRailButtonActive : ""}`} onPointerEnter={() => activateGroup(group)} onFocus={() => activateGroup(group)} onClick={() => activateGroup(group)}>
                    <span>{group.label}</span><ChevronRight size={16} aria-hidden="true" />
                  </button>
                ))}
              </div>

              <div className={styles.megaSections}>
                {activeGroup?.sections.map((section) => (
                  <button key={section.id} type="button" className={`${styles.megaSectionButton} ${activeSection?.id === section.id ? styles.megaSectionButtonActive : ""}`} onPointerEnter={() => activateSection(section)} onFocus={() => activateSection(section)} onClick={() => activateSection(section)}>
                    <span>{section.label}</span><ChevronRight size={15} aria-hidden="true" />
                  </button>
                ))}
              </div>

              <div className={styles.megaResults}>
                <div className={styles.megaBrandGroups}>
                  {groupLinksByBrand(activeSection?.links ?? []).map(([brand, links]) => {
                    const logo = logoForBrand(brand);
                    return (
                      <section key={brand} className={styles.megaBrandGroup}>
                        <div className={styles.megaBrandLabel}>
                          <span>{brand}</span>
                          {logo ? <Image src={logo.src} alt={`${brand} logo`} width={logo.width} height={logo.height} /> : null}
                        </div>
                        <div>
                          {links.map((leaf) => (
                            <Link key={leaf.id} href={leaf.href} className={`${styles.megaLeafLink} ${activeLeaf?.id === leaf.id ? styles.megaLeafLinkActive : ""}`} onPointerEnter={() => setActiveLeafId(leaf.id)} onFocus={() => setActiveLeafId(leaf.id)} onClick={closeNavigation}>
                              <span>{leaf.label}</span><ChevronRight size={15} aria-hidden="true" />
                            </Link>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>

                {activeLeaf ? (
                  <aside className={styles.megaPreview} aria-live="polite">
                    <span className={styles.megaPreviewBrand}>{activeLeaf.brand}</span>
                    <h3>{activeLeaf.title}</h3>
                    <p>{activeLeaf.description}</p>
                    <span className={styles.megaPreviewAction}>{activeLeaf.label}<ChevronRight size={15} aria-hidden="true" /></span>
                  </aside>
                ) : null}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {isOpen ? (
        <div id={panelId} className={styles.headerMobilePanel}>
          <nav className={styles.headerMobileNav} aria-label={accessibility.mobileNavigation}>
            {navItems.map((item) => {
              if (item.type === "link") {
                return <Link key={item.id} href={item.href} className={`${styles.headerNavLink} ${isCurrentPath(pathname, item.href) ? styles.headerNavLinkActive : ""}`} aria-current={pathname === item.href ? "page" : undefined} onClick={closeNavigation}>{item.label}</Link>;
              }
              const isGroupOpen = mobileOpen === item.id;
              return (
                <div key={item.id} className={styles.headerMobileGroup}>
                  <button type="button" className={`${styles.headerMobileGroupButton} ${isCurrentPath(pathname, item.href) ? styles.headerNavLinkActive : ""}`} aria-expanded={isGroupOpen} onClick={() => setMobileOpen((current) => current === item.id ? null : item.id)}>
                    {item.label}<ChevronDown size={16} aria-hidden="true" />
                  </button>
                  {isGroupOpen ? (
                    <div className={styles.headerMobileSubmenu}>
                      <Link href={item.href} className={styles.headerMobileAllLink} onClick={closeNavigation}>{item.label}<ChevronRight size={15} aria-hidden="true" /></Link>
                      {item.groups.map((group) => {
                        const isSectionOpen = mobileSections.includes(group.id);
                        return (
                          <div key={group.id} className={styles.headerMobileSubmenuItem}>
                            <button type="button" className={styles.headerMobileSubmenuButton} aria-expanded={isSectionOpen} onClick={() => toggleMobileSection(group.id)}>
                              <span>{group.label}</span><ChevronDown size={16} aria-hidden="true" />
                            </button>
                            {isSectionOpen ? (
                              <div className={styles.headerMobileNestedList}>
                                {group.sections.map((section) => (
                                  <section key={section.id} className={styles.headerMobileSection}>
                                    {group.sections.length > 1 ? <h3>{section.label}</h3> : null}
                                    {section.links.map((leaf) => <Link key={leaf.id} href={leaf.href} className={styles.headerMobileNestedLink} onClick={closeNavigation}>{leaf.label}</Link>)}
                                  </section>
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
          {search ? <SearchField id={`${panelId}-mobile-search`} label={search.label} placeholder={search.placeholder} hideLabel /> : null}
          {languageSwitcher ? <LanguageSwitcher {...languageSwitcher} /> : null}
          {cta ? <LabLink href={cta.href} variant="button-primary">{cta.label}</LabLink> : null}
        </div>
      ) : null}
    </header>
  );
}
