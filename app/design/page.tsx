import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  Download,
  FlaskConical,
  Menu,
  ScanLine,
  ShieldCheck,
} from "lucide-react";

import { TokenGrid, type DesignToken } from "@/app/design/design-interactions";
import { Hero } from "@/components/patterns/hero";
import { ProductCard, type ProductData } from "@/components/patterns/product-card";
import { SiteHeader, type HeaderNavItem } from "@/components/patterns/site-header";
import {
  Badge,
  Button,
  IconButton,
  LabLink,
  SearchField,
  Surface,
  TextField,
} from "@/components/ui/primitives";

import styles from "./design.module.css";

export const metadata: Metadata = {
  title: "LabWell Design System",
  description: "Жива дизайн-система та UI-мова LabWell.",
  robots: {
    index: false,
    follow: false,
  },
};

const sections = [
  ["principles", "Principles"],
  ["changes", "Changes v1.1"],
  ["brand", "Brand"],
  ["colors", "Colors"],
  ["typography", "Typography"],
  ["spacing", "Spacing"],
  ["shape", "Shape"],
  ["depth", "Depth & motion"],
  ["components", "Components"],
  ["patterns", "Patterns"],
  ["responsive", "Responsive"],
] as const;

const auditRows = [
  ["Контраст тексту", "text-muted #738494: 3.85:1 на білому, 3.44:1 на surface-subtle — нижче WCAG AA.", "text-muted → #5F7082: 5.09:1 на білому, 4.54:1 на subtle. Назва токена та сама."],
  ["Межі полів", "border-strong #ACBEC9 — 1.92:1; для меж інтерактивних елементів потрібно ≥ 3:1.", "Новий border-control #7F93A2 (3.18:1): поля, перемикачі, роздільники крихт. border-strong — лише декор."],
  ["Ваги шрифту", "У CSS було 20 різних ваг: 520, 560, 650, 690, 760…", "4 ваги: 400 текст, 500 UI, 600 акценти й кнопки, 700 заголовки й labels."],
  ["Шкала шрифтів", "Розміри задавалися в кожному компоненті окремо.", "10 ролей із токенами --text-*; на mobile Display, H1–H3 зменшуються."],
  ["Висоти контролів", "Кнопки 36 / 44 / 52 px.", "sm 32 / md 40 / lg 48; на touch-пристроях мінімум 44."],
] as const;

const colorRules = [
  ["Текст на світлому", "Лише text-primary, text-secondary, text-muted, brand-700/800. brand-500 (3.74:1) і cyan (1.96:1) — ніколи для тексту."],
  ["Одна заливка дії", "brand-600 — фон primary-кнопки (білий текст 5.21:1). Hover brand-700, pressed brand-800. Активні пункти меню — brand-50 фон + brand-700 текст."],
  ["Cyan — лише акцент", "Лінія eyebrow, декоративні сигнали, м’які фони. Не для станів і не як другий колір дії."],
] as const;

type TypeRole = {
  name: string;
  sample: string;
  meta: string;
  size: string;
  line: string;
  weight: number;
  tracking?: string;
  caps?: boolean;
  color?: string;
};

