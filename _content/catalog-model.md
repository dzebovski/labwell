# Технічна модель каталогу LabWell

## 1. Призначення

Це платформонейтральна логічна схема для майбутньої CMS або TypeScript-реалізації. Вона описує дані й інваріанти, але не прив'язує каталог до конкретної бази даних чи UI.

Модель нормалізована: продуктові вузли зберігаються один раз, а навігація, фільтри, сторінки брендів і breadcrumbs будуються як проєкції.

## 2. Ідентифікатори й URL

### Правила ID

- Формат: `{entity-prefix}-{scope}-{semantic-name}`.
- Тільки lowercase ASCII та дефіси.
- ID не змінюється після публікації, навіть якщо змінюється відображувана назва.
- Префікси: `brd`, `pt`, `da`, `bpg`, `fam`, `prd`, `tm`, `rel`.

Приклади:

```text
brd-snibe
pt-equipment
da-immunoassay
bpg-snibe-immunoassay
fam-snibe-clia-analyzers
prd-snibe-maglumi-x8
tm-snibe-clia
```

### Правила slug

- Тільки lowercase ASCII та дефіси.
- Бренд не додається в product slug, якщо без нього slug залишається унікальним.
- Для початкового реєстру product slug дорівнює частині ID після `prd-{brand}-`; family slug — частині після `fam-{brand}-` або `fam-generic-`, якщо немає окремого значення в реєстрі.
- Зміна slug після публікації потребує постійного redirect зі старого URL.
- Canonical URL конкретного продукту: `/products/{slug}`.
- Canonical URL сімейства: `/product-families/{slug}`, якщо сімейство отримує власну публічну сторінку.
- Test menu: `/test-menus/{slug}`.
- Бренд: `/brands/{brand-slug}`.
- Категорія: `/products/{product-type-slug}`.

## 3. Спільні типи

```ts
type EntityId = string;
type Slug = string;
type ISODateTime = string;

type VerificationStatus =
  | 'source-confirmed'
  | 'market-dependent'
  | 'source-ambiguous'
  | 'external-discrepancy';

type PublicationStatus = 'draft' | 'published' | 'archived';

type MarketAvailability =
  | 'confirmed-for-ukraine'
  | 'market-dependent'
  | 'unknown';

interface SourceRef {
  file: 'content/labwell.docx' | 'content/labwell.md' | 'report-1.md' | 'report-2.md';
  locator?: string;
  note?: string;
}

interface EditorialOverride {
  reason: string;
  approvedBy: string;
  approvedAt: ISODateTime;
}

interface ProductResource {
  id: string;
  title: string;
  type: 'brochure' | 'manual' | 'specification' | 'certificate' | 'test-menu' | 'other';
  url: string;
  language: 'uk' | 'en' | 'other';
}

interface ServiceLink {
  label: string;
  href: string;
  type: 'consultation' | 'installation' | 'training' | 'maintenance' | 'support';
}

interface EntityBase {
  id: EntityId;
  slug: Slug;
  name: string;
  nameEn?: string;
  aliases: string[];
  sortOrder: number;
  verificationStatus: VerificationStatus;
  publicationStatus: PublicationStatus;
  navigationVisible: boolean;
  sourceRefs: SourceRef[];
  editorialOverride?: EditorialOverride;
  notes?: string;
}
```

### Політика статусів

- Новий вузол починає зі `publicationStatus: 'draft'`.
- `source-confirmed` означає підтвердження наявності в DOCX, але не автоматично підтверджує доступність в Україні.
- `market-dependent`, `source-ambiguous` та `external-discrepancy` не можна публікувати без редакційного рішення.
- `navigationVisible` не замінює `publicationStatus`: прихований вузол може бути опублікованим і доступним за прямим URL.

### Початкові значення реєстру

- Усі створені вузли починають із `publicationStatus: 'draft'`.
- `verificationStatus` дорівнює `source-confirmed`, якщо в `catalog-graph.md` не вказано інше.
- `sortOrder` призначається кроком 10 у порядку відповідної таблиці або дерева `catalog-graph.md`; це залишає місце для вставок без масового перенумерування.
- `navigationVisible: true` за замовчуванням для `Brand`, `ProductType`, `DiagnosticArea` і `BrandPortfolioGroup`.
- Для `ProductFamily` значення `true` встановлюється лише коли сімейство має власну landing page або є видимим вузлом категорії.
- Для `Product` і `TestMenu` значення `false` у mega menu; вони залишаються видимими у listing pages і пошуку після публікації.
- Вузли зі статусом `market-dependent`, `source-ambiguous` або `external-discrepancy` мають `navigationVisible: false` до редакційного підтвердження.

