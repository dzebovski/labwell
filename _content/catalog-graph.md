# Граф каталогу LabWell

## 1. Призначення документа

Цей документ описує каталог LabWell незалежно від майбутнього інтерфейсу, CMS або фреймворку. Каталог є єдиним графом сутностей, а розділи «Продукція» і «Бренди» — двома навігаційними проєкціями цього графа.

Кожен продукт, сімейство або тестове меню створюється один раз. Різні категорії, брендові сторінки й діагностичні напрями лише посилаються на той самий вузол.

### Джерела і пріоритет

1. `content/labwell.docx` і його структурована копія `content/labwell.md` — авторитетний перелік асортименту LabWell.
2. `report-1.md` — джерело для перевірки структури виробників і виявлення розбіжностей.
3. `report-2.md` — джерело архітектурних патернів каталогів, рішень і крос-навігації.
4. Позиції зі звітів, яких немає в LabWell DOCX, не додаються до каталогу автоматично.

## 2. Основний принцип

```text
Єдиний каталог
├── Продукція
│   ├── Обладнання
│   ├── Реагенти й тести
│   ├── Контроль якості
│   ├── Витратні матеріали й аксесуари
│   └── Програмне забезпечення
└── Бренди
    ├── SNIBE
    └── Bio-Rad
```

Продукт має один canonical URL:

```text
/products/{product-slug}
```

Наприклад, обидва шляхи ведуть до `/products/maglumi-x8`:

```text
Продукція → Обладнання → Імуноаналіз → MAGLUMI X8
Бренди → SNIBE → Імуноаналіз → Аналізатори CLIA → MAGLUMI X8
```

## 3. Типи вузлів

| Тип | Призначення | Приклад |
|---|---|---|
| `Brand` | Виробник | SNIBE |
| `ProductType` | Верхній тип продукції | Обладнання |
| `DiagnosticArea` | Метод або напрям діагностики | Імуноаналіз |
| `BrandPortfolioGroup` | Властива бренду група портфеля | SNIBE → Lab Automation |
| `ProductFamily` | Сімейство без підтверджених окремих SKU або група моделей | MAGLUMI M Series |
| `Product` | Конкретна модель або іменований програмний продукт | MAGLUMI X8 |
| `TestMenu` | Структуроване меню тестів без вигаданих SKU | CLIA Test Menu |
| `Relation` | Семантичний зв'язок між вузлами | BioPlex 2200 → in diagnostic area → Infectious Disease |

### Статуси перевірки

| Статус | Значення |
|---|---|
| `source-confirmed` | Назва або зв'язок прямо присутні в LabWell DOCX |
| `market-dependent` | DOCX прямо вказує залежність від ринку |
| `source-ambiguous` | Назва є в DOCX, але тип сутності або точний зв'язок потребує уточнення |
| `external-discrepancy` | Звіт виробника суперечить або не збігається з DOCX |

## 4. Проєкція «Продукція»

### 4.1. Обладнання

#### Імуноаналіз

| ID | Назва | Бренд | Сімейство | Статус |
|---|---|---|---|---|
| `prd-snibe-maglumi-x3` | MAGLUMI X3 | SNIBE | Аналізатори CLIA | `source-confirmed` |
| `prd-snibe-maglumi-x6` | MAGLUMI X6 | SNIBE | Аналізатори CLIA | `source-confirmed` |
| `prd-snibe-maglumi-x8` | MAGLUMI X8 | SNIBE | Аналізатори CLIA | `source-confirmed` |
| `prd-snibe-maglumi-m2000` | MAGLUMI M2000 | SNIBE | MAGLUMI M Series | `market-dependent` |
| `prd-snibe-maglumi-m4000` | MAGLUMI M4000 | SNIBE | MAGLUMI M Series | `market-dependent` |
| `prd-snibe-maglumi-m8000` | MAGLUMI M8000 | SNIBE | MAGLUMI M Series | `market-dependent` |
| `prd-biorad-bioplex-2200` | BioPlex 2200 System | Bio-Rad | Мультиплексні системи | `source-confirmed` |
| `prd-biorad-phd-lx` | PhD lx System | Bio-Rad | EIA / IFA-платформи | `source-confirmed` |
| `prd-biorad-evolis-system` | EVOLIS System | Bio-Rad | EIA / IFA-платформи | `source-confirmed` |
| `prd-biorad-pr-4100` | PR 4100 | Bio-Rad | Мікропланшетні пристрої | `source-confirmed` |
| `prd-biorad-pw-41` | PW 41 | Bio-Rad | Мікропланшетні пристрої | `source-confirmed` |

