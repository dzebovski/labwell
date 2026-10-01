"use client";

import { ArrowRight, ChevronRight, MessageSquare, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";

import { IconButton } from "@/components/ui/primitives";
import type { HeaderBrand, HeaderMegaLeaf, HeaderNavigationItem } from "@/lib/site-navigation";
import styles from "./mega-menu.module.css";

type PanelId = "catalog" | "clinical" | "brands";

type TaxonomyLabels = {
  railTitle: string;
  sectionTitle: string;
  all: string;
  /** Two labels, in the order of `otherPanels[panel]`. */
  otherWays: string[];
};

export type MegaMenuLabels = {
  viewing: string;
  catalog: TaxonomyLabels;
  clinical: TaxonomyLabels;
  brands: { all: string; linesTitle: string; about: string; itemsInCatalog: string };
  searchOtherWay: string;
  details: string;
  requestPrice: string;
  consultationText: string;
  consultationCta: string;
};

const otherPanels: Record<"catalog" | "clinical", PanelId[]> = {
  catalog: ["clinical", "brands"],
  clinical: ["catalog", "brands"],
};

type MegaItem = Extract<HeaderNavigationItem, { type: "mega" }>;
type TaxonomyItem = Extract<MegaItem, { panel: "catalog" | "clinical" }>;
type BrandsItem = Extract<MegaItem, { panel: "brands" }>;

export type MegaPanelProps = {
  item: MegaItem;
  id: string;
  labels: MegaMenuLabels;
  closeLabel: string;
  contactHref: string;
  /** A link inside the panel was followed. */
  onNavigate: () => void;
  /** The close button: the header restores focus to the tab. */
  onClose: () => void;
  onSwitch: (panel: PanelId) => void;
  /** Move focus into the panel once it is shown (after "Search another way"). */
  autoFocus?: boolean;
};

/** Hover selects items for a mouse only; touch and keyboard select through click and focus. */
function onMouse(action: () => void) {
  return (event: PointerEvent) => {
    if (event.pointerType === "mouse") action();
  };
}

/** Up/Down/Home/End move focus between the buttons of a list; focus selects the item. */
function moveFocus(event: KeyboardEvent<HTMLElement>) {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-roving]"));
  const current = items.indexOf(document.activeElement as HTMLButtonElement);
  if (current === -1) return;
  event.preventDefault();
  const last = items.length - 1;
  const next =
    event.key === "Home" ? 0 : event.key === "End" ? last : event.key === "ArrowDown" ? Math.min(current + 1, last) : Math.max(current - 1, 0);
  items[next].focus();
}

function BrandLogo({ brand, logo }: { brand: string; logo?: { src: string; width: number; height: number } }) {
  return logo ? <Image src={logo.src} alt={brand} width={logo.width} height={logo.height} /> : <span className={styles.columnName}>{brand}</span>;
}

function PanelHeader({
  item,
  labels,
  trail,
  allLabel,
  closeLabel,
  onNavigate,
  onClose,
}: {
  item: MegaItem;
  labels: MegaMenuLabels;
  trail: { label: string; current: boolean }[];
  allLabel: string;
  closeLabel: string;
  onNavigate: () => void;
  onClose: () => void;
}) {
  return (
    <div className={styles.header}>
      <nav className={styles.trail} aria-label={labels.viewing}>
        <ol className={styles.trailList}>
          <li className={styles.trailItem}>
            <Link href={item.href} className={styles.trailRoot} onClick={onNavigate}>
              {item.label}
            </Link>
          </li>
          {trail.map((crumb) => (
            <li key={crumb.label} className={`${styles.trailItem} ${crumb.current ? styles.trailItemCurrent : ""}`}>
              <ChevronRight size={14} aria-hidden="true" />
              <span aria-current={crumb.current ? "location" : undefined}>{crumb.label}</span>
            </li>
          ))}
        </ol>
      </nav>
      <Link href={item.href} className={styles.allLink} onClick={onNavigate}>
        {allLabel}
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
      <IconButton label={closeLabel} className={styles.closeButton} onClick={onClose}>
        <X size={18} aria-hidden="true" />
      </IconButton>
    </div>
  );
}

function Consultation({ labels, href, onNavigate }: { labels: MegaMenuLabels; href: string; onNavigate: () => void }) {
  return (
    <div className={styles.consultation}>
      <MessageSquare size={18} aria-hidden="true" />
      <span className={styles.consultationText}>{labels.consultationText}</span>
      <Link href={href} className={styles.consultationLink} onClick={onNavigate}>
        {labels.consultationCta}
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  );
}

