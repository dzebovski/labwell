"use client";

import { ChevronLeft, ChevronRight, Ellipsis, House, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import type { Crumb, Trail } from "@/lib/breadcrumbs";
import styles from "./breadcrumbs.module.css";

export type CrumbLabels = {
  /** Accessible name of the navigation. */
  breadcrumbs: string;
  home: string;
  showHidden: string;
  /** "Up one level: {name}": the mobile link. */
  up: string;
};

/** Closes a popover on Esc (focus returns to its button) and on a press outside it. */
function useDismiss(open: boolean, close: () => void, rootRef: React.RefObject<HTMLElement | null>, buttonRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) close();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      close();
      buttonRef.current?.focus();
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, rootRef, buttonRef]);
}

/** "…" on 768–1023 px: the middle levels, as a list. */
function HiddenLevels({ crumbs, label }: { crumbs: Crumb[]; label: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const rootRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useDismiss(open, () => setOpen(false), rootRef, buttonRef);

  return (
    <li ref={rootRef} className={`${styles.item} ${styles.collapse}`}>
      <ChevronRight className={styles.sep} size={14} aria-hidden="true" />
      <span className={styles.anchor}>
        <button
          ref={buttonRef}
          type="button"
          className={styles.ellipsis}
          aria-label={label}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
        >
          <Ellipsis size={16} aria-hidden="true" />
        </button>
        {open ? (
          <ul id={id} className={styles.popover}>
            {crumbs.map((crumb) => (
              <li key={crumb.label}>
                {crumb.href ? (
                  <Link href={crumb.href} className={styles.option} onClick={() => setOpen(false)}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={styles.option}>{crumb.label}</span>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </span>
    </li>
  );
}

/** The last level of a catalog page: its name, and the neighbouring pages with their key figure. */
function Switcher({ trail }: { trail: Trail }) {
  const switcher = trail.switcher!;
  const [open, setOpen] = useState(false);
  const id = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useDismiss(open, () => setOpen(false), rootRef, buttonRef);

  return (
    <span ref={rootRef} className={styles.anchor}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.switcher}
        aria-current="page"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        {trail.current.label}
        <ChevronDown size={15} aria-hidden="true" className={open ? styles.flipped : undefined} />
      </button>
      {open ? (
        <div id={id} role="group" aria-label={switcher.title} className={`${styles.popover} ${styles.switcherPopover}`}>
          <div className={styles.popoverTitle}>{switcher.title}</div>
          <ul className={styles.options}>
            {switcher.options.map((option) => (
              <li key={option.href}>
                {option.current ? (
                  <span className={`${styles.option} ${styles.optionCurrent}`} aria-current="true">
                    <span className={styles.optionName}>
                      <Check size={15} aria-hidden="true" />
                      {option.label}
                    </span>
                    <span className={styles.optionMeta}>{option.meta}</span>
                  </span>
                ) : (
                  <Link href={option.href} className={styles.option} onClick={() => setOpen(false)}>
                    <span className={styles.optionName}>{option.label}</span>
                    <span className={styles.optionMeta}>{option.meta}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className={styles.popoverFooter}>
            <Link href={switcher.all.href} onClick={() => setOpen(false)}>
              {switcher.all.label} →
            </Link>
          </div>
        </div>
      ) : null}
    </span>
  );
}

export function Breadcrumbs({ trail, labels }: { trail: Trail; labels: CrumbLabels }) {
  const [home, ...ancestors] = trail.items;
  const parent = ancestors.at(-1);
  const middle = ancestors.slice(0, -1);
  // On small screens the link goes to the nearest ancestor that is a page; Home is always one.
  const up = [...trail.items].reverse().find((crumb) => crumb.href) ?? home;

  return (
    <nav aria-label={labels.breadcrumbs} className={styles.nav}>
      <ol className={styles.list}>
        <li className={styles.item}>
          {home.href ? (
            <Link href={home.href} className={`${styles.link} ${styles.home}`} aria-label={labels.home}>
              <House size={16} aria-hidden="true" />
            </Link>
          ) : (
            <span>{home.label}</span>
          )}
        </li>
        {middle.length > 0 ? <HiddenLevels crumbs={middle} label={labels.showHidden} /> : null}
        {ancestors.map((crumb, index) => {
          const isParent = crumb === parent;
          return (
            <li key={`${index}-${crumb.label}`} className={`${styles.item} ${isParent ? "" : styles.middle}`}>
              <ChevronRight className={styles.sep} size={14} aria-hidden="true" />
              {crumb.href ? (
                <Link href={crumb.href} className={`${styles.link} ${isParent ? styles.parent : ""}`} title={crumb.label}>
                  {crumb.label}
                </Link>
              ) : (
                <span className={isParent ? styles.parent : undefined} title={crumb.label}>
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
        <li className={styles.item}>
          <ChevronRight className={styles.sep} size={14} aria-hidden="true" />
          {trail.switcher ? <Switcher trail={trail} /> : <span className={styles.current} aria-current="page">{trail.current.label}</span>}
        </li>
      </ol>
      {up.href ? (
        <Link href={up.href} className={styles.mobileUp} aria-label={labels.up.replace("{name}", up.label)}>
          <ChevronLeft size={18} aria-hidden="true" />
          <span>{up === home ? labels.home : up.label}</span>
        </Link>
      ) : null}
    </nav>
  );
}