## 4. Сутності

### Brand

```ts
interface Brand extends EntityBase {
  kind: 'brand';
  logoAssetId?: string;
  description?: string;
}
```

Початкові записи:

| ID | Slug | Назва | Порядок |
|---|---|---|---:|
| `brd-snibe` | `snibe` | SNIBE | 10 |
| `brd-biorad` | `bio-rad` | Bio-Rad | 20 |

### ProductType

```ts
interface ProductType extends EntityBase {
  kind: 'product-type';
}
```

| ID | Slug | Назва | Порядок |
|---|---|---|---:|
| `pt-equipment` | `equipment` | Лабораторне обладнання | 10 |
| `pt-reagents-tests` | `reagents-tests` | Реагенти й тести | 20 |
| `pt-quality-control` | `quality-control` | Контроль якості | 30 |
| `pt-consumables-accessories` | `consumables-accessories` | Витратні матеріали й аксесуари | 40 |
| `pt-software` | `software` | Програмне забезпечення | 50 |

### DiagnosticArea

```ts
interface DiagnosticArea extends EntityBase {
  kind: 'diagnostic-area';
  parentId?: EntityId;
}
```

Початковий реєстр напрямів:

| ID | Slug | Назва |
|---|---|---|
| `da-immunoassay` | `immunoassay` | Імуноаналіз |
| `da-autoimmune-testing` | `autoimmune-testing` | Автоімунне тестування |
| `da-biochemistry` | `biochemistry` | Біохімія |
| `da-electrolytes` | `electrolytes` | Електроліти |
| `da-integrated-systems` | `integrated-systems` | Інтегровані системи |
| `da-lab-automation` | `lab-automation` | Автоматизація лабораторії |
| `da-molecular-diagnostics` | `molecular-diagnostics` | Молекулярна діагностика |
| `da-poct` | `poct` | Експрес-діагностика POCT |
| `da-immunohematology` | `immunohematology` | Імуногематологія |
| `da-diabetes` | `diabetes` | Діабет |
| `da-hemoglobinopathies` | `hemoglobinopathies` | Гемоглобінопатії |
| `da-infectious-diseases` | `infectious-diseases` | Інфекційні захворювання |
| `da-microbiology` | `microbiology` | Мікробіологія |
| `da-newborn-screening` | `newborn-screening` | Неонатальний скринінг |
| `da-quality-control` | `quality-control` | Контроль якості |
| `da-toxicology` | `toxicology` | Токсикологія |
| `da-microplate-automation` | `microplate-automation` | Автоматизація мікропланшетів |
| `da-western-blot` | `western-blot` | Western Blot |
| `da-incubation` | `incubation` | Інкубація |

Це фасетна таксономія, а не обов'язково дерево меню. Один продукт може мати кілька напрямів.

### BrandPortfolioGroup

```ts
interface BrandPortfolioGroup extends EntityBase {
  kind: 'brand-portfolio-group';
  brandId: EntityId;
  parentId?: EntityId;
}
```

Ця сутність зберігає мову й порядок портфеля виробника, не змінюючи глобальну класифікацію LabWell. Наприклад, продукт може бути присутнім у `bpg-biorad-diabetes-testing`, але водночас мати додатковий діагностичний напрям або входити до іншої портфельної групи через окремий edge.

Початковий реєстр:

