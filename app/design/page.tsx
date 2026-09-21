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
  ["brand", "Brand"],
  ["colors", "Colors"],
  ["typography", "Typography"],
  ["spacing", "Spacing"],
  ["components", "Components"],
  ["patterns", "Patterns"],
  ["responsive", "Responsive"],
] as const;

const colorTokens: DesignToken[] = [
  { name: "--color-brand-50", value: "#EFF8FF", color: "#eff8ff" },
  { name: "--color-brand-200", value: "#B9DDFF", color: "#b9ddff" },
  { name: "--color-brand-500", value: "#2389D5", color: "#2389d5" },
  { name: "--color-brand-700", value: "#115B9A", color: "#115b9a" },
  { name: "--color-brand-950", value: "#0B263F", color: "#0b263f" },
  { name: "--color-cyan", value: "#63C8D2", color: "#63c8d2" },
  { name: "--color-canvas", value: "#F3F7F9", color: "#f3f7f9" },
  { name: "--color-surface", value: "#FFFFFF", color: "#ffffff" },
  { name: "--color-border", value: "#D5E0E7", color: "#d5e0e7" },
  { name: "--color-text-primary", value: "#0A1927", color: "#0a1927" },
  { name: "--color-success", value: "#167A5D", color: "#167a5d" },
  { name: "--color-danger", value: "#C53F4E", color: "#c53f4e" },
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
  { label: "Обладнання", href: "#patterns" },
  { label: "Реагенти", href: "#components" },
  { label: "Сервіс", href: "#principles" },
  { label: "Про нас", href: "#brand" },
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
            Foundations v1
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
          <span className={styles.sideNavLabel}>Index / 01—08</span>
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

          <section id="brand" className={styles.section}>
            <SectionHeader
              index="02 / Brand"
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
              index="03 / Colors"
              title="Колір як сигнал"
              description="Brand blue відповідає за дію й довіру, cyan — за технологічну свіжість. Нейтральні поверхні тримають інформацію чистою."
            />
            <TokenGrid tokens={colorTokens} />
          </section>

          <section id="typography" className={styles.section}>
            <SectionHeader
              index="04 / Typography"
              title="Onest, без компромісів"
              description="Humanist sans підтримує кирилицю, зберігає технічний характер у малих розмірах і не виглядає холодним у великих заголовках."
            />
            <div className={styles.typeSpecimen}>
              <div className={styles.typeRow}>
                <span className={styles.typeName}>Display</span>
                <span className={styles.typeDisplay}>Діагностика</span>
                <span className={styles.typeMeta}>80 / 76 · 660</span>
              </div>
              <div className={styles.typeRow}>
                <span className={styles.typeName}>Heading 1</span>
                <span className={styles.typeH1}>Лабораторна точність</span>
                <span className={styles.typeMeta}>56 / 56 · 650</span>
              </div>
              <div className={styles.typeRow}>
                <span className={styles.typeName}>Heading 2</span>
                <span className={styles.typeH2}>Системи для точних рішень</span>
                <span className={styles.typeMeta}>40 / 44 · 640</span>
              </div>
              <div className={styles.typeRow}>
                <span className={styles.typeName}>Body</span>
                <span className={styles.typeBody}>
                  Обладнання, реагенти й сервісна підтримка для сучасних клінічних лабораторій України.
                </span>
                <span className={styles.typeMeta}>16 / 26 · 400</span>
              </div>
              <div className={styles.typeRow}>
                <span className={styles.typeName}>Label</span>
                <span className={styles.typeLabel}>Official distribution partner</span>
                <span className={styles.typeMeta}>12 / 16 · 750</span>
              </div>
            </div>
          </section>

          <section id="spacing" className={styles.section}>
            <SectionHeader
              index="05 / Spacing"
              title="Ритм 4 px"
              description="Компактні controls живуть на кроках 4–16 px, композиції — на 24–96 px. Радіуси: 8 px для controls, 12 px для cards, 20 px для великих panels."
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

          <section id="components" className={styles.section}>
            <SectionHeader
              index="06 / Components"
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
              index="07 / Patterns"
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
              index="08 / Responsive"
              title="Одна система, два ритми"
              description="Desktop розкриває навігацію й інформаційну щільність. Mobile зберігає 44 px touch targets, вертикальну ієрархію та той самий характер."
            />
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
        LabWell Design System · Foundations v1 · Onest / 4px grid / WCAG AA
      </footer>
    </main>
  );
}
