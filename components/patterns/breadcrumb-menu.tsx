"use client";

import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import styles from "@/components/labwell-ui.module.css";
import type { Breadcrumb } from "@/lib/catalog";

type BreadcrumbMenuProps = {
  item: Breadcrumb;
  isCurrent: boolean;
  chooseLabel: string;
};

/** A breadcrumb that also lets the visitor jump to a sibling category. */
export function BreadcrumbMenu({ item, isCurrent, chooseLabel }: BreadcrumbMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function closeOnOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus();
    }
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <span ref={rootRef} className={styles.breadcrumbMenu}>
      {item.href && !isCurrent ? (
        <Link href={item.href} className={styles.breadcrumbLink}>
          {item.label}
        </Link>
      ) : (
        <span aria-current={isCurrent ? "page" : undefined}>{item.label}</span>
      )}
      <button
        ref={triggerRef}
        type="button"
        className={styles.breadcrumbMenuTrigger}
        aria-label={`${chooseLabel}: ${item.label}`}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <ChevronDown size={14} aria-hidden="true" className={isOpen ? styles.languageChevronOpen : undefined} />
      </button>
      {isOpen ? (
        <ul id={menuId} className={styles.breadcrumbMenuList}>
          {item.options?.map((option) => (
            <li key={option.href}>
              <Link
                href={option.href}
                className={`${styles.breadcrumbMenuOption} ${option.current ? styles.breadcrumbMenuOptionActive : ""}`}
                aria-current={option.current ? "true" : undefined}
                onClick={() => setIsOpen(false)}
              >
                <span>{option.label}</span>
                {option.current ? <Check size={15} aria-hidden="true" /> : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </span>
  );
}