Сімейства:

- `fam-snibe-clia-analyzers` — Аналізатори CLIA.
- `fam-snibe-maglumi-m-series` — MAGLUMI M Series.
- `fam-biorad-multiplex-systems` — Мультиплексні системи.
- `fam-biorad-eia-ifa-platforms` — EIA / IFA-платформи.
- `fam-biorad-microplate-devices` — Мікропланшетні пристрої.

#### Біохімія та електроліти

| ID | Назва | Бренд | Сімейство | Статус |
|---|---|---|---|---|
| `prd-snibe-biossays-c8` | Biossays C8 | SNIBE | Аналізатори біохімії та електролітів | `external-discrepancy` |
| `prd-snibe-biossays-240-plus` | Biossays 240 Plus | SNIBE | Аналізатори біохімії та електролітів | `source-confirmed` |
| `prd-snibe-biossays-e6-plus` | Biossays E6 Plus | SNIBE | Аналізатори біохімії та електролітів | `source-confirmed` |

Сімейство: `fam-snibe-biochemistry-electrolyte-analyzers`.

#### Інтегровані системи

| ID | Назва | Бренд | Сімейство | Статус |
|---|---|---|---|---|
| `prd-snibe-biolumi-cx8` | Biolumi CX8 | SNIBE | Інтегровані системи | `external-discrepancy` |

У DOCX Biolumi CX8 описано як поєднання CLIA і біохімії в одному рішенні. Це підтверджує зв'язок із двома діагностичними напрямами, але не підтверджує сумісність із конкретними аналізаторами або реагентами.

Сімейство: `fam-snibe-integrated-systems`.

#### Автоматизація лабораторії

| ID | Назва | Бренд | Сімейство | Статус |
|---|---|---|---|---|
| `prd-snibe-satlars-t8` | SATLARS-T8 | SNIBE | Автоматизація лабораторії | `source-confirmed` |
| `prd-snibe-satlars-tca` | SATLARS-TCA | SNIBE | Автоматизація лабораторії | `source-confirmed` |

Сімейство: `fam-snibe-lab-automation`.

#### Молекулярна діагностика

| ID | Назва | Бренд | Сімейство | Статус |
|---|---|---|---|---|
| `prd-snibe-molecision-r8` | Molecision R8 | SNIBE | Молекулярні аналізатори | `source-confirmed` |
| `prd-snibe-molecision-s6` | Molecision S6 | SNIBE | Молекулярні аналізатори | `source-confirmed` |
| `prd-snibe-molecision-mp-32` | Molecision MP-32 | SNIBE | Молекулярні аналізатори | `source-confirmed` |
| `prd-snibe-molecision-mp-96` | Molecision MP-96 | SNIBE | Молекулярні аналізатори | `source-confirmed` |

Сімейство: `fam-snibe-molecular-analyzers`.

#### Імуногематологія

| ID | Назва | Бренд | Сімейство | Статус |
|---|---|---|---|---|
| `fam-biorad-ih-card-systems` | IH-Card Systems | Bio-Rad | Автоматизовані системи | `source-confirmed` |
| `prd-biorad-ih-reader-24` | IH-Reader 24 | Bio-Rad | Напівавтоматизовані системи | `source-confirmed` |
| `prd-biorad-ih-centrifuge-l` | IH-Centrifuge L | Bio-Rad | Ручні системи | `source-confirmed` |
| `prd-biorad-ih-incubator-l` | IH-Incubator L | Bio-Rad | Ручні системи | `source-confirmed` |

`IH-Card Systems` зберігається як сімейство, доки не буде підтверджено перелік конкретних моделей або SKU.

#### HPLC, діабет і гемоглобінопатії

| ID | Назва | Бренд | Сімейство | Напрями | Статус |
|---|---|---|---|---|---|
| `prd-biorad-d-100` | D-100 Hemoglobin Testing System | Bio-Rad | HPLC-системи | Діабет; токсикологія | `source-confirmed` |
| `prd-biorad-variant-ii-turbo` | VARIANT II Turbo Hemoglobin Testing System | Bio-Rad | HPLC-системи | Діабет | `source-confirmed` |
| `prd-biorad-d-10` | D-10 Hemoglobin Testing System | Bio-Rad | HPLC-системи | Діабет; токсикологія | `source-confirmed` |
| `prd-biorad-variant-ii` | VARIANT II Hemoglobin Testing System | Bio-Rad | HPLC-системи | Гемоглобінопатії; токсикологія | `source-confirmed` |