| ID | Slug | Назва | Brand |
|---|---|---|---|
| `bpg-snibe-immunoassay` | `immunoassay` | Імуноаналіз | SNIBE |
| `bpg-snibe-biochemistry-electrolyte` | `biochemistry-electrolyte` | Біохімія та електроліти | SNIBE |
| `bpg-snibe-integrated-systems` | `integrated-systems` | Інтегровані системи | SNIBE |
| `bpg-snibe-lab-automation` | `lab-automation` | Автоматизація лабораторії | SNIBE |
| `bpg-snibe-molecular-diagnostics` | `molecular-diagnostics` | Молекулярна діагностика | SNIBE |
| `bpg-snibe-poct` | `poct` | POCT | SNIBE |
| `bpg-biorad-autoimmune-testing` | `autoimmune-testing` | Автоімунне тестування | Bio-Rad |
| `bpg-biorad-blood-typing-screening` | `blood-typing-screening` | Типування та скринінг крові | Bio-Rad |
| `bpg-biorad-diabetes-testing` | `diabetes-testing` | Тестування на діабет | Bio-Rad |
| `bpg-biorad-hemoglobinopathy-testing` | `hemoglobinopathy-testing` | Тестування на гемоглобінопатії | Bio-Rad |
| `bpg-biorad-infectious-disease-testing` | `infectious-disease-testing` | Інфекційні захворювання | Bio-Rad |
| `bpg-biorad-microbiology-testing` | `microbiology-testing` | Мікробіологічне тестування | Bio-Rad |
| `bpg-biorad-newborn-screening` | `newborn-screening` | Неонатальний скринінг | Bio-Rad |
| `bpg-biorad-quality-control` | `quality-control` | Контроль якості | Bio-Rad |
| `bpg-biorad-software-data-analysis` | `software-data-analysis` | Програмне забезпечення та аналітика | Bio-Rad |
| `bpg-biorad-toxicology` | `toxicology` | Токсикологія | Bio-Rad |

### ProductFamily

```ts
interface ProductFamily extends EntityBase {
  kind: 'product-family';
  brandId?: EntityId;
  productTypeId: EntityId;
  parentId?: EntityId;
  canonicalPath?: string;
}
```

`brandId` відсутній у глобальних сімейств на кшталт «Пробірки» або «PCR-набори». Сімейство може бути публічною landing page або лише внутрішнім вузлом групування.

`parentId` підтримує вкладені сімейства, наприклад `Контролі та калібратори → Імунологічні та біохімічні контроли → Liquichek`.

### Product

```ts
interface Product extends EntityBase {
  kind: 'product';
  brandId: EntityId;
  productTypeId: EntityId;
  primaryFamilyId?: EntityId;
  primaryDiagnosticAreaId: EntityId;
  canonicalPath: `/products/${string}`;
  marketAvailability: MarketAvailability;
  shortDescription?: string;
  resources: ProductResource[];
  serviceLinks: ServiceLink[];
}
```

Інваріанти:

- `brandId`, `productTypeId`, `primaryDiagnosticAreaId` і `canonicalPath` обов'язкові.
- `canonicalPath` унікальний.
- Повторення продукту в декількох напрямах оформлюється edges `in-diagnostic-area`.
- Один продукт не копіюється для сторінок бренду, категорії або рішення.

### TestMenu

```ts
interface TestMenu extends EntityBase {
  kind: 'test-menu';
  brandId: EntityId;
  productTypeId: 'pt-reagents-tests';
  primaryDiagnosticAreaId: EntityId;
  groupLabels: string[];
  canonicalPath: `/test-menus/${string}`;
}
```

`groupLabels` є контрольованими редакційними значеннями, а не окремими SKU. Після отримання підтвердженого каталогу кожен тест можна буде перетворити на окремий `Product` без зміни TestMenu.

| ID | Slug | Назва |
|---|---|---|
| `tm-snibe-clia` | `snibe-clia-test-menu` | CLIA Test Menu |
| `tm-snibe-biochemistry` | `snibe-biochemistry-test-menu` | Biochemistry Test Menu |
| `tm-snibe-molecular` | `snibe-molecular-test-menu` | Molecular Test Menu |
| `tm-snibe-poct` | `snibe-poct-test-menu` | POCT Test Menu |

## 5. Зв'язки

```ts
type EntityKind =
  | 'brand'
  | 'product-type'
  | 'diagnostic-area'
  | 'brand-portfolio-group'
  | 'product-family'
  | 'product'
  | 'test-menu';

type RelationType =
  | 'in-diagnostic-area'
  | 'in-portfolio-group'
  | 'member-of-family'
  | 'contains-product'
  | 'supported-by-test-menu'
  | 'supports-family'
  | 'compatible-with'
  | 'has-accessory-family'
  | 'has-reagent-family'
  | 'related-to'
  | 'combines-capabilities';

interface Relation {
  id: EntityId;
  fromKind: EntityKind;
  fromId: EntityId;
  type: RelationType;
  toKind: EntityKind;
  toId: EntityId;
  verificationStatus: VerificationStatus;
  sourceRefs: SourceRef[];
  note?: string;
}
```