const typeRoles: TypeRole[] = [
  { name: "Display", sample: "Діагностика", meta: "72/72 · 700 · −3.5% · mobile 44/48", size: "--text-display-size", line: "--text-display-line", weight: 700, tracking: "var(--text-display-tracking)" },
  { name: "H1", sample: "MAGLUMI X8", meta: "56/60 · 700 · −3% · mobile 36/40", size: "--text-h1-size", line: "--text-h1-line", weight: 700, tracking: "var(--text-h1-tracking)" },
  { name: "H2", sample: "Технічні характеристики", meta: "36/42 · 700 · −2% · mobile 28/34", size: "--text-h2-size", line: "--text-h2-line", weight: 700, tracking: "var(--text-h2-tracking)" },
  { name: "H3", sample: "Масштабовані конфігурації", meta: "24/30 · 600 · −1% · mobile 22/28", size: "--text-h3-size", line: "--text-h3-line", weight: 600, tracking: "var(--text-h3-tracking)" },
  { name: "H4", sample: "Імунохімічні аналізатори (CLIA)", meta: "18/26 · 600", size: "--text-h4-size", line: "--text-h4-line", weight: 600 },
  { name: "Nav", sample: "Каталог продукції · Бренди", meta: "15/20 · 500, активний 600", size: "--text-nav-size", line: "--text-nav-line", weight: 500 },
  { name: "Body L", sample: "Автоматизований аналізатор CLIA для середніх і великих лабораторій.", meta: "18/28 · 400 · lead", size: "--text-body-lg-size", line: "--text-body-lg-line", weight: 400, color: "var(--color-text-secondary)" },
  { name: "Body", sample: "Обладнання, реагенти й сервісна підтримка для сучасних клінічних лабораторій України.", meta: "16/26 · 400", size: "--text-body-size", line: "--text-body-line", weight: 400 },
  { name: "Small / UI", sample: "Каталог продукції · Запит ціни · Детальніше", meta: "14/22 · 500 · кнопки 600", size: "--text-small-size", line: "--text-small-line", weight: 500 },
  { name: "Meta", sample: "Snibe · до 600 тестів/год · PDF, 2.4 МБ", meta: "13/18 · 500 · text-muted", size: "--text-meta-size", line: "--text-meta-line", weight: 500, color: "var(--color-text-muted)" },
  { name: "Label", sample: "Snibe · Імунохімічні аналізатори", meta: "12/16 · 700 · +10% · caps", size: "--text-label-size", line: "--text-label-line", weight: 700, tracking: "var(--text-label-tracking)", caps: true, color: "var(--color-brand-700)" },
];

const radii = [
  ["8", "control", "кнопки, поля, пункти", "var(--radius-control)"],
  ["12", "card", "картки, header, dropdown", "var(--radius-card)"],
  ["20", "panel", "мега-меню, hero, секції", "var(--radius-panel)"],
  ["999", "pill", "бейджі, чипи", "var(--radius-round)"],
] as const;

const depths = [
  ["flat", "секції, картки у сітці", "none"],
  ["card", "header, sticky-панель", "var(--shadow-card)"],
  ["elevated", "мега-меню, dropdown, modal", "var(--shadow-elevated)"],
] as const;

const breakpoints = [
  ["mobile", "0–767 px", "Лого + бургер, повноекранне меню drill-down. Крихти — лише «‹ Батько».", "390"],
  ["tablet", "768–1279 px", "Лого + бургер. Крихти згортають середні рівні в «…» до 1023 px.", "768, 1024"],
  ["desktop", "≥ 1280 px", "Повна шапка й мега-меню, повний рядок крихт.", "1280, 1440"],
] as const;