Повторення D-100, D-10 і VARIANT II у розділі «Токсикологія» створює додаткові зв'язки `in-diagnostic-area`, а не нові продуктові вузли.

Сімейства: `fam-biorad-hplc-hba1c-systems` і `fam-biorad-hplc-hemoglobin-variants`. Поява тих самих моделей у токсикології задається додатковою сімейною та напрямною класифікацією, а не дублюванням продукту.

#### Неонатальний скринінг

- `fam-biorad-hemoglobinopathy-screening-systems` — системи для виявлення гемоглобінопатій. Це сімейство без підтверджених у DOCX конкретних моделей.

#### Автоматизація мікропланшетів, Western Blot та інкубатори

| ID | Назва | Бренд | Сімейство | Статус |
|---|---|---|---|---|
| `prd-biorad-evolis-processor` | EVOLIS Processor | Bio-Rad | Автоматизація мікропланшетів | `source-confirmed` |
| `prd-biorad-phd-system` | PhD System | Bio-Rad | Автоматизація мікропланшетів | `source-confirmed` |
| `prd-biorad-autoblot-3000` | AutoBlot 3000 | Bio-Rad | Western Blot автоматизація | `source-confirmed` |
| `prd-biorad-kvm-incubator` | KVM Incubator | Bio-Rad | Інкубатори | `source-confirmed` |

`PhD System` і `PhD lx System` не об'єднуються без додаткового підтвердження.

#### POCT

DOCX містить POCT Test Menu, але не називає конкретного аналізатора. У першій версії графа створюється тестове меню, а вузол обладнання не вигадується.

### 4.2. Реагенти й тести

#### Глобальні сімейства без підтвердженого бренду

| ID | Назва | Напрям | Статус |
|---|---|---|---|
| `fam-generic-biochemistry-panels` | Панелі для біохімії | Біохімія | `source-confirmed` |
| `fam-generic-immunology-tests` | Імунологічні тести | Імуноаналіз | `source-confirmed` |
| `fam-generic-pcr-kits` | PCR-набори | Молекулярна діагностика | `source-confirmed` |

Підтеми імунологічних тестів: гормони, онкомаркери, інфекційна серологія. До отримання SKU це атрибути сімейства, а не окремі продукти.

#### SNIBE Test Menu

| ID | Назва | Групи тестів | Портфельна група |
|---|---|---|---|
| `tm-snibe-clia` | CLIA Test Menu | Гормони; інфекційні маркери; онкомаркери; автоімунні; кардіомаркери | SNIBE → Імуноаналіз |
| `tm-snibe-biochemistry` | Biochemistry Test Menu | Біохімічні тести; електроліти Na, K, Cl, Ca, Mg | SNIBE → Біохімія та електроліти |
| `tm-snibe-molecular` | Molecular Test Menu | Інфекційні хвороби; генетика; онкологія | SNIBE → Молекулярна діагностика |
| `tm-snibe-poct` | POCT Test Menu | Біомаркери; інфекційні захворювання; кардіологія | SNIBE → POCT |

Остання колонка показує спільну портфельну групу, а не сумісність. DOCX не підтверджує зв'язок конкретного аналізатора з конкретним тестом або Test Menu.

#### Bio-Rad реагенти й тестові сімейства

| ID | Назва | Напрям | Статус |
|---|---|---|---|
| `fam-biorad-culture-media` | Культуральні середовища | Мікробіологія | `source-confirmed` |
| `fam-biorad-mycology-products` | Мікологічні продукти | Мікробіологія | `source-confirmed` |

DOCX не містить повного SKU-переліку EIA/IFA, імуногематологічних або HPLC-реагентів, тому такі позиції не створюються.

### 4.3. Контроль якості

