"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { IconButton } from "@/components/ui/primitives";
import type { HeaderNavigationItem } from "@/lib/site-navigation";
import type { MegaMenuLabels } from "./mega-menu";
import styles from "./mobile-menu.module.css";

export type MobileMenuLabels = {
  menu: string;
  contact: string;
  language: string;
  /** "Back: {name}". */
  back: string;
  /** "All in “{name}”". */
  allIn: string;
};

type MegaItem = Extract<HeaderNavigationItem, { type: "mega" }>;

/** One screen of the menu: what it shows and where "back" and "all" lead. */
type Screen = {
  eyebrow: string;
  title: string;
  backLabel: string;
  rows: Array<{ id: string; label: string; meta?: string; href?: string; go?: string[] }>;
  all?: { label: string; href: string };
};

function summary(labels: string[]) {
  return labels.slice(0, 3).join(", ") + (labels.length > 3 ? "…" : "");
}

/**
 * The screen at `path`: [] is the root; [item] a menu; [item, group] a group or brand;
 * [item, group, section] a section. A group without directions lists its pages straight away (rule 3).
 */
function buildScreen(
  navItems: HeaderNavigationItem[],
  path: string[],
  labels: { mobile: MobileMenuLabels; mega: MegaMenuLabels },
): Screen | undefined {
  const item = navItems.find((entry): entry is MegaItem => entry.type === "mega" && entry.id === path[0]);
  if (!item) return undefined;
  const allIn = (name: string) => labels.mobile.allIn.replace("{name}", name);

  if (item.panel === "brands") {
    const brand = path[1] ? item.brands.find((entry) => entry.id === path[1]) : undefined;
    if (!brand) {
      return {
        eyebrow: labels.mega.brands.all,
        title: item.label,
        backLabel: labels.mobile.menu,
        rows: item.brands.map((entry) => ({
          id: entry.id,
          label: entry.label,
          meta: `${entry.countLabel} ${labels.mega.brands.itemsInCatalog}`,
          go: [item.id, entry.id],
        })),
        all: { label: labels.mega.brands.all, href: item.href },
      };
    }
    return {
      eyebrow: item.label,
      title: brand.label,
      backLabel: item.label,
      rows: [...brand.lines, ...(brand.about ? [brand.about] : [])].map((line) => ({
        id: line.id,
        label: line.label,
        meta: line.description,
        href: line.href,
      })),
      all: { label: brand.allLabel, href: brand.allHref },
    };
  }

  const text = labels.mega[item.panel];
  const group = path[1] ? item.groups.find((entry) => entry.id === path[1]) : undefined;
  if (!group) {
    return {
      eyebrow: text.railTitle,
      title: item.label,
      backLabel: labels.mobile.menu,
      rows: item.groups.map((entry) => ({ id: entry.id, label: entry.label, meta: entry.countLabel, go: [item.id, entry.id] })),
      all: { label: text.all, href: item.href },
    };
  }

  const pageRows = (links: typeof group.links) =>
    links.map((link) => ({ id: link.id, label: link.label, meta: [link.brand, link.meta].filter(Boolean).join(" · "), href: link.href }));

  const section = path[2] ? group.sections.find((entry) => entry.id === path[2]) : undefined;
  if (section) {
    return {
      eyebrow: group.label,
      title: section.label,
      backLabel: group.label,
      rows: pageRows(section.links),
      all: { label: allIn(section.label), href: section.href },
    };
  }

  return {
    eyebrow: item.label,
    title: group.label,
    backLabel: item.label,
    rows:
      group.sections.length > 0
        ? group.sections.map((entry) => ({
            id: entry.id,
            label: entry.label,
            meta: summary(entry.links.map((link) => link.label)),
            go: [item.id, group.id, entry.id],
          }))
        : pageRows(group.links),
    all: { label: allIn(group.label), href: group.href },
  };
}