### Правила edges

- Напрями, додаткові портфельні групи, test menu та сумісність зберігаються як `Relation`.
- `compatible-with` завжди симетричний на рівні API, але фізично може зберігатися одним edge.
- `supported-by-test-menu` не означає сумісність кожного тесту з кожною моделлю, якщо edge веде від сімейства.
- `contains-product` і `member-of-family` є оберненими представленнями одного логічного зв'язку; джерело даних зберігає лише `member-of-family`, а API може віддавати обидва напрями.
- Edge з непідтвердженим джерелом не створюється. Припущення зберігається в editorial backlog, а не в production graph.

### Приклади edges

```ts
const relations: Relation[] = [
  {
    id: 'rel-clia-analyzers-snibe-immunoassay',
    fromKind: 'product-family',
    fromId: 'fam-snibe-clia-analyzers',
    type: 'in-portfolio-group',
    toKind: 'brand-portfolio-group',
    toId: 'bpg-snibe-immunoassay',
    verificationStatus: 'source-confirmed',
    sourceRefs: [{ file: 'content/labwell.docx', locator: 'SNIBE / Immunoassay' }],
    note: 'Це портфельне групування, а не доказ сумісності з CLIA Test Menu.'
  },
  {
    id: 'rel-clia-menu-snibe-immunoassay',
    fromKind: 'test-menu',
    fromId: 'tm-snibe-clia',
    type: 'in-portfolio-group',
    toKind: 'brand-portfolio-group',
    toId: 'bpg-snibe-immunoassay',
    verificationStatus: 'source-confirmed',
    sourceRefs: [{ file: 'content/labwell.docx', locator: 'SNIBE / Immunoassay' }]
  },
  {
    id: 'rel-bioplex-2200-infectious-diseases',
    fromKind: 'product',
    fromId: 'prd-biorad-bioplex-2200',
    type: 'in-diagnostic-area',
    toKind: 'diagnostic-area',
    toId: 'da-infectious-diseases',
    verificationStatus: 'source-confirmed',
    sourceRefs: [{ file: 'content/labwell.docx', locator: 'Bio-Rad / Infectious Disease Testing' }]
  }
];
```

## 6. Коренева структура даних

```ts
interface CatalogGraph {
  brands: Brand[];
  productTypes: ProductType[];
  diagnosticAreas: DiagnosticArea[];
  portfolioGroups: BrandPortfolioGroup[];
  productFamilies: ProductFamily[];
  products: Product[];
  testMenus: TestMenu[];
  relations: Relation[];
}
```

Усі listing pages та навігаційні дерева обчислюються з `CatalogGraph`. Окремі масиви «продукти SNIBE» або «обладнання Bio-Rad» як дубльовані джерела даних не створюються.

## 7. Навігаційні проєкції

### «Продукція»

```ts
interface ProductsProjectionQuery {
  productTypeId: EntityId;
  diagnosticAreaId?: EntityId;
  brandId?: EntityId;
  familyId?: EntityId;
  publicationStatus: 'published';
}
```

Порядок групування:

1. `ProductType.sortOrder`.
2. `DiagnosticArea.sortOrder`.
3. `ProductFamily.sortOrder`.
4. `Product.sortOrder`, потім `name`.

### «Бренди»

```ts
interface BrandProjectionQuery {
  brandId: EntityId;
  portfolioGroupId?: EntityId;
  productTypeId?: EntityId;
  publicationStatus: 'published';
}
```

Портфельна сторінка отримує вузли через `brandId` та edges `in-portfolio-group`. Вона не володіє копіями продуктів.

### Product resolver

```ts
interface ProductPageView {
  product: Product;
  brand: Brand;
  productType: ProductType;
  primaryArea: DiagnosticArea;
  additionalAreas: DiagnosticArea[];
  family?: ProductFamily;
  portfolioGroups: BrandPortfolioGroup[];
  testMenus: TestMenu[];
  compatibleProducts: Product[];
  accessoryFamilies: ProductFamily[];
  reagentFamilies: ProductFamily[];
  resources: ProductResource[];
  serviceLinks: ServiceLink[];
}
```