| ID | Назва | Бренд | Тип вузла | Напрям | Статус |
|---|---|---|---|---|---|
| `fam-generic-controls-calibrators` | Контролі та калібратори | Не визначено | `ProductFamily` | Контроль якості | `source-confirmed` |
| `fam-biorad-inteliq` | InteliQ | Bio-Rad | `ProductFamily` | Імунологія; біохімія | `source-confirmed` |
| `fam-biorad-liquichek` | Liquichek | Bio-Rad | `ProductFamily` | Імунологія; біохімія | `source-confirmed` |
| `fam-biorad-lyphochek` | Lyphochek | Bio-Rad | `ProductFamily` | Імунологія; біохімія | `source-confirmed` |
| `fam-biorad-molecular-controls` | Молекулярні контроли | Bio-Rad | `ProductFamily` | Молекулярна діагностика | `source-confirmed` |

У першій версії InteliQ, Liquichek і Lyphochek є сімействами, а не окремими SKU.

### 4.4. Витратні матеріали й аксесуари

| ID | Назва | Бренд | Статус сумісності |
|---|---|---|---|
| `fam-generic-analyzer-consumables` | Витратні матеріали для аналізаторів | Не визначено | Потребує мапінгу |
| `fam-generic-tubes` | Пробірки | Не визначено | Потребує мапінгу |
| `fam-generic-cartridges` | Картриджі | Не визначено | Потребує мапінгу |
| `fam-generic-cuvettes` | Кювети | Не визначено | Потребує мапінгу |

Ці сімейства не зв'язуються з конкретним обладнанням, доки LabWell не надасть таблицю сумісності.

### 4.5. Програмне забезпечення

| ID | Назва | Бренд | Статус |
|---|---|---|---|
| `prd-biorad-unityweb` | UnityWeb | Bio-Rad | `source-confirmed` |
| `prd-biorad-unity-real-time` | Unity Real Time | Bio-Rad | `source-confirmed` |
| `prd-biorad-unity-next-peer-qc` | Unity Next Peer QC | Bio-Rad | `source-confirmed` |

DOCX розміщує ці продукти в «Програмне забезпечення та аналітика», але не визначає сумісність із конкретними контролями або аналізаторами. Такі зв'язки не додаються без підтвердження.

### 4.6. Реєстр продуктових сімейств

Реєстр включає як leaf-сімейства, так і структурні батьківські групи. `Parent` задає вкладеність між сімействами; порожнє значення означає кореневу сімейну групу.

| ID | Назва | Бренд | Parent |
|---|---|---|---|
| `fam-snibe-clia-analyzers` | Аналізатори CLIA | SNIBE | — |
| `fam-snibe-maglumi-m-series` | MAGLUMI M Series | SNIBE | `fam-snibe-clia-analyzers` |
| `fam-snibe-biochemistry-electrolyte-analyzers` | Аналізатори біохімії та електролітів | SNIBE | — |
| `fam-snibe-integrated-systems` | Інтегровані системи | SNIBE | — |
| `fam-snibe-lab-automation` | Автоматизація лабораторії | SNIBE | — |
| `fam-snibe-molecular-analyzers` | Молекулярні аналізатори | SNIBE | — |
| `fam-biorad-multiplex-systems` | Мультиплексні системи | Bio-Rad | — |
| `fam-biorad-eia-ifa-platforms` | EIA / IFA-платформи | Bio-Rad | — |
| `fam-biorad-microplate-devices` | Мікропланшетні пристрої | Bio-Rad | — |
| `fam-biorad-fully-automated-blood-typing` | Автоматизовані системи типування крові | Bio-Rad | — |
| `fam-biorad-ih-card-systems` | IH-Card Systems | Bio-Rad | `fam-biorad-fully-automated-blood-typing` |
| `fam-biorad-semi-automated-blood-typing` | Напівавтоматизовані системи типування крові | Bio-Rad | — |
| `fam-biorad-manual-blood-typing` | Ручні системи типування крові | Bio-Rad | — |
| `fam-biorad-hplc-hba1c-systems` | HPLC-системи для HbA1c | Bio-Rad | — |
| `fam-biorad-hplc-hemoglobin-variants` | HPLC-системи для варіантів гемоглобіну | Bio-Rad | — |
| `fam-biorad-culture-media` | Культуральні середовища | Bio-Rad | — |
| `fam-biorad-mycology-products` | Мікологічні продукти | Bio-Rad | — |
| `fam-biorad-hemoglobinopathy-screening-systems` | Системи скринінгу гемоглобінопатій | Bio-Rad | — |
| `fam-biorad-immunology-chemistry-controls` | Імунологічні та біохімічні контроли | Bio-Rad | `fam-generic-controls-calibrators` |
| `fam-biorad-inteliq` | InteliQ | Bio-Rad | `fam-biorad-immunology-chemistry-controls` |
| `fam-biorad-liquichek` | Liquichek | Bio-Rad | `fam-biorad-immunology-chemistry-controls` |
| `fam-biorad-lyphochek` | Lyphochek | Bio-Rad | `fam-biorad-immunology-chemistry-controls` |
| `fam-biorad-molecular-controls` | Молекулярні контроли | Bio-Rad | `fam-generic-controls-calibrators` |
| `fam-biorad-toxicology-instrumentation` | Обладнання для токсикології | Bio-Rad | — |
| `fam-biorad-toxicology-hplc-systems` | HPLC-системи для токсикології | Bio-Rad | `fam-biorad-toxicology-instrumentation` |
| `fam-biorad-microplate-automation` | Автоматизація мікропланшетів | Bio-Rad | `fam-biorad-toxicology-instrumentation` |
| `fam-biorad-western-blot-automation` | Western Blot автоматизація | Bio-Rad | `fam-biorad-toxicology-instrumentation` |
| `fam-biorad-incubators` | Інкубатори | Bio-Rad | `fam-biorad-toxicology-instrumentation` |
| `fam-generic-biochemistry-panels` | Панелі для біохімії | Не визначено | — |
| `fam-generic-immunology-tests` | Імунологічні тести | Не визначено | — |
| `fam-generic-pcr-kits` | PCR-набори | Не визначено | — |
| `fam-generic-controls-calibrators` | Контролі та калібратори | Не визначено | — |
| `fam-generic-analyzer-consumables` | Витратні матеріали для аналізаторів | Не визначено | — |
| `fam-generic-tubes` | Пробірки | Не визначено | — |
| `fam-generic-cartridges` | Картриджі | Не визначено | — |
| `fam-generic-cuvettes` | Кювети | Не визначено | — |