export function MobileMenu({
  navItems,
  pathname,
  labels,
  closeLabel,
  menuLabel,
  contact,
  searchHint,
  searchLabel,
  language,
  onClose,
  onNavigate,
}: {
  navItems: HeaderNavigationItem[];
  pathname: string;
  labels: { mobile: MobileMenuLabels; mega: MegaMenuLabels };
  closeLabel: string;
  menuLabel: string;
  contact?: { label: string; href: string };
  searchLabel?: string;
  searchHint?: string;
  language?: ReactNode;
  /** Close and give focus back to the burger. */
  onClose: () => void;
  /** A link was followed: close without moving focus. */
  onNavigate: () => void;
}) {
  const [path, setPath] = useState<string[]>([]);
  const layerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const screen = buildScreen(navItems, path, labels);

  // The page behind the layer must not scroll; a wider window (full header) closes the layer.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const wide = window.matchMedia("(min-width: 85.375rem)");
    const onChange = () => wide.matches && onClose();
    wide.addEventListener("change", onChange);
    layerRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    return () => {
      document.body.style.overflow = previous;
      wide.removeEventListener("change", onChange);
    };
  }, [onClose]);

  function goTo(next: string[]) {
    setPath(next);
    // Announce the new screen and keep keyboard users from landing on a row that no longer exists.
    requestAnimationFrame(() => titleRef.current?.focus());
  }

  // Focus stays inside the layer.
  function trapFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(layerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex="-1"][data-trap]') ?? []).filter((element) => element.offsetParent !== null);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const links = navItems.filter((item) => item.type === "link");
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return createPortal(
    <div ref={layerRef} className={styles.layer} role="dialog" aria-modal="true" aria-label={menuLabel} onKeyDown={trapFocus}>
      <div className={styles.top}>
        <Image src="/logo_LABWELL.png" alt="LabWell" width={180} height={40} />
        <IconButton label={closeLabel} className={styles.close} onClick={onClose}>
          <X size={20} aria-hidden="true" />
        </IconButton>
      </div>

      {screen ? (
        <div className={styles.level}>
          <div className={styles.levelHead}>
            <button type="button" className={styles.back} aria-label={labels.mobile.back.replace("{name}", screen.backLabel)} onClick={() => goTo(path.slice(0, -1))}>
              <ChevronLeft size={18} aria-hidden="true" />
              {screen.backLabel}
            </button>
            <span className={styles.eyebrow}>{screen.eyebrow}</span>
            <h2 ref={titleRef} className={styles.title} tabIndex={-1} data-trap="">
              {screen.title}
            </h2>
          </div>
          <ul className={styles.rows}>
            {screen.rows.map((row) => {
              const content = (
                <>
                  <span className={styles.rowText}>
                    <span className={styles.rowLabel}>{row.label}</span>
                    {row.meta ? <span className={styles.rowMeta}>{row.meta}</span> : null}
                  </span>
                  <ChevronRight size={18} aria-hidden="true" />
                </>
              );
              return (
                <li key={row.id}>
                  {row.href ? (
                    <Link href={row.href} className={styles.row} onClick={onNavigate}>
                      {content}
                    </Link>
                  ) : (
                    <button type="button" className={styles.row} onClick={() => goTo(row.go!)}>
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          {screen.all ? (
            <div className={styles.levelFoot}>
              <Link href={screen.all.href} className={styles.all} onClick={onNavigate}>
                {screen.all.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </div>
      ) : (
        <nav className={styles.root} aria-label={menuLabel}>
          {searchLabel ? (
            <label className={styles.search}>
              <Search size={18} aria-hidden="true" />
              <input type="search" disabled aria-label={searchLabel} placeholder={searchHint} />
            </label>
          ) : null}
          {navItems.map((item) =>
            item.type === "mega" ? (
              <button key={item.id} type="button" className={`${styles.bigRow} ${isCurrent(item.href) ? styles.bigRowCurrent : ""}`} onClick={() => goTo([item.id])}>
                {item.label}
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            ) : null,
          )}
          <div className={styles.divider} />
          {links.map((item) => (
            <Link key={item.id} href={item.href} className={`${styles.link} ${isCurrent(item.href) ? styles.linkCurrent : ""}`} aria-current={pathname === item.href ? "page" : undefined} onClick={onNavigate}>
              {item.label}
            </Link>
          ))}
          <div className={styles.spacer} />
          <div className={styles.footer}>
            {language}
            {contact ? (
              <Link href={contact.href} className={styles.cta} onClick={onNavigate}>
                {contact.label}
              </Link>
            ) : null}
          </div>
        </nav>
      )}
    </div>,
    document.body,
  );
}