const colorTokens: DesignToken[] = [
  { name: "--color-brand-50", value: "#EFF8FF", color: "#eff8ff", role: "Активний пункт, hover-фон" },
  { name: "--color-brand-100", value: "#DCEEFF", color: "#dceeff", role: "Бейдж brand, виділення" },
  { name: "--color-brand-300", value: "#84C5F4", color: "#84c5f4", role: "Рамка secondary-кнопки" },
  { name: "--color-brand-600", value: "#126FBD", color: "#126fbd", ratio: "5.21:1", role: "Заливка primary, focus-кільце" },
  { name: "--color-brand-700", value: "#115B9A", color: "#115b9a", ratio: "7.03:1", role: "Посилання, активний текст" },
  { name: "--color-brand-950", value: "#0B263F", color: "#0b263f", ratio: "15.4:1", role: "Темні блоки, футер" },
  { name: "--color-canvas", value: "#F3F7F9", color: "#f3f7f9", role: "Фон сторінки" },
  { name: "--color-surface", value: "#FFFFFF", color: "#ffffff", role: "Картки, панелі" },
  { name: "--color-surface-subtle", value: "#EDF3F6", color: "#edf3f6", role: "Рейка меню, таблиці" },
  { name: "--color-border", value: "#D5E0E7", color: "#d5e0e7", ratio: "1.34:1", role: "Межі карток і секцій" },
  { name: "--color-border-control", value: "#7F93A2", color: "#7f93a2", ratio: "3.18:1", role: "Межі полів, роздільники", change: "NEW" },
  { name: "--color-text-primary", value: "#0A1927", color: "#0a1927", ratio: "17.8:1", role: "Заголовки, основний текст" },
  { name: "--color-text-secondary", value: "#41576B", color: "#41576b", ratio: "7.50:1", role: "Описи, пункти навігації" },
  { name: "--color-text-muted", value: "#5F7082", color: "#5f7082", ratio: "5.09:1", role: "Мета, labels (було #738494)", change: "FIX" },
  { name: "--color-cyan", value: "#63C8D2", color: "#63c8d2", ratio: "1.96:1", role: "Лише декор і eyebrow-лінія" },
  { name: "--color-success", value: "#167A5D", color: "#167a5d", ratio: "5.28:1", role: "В наявності, сертифіковано" },
  { name: "--color-warning", value: "#9A650A", color: "#9a650a", ratio: "4.95:1", role: "Під замовлення" },
  { name: "--color-danger", value: "#C53F4E", color: "#c53f4e", ratio: "5.01:1", role: "Помилки форм" },
];

const spacingTokens = [
  ["space-1", "4px", "4%"],
  ["space-2", "8px", "8%"],
  ["space-3", "12px", "12%"],
  ["space-4", "16px", "16%"],
  ["space-6", "24px", "24%"],
  ["space-8", "32px", "32%"],
  ["space-12", "48px", "48%"],
  ["space-16", "64px", "64%"],
  ["space-24", "96px", "96%"],
] as const;

const navItems: HeaderNavItem[] = [
  { type: "link", id: "equipment", label: "Обладнання", href: "#patterns" },
  { type: "link", id: "reagents", label: "Реагенти", href: "#components" },
  { type: "link", id: "services", label: "Сервіс", href: "#principles" },
  { type: "link", id: "about", label: "Про нас", href: "#brand" },
];

const ukrainianProduct: ProductData = {
  tag: "CLIA system",
  brand: "SNIBE",
  title: "MAGLUMI X8",
  description:
    "Повністю автоматична система хемілюмінесцентного імуноаналізу для лабораторій із високим навантаженням.",
  specs: [
    { label: "Продуктивність", value: "450 тестів/год" },
    { label: "Зразки", value: "300 позицій" },
    { label: "Реагенти", value: "42 позиції" },
    { label: "Інкубація", value: "37°C ± 0.1°C" },
  ],
  media: {
    alt: "Схематичний лабораторний аналізатор",
    variant: "analyzer",
    label: "Analyzer / X8",
  },
  cta: { label: "Технічні характеристики", href: "#responsive" },
};

const englishProduct: ProductData = {
  tag: "New arrival",
  brand: "Bio-Rad",
  title: "High-throughput Immunoassay Workstation",
  description:
    "A compact diagnostic platform engineered for continuous workflow and precise sample management.",
  specs: [
    { label: "Throughput", value: "300 tests/hour" },
    { label: "Footprint", value: "Desktop unit" },
  ],
  media: {
    alt: "Abstract diagnostic workstation",
    variant: "diagnostics",
    label: "Stress test / EN",
  },
  cta: { label: "Explore technical specifications", href: "#responsive" },
};

function SectionHeader({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.sectionHeader}>
      <div>
        <span className={styles.sectionIndex}>{index}</span>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      <p className={styles.sectionLead}>{description}</p>
    </div>
  );
}