## 5. Проєкція «Бренди»

### 5.1. SNIBE

```text
SNIBE
├── Імуноаналіз
│   ├── Аналізатори CLIA
│   │   ├── MAGLUMI X3
│   │   ├── MAGLUMI X6
│   │   └── MAGLUMI X8
│   ├── MAGLUMI M Series
│   │   ├── MAGLUMI M2000 [market-dependent]
│   │   ├── MAGLUMI M4000 [market-dependent]
│   │   └── MAGLUMI M8000 [market-dependent]
│   └── CLIA Test Menu
├── Біохімія та електроліти
│   ├── Biossays C8 [external-discrepancy]
│   ├── Biossays 240 Plus
│   ├── Biossays E6 Plus
│   └── Biochemistry Test Menu
├── Інтегровані системи
│   └── Biolumi CX8 [external-discrepancy]
├── Автоматизація лабораторії
│   ├── SATLARS-T8
│   └── SATLARS-TCA
├── Молекулярна діагностика
│   ├── Molecision R8
│   ├── Molecision S6
│   ├── Molecision MP-32
│   ├── Molecision MP-96
│   └── Molecular Test Menu
└── POCT
    └── POCT Test Menu
```

### 5.2. Bio-Rad

```text
Bio-Rad
├── Автоімунне тестування
│   ├── Мультиплексні системи
│   │   └── BioPlex 2200 System
│   ├── EIA / IFA-платформи
│   │   ├── PhD lx System
│   │   └── EVOLIS System
│   └── Мікропланшетні пристрої
│       ├── PR 4100
│       └── PW 41
├── Типування та скринінг крові
│   ├── IH-Card Systems [family]
│   ├── IH-Reader 24
│   ├── IH-Centrifuge L
│   └── IH-Incubator L
├── Діабет і гемоглобінопатії
│   ├── D-100 Hemoglobin Testing System
│   ├── VARIANT II Turbo Hemoglobin Testing System
│   ├── D-10 Hemoglobin Testing System
│   └── VARIANT II Hemoglobin Testing System
├── Інфекційні захворювання
│   └── BioPlex 2200 System [той самий продуктовий вузол]
├── Мікробіологія
│   ├── Культуральні середовища [family]
│   └── Мікологічні продукти [family]
├── Неонатальний скринінг
│   └── Системи для виявлення гемоглобінопатій [family]
├── Контроль якості
│   ├── InteliQ [family]
│   ├── Liquichek [family]
│   ├── Lyphochek [family]
│   └── Молекулярні контроли [family]
├── Програмне забезпечення та аналітика
│   ├── UnityWeb
│   ├── Unity Real Time
│   └── Unity Next Peer QC
└── Токсикологія та обладнання
    ├── HPLC-системи
    │   ├── D-100 [той самий продуктовий вузол]
    │   ├── VARIANT II [той самий продуктовий вузол]
    │   └── D-10 [той самий продуктовий вузол]
    ├── Автоматизація мікропланшетів
    │   ├── EVOLIS Processor
    │   └── PhD System
    ├── Western Blot автоматизація
    │   └── AutoBlot 3000
    └── Інкубатори
        └── KVM Incubator
```