function Preview({
  leaf,
  labels,
  contactHref,
  onNavigate,
}: {
  leaf: HeaderMegaLeaf;
  labels: MegaMenuLabels;
  contactHref: string;
  onNavigate: () => void;
}) {
  return (
    <aside className={`${styles.preview} ${leaf.photo ? "" : styles.previewNoPhoto}`} aria-live="polite">
      {leaf.photo ? (
        <div className={styles.previewPhoto}>
          <Image src={leaf.photo} alt="" fill sizes="200px" />
        </div>
      ) : null}
      <div className={styles.previewText}>
        <span className={styles.previewBrand}>{leaf.brand}</span>
        <h3 className={styles.previewName}>{leaf.label}</h3>
        {leaf.itemType ? <span className={styles.previewKind}>{leaf.itemType}</span> : null}
        <p className={styles.previewDescription}>{leaf.description}</p>
      </div>
      <div className={styles.previewActions}>
        <Link href={leaf.href} className={styles.buttonPrimary} onClick={onNavigate}>
          {labels.details}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <Link href={contactHref} className={styles.buttonGhost} onClick={onNavigate}>
          {labels.requestPrice}
        </Link>
      </div>
    </aside>
  );
}

function TaxonomyPanel({ item, labels, closeLabel, contactHref, onNavigate, onClose, onSwitch, autoFocus }: MegaPanelProps & { item: TaxonomyItem }) {
  const text = labels[item.panel];
  const [groupId, setGroupId] = useState<string | null>(null);
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [leafId, setLeafId] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const group = item.groups.find((entry) => entry.id === groupId) ?? item.groups[0];
  const section = group?.sections.find((entry) => entry.id === sectionId) ?? group?.sections[0];
  const results = section?.results ?? group?.results;
  const leaves = results?.columns.flatMap((column) => column.links) ?? [];
  const leaf = leaves.find((entry) => entry.id === leafId) ?? leaves[0];

  useEffect(() => {
    if (autoFocus) railRef.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus();
  }, [autoFocus]);

  if (!group || !results) return null;

  function selectGroup(id: string) {
    if (id === group.id) return;
    setGroupId(id);
    setSectionId(null);
    setLeafId(null);
  }

  function selectSection(id: string) {
    if (id === section?.id) return;
    setSectionId(id);
    setLeafId(null);
  }

  const trail = section
    ? [
        { label: group.label, current: false },
        { label: section.label, current: true },
      ]
    : [{ label: group.label, current: true }];

  return (
    <>
      <PanelHeader item={item} labels={labels} trail={trail} allLabel={text.all} closeLabel={closeLabel} onNavigate={onNavigate} onClose={onClose} />
      <div className={`${styles.body} ${section ? "" : styles.bodyFlat}`}>
        <div className={styles.rail} ref={railRef} onKeyDown={moveFocus}>
          <div className={styles.listTitle}>{text.railTitle}</div>
          {item.groups.map((entry) => {
            const active = entry.id === group.id;
            return (
              <button
                key={entry.id}
                type="button"
                data-roving=""
                tabIndex={active ? 0 : -1}
                aria-pressed={active}
                className={`${styles.row} ${active ? styles.rowActive : ""}`}
                onPointerEnter={onMouse(() => selectGroup(entry.id))}
                onFocus={() => selectGroup(entry.id)}
                onClick={() => selectGroup(entry.id)}
              >
                <span className={styles.rowLabel}>{entry.label}</span>
                <span className={styles.rowCount} aria-hidden="true">{entry.count}</span>
                <span className={styles.srOnly}>{entry.countLabel}</span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            );
          })}
          <div className={styles.alternatives}>
            <div className={styles.listTitle}>{labels.searchOtherWay}</div>
            {otherPanels[item.panel].map((target, index) => (
              <button key={target} type="button" className={styles.alternative} onClick={() => onSwitch(target)}>
                {text.otherWays[index]}
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        {section ? (
          <div className={styles.sections} onKeyDown={moveFocus}>
            <div className={styles.listTitle}>{text.sectionTitle}</div>
            {group.sections.map((entry) => {
              const active = entry.id === section.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  data-roving=""
                  tabIndex={active ? 0 : -1}
                  aria-pressed={active}
                  className={`${styles.row} ${active ? styles.rowActive : ""}`}
                  onPointerEnter={onMouse(() => selectSection(entry.id))}
                  onFocus={() => selectSection(entry.id)}
                  onClick={() => selectSection(entry.id)}
                >
                  <span className={styles.rowLabel}>{entry.label}</span>
                  <span className={styles.rowCount} aria-hidden="true">{entry.count}</span>
                  <span className={styles.srOnly}>{entry.countLabel}</span>
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        ) : null}

        <div className={styles.results}>
          <div className={styles.columns} style={{ "--mega-columns": Math.max(2, results.columns.length) } as CSSProperties}>
            {results.columns.map((column) => (
              <section key={column.brandId} className={styles.column} aria-label={`${column.brand}, ${column.countLabel}`}>
                <div className={styles.columnHead}>
                  <BrandLogo brand={column.brand} logo={column.logo} />
                  <span className={styles.columnCount}>{column.countLabel}</span>
                </div>
                {column.links.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className={`${styles.leaf} ${leaf?.id === link.id ? styles.leafActive : ""}`}
                    onPointerEnter={onMouse(() => setLeafId(link.id))}
                    onFocus={() => setLeafId(link.id)}
                    onClick={onNavigate}
                  >
                    <span className={styles.leafText}>
                      <span className={styles.leafLabel}>{link.label}</span>
                      {link.meta ? <span className={styles.leafMeta}>{link.meta}</span> : null}
                    </span>
                    <ChevronRight size={16} aria-hidden="true" />
                  </Link>
                ))}
                {column.more ? (
                  <Link href={column.more.href} className={styles.more} onClick={onNavigate}>
                    {column.more.label} →
                  </Link>
                ) : null}
              </section>
            ))}
          </div>
          {leaf ? <Preview leaf={leaf} labels={labels} contactHref={contactHref} onNavigate={onNavigate} /> : null}
        </div>
      </div>
      <Consultation labels={labels} href={contactHref} onNavigate={onNavigate} />
    </>
  );
}

function BrandCard({ brand, labels, onNavigate }: { brand: HeaderBrand; labels: MegaMenuLabels["brands"]; onNavigate: () => void }) {
  return (
    <section className={styles.brand} aria-label={brand.label}>
      <div className={styles.brandHead}>
        <div className={styles.brandIdentity}>
          {brand.logo ? <Image src={brand.logo.src} alt={brand.label} width={brand.logo.width} height={brand.logo.height} /> : <span className={styles.brandName}>{brand.label}</span>}
          <span className={styles.brandCount}>
            {brand.countLabel} {labels.itemsInCatalog}
          </span>
        </div>
        <Link href={brand.allHref} className={styles.buttonGhost} onClick={onNavigate}>
          {brand.allLabel}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
      <div className={styles.listTitle}>{labels.linesTitle}</div>
      <ul className={styles.brandLines}>
        {brand.lines.map((line) => (
          <li key={line.id}>
            <Link href={line.href} className={styles.brandLine} onClick={onNavigate}>
              <span className={styles.brandLineTitle}>
                {line.label}
                <ChevronRight size={16} aria-hidden="true" />
              </span>
              <span className={styles.brandLineText}>{line.description}</span>
            </Link>
          </li>
        ))}
      </ul>
      {brand.about ? (
        <Link href={brand.about.href} className={styles.brandAbout} onClick={onNavigate}>
          <span className={styles.brandAboutTitle}>
            {brand.about.label}
            <ArrowRight size={15} aria-hidden="true" />
          </span>
          <span className={styles.brandAboutText}>{brand.about.description}</span>
        </Link>
      ) : null}
    </section>
  );
}

function BrandsPanel({ item, labels, closeLabel, contactHref, onNavigate, onClose }: MegaPanelProps & { item: BrandsItem }) {
  return (
    <>
      <PanelHeader item={item} labels={labels} trail={[]} allLabel={labels.brands.all} closeLabel={closeLabel} onNavigate={onNavigate} onClose={onClose} />
      <div className={styles.brands} style={{ "--mega-columns": Math.max(2, item.brands.length) } as CSSProperties}>
        {item.brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} labels={labels.brands} onNavigate={onNavigate} />
        ))}
      </div>
      <Consultation labels={labels} href={contactHref} onNavigate={onNavigate} />
    </>
  );
}

export function MegaPanel(props: MegaPanelProps) {
  const { item, id } = props;
  return (
    <div id={id} role="region" aria-label={item.label} className={styles.panel}>
      {item.panel === "brands" ? <BrandsPanel {...props} item={item} /> : <TaxonomyPanel {...props} item={item} />}
    </div>
  );
}