function ViewportChrome({ label }: { label: string }) {
  return (
    <div className={styles.viewportLabel} aria-hidden="true">
      <span>{label}</span>
      <span className={styles.viewportDots}>
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.brandLockup}>
            <Image
              src="/logo_LABWELL.png"
              alt="LabWell"
              width={180}
              height={40}
              className={styles.brandLogo}
              priority
            />
            <span className={styles.brandDivider} aria-hidden="true" />
            <span className={styles.brandLabel}>Design system</span>
          </div>
          <span className={styles.version}>
            <span className={styles.versionDot} aria-hidden="true" />
            Foundations v1.1
          </span>
        </div>
      </header>

      <section className={styles.intro} aria-labelledby="design-title">
        <div className={styles.introContent}>
          <p className={styles.kicker}>LabWell / Visual language 01</p>
          <h1 id="design-title" className={styles.introTitle}>
            Точність має <span>візуальну мову.</span>
          </h1>
          <p className={styles.introText}>
            Спокійна clinical-tech система для складного лабораторного продукту:
            структурована, людяна та достатньо виразна, щоб LabWell упізнавали без
            зайвого шуму.
          </p>
          <div className={styles.principleStrip} aria-label="Ключові якості системи">
            <div className={styles.principle}>
              <span className={styles.principleNumber}>01</span>
              <strong>Precision</strong>
            </div>
            <div className={styles.principle}>
              <span className={styles.principleNumber}>02</span>
              <strong>Clarity</strong>
            </div>
            <div className={styles.principle}>
              <span className={styles.principleNumber}>03</span>
              <strong>Confidence</strong>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.shell}>
        <nav className={styles.sideNav} aria-label="Навігація дизайн-системи">
          <span className={styles.sideNavLabel}>Index / 01—11</span>
          {sections.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <div className={styles.content}>
          <section id="principles" className={styles.section}>
            <SectionHeader
              index="01 / Principles"
              title="Не стерильно. Точно."
              description="Клінічна довіра народжується не з білого простору самого по собі, а з ясної ієрархії, передбачуваних дій і контрольованих деталей."
            />
            <div className={styles.principlesGrid}>
              <article className={styles.principleCard}>
                <span className={styles.principleIcon}>
                  <ScanLine aria-hidden="true" size={20} />
                </span>
                <h3>Signal over noise</h3>
                <p>Один сильний акцент веде користувача; другорядне не конкурує за увагу.</p>
              </article>
              <article className={styles.principleCard}>
                <span className={styles.principleIcon}>
                  <ShieldCheck aria-hidden="true" size={20} />
                </span>
                <h3>Evidence builds trust</h3>
                <p>Характеристики, стани й сервісна інформація завжди читаються без здогадок.</p>
              </article>
              <article className={styles.principleCard}>
                <span className={styles.principleIcon}>
                  <FlaskConical aria-hidden="true" size={20} />
                </span>
                <h3>Technical, still human</h3>
                <p>Технологічна точність поєднується з м’якими формами та зрозумілою мовою.</p>
              </article>
            </div>
          </section>

          <section id="changes" className={styles.section}>
            <SectionHeader
              index="02 / Changes"
              title="Що змінилося у v1.1"
              description="Аудит v1 з коду: контраст, ваги, шкала шрифтів, висоти. Назви токенів не змінилися — лише значення й роль."
            />
            <div className={styles.auditTable} role="table" aria-label="Зміни Foundations v1.1">
              <div className={styles.auditHead} role="row">
                <span role="columnheader">Область</span>
                <span role="columnheader">Що було у v1</span>
                <span role="columnheader">Рішення v1.1</span>
              </div>
              {auditRows.map(([area, found, fix]) => (
                <div key={area} className={styles.auditRow} role="row">
                  <strong role="cell">{area}</strong>
                  <span role="cell">{found}</span>
                  <span role="cell">{fix}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="brand" className={styles.section}>
            <SectionHeader
              index="03 / Brand"
              title="Знак і простір"
              description="Офіційний логотип використовується без перемальовування. Навколо нього завжди залишається спокійна зона, рівна висоті знака."
            />
            <div className={styles.brandGrid}>
              <div className={styles.brandPanel}>
                <Image
                  src="/logo_LABWELL.png"
                  alt="Повний логотип LabWell"
                  width={800}
                  height={179}
                />
              </div>
              <article className={styles.brandRulePanel}>
                <div className={styles.clearSpace} aria-hidden="true" />
                <div>
                  <h3>Clear space = 1× mark</h3>
                  <p>Не стискати, не фарбувати й не відділяти знак від wordmark у продуктових header-компонентах.</p>
                </div>
              </article>
            </div>
          </section>

          <section id="colors" className={styles.section}>
            <SectionHeader
              index="04 / Colors"
              title="Колір як сигнал"
              description="Brand blue відповідає за дію й довіру, cyan — за технологічну свіжість. Нейтральні поверхні тримають інформацію чистою."
            />
            <TokenGrid tokens={colorTokens} />
            <div className={styles.ruleGrid}>
              {colorRules.map(([title, text]) => (
                <article key={title} className={styles.ruleCard}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="typography" className={styles.section}>
            <SectionHeader
              index="05 / Typography"
              title="Onest · 4 ваги · 11 ролей"
              description="400 — текст, 500 — UI, 600 — акценти й кнопки, 700 — заголовки й labels. Розміри беруться з токенів --text-*; на mobile великі ролі зменшуються."
            />
            <div className={styles.typeSpecimen}>
              {typeRoles.map((role) => (
                <div key={role.name} className={styles.typeRow}>
                  <span className={styles.typeName}>{role.name}</span>
                  <span
                    className={styles.typeSample}
                    style={{
                      fontSize: `var(${role.size})`,
                      lineHeight: `var(${role.line})`,
                      fontWeight: role.weight,
                      letterSpacing: role.tracking,
                      textTransform: role.caps ? "uppercase" : undefined,
                      color: role.color,
                    }}
                  >
                    {role.sample}
                  </span>
                  <span className={styles.typeMeta}>{role.meta}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="spacing" className={styles.section}>
            <SectionHeader
              index="06 / Spacing"
              title="Ритм 4 px"
              description="4–16 px — усередині компонентів, 24–48 px — між блоками, 64–96 px — між секціями сторінки."
            />
            <div className={styles.spacingPanel}>
              {spacingTokens.map(([name, value, width]) => (
                <div key={name} className={styles.spacingRow}>
                  <span className={styles.spacingName}>{name}</span>
                  <span className={styles.spacingTrack}>
                    <span className={styles.spacingBar} style={{ width }} />
                  </span>
                  <span className={styles.spacingValue}>{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="shape" className={styles.section}>
            <SectionHeader
              index="07 / Shape"
              title="Радіуси й висоти"
              description="Чотири радіуси за роллю елемента. Три висоти контролів; на touch-пристроях зона дотику не менша за 44 px, навіть для sm."
            />
            <div className={styles.shapeGrid}>
              {radii.map(([px, name, use, value]) => (
                <div key={name} className={styles.radiusSample} style={{ borderRadius: value }}>
                  <strong>{px}</strong> {name}
                  <span>{use}</span>
                </div>
              ))}
            </div>
            <div className={styles.componentRow}>
              <Button size="sm" variant="secondary">sm 32</Button>
              <Button size="md">md 40</Button>
              <Button size="lg">lg 48</Button>
            </div>
          </section>

          <section id="depth" className={styles.section}>
            <SectionHeader
              index="08 / Depth & motion"
              title="Тінь = над сторінкою"
              description="140 ms — hover і фокус, 200 ms — відкриття меню, easing (0.2, 0.8, 0.2, 1). Без translateY на пунктах меню: зсув ламає сітку."
            />
            <div className={styles.depthGrid}>
              {depths.map(([name, use, shadow]) => (
                <div key={name} className={styles.depthSample} style={{ boxShadow: shadow }}>
                  <strong>{name}</strong>
                  <span>{use}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="components" className={styles.section}>
            <SectionHeader
              index="09 / Components"
              title="Тихі за замовчуванням"
              description="Компоненти не імітують ефектність. Вони стають помітними у момент взаємодії — через контраст, фокус і короткий рух."
            />

            <div className={styles.componentGrid}>
              <Surface className={styles.specimenPanel}>
                <h3>Buttons</h3>
                <p className={styles.specimenCaption}>Primary, secondary, ghost · sm, md, lg</p>
                <div className={styles.componentRow}>
                  <Button variant="primary">Зв’язатися</Button>
                  <Button variant="secondary">Каталог</Button>
                  <Button variant="ghost">Дізнатися більше</Button>
                </div>
                <div className={styles.componentRow}>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large action</Button>
                </div>
              </Surface>

              <Surface className={styles.specimenPanel}>
                <h3>Fields</h3>
                <p className={styles.specimenCaption}>Завжди з label, hint або зрозумілою помилкою.</p>
                <div className={styles.fieldStack}>
                  <SearchField
                    id="design-search"
                    label="Пошук обладнання"
                    placeholder="Пошук обладнання…"
                    hint="Модель, категорія або виробник"
                  />
                  <TextField
                    id="design-email"
                    label="Робоча електронна пошта"
                    type="email"
                    defaultValue="lab@example"
                    error="Перевірте формат адреси"
                  />
                </div>
              </Surface>

              <Surface className={styles.specimenPanel}>
                <h3>Badges & links</h3>
                <p className={styles.specimenCaption}>Службові сигнали без декоративного шуму.</p>
                <div className={styles.componentRow}>
                  <Badge>Neutral</Badge>
                  <Badge tone="brand">CLIA system</Badge>
                  <Badge tone="success">Сертифіковано</Badge>
                  <Badge tone="warning">Обмежено</Badge>
                  <Badge tone="danger">Помилка</Badge>
                </div>
                <div className={styles.componentRow}>
                  <LabLink href="#patterns" trailingArrow>
                    Переглянути патерни
                  </LabLink>
                  <LabLink href="#responsive" trailingArrow>
                    Explore a significantly longer English link
                  </LabLink>
                </div>
              </Surface>

              <Surface className={styles.specimenPanel}>
                <h3>Icon actions</h3>
                <p className={styles.specimenCaption}>44 px touch target і обов’язкова доступна назва.</p>
                <div className={styles.componentRow}>
                  <IconButton label="Відкрити меню">
                    <Menu aria-hidden="true" size={19} />
                  </IconButton>
                  <Button leadingIcon={<Download aria-hidden="true" size={17} />}>
                    Завантажити PDF
                  </Button>
                  <IconButton label="Недоступна дія" disabled>
                    <ArrowRight aria-hidden="true" size={19} />
                  </IconButton>
                </div>
              </Surface>
            </div>

            <div className={styles.stateGrid} aria-label="Стани primary button">
              <div className={styles.stateCell}>
                <span>Default</span>
                <Button>Action</Button>
              </div>
              <div className={styles.stateCell}>
                <span>Hover</span>
                <Button data-demo-state="hover">Action</Button>
              </div>
              <div className={styles.stateCell}>
                <span>Focus</span>
                <Button data-demo-state="focus">Action</Button>
              </div>
              <div className={styles.stateCell}>
                <span>Pressed</span>
                <Button data-demo-state="pressed">Action</Button>
              </div>
              <div className={styles.stateCell}>
                <span>Disabled</span>
                <Button disabled>Action</Button>
              </div>
            </div>
          </section>

          <section id="patterns" className={styles.section}>
            <SectionHeader
              index="10 / Patterns"
              title="Композиції, готові до даних"
              description="Header, Hero та Product Card приймають контент через props. Реальні фото можна підставити замість placeholders без зміни layout."
            />
            <div className={styles.patternStack}>
              <div>
                <div className={styles.patternLabel}>
                  <h3>Site header</h3>
                  <code>container responsive</code>
                </div>
                <div className={styles.patternFrame}>
                  <SiteHeader
                    navItems={navItems}
                    search={{
                      label: "Пошук обладнання",
                      placeholder: "Пошук обладнання…",
                    }}
                    cta={{ label: "Зв’язатися з нами", href: "#components" }}
                    homeHref="#design-title"
                  />
                </div>
              </div>

              <div>
                <div className={styles.patternLabel}>
                  <h3>Hero</h3>
                  <code>eyebrow · actions · media</code>
                </div>
                <Hero
                  eyebrow="Офіційний дистриб’ютор"
                  title="Інноваційні рішення для лабораторної діагностики"
                  description="Надійне обладнання, сертифіковані реагенти та сервісна підтримка для лабораторій, де точність визначає результат."
                  actions={[
                    { label: "Переглянути каталог", href: "#responsive" },
                    { label: "Консультація", href: "#components", variant: "secondary" },
                  ]}
                  media={{
                    alt: "Абстрактна лабораторна система",
                    variant: "automation",
                    label: "Clinical automation",
                  }}
                  titleTag="h3"
                />
              </div>

              <div>
                <div className={styles.patternLabel}>
                  <h3>Product cards</h3>
                  <code>UA + EN length stress</code>
                </div>
                <div className={styles.cardPair}>
                  <ProductCard product={ukrainianProduct} />
                  <ProductCard product={englishProduct} />
                </div>
              </div>
            </div>
          </section>

          <section id="responsive" className={styles.section}>
            <SectionHeader
              index="11 / Responsive"
              title="Три брейкпоінти, одна система"
              description="Desktop розкриває навігацію й інформаційну щільність. Mobile зберігає 44 px touch targets, вертикальну ієрархію та той самий характер."
            />
            <div className={styles.auditTable} role="table" aria-label="Брейкпоінти">
              <div className={styles.auditHead} role="row">
                <span role="columnheader">Брейкпоінт</span>
                <span role="columnheader">Поведінка</span>
                <span role="columnheader">Перевіряємо на</span>
              </div>
              {breakpoints.map(([name, range, behavior, widths]) => (
                <div key={name} className={styles.auditRow} role="row">
                  <strong role="cell">
                    {name} <span className={styles.auditRange}>{range}</span>
                  </strong>
                  <span role="cell">{behavior}</span>
                  <span role="cell">{widths} px</span>
                </div>
              ))}
            </div>
            <div className={styles.responsiveGrid}>
              <div className={styles.responsivePanel}>
                <ViewportChrome label="DESKTOP / FLUID" />
                <div className={styles.desktopViewport}>
                  <div className={styles.desktopViewportInner}>
                    <SiteHeader
                      navItems={navItems.slice(0, 3)}
                      search={{ label: "Пошук", placeholder: "Пошук…" }}
                      cta={{ label: "Контакт", href: "#components" }}
                      homeHref="#design-title"
                    />
                    <ProductCard product={englishProduct} />
                  </div>
                </div>
              </div>

              <div className={styles.responsivePanel}>
                <ViewportChrome label="MOBILE / 375" />
                <div className={styles.mobileViewport}>
                  <div className={styles.mobileViewportInner}>
                    <SiteHeader
                      navItems={navItems}
                      search={{ label: "Пошук", placeholder: "Пошук обладнання…" }}
                      cta={{ label: "Зв’язатися", href: "#components" }}
                      homeHref="#design-title"
                    />
                    <ProductCard product={ukrainianProduct} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className={styles.footer}>
        LabWell Design System · Foundations v1.1 · Onest / 4px grid / WCAG AA
      </footer>
    </main>
  );
}