## 6. Правила крос-навігації

| Контекст | Основні елементи крос-навігації |
|---|---|
| Сторінка типу продукції | Діагностичні напрями, бренди, сімейства |
| Сторінка діагностичного напряму | Типи продукції, бренди, пов'язані test menu |
| Сторінка бренду | Портфельні групи, типи продукції, усі доступні продукти бренду |
| Сторінка продукту | Бренд, тип, основний і додаткові напрями, сімейство, підтверджені test menu/сумісності, документи та сервісні переходи |
| Сторінка test menu | Напрям, бренд, пов'язані сімейства обладнання, групи тестів |
| Сторінка сімейства | Дочірні продукти, бренд, напрями та підтверджені пов'язані сімейства |

### Breadcrumbs

Canonical breadcrumb завжди будується через «Продукцію»:

```text
Головна → Продукція → Обладнання → Імуноаналіз → MAGLUMI X8
```

Перехід із брендової сторінки не створює іншого canonical breadcrumb. На продукті може бути окреме контекстне посилання «Повернутися до SNIBE».

### Mega menu

- «Продукція» показує п'ять типів і максимум один рівень діагностичних напрямів.
- «Бренди» показує SNIBE і Bio-Rad та їхні портфельні групи.
- Сімейства і конкретні продукти відкриваються на listing/landing pages, а не розгортаються безмежно в меню.

### Фільтри

Мінімальний набір фільтрів:

- бренд;
- тип продукції;
- діагностичний напрям;
- продуктове сімейство;
- статус доступності після появи підтверджених даних.

Ціна не використовується як фільтр, доки LabWell не публікує ціни.

## 7. Наскрізні приклади

### 7.1. Аналізатор MAGLUMI X8

```text
Product: MAGLUMI X8
├── Brand: SNIBE
├── ProductType: Обладнання
├── DiagnosticArea: Імуноаналіз
├── ProductFamily: Аналізатори CLIA
├── BrandPortfolioGroup: SNIBE → Імуноаналіз
├── Shared portfolio group: SNIBE → Імуноаналіз
├── TestMenu compatibility: не підтверджена
└── Canonical URL: /products/maglumi-x8
```

### 7.2. CLIA Test Menu

```text
TestMenu: CLIA Test Menu
├── Brand: SNIBE
├── ProductType: Реагенти й тести
├── DiagnosticArea: Імуноаналіз
├── Groups: гормони, інфекційні маркери, онкомаркери,
│           автоімунні тести, кардіомаркери
└── Shared portfolio group: SNIBE → Імуноаналіз
```

Test Menu і аналізатори доступні в одній портфельній групі. Прямий compatibility-зв'язок між ними не створюється без окремого джерела.

### 7.3. Liquichek

```text
ProductFamily: Liquichek
├── Brand: Bio-Rad
├── ProductType: Контроль якості
├── DiagnosticAreas: Імунологія, біохімія
├── BrandPortfolioGroup: Bio-Rad → Контроль якості
└── SKU: не визначені у вихідному DOCX
```

### 7.4. Unity Real Time

```text
Product: Unity Real Time
├── Brand: Bio-Rad
├── ProductType: Програмне забезпечення
├── BrandPortfolioGroup: Bio-Rad → ПЗ та аналітика
├── Compatibility: не підтверджена вихідним DOCX
└── Canonical URL: /products/unity-real-time
```

## 8. Підтверджені семантичні зв'язки