Порожні колекції не показуються в UI. Відсутність зв'язку не інтерпретується як несумісність — лише як відсутність підтверджених даних. `resources` і `serviceLinks` дозволяють виконати вимогу продуктової сторінки без створення окремих сутностей документів і сервісу в першій версії.

## 8. URL, canonical і breadcrumbs

| Сутність | URL |
|---|---|
| Product index | `/products` |
| Product type | `/products/{product-type-slug}` |
| Brand index | `/brands` |
| Brand | `/brands/{brand-slug}` |
| Product | `/products/{product-slug}` |
| Product family | `/product-families/{family-slug}` |
| Test menu | `/test-menus/{test-menu-slug}` |

Правила:

- Сторінки `/brands/{brand}` посилаються на canonical product URL.
- Не створюються дублікати `/brands/{brand}/{product}`.
- Canonical breadcrumb продукту: `Головна → Продукція → тип → primaryDiagnosticArea → продукт`.
- Додаткові напрями доступні як посилання та фільтри, але не змінюють canonical breadcrumb.
- Старі slugs після публікації зберігаються в redirect registry.

## 9. Валідація

### Структурні правила

```ts
interface ValidationIssue {
  severity: 'error' | 'warning';
  code: string;
  entityId?: EntityId;
  message: string;
}
```

Обов'язкові перевірки:

1. Унікальність `id` серед усіх вузлів.
2. Унікальність `slug` у межах одного типу сутності.
3. Унікальність `Product.canonicalPath`.
4. Існування всіх foreign keys і endpoints кожного relation.
5. Рівно один `brandId` і `productTypeId` для кожного продукту.
6. Рівно один `primaryDiagnosticAreaId`; додаткові напрями — через edges.
7. Заборона `published` для `market-dependent`, `source-ambiguous` або `external-discrepancy` без явного editorial override.
8. Заборона публічного compatibility edge без `sourceRefs`.
9. Відсутність циклів у `DiagnosticArea.parentId`, `BrandPortfolioGroup.parentId` і `ProductFamily.parentId`.
10. Досяжність кожного опублікованого брендованого продукту з обох проєкцій.

### Редакційні warnings

- Сімейство без бренду.
- Продукт без сімейства.
- Брендований вузол, не включений до портфельної групи.
- Test menu без пов'язаного обладнання.
- Сімейство аксесуарів без підтверджених compatibility edges.
- Alias, який збігається з canonical name іншої сутності.

## 10. Acceptance-сценарії

### Аналізатор

Запит `MAGLUMI X8` повертає один `Product` із canonical URL `/products/maglumi-x8`, брендом SNIBE, типом «Обладнання», напрямом «Імуноаналіз» і сімейством CLIA. Аналізатор і CLIA Test Menu належать до однієї портфельної групи, але прямий compatibility-зв'язок між ними відсутній до фактологічного підтвердження.

### Продукт у кількох напрямах

`BioPlex 2200 System` існує один раз, але потрапляє до автоімунного тестування та інфекційних захворювань через два edges `in-diagnostic-area`.

### Контроль якості

`Liquichek` повертається як `ProductFamily`, а не вигаданий SKU. Він доступний через «Продукція → Контроль якості» та «Bio-Rad → Контроль якості».

### Програмне забезпечення

`Unity Real Time` має один product node і canonical URL. Відсутність підтвердженої сумісності не генерує автоматичних зв'язків із Liquichek або аналізаторами.

### Розбіжність джерел

`Biossays C8` присутній у draft-графі зі статусом `external-discrepancy`; `Biossays C10` не додається, доки LabWell не підтвердить зміну асортименту.

### Невідомі аксесуари

«Кювети» існують як глобальне сімейство. UI не показує блок «Сумісне з», доки не з'являться підтверджені relations.

## 11. Межі першої версії

- Не додаються окремі assays, реагентні SKU, контролі або калібратори, яких немає в DOCX.
- Не імпортуються X10, C10, SATLARS mini-T8, Hemolumi H6 та інші позиції лише зі звітів виробників.
- Не визначаються ціни, складські залишки, строки поставки або тендерні характеристики.
- Не вигадується сумісність між обладнанням, реагентами, контролями й ПЗ.
- Документи й сервісні переходи зберігаються як вкладені посилання продукту; окремі сутності документів, сервісів і knowledge materials залишаються майбутнім розширенням.