| From | Relation | To | Статус |
|---|---|---|---|
| Аналізатори CLIA | `in-portfolio-group` | SNIBE → Імуноаналіз | `source-confirmed` |
| CLIA Test Menu | `in-portfolio-group` | SNIBE → Імуноаналіз | `source-confirmed` |
| Аналізатори біохімії та електролітів | `in-portfolio-group` | SNIBE → Біохімія та електроліти | `source-confirmed` |
| Biochemistry Test Menu | `in-portfolio-group` | SNIBE → Біохімія та електроліти | `source-confirmed` |
| Молекулярні аналізатори | `in-portfolio-group` | SNIBE → Молекулярна діагностика | `source-confirmed` |
| Molecular Test Menu | `in-portfolio-group` | SNIBE → Молекулярна діагностика | `source-confirmed` |
| Biolumi CX8 | `in-diagnostic-area` | Імуноаналіз | `source-confirmed` |
| Biolumi CX8 | `in-diagnostic-area` | Біохімія | `source-confirmed` |
| BioPlex 2200 System | `in-diagnostic-area` | Автоімунне тестування | `source-confirmed` |
| BioPlex 2200 System | `in-diagnostic-area` | Інфекційні захворювання | `source-confirmed` |
| D-100 | `in-diagnostic-area` | Діабет | `source-confirmed` |
| D-100 | `in-diagnostic-area` | Токсикологія | `source-confirmed` |
| D-10 | `in-diagnostic-area` | Діабет | `source-confirmed` |
| D-10 | `in-diagnostic-area` | Токсикологія | `source-confirmed` |
| VARIANT II | `in-diagnostic-area` | Гемоглобінопатії | `source-confirmed` |
| VARIANT II | `in-diagnostic-area` | Токсикологія | `source-confirmed` |

Усі інші потенційні compatibility-зв'язки залишаються непідтвердженими.

## 9. Розбіжності, які треба перевірити

| Тема | LabWell DOCX | `report-1.md` | Дія |
|---|---|---|---|
| SNIBE CLIA | X3, X6, X8, M Series | X10, X3, X6, X8 | Не додавати X10; перевірити M Series і регіональну доступність |
| SNIBE біохімія | Biossays C8 | Biossays C10 | Зберегти C8 зі статусом `external-discrepancy`; перевірити модель |
| Інтегрована система | Biolumi CX8 | Biolumi CX Solution — X10 + C10 | Зберегти CX8 зі статусом `external-discrepancy`; перевірити актуальну назву |
| Автоматизація | SATLARS-T8, SATLARS-TCA | Додатково SATLARS mini-T8 | Не додавати mini-T8 до підтвердження асортименту LabWell |
| Гемостаз | Відсутній | Hemolumi H6 | Не додавати напрям і продукт до підтвердження |
| POCT | Лише узагальнений Test Menu | У звіті наведені конкретні швидкі тести | Не створювати окремі SKU до підтвердження локального портфеля |
| PhD | PhD lx System і окремо PhD System | Звіт не підтверджує, що це одна сутність | Не об'єднувати автоматично |
| Unity | `UnityWeb` | У частині матеріалів трапляється `Unity Web` | Використовувати canonical name `UnityWeb`, альтернативу зберегти як alias |

## 10. Інвентар і критерії повноти

Поточний граф містить:

- 2 бренди;
- 5 типів продукції;
- 32 конкретні апаратні моделі: 16 SNIBE і 16 Bio-Rad;
- 3 програмні продукти Bio-Rad, змодельовані як `Product` із типом «Програмне забезпечення»;
- 4 SNIBE test menu;
- 36 продуктових сімейств: 6 SNIBE, 22 Bio-Rad і 8 глобальних;
- 3 моделі MAGLUMI M Series враховані серед апаратних моделей зі статусом `market-dependent`.

Перед імплементацією дані мають пройти машинну перевірку:

1. `id` і `slug` унікальні в межах типу сутності.
2. Кожен `Product` має рівно один `Brand`, один `ProductType` і один canonical URL.
3. Кожен брендований продукт доступний у проєкціях «Продукція» і «Бренди».
4. Глобальні сімейства без бренду доступні лише через «Продукцію», доки бренд не підтверджено.
5. Повторна поява продукту в іншому напрямі створює edge, а не копію вузла.
6. `market-dependent`, `source-ambiguous` і `external-discrepancy` не публікуються без редакційного підтвердження.
7. Непідтверджена сумісність не показується як факт.
