/**
 * Immutable local navigation/content snapshot sourced from the aligned Labwell
 * Navigation Uk and Navigation Eng sheets. No runtime Google access is used.
 */

export type LocalizedText = Readonly<{ en: string; uk: string }>;
export type ContentKind = 'product' | 'clinical' | 'brand';
export type ContentPageRecord = Readonly<{
  sourceRow: number;
  id: string;
  slug: string;
  kind: ContentKind;
  brand: string;
  navLabel: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  todoNote?: LocalizedText;
  sourceUrl: string;
  canonicalPath: string;
}>;
export type NavigationPlacement = Readonly<{
  sourceRow: number;
  id: string;
  kind: ContentKind;
  category: LocalizedText;
  subcategory: LocalizedText;
  group?: LocalizedText;
  navLabel: LocalizedText;
  path: string;
  /** Placement-specific editorial note; repeated clinical placements retain their source note here. */
  todoNote?: LocalizedText;
}>;

export const contentPages = [
  {
    sourceRow: 2,
    id: "product-maglumi-x10",
    slug: "maglumi-x10",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "MAGLUMI X10",
      uk: "MAGLUMI X10"
    },
    title: {
      en: "MAGLUMI X10 CLIA Analyzer | Snibe | Labwell",
      uk: "MAGLUMI X10 CLIA-аналізатор | Snibe | Labwell"
    },
    description: {
      en: "High-throughput chemiluminescence immunoassay system for medium and large clinical laboratories; up to 1,000 tests per hour per module.",
      uk: "Високопродуктивна система хемілюмінесцентного імуноаналізу для середніх і великих клінічних лабораторій; до 1 000 тестів на годину на модуль."
    },
    sourceUrl: "https://www.snibe.com/en/product/CLIA_analyzer/342.html",
    canonicalPath: "/products/maglumi-x10"
  },
  {
    sourceRow: 3,
    id: "product-maglumi-x8",
    slug: "maglumi-x8",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "MAGLUMI X8",
      uk: "MAGLUMI X8"
    },
    title: {
      en: "MAGLUMI X8 CLIA Analyzer | Snibe | Labwell",
      uk: "MAGLUMI X8 CLIA-аналізатор | Snibe | Labwell"
    },
    description: {
      en: "Automated CLIA analyzer for medium and large laboratories, with up to 600 tests per hour per module and scalable configurations.",
      uk: "Автоматизований аналізатор CLIA для середніх і великих лабораторій: до 600 тестів на годину на модуль і масштабовані конфігурації."
    },
    sourceUrl: "https://www.snibe.com/en/product/CLIA_analyzer/40.html",
    canonicalPath: "/products/maglumi-x8"
  },
  {
    sourceRow: 4,
    id: "product-maglumi-x6",
    slug: "maglumi-x6",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "MAGLUMI X6",
      uk: "MAGLUMI X6"
    },
    title: {
      en: "MAGLUMI X6 CLIA Analyzer | Snibe | Labwell",
      uk: "MAGLUMI X6 CLIA-аналізатор | Snibe | Labwell"
    },
    description: {
      en: "Scalable chemiluminescence immunoassay system for laboratories with high test demand; throughput of up to 450 tests per hour.",
      uk: "Масштабована система хемілюмінесцентного імуноаналізу для лабораторій із великим навантаженням; продуктивність до 450 тестів на годину."
    },
    sourceUrl: "https://www.snibe.com/en/product/CLIA_analyzer/42.html",
    canonicalPath: "/products/maglumi-x6"
  },
  {
    sourceRow: 5,
    id: "product-maglumi-x3",
    slug: "maglumi-x3",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "MAGLUMI X3",
      uk: "MAGLUMI X3"
    },
    title: {
      en: "MAGLUMI X3 CLIA Analyzer | Snibe | Labwell",
      uk: "MAGLUMI X3 CLIA-аналізатор | Snibe | Labwell"
    },
    description: {
      en: "Compact fully automated CLIA analyzer for small and medium laboratories, with throughput of up to 200 tests per hour.",
      uk: "Компактний повністю автоматизований аналізатор CLIA для малих і середніх лабораторій, продуктивність до 200 тестів на годину."
    },
    sourceUrl: "https://www.snibe.com/en/product/CLIA_analyzer/43.html",
    canonicalPath: "/products/maglumi-x3"
  },
  {
    sourceRow: 6,
    id: "product-biossays-c10",
    slug: "biossays-c10",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "Biossays C10",
      uk: "Biossays C10"
    },
    title: {
      en: "Biossays C10 Biochemistry Analyzer | Snibe | Labwell",
      uk: "Biossays C10 Біохімічний аналізатор | Snibe | Labwell"
    },
    description: {
      en: "Automated clinical chemistry analyzer with biochemistry and ISE testing, flexible scalability and high sample throughput.",
      uk: "Автоматизований біохімічний аналізатор із тестуванням ISE, гнучким масштабуванням і високою пропускною здатністю зразків."
    },
    sourceUrl: "https://www.snibe.com/en/product/biochemistry_analyzer/652.html",
    canonicalPath: "/products/biossays-c10"
  },
  {
    sourceRow: 7,
    id: "product-biossays-240-plus",
    slug: "biossays-240-plus",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "Biossays 240 Plus",
      uk: "Biossays 240 Plus"
    },
    title: {
      en: "Biossays 240 Plus Biochemistry Analyzer | Snibe | Labwell",
      uk: "Biossays 240 Plus Біохімічний аналізатор | Snibe | Labwell"
    },
    description: {
      en: "Automated biochemistry analyzer for routine clinical chemistry testing in laboratory workflows.",
      uk: "Автоматизований біохімічний аналізатор для рутинних досліджень у лабораторних процесах."
    },
    sourceUrl: "https://www.snibe.com/en/product/biochemistry_analyzer/433.html",
    canonicalPath: "/products/biossays-240-plus"
  },
  {
    sourceRow: 8,
    id: "product-biossays-e6-plus",
    slug: "biossays-e6-plus",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "Biossays E6 Plus",
      uk: "Biossays E6 Plus"
    },
    title: {
      en: "Biossays E6 Plus Biochemistry Analyzer | Snibe | Labwell",
      uk: "Biossays E6 Plus Біохімічний аналізатор | Snibe | Labwell"
    },
    description: {
      en: "Automated biochemistry and electrolyte analyzer for clinical laboratory testing.",
      uk: "Автоматизований біохімічний аналізатор та аналізатор електролітів для клінічних лабораторій."
    },
    sourceUrl: "https://www.snibe.com/en/product/biochemistry_analyzer/86.html",
    canonicalPath: "/products/biossays-e6-plus"
  },
  {
    sourceRow: 9,
    id: "product-d-100",
    slug: "d-100",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "D-100",
      uk: "D-100"
    },
    title: {
      en: "D-100 Hemoglobin Testing System | Bio-Rad | Labwell",
      uk: "D-100 Система визначення гемоглобіну | Bio-Rad | Labwell"
    },
    description: {
      en: "Automated HPLC system for HbA1c testing, designed to streamline diabetes laboratory workflows.",
      uk: "Автоматизована система ВЕРХ для визначення HbA1c, розроблена для оптимізації лабораторної діагностики діабету."
    },
    todoNote: {
      en: "Source is a product family page; confirm the UK configuration and availability.",
      uk: "Джерелом є сторінка сімейства продуктів; підтвердьте конфігурацію та доступність у Великій Британії."
    },
    sourceUrl: "https://www.bio-rad.com/en-us/category/d-100-hemoglobin-testing-solution?ID=NVVIN015",
    canonicalPath: "/products/d-100"
  },
  {
    sourceRow: 10,
    id: "product-d-10",
    slug: "d-10",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "D-10",
      uk: "D-10"
    },
    title: {
      en: "D-10 Hemoglobin Testing System | Bio-Rad | Labwell",
      uk: "D-10 Система визначення гемоглобіну | Bio-Rad | Labwell"
    },
    description: {
      en: "Compact HPLC system for HbA1c and hemoglobin testing, with straightforward laboratory workflow.",
      uk: "Компактна система ВЕРХ для визначення HbA1c і гемоглобіну зі зручним лабораторним робочим процесом."
    },
    sourceUrl: "https://www.bio-rad.com/applications-technologies/ion-exchange-hplc-systems-d-10?ID=PZ8US5MKSK1O",
    canonicalPath: "/products/d-10"
  },
  {
    sourceRow: 11,
    id: "product-variant-ii",
    slug: "variant-ii",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "VARIANT II",
      uk: "VARIANT II"
    },
    title: {
      en: "VARIANT II Hemoglobin Testing System | Bio-Rad | Labwell",
      uk: "VARIANT II Система визначення гемоглобіну | Bio-Rad | Labwell"
    },
    description: {
      en: "HPLC hemoglobin testing system for HbA2 and HbF analysis and investigation of abnormal hemoglobins.",
      uk: "Система ВЕРХ для аналізу гемоглобіну HbA2 і HbF та дослідження аномальних гемоглобінів."
    },
    todoNote: {
      en: "Check whether this legacy model is available for new sales in the UK.",
      uk: "Перевірте, чи доступна ця застаріла модель для нових продажів у Великій Британії."
    },
    sourceUrl: "https://www.bio-rad.com/en-us/category/variant-ii-hemoglobin-testing-solution?ID=b91663a4-2f82-44ee-98a6-9b50dbb7e359",
    canonicalPath: "/products/variant-ii"
  },
  {
    sourceRow: 12,
    id: "product-variant-ii-turbo",
    slug: "variant-ii-turbo",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "VARIANT II TURBO",
      uk: "VARIANT II TURBO"
    },
    title: {
      en: "VARIANT II TURBO Hemoglobin Testing System | Bio-Rad | Labwell",
      uk: "VARIANT II TURBO Система визначення гемоглобіну | Bio-Rad | Labwell"
    },
    description: {
      en: "Automated HPLC system for high-volume HbA1c testing with integrated data management.",
      uk: "Автоматизована система ВЕРХ для великого обсягу досліджень HbA1c з інтегрованим керуванням даними."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/product/variant-ii-turbo-hemoglobin-testing-system?ID=41158308-b08b-4921-af0d-465d46b3f1b5",
    canonicalPath: "/products/variant-ii-turbo"
  },
  {
    sourceRow: 13,
    id: "product-ih-500-next-system",
    slug: "ih-500-next-system",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "IH-500 NEXT System",
      uk: "IH-500 NEXT System"
    },
    title: {
      en: "IH-500 NEXT Blood Typing System | Bio-Rad | Labwell",
      uk: "IH-500 NEXT Система визначення групи крові | Bio-Rad | Labwell"
    },
    description: {
      en: "Fully automated immunohematology system for blood grouping and compatibility testing.",
      uk: "Повністю автоматизована імуногематологічна система для визначення групи крові та проведення проб на сумісність."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/product/ih-500-next-system?ID=NPUFID15",
    canonicalPath: "/products/ih-500-next-system"
  },
  {
    sourceRow: 14,
    id: "product-ih-1000",
    slug: "ih-1000",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "IH-1000",
      uk: "IH-1000"
    },
    title: {
      en: "IH-1000 Immunohematology System | Bio-Rad | Labwell",
      uk: "IH-1000 Імуно-гематологічна система | Bio-Rad | Labwell"
    },
    description: {
      en: "Fully automated gel-card system for blood group serology, with continuous loading of samples and reagents.",
      uk: "Повністю автоматизована система з гелевими картками для серологічних досліджень груп крові з безперервним завантаженням зразків і реагентів."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/product/ih-1000-system?ID=M0FPV8IVK",
    canonicalPath: "/products/ih-1000"
  },
  {
    sourceRow: 15,
    id: "product-ih-reader-24",
    slug: "ih-reader-24",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "IH-Reader 24",
      uk: "IH-Reader 24"
    },
    title: {
      en: "IH-Reader 24 System | Bio-Rad | Labwell",
      uk: "IH-Reader 24 — система зчитування | Bio-Rad | Labwell"
    },
    description: {
      en: "Semi-automated reader for manually prepared IH-Cards in blood typing and antibody testing workflows.",
      uk: "Напівавтоматичний зчитувач для вручну підготовлених IH-Cards у дослідженнях групи крові та антитіл."
    },
    todoNote: {
      en: "Linked Bio-Rad page uses a US locale; verify local availability.",
      uk: "Пов’язана сторінка Bio-Rad має локаль US; перевірте доступність на місцевому ринку."
    },
    sourceUrl: "https://www.bio-rad.com/en-us/product/semi-automated-systems-ih-reader-24?ID=PLX3E6E08O1Y",
    canonicalPath: "/products/ih-reader-24"
  },
  {
    sourceRow: 16,
    id: "product-bioplex-2200-system",
    slug: "bioplex-2200-system",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "BioPlex 2200 System",
      uk: "BioPlex 2200 System"
    },
    title: {
      en: "BioPlex 2200 Multiplex System | Bio-Rad | Labwell",
      uk: "BioPlex 2200 Мультиплексна система | Bio-Rad | Labwell"
    },
    description: {
      en: "Fully automated random-access multiplex platform for autoimmune and infectious disease assays.",
      uk: "Повністю автоматизована мультиплексна платформа з довільним доступом для досліджень аутоімунних та інфекційних захворювань."
    },
    todoNote: {
      en: "Linked Bio-Rad page uses a US locale; confirm UK assay availability.",
      uk: "Пов’язана сторінка Bio-Rad має локаль US; підтвердьте доступність тестів у Великій Британії."
    },
    sourceUrl: "https://www.bio-rad.com/en-us/product/bioplex-2200-system?ID=179032f7-5b80-4a4d-a5c9-9218a62c6eb3",
    canonicalPath: "/products/bioplex-2200-system"
  },
  {
    sourceRow: 17,
    id: "product-phd-lx-system",
    slug: "phd-lx-system",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "PhD lx System",
      uk: "PhD lx System"
    },
    title: {
      en: "PhD lx System | Bio-Rad | Labwell",
      uk: "PhD lx System | Bio-Rad | Labwell"
    },
    description: {
      en: "Automated processor supporting immunofluorescence and enzyme immunoassay workflows for autoimmune and infectious disease testing.",
      uk: "Автоматизований процесор для виконання досліджень методом імунофлуоресценції та імуноферментного аналізу в діагностиці аутоімунних й інфекційних захворювань."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/product/phd-lx-system?ID=M4HSAU15",
    canonicalPath: "/products/phd-lx-system"
  },
  {
    sourceRow: 18,
    id: "product-geenius-system",
    slug: "geenius-system",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "Geenius System",
      uk: "Geenius System"
    },
    title: {
      en: "Geenius Confirmatory Testing System | Bio-Rad | Labwell",
      uk: "Geenius Система підтверджувального тестування | Bio-Rad | Labwell"
    },
    description: {
      en: "Rapid confirmatory assay platform for HIV and HCV antibody testing, with automated result interpretation.",
      uk: "Платформа для швидких підтверджувальних досліджень антитіл до HIV і HCV з автоматизованою інтерпретацією результатів."
    },
    todoNote: {
      en: "Infectious disease category source; choose the exact Geenius instrument and assay pages for the Labwell page.",
      uk: "Джерелом є категорія інфекційних захворювань; для сторінки Labwell оберіть точні сторінки приладу Geenius і відповідних тестів."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/infectious-disease-testing?ID=NA00OK15",
    canonicalPath: "/products/geenius-system"
  },
  {
    sourceRow: 19,
    id: "product-satlars-tca",
    slug: "satlars-tca",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "SATLARS-TCA",
      uk: "SATLARS-TCA"
    },
    title: {
      en: "SATLARS-TCA Lab Automation | Snibe | Labwell",
      uk: "SATLARS-TCA Лабораторна автоматизація | Snibe | Labwell"
    },
    description: {
      en: "Laboratory automation solution for connecting analytical systems and streamlining sample workflows.",
      uk: "Рішення для лабораторної автоматизації, що поєднує аналітичні системи та оптимізує маршрутизацію зразків."
    },
    sourceUrl: "https://www.snibe.com/en/product/Lab_Automation/89.html",
    canonicalPath: "/products/satlars-tca"
  },
  {
    sourceRow: 20,
    id: "product-satlars-t8",
    slug: "satlars-t8",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "SATLARS-T8",
      uk: "SATLARS-T8"
    },
    title: {
      en: "SATLARS-T8 Lab Automation | Snibe | Labwell",
      uk: "SATLARS-T8 Лабораторна автоматизація | Snibe | Labwell"
    },
    description: {
      en: "Total laboratory automation system designed to connect diagnostic testing workflows.",
      uk: "Система комплексної лабораторної автоматизації, призначена для інтеграції робочих процесів діагностичних досліджень."
    },
    sourceUrl: "https://www.snibe.com/en/product/Lab_Automation/570.html",
    canonicalPath: "/products/satlars-t8"
  },
  {
    sourceRow: 21,
    id: "product-satlars-mini-t8",
    slug: "satlars-mini-t8",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "SATLARS mini-T8",
      uk: "SATLARS mini-T8"
    },
    title: {
      en: "SATLARS mini-T8 Lab Automation | Snibe | Labwell",
      uk: "SATLARS mini-T8 Лабораторна автоматизація | Snibe | Labwell"
    },
    description: {
      en: "Compact laboratory automation solution for integrated sample processing and testing workflows.",
      uk: "Компактне рішення для лабораторної автоматизації та інтегрованої обробки зразків і проведення досліджень."
    },
    sourceUrl: "https://www.snibe.com/en/product/Lab_Automation/869.html",
    canonicalPath: "/products/satlars-mini-t8"
  },
  {
    sourceRow: 22,
    id: "product-molecision-mp-96",
    slug: "molecision-mp-96",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "Molecision MP-96",
      uk: "Molecision MP-96"
    },
    title: {
      en: "Molecision MP-96 Molecular Analyzer | Snibe | Labwell",
      uk: "Molecision MP-96 Молекулярний аналізатор | Snibe | Labwell"
    },
    description: {
      en: "Molecular testing instrument in Snibe’s Molecision portfolio for automated laboratory workflows.",
      uk: "Прилад для молекулярних досліджень із лінійки Molecision компанії Snibe для автоматизованих лабораторних процесів."
    },
    sourceUrl: "https://www.snibe.com/en/product/Molecular/67.html",
    canonicalPath: "/products/molecision-mp-96"
  },
  {
    sourceRow: 23,
    id: "product-molecision-mp-32",
    slug: "molecision-mp-32",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "Molecision MP-32",
      uk: "Molecision MP-32"
    },
    title: {
      en: "Molecision MP-32 Molecular Analyzer | Snibe | Labwell",
      uk: "Molecision MP-32 Молекулярний аналізатор | Snibe | Labwell"
    },
    description: {
      en: "Molecular testing instrument in the Molecision range for clinical laboratory workflows.",
      uk: "Прилад для молекулярних досліджень із лінійки Molecision для робочих процесів клінічної лабораторії."
    },
    sourceUrl: "https://www.snibe.com/en/product/Molecular/539.html",
    canonicalPath: "/products/molecision-mp-32"
  },
  {
    sourceRow: 24,
    id: "product-molecision-s6",
    slug: "molecision-s6",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "Molecision S6",
      uk: "Molecision S6"
    },
    title: {
      en: "Molecision S6 Molecular Analyzer | Snibe | Labwell",
      uk: "Molecision S6 Молекулярний аналізатор | Snibe | Labwell"
    },
    description: {
      en: "Molecision molecular diagnostics system for laboratory testing workflows.",
      uk: "Система молекулярної діагностики Molecision для лабораторних досліджень."
    },
    sourceUrl: "https://www.snibe.com/en/product/Molecular/66.html",
    canonicalPath: "/products/molecision-s6"
  },
  {
    sourceRow: 25,
    id: "product-molecision-r8",
    slug: "molecision-r8",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "Molecision R8",
      uk: "Molecision R8"
    },
    title: {
      en: "Molecision R8 Molecular Analyzer | Snibe | Labwell",
      uk: "Molecision R8 Молекулярний аналізатор | Snibe | Labwell"
    },
    description: {
      en: "Molecision molecular diagnostics instrument for clinical testing workflows.",
      uk: "Прилад Molecision для молекулярної діагностики в клінічних дослідженнях."
    },
    sourceUrl: "https://www.snibe.com/en/product/Molecular/87.html",
    canonicalPath: "/products/molecision-r8"
  },
  {
    sourceRow: 26,
    id: "product-hemolumi-h6",
    slug: "hemolumi-h6",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "Hemolumi H6",
      uk: "Hemolumi H6"
    },
    title: {
      en: "Hemolumi H6 Coagulation Analyzer | Snibe | Labwell",
      uk: "Hemolumi H6 Коагулологічний аналізатор | Snibe | Labwell"
    },
    description: {
      en: "Automated coagulation analyzer combining clotting and optical detection for hemostasis testing.",
      uk: "Автоматизований коагулологічний аналізатор, що поєднує клотинговий та оптичний методи детекції для дослідження гемостазу."
    },
    sourceUrl: "https://www.snibe.com/en/product/coagulation_analyzer/658.html",
    canonicalPath: "/products/hemolumi-h6"
  },
  {
    sourceRow: 27,
    id: "product-ih-systems-reagents",
    slug: "ih-systems-reagents",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "IH-Systems reagents",
      uk: "IH-Systems reagents"
    },
    title: {
      en: "IH-System Reagents | Bio-Rad | Labwell",
      uk: "Реагенти IH-System | Bio-Rad | Labwell"
    },
    description: {
      en: "Explore Bio-Rad reagents and testing supplies for blood grouping and immunohematology workflows.",
      uk: "Ознайомтеся з реагентами й витратними матеріалами Bio-Rad для визначення групи крові та імуногематологічних досліджень."
    },
    todoNote: {
      en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
      uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/applications-technologies/immunohematology-systems?ID=1218d676-692f-f3fe-c735-77c794a050ee",
    canonicalPath: "/products/ih-systems-reagents"
  },
  {
    sourceRow: 28,
    id: "product-gel-testing",
    slug: "gel-testing",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "Gel Testing",
      uk: "Gel Testing"
    },
    title: {
      en: "Gel Testing for Blood Banks | Bio-Rad | Labwell",
      uk: "Гелеве тестування для банків крові | Bio-Rad | Labwell"
    },
    description: {
      en: "Bio-Rad gel-card testing solutions for blood typing, antibody screening and other immunohematology procedures.",
      uk: "Рішення Bio-Rad для тестування з гелевими картками: визначення групи крові, скринінг антитіл та інші імуногематологічні процедури."
    },
    todoNote: {
      en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
      uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії."
    },
    sourceUrl: "https://www.bio-rad.com/category/instruments-for-id-system?ID=LO2Q1IFCN",
    canonicalPath: "/products/gel-testing"
  },
  {
    sourceRow: 29,
    id: "product-tube-testing",
    slug: "tube-testing",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "Tube Testing",
      uk: "Tube Testing"
    },
    title: {
      en: "Tube Testing Reagents | Bio-Rad | Labwell",
      uk: "Реагенти для пробіркового тестування | Bio-Rad | Labwell"
    },
    description: {
      en: "Traditional tube-based blood group serology reagents and solutions for immunohematology laboratories.",
      uk: "Традиційні реагенти та рішення для пробіркової серології груп крові в імуногематологічних лабораторіях."
    },
    todoNote: {
      en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
      uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/blood-typing-screening-products?ID=KVSPOY15",
    canonicalPath: "/products/tube-testing"
  },
  {
    sourceRow: 30,
    id: "product-chromogenic-culture-media",
    slug: "chromogenic-culture-media",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "Chromogenic Culture Media",
      uk: "Chromogenic Culture Media"
    },
    title: {
      en: "Chromogenic Culture Media | Bio-Rad | Labwell",
      uk: "Хромогенні культуральні середовища | Bio-Rad | Labwell"
    },
    description: {
      en: "Chromogenic culture media for microbiology laboratories to support differentiation of bacterial colonies.",
      uk: "Хромогенні культуральні середовища для мікробіологічних лабораторій, що полегшують диференціацію бактеріальних колоній."
    },
    todoNote: {
      en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
      uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/microbiology-testing?ID=M4SXK915",
    canonicalPath: "/products/chromogenic-culture-media"
  },
  {
    sourceRow: 31,
    id: "product-blood-agar-media",
    slug: "blood-agar-media",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "Blood Agar Media",
      uk: "Blood Agar Media"
    },
    title: {
      en: "Blood Agar Culture Media | Bio-Rad | Labwell",
      uk: "Культуральні середовища з кров'яним агаром | Bio-Rad | Labwell"
    },
    description: {
      en: "Blood agar culture media for isolation and examination of microorganisms in routine bacteriology.",
      uk: "Культуральні середовища з кров'яним агаром для виділення та дослідження мікроорганізмів у рутинній бактеріології."
    },
    todoNote: {
      en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
      uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/microbiology-testing?ID=M4SXK915",
    canonicalPath: "/products/blood-agar-media"
  },
  {
    sourceRow: 32,
    id: "product-maglumi-clia-test-menu-278-parameters",
    slug: "maglumi-clia-test-menu-278-parameters",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "MAGLUMI CLIA Test Menu (278 parameters)",
      uk: "MAGLUMI CLIA Test Menu (278 parameters)"
    },
    title: {
      en: "MAGLUMI CLIA Test Menu | Snibe | Labwell",
      uk: "Меню CLIA-тестів MAGLUMI | Snibe | Labwell"
    },
    description: {
      en: "Browse Snibe’s MAGLUMI chemiluminescence immunoassay menu across clinical specialties.",
      uk: "Ознайомтеся з меню хемілюмінесцентних імуноаналізів MAGLUMI від Snibe для різних клінічних напрямів."
    },
    todoNote: {
      en: "Confirm the current assay count and which assays Labwell supplies in the UK.",
      uk: "Підтвердьте актуальну кількість тестів і перелік тестів, які Labwell постачає у Великій Британії."
    },
    sourceUrl: "https://www.snibe.com/en/product/CLIA_menu/",
    canonicalPath: "/products/maglumi-clia-test-menu-278-parameters"
  },
  {
    sourceRow: 33,
    id: "product-biochemistry-test-menu",
    slug: "biochemistry-test-menu",
    kind: "product",
    brand: "Snibe",
    navLabel: {
      en: "Biochemistry Test Menu",
      uk: "Biochemistry Test Menu"
    },
    title: {
      en: "Biochemistry Test Menu | Snibe | Labwell",
      uk: "Меню біохімічних тестів | Snibe | Labwell"
    },
    description: {
      en: "Explore Snibe’s clinical chemistry and electrolyte assays for Biossays analyzers.",
      uk: "Ознайомтеся з тестами для клінічної хімії та електролітів від Snibe для аналізаторів Biossays."
    },
    todoNote: {
      en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
      uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії."
    },
    sourceUrl: "https://www.snibe.com/en/product/biochemistry_menu/",
    canonicalPath: "/products/biochemistry-test-menu"
  },
  {
    sourceRow: 34,
    id: "product-inteliq",
    slug: "inteliq",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "InteliQ",
      uk: "InteliQ"
    },
    title: {
      en: "InteliQ Quality Controls | Bio-Rad | Labwell",
      uk: "Контролі якості InteliQ | Bio-Rad | Labwell"
    },
    description: {
      en: "Ready-to-use barcoded independent quality controls for chemistry and immunoassay laboratory platforms.",
      uk: "Готові до використання незалежні штрихкодовані контрольні матеріали для біохімічних та імуноаналітичних лабораторних платформ."
    },
    todoNote: {
      en: "Confirm selected control levels and analytes for Labwell’s range.",
      uk: "Підтвердьте обрані рівні контролю та аналіти для асортименту Labwell."
    },
    sourceUrl: "https://www.qcnet.com/quality-controls/inteliq",
    canonicalPath: "/products/inteliq"
  },
  {
    sourceRow: 35,
    id: "product-immunoassay-controls",
    slug: "immunoassay-controls",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "Immunoassay Controls",
      uk: "Immunoassay Controls"
    },
    title: {
      en: "Immunoassay Quality Controls | Bio-Rad | Labwell",
      uk: "Контролі якості для імуноаналізу | Bio-Rad | Labwell"
    },
    description: {
      en: "Independent controls for monitoring the analytical performance of immunoassay testing.",
      uk: "Незалежні контрольні матеріали для моніторингу аналітичних характеристик імуноаналітичних досліджень."
    },
    todoNote: {
      en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
      uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/quality-controls?ID=b11f022f-7ced-4bf0-aaaa-dcdc8affc787",
    canonicalPath: "/products/immunoassay-controls"
  },
  {
    sourceRow: 36,
    id: "product-infectious-disease-controls",
    slug: "infectious-disease-controls",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "Infectious Disease Controls",
      uk: "Infectious Disease Controls"
    },
    title: {
      en: "Infectious Disease Controls | Bio-Rad | Labwell",
      uk: "Контролі для досліджень інфекційних захворювань | Bio-Rad | Labwell"
    },
    description: {
      en: "Quality controls for laboratory infectious disease assays and serology workflows.",
      uk: "Контрольні матеріали для лабораторних досліджень інфекційних захворювань і серологічних процесів."
    },
    todoNote: {
      en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
      uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/quality-controls?ID=b11f022f-7ced-4bf0-aaaa-dcdc8affc787",
    canonicalPath: "/products/infectious-disease-controls"
  },
  {
    sourceRow: 37,
    id: "product-liquichek-serum-indices",
    slug: "liquichek-serum-indices",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "Liquichek Serum Indices",
      uk: "Liquichek Serum Indices"
    },
    title: {
      en: "Liquichek Serum Indices | Bio-Rad | Labwell",
      uk: "Liquichek Serum Indices | Bio-Rad | Labwell"
    },
    description: {
      en: "Liquid control material for monitoring serum index measurements in clinical chemistry workflows.",
      uk: "Рідкий контрольний матеріал для моніторингу вимірювань сироваткових індексів у клініко-біохімічних дослідженнях."
    },
    todoNote: {
      en: "Linked Bio-Rad page uses a US locale; confirm UK product availability.",
      uk: "Пов’язана сторінка Bio-Rad має локаль US; підтвердьте доступність продукту у Великій Британії."
    },
    sourceUrl: "https://www.bio-rad.com/en-us/product/liquichek-serum-indices?ID=ODKBM515",
    canonicalPath: "/products/liquichek-serum-indices"
  },
  {
    sourceRow: 38,
    id: "product-unity-next-peer-qc",
    slug: "unity-next-peer-qc",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "Unity Next Peer QC",
      uk: "Unity Next Peer QC"
    },
    title: {
      en: "Unity Next Peer QC | Bio-Rad | Labwell",
      uk: "Unity Next Peer QC | Bio-Rad | Labwell"
    },
    description: {
      en: "Peer comparison and quality control data tools for reviewing laboratory analytical performance.",
      uk: "Інструменти для міжлабораторного порівняння та аналізу даних контролю якості, що дають змогу оцінювати аналітичні показники лабораторії."
    },
    todoNote: {
      en: "Software category source; confirm the Unity Next product page, version and Labwell support scope.",
      uk: "Джерелом є категорія програмного забезпечення; підтвердьте сторінку продукту Unity Next, його версію та обсяг підтримки Labwell."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/software-data-analysis?ID=MZQ28F15",
    canonicalPath: "/products/unity-next-peer-qc"
  },
  {
    sourceRow: 39,
    id: "product-unityweb",
    slug: "unityweb",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "UnityWeb",
      uk: "UnityWeb"
    },
    title: {
      en: "UnityWeb QC Software | Bio-Rad | Labwell",
      uk: "Програмне забезпечення QC UnityWeb | Bio-Rad | Labwell"
    },
    description: {
      en: "Online quality control data management for laboratory performance monitoring and peer comparison.",
      uk: "Онлайн-система керування даними контролю якості для моніторингу показників лабораторії та міжлабораторного порівняння."
    },
    todoNote: {
      en: "Software category source; confirm current product naming and Labwell support scope.",
      uk: "Джерелом є категорія програмного забезпечення; підтвердьте актуальну назву продукту та обсяг підтримки Labwell."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/software-data-analysis?ID=MZQ28F15",
    canonicalPath: "/products/unityweb"
  },
  {
    sourceRow: 40,
    id: "product-unity-real-time",
    slug: "unity-real-time",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "Unity Real Time",
      uk: "Unity Real Time"
    },
    title: {
      en: "Unity Real Time QC Software | Bio-Rad | Labwell",
      uk: "Програмне забезпечення QC Unity Real Time | Bio-Rad | Labwell"
    },
    description: {
      en: "Quality control software for reviewing QC results and supporting laboratory performance monitoring.",
      uk: "Програмне забезпечення для контролю якості, призначене для перегляду результатів QC і моніторингу показників лабораторії."
    },
    todoNote: {
      en: "Software category source; confirm current product naming, version and Labwell support scope.",
      uk: "Джерелом є категорія програмного забезпечення; підтвердьте актуальну назву продукту, версію та обсяг підтримки Labwell."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/software-data-analysis?ID=MZQ28F15",
    canonicalPath: "/products/unity-real-time"
  },
  {
    sourceRow: 41,
    id: "product-bricare",
    slug: "bricare",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "BRiCare",
      uk: "BRiCare"
    },
    title: {
      en: "BRiCare Remote Diagnostics | Bio-Rad | Labwell",
      uk: "Віддалена діагностика BRiCare | Bio-Rad | Labwell"
    },
    description: {
      en: "Secure remote diagnostics and support software for Bio-Rad clinical diagnostic instruments.",
      uk: "Захищене програмне забезпечення для віддаленої діагностики та підтримки клініко-діагностичних приладів Bio-Rad."
    },
    todoNote: {
      en: "Confirm Labwell’s service role and access arrangements.",
      uk: "Підтвердьте роль Labwell у сервісному обслуговуванні та умови надання доступу."
    },
    sourceUrl: "https://www.bio-rad.com/product/bricare?ID=MZQ2AUE8Z",
    canonicalPath: "/products/bricare"
  },
  {
    sourceRow: 42,
    id: "product-ih-com",
    slug: "ih-com",
    kind: "product",
    brand: "Bio-Rad",
    navLabel: {
      en: "IH-Com",
      uk: "IH-Com"
    },
    title: {
      en: "IH-Com Connectivity Software | Bio-Rad | Labwell",
      uk: "Програмне забезпечення для інтеграції IH-Com | Bio-Rad | Labwell"
    },
    description: {
      en: "Connectivity solution supporting immunohematology instruments and laboratory information workflows.",
      uk: "Рішення для інтеграції, що підтримує імуногематологічні прилади та процеси обміну даними лабораторної інформаційної системи."
    },
    todoNote: {
      en: "Connectivity category source; confirm IH-Com product details and local integration scope.",
      uk: "Джерелом є категорія інтеграційних рішень; підтвердьте відомості про продукт IH-Com та обсяг локальної інтеграції."
    },
    sourceUrl: "https://www.bio-rad.com/category/connectivity?ID=LO52HFBOL",
    canonicalPath: "/products/ih-com"
  },
  {
    sourceRow: 47,
    id: "clinical-metabolic-panel",
    slug: "metabolic-panel",
    kind: "clinical",
    brand: "Snibe",
    navLabel: {
      en: "Metabolic panel",
      uk: "Метаболічна панель"
    },
    title: {
      en: "Metabolic Testing | Snibe | Labwell",
      uk: "Метаболічні дослідження | Snibe | Labwell"
    },
    description: {
      en: "Clinical chemistry and immunoassay options relevant to metabolic health testing.",
      uk: "Методи клінічної хімії та імуноаналізу, актуальні для дослідження метаболічного здоров'я."
    },
    todoNote: {
      en: "Proposed Labwell clinical page; define the exact biomarkers, assays and instruments before publishing.",
      uk: "Це запропонована клінічна сторінка Labwell; перед публікацією визначте точні біомаркери, тести та прилади."
    },
    sourceUrl: "https://www.snibe.com/en/product/biochemistry_menu/",
    canonicalPath: "/clinical-directions/diabetes-and-metabolism/metabolic-panel"
  },
  {
    sourceRow: 48,
    id: "clinical-maglumi-thyroid-panel",
    slug: "maglumi-thyroid-panel",
    kind: "clinical",
    brand: "Snibe",
    navLabel: {
      en: "MAGLUMI Thyroid Panel",
      uk: "Тиреоїдна панель MAGLUMI"
    },
    title: {
      en: "MAGLUMI Thyroid Tests | Snibe | Labwell",
      uk: "Тиреоїдні тести MAGLUMI | Snibe | Labwell"
    },
    description: {
      en: "Explore thyroid function assays in Snibe’s MAGLUMI CLIA test menu.",
      uk: "Ознайомтеся з тестами для оцінювання функції щитоподібної залози в меню CLIA-тестів MAGLUMI від Snibe."
    },
    todoNote: {
      en: "Test-menu category source; specify the exact thyroid assays and local availability.",
      uk: "Джерелом є категорія меню тестів; зазначте точний перелік тиреоїдних тестів і їхню локальну доступність."
    },
    sourceUrl: "https://www.snibe.com/en/product/CLIA_menu/",
    canonicalPath: "/clinical-directions/thyroid-function/maglumi-thyroid-panel"
  },
  {
    sourceRow: 49,
    id: "clinical-oncopanel-maglumi-oncomarkers",
    slug: "oncopanel-maglumi-oncomarkers",
    kind: "clinical",
    brand: "Snibe",
    navLabel: {
      en: "Oncopanel MAGLUMI (Oncomarkers)",
      uk: "Онкопанель MAGLUMI (Онкомаркери)"
    },
    title: {
      en: "MAGLUMI Tumor Marker Tests | Snibe | Labwell",
      uk: "Тести на онкомаркери MAGLUMI | Snibe | Labwell"
    },
    description: {
      en: "Explore tumor marker immunoassays in the MAGLUMI test menu for oncology laboratory workflows.",
      uk: "Ознайомтеся з імуноаналізами онкомаркерів у меню тестів MAGLUMI для робочих процесів онкологічної лабораторії."
    },
    todoNote: {
      en: "Test-menu category source; replace the informal “Oncopanel” label with confirmed assays and claims.",
      uk: "Джерелом є категорія меню тестів; замініть неофіційну назву «Онкопанель» підтвердженим переліком тестів і формулюваннями їх призначення."
    },
    sourceUrl: "https://www.snibe.com/en/product/CLIA_menu/",
    canonicalPath: "/clinical-directions/oncology/oncopanel-maglumi-oncomarkers"
  },
  {
    sourceRow: 51,
    id: "clinical-bioplex-2200-infection-panels",
    slug: "bioplex-2200-infection-panels",
    kind: "clinical",
    brand: "Bio-Rad",
    navLabel: {
      en: "BioPlex 2200 Infection Panels",
      uk: "BioPlex 2200 Інфекційні панелі"
    },
    title: {
      en: "BioPlex 2200 Infectious Disease Assays | Bio-Rad | Labwell",
      uk: "Тести BioPlex 2200 для інфекційних захворювань | Bio-Rad | Labwell"
    },
    description: {
      en: "Multiplex infectious disease testing on the fully automated BioPlex 2200 platform.",
      uk: "Мультиплексні дослідження інфекційних захворювань на повністю автоматизованій платформі BioPlex 2200."
    },
    todoNote: {
      en: "Category source; identify the exact infection panels available for Labwell.",
      uk: "Джерелом є категорія продуктів; визначте точний перелік панелей для інфекційних захворювань, доступних для Labwell."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/infectious-disease-testing?ID=NA00OK15",
    canonicalPath: "/clinical-directions/infectious-diseases/bioplex-2200-infection-panels"
  },
  {
    sourceRow: 52,
    id: "clinical-maglumi-infection-panel",
    slug: "maglumi-infection-panel",
    kind: "clinical",
    brand: "Snibe",
    navLabel: {
      en: "MAGLUMI Infection Panel",
      uk: "Інфекційна панель MAGLUMI"
    },
    title: {
      en: "MAGLUMI Infectious Disease Tests | Snibe | Labwell",
      uk: "Тести MAGLUMI для інфекційних захворювань | Snibe | Labwell"
    },
    description: {
      en: "Explore infectious disease assays in Snibe’s MAGLUMI CLIA menu.",
      uk: "Ознайомтеся з тестами на інфекційні захворювання в меню CLIA-тестів MAGLUMI від Snibe."
    },
    todoNote: {
      en: "Test-menu category source; identify the exact infections and approved UK assays.",
      uk: "Джерелом є категорія меню тестів; визначте точний перелік інфекцій і тестів, схвалених для Великої Британії."
    },
    sourceUrl: "https://www.snibe.com/en/product/CLIA_menu/",
    canonicalPath: "/clinical-directions/infectious-diseases/maglumi-infection-panel"
  },
  {
    sourceRow: 53,
    id: "clinical-systemic-autoimmune-tests",
    slug: "systemic-autoimmune-tests",
    kind: "clinical",
    brand: "Bio-Rad",
    navLabel: {
      en: "Systemic autoimmune tests",
      uk: "Системні аутоімунні тести"
    },
    title: {
      en: "Systemic Autoimmune Testing | Bio-Rad | Labwell",
      uk: "Системні аутоімунні дослідження | Bio-Rad | Labwell"
    },
    description: {
      en: "Autoantibody testing solutions for systemic autoimmune diseases from Bio-Rad.",
      uk: "Рішення Bio-Rad для дослідження автоантитіл при системних аутоімунних захворюваннях."
    },
    todoNote: {
      en: "Category or family source. Create a dedicated Labwell page and confirm exact UK products/assays before publishing.",
      uk: "Джерелом є категорія або сімейство продуктів. Створіть окрему сторінку Labwell і перед публікацією підтвердьте точний перелік продуктів і тестів для Великої Британії."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/autoimmune-testing?ID=1a1ffd2e-c4cf-4752-83a8-4b93663b4a15",
    canonicalPath: "/clinical-directions/autoimmune-diseases/systemic-autoimmune-tests"
  },
  {
    sourceRow: 54,
    id: "clinical-vasculitis",
    slug: "vasculitis",
    kind: "clinical",
    brand: "Bio-Rad",
    navLabel: {
      en: "Vasculitis",
      uk: "Васкуліти"
    },
    title: {
      en: "Vasculitis Autoantibody Testing | Bio-Rad | Labwell",
      uk: "Дослідження автоантитіл при васкулітах | Bio-Rad | Labwell"
    },
    description: {
      en: "Explore autoantibody testing options relevant to vasculitis investigations.",
      uk: "Ознайомтеся з варіантами дослідження автоантитіл, актуальними для діагностики васкулітів."
    },
    todoNote: {
      en: "Proposed clinical page; select exact assays and review all diagnostic claims before publishing.",
      uk: "Це запропонована клінічна сторінка; перед публікацією оберіть точні тести та перевірте всі діагностичні твердження."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/autoimmune-testing?ID=1a1ffd2e-c4cf-4752-83a8-4b93663b4a15",
    canonicalPath: "/clinical-directions/autoimmune-diseases/vasculitis"
  },
  {
    sourceRow: 56,
    id: "clinical-maglumi-cardiac-markers",
    slug: "maglumi-cardiac-markers",
    kind: "clinical",
    brand: "Snibe",
    navLabel: {
      en: "MAGLUMI cardiac markers",
      uk: "Кардіомаркери MAGLUMI"
    },
    title: {
      en: "MAGLUMI Cardiac Markers | Snibe | Labwell",
      uk: "Кардіомаркери MAGLUMI | Snibe | Labwell"
    },
    description: {
      en: "Cardiac biomarker assays available through Snibe’s MAGLUMI CLIA test menu.",
      uk: "Тести на кардіальні біомаркери, доступні в меню CLIA-тестів MAGLUMI від Snibe."
    },
    todoNote: {
      en: "Test-menu category source; define exact biomarkers and approved claims.",
      uk: "Джерелом є категорія меню тестів; визначте точний перелік біомаркерів і схвалені формулювання призначення."
    },
    sourceUrl: "https://www.snibe.com/en/product/CLIA_menu/",
    canonicalPath: "/clinical-directions/cardiology/maglumi-cardiac-markers"
  },
  {
    sourceRow: 57,
    id: "clinical-cardiac-advance-qc",
    slug: "cardiac-advance-qc",
    kind: "clinical",
    brand: "Bio-Rad",
    navLabel: {
      en: "Cardiac Advance QC",
      uk: "Cardiac Advance QC"
    },
    title: {
      en: "Cardiac Advance Control | Bio-Rad | Labwell",
      uk: "Контрольний матеріал Cardiac Advance | Bio-Rad | Labwell"
    },
    description: {
      en: "Multi-analyte quality control material for cardiac marker assays, including high-sensitivity troponin.",
      uk: "Багатоаналітний матеріал для контролю якості досліджень кардіомаркерів, зокрема високочутливого тропоніну."
    },
    todoNote: {
      en: "Bio-Rad clinical diagnostics overview; locate exact control SKU and confirm Labwell range.",
      uk: "Джерелом є огляд клінічної діагностики Bio-Rad; знайдіть точний SKU контрольного матеріалу та підтвердьте його наявність в асортименті Labwell."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/p/cd",
    canonicalPath: "/clinical-directions/cardiology/cardiac-advance-qc"
  },
  {
    sourceRow: 61,
    id: "clinical-gel-tube-testing",
    slug: "gel-tube-testing",
    kind: "clinical",
    brand: "Bio-Rad",
    navLabel: {
      en: "Gel/Tube testing",
      uk: "Gel/Tube testing"
    },
    title: {
      en: "Gel and Tube Blood Typing | Bio-Rad | Labwell",
      uk: "Визначення групи крові гелевим і пробірковим методами | Bio-Rad | Labwell"
    },
    description: {
      en: "Explore Bio-Rad gel-card and tube-based methods for blood group serology.",
      uk: "Ознайомтеся з методами Bio-Rad із використанням гелевих карток і пробірок для серологічних досліджень груп крові."
    },
    todoNote: {
      en: "Proposed category page; list exact products and distinguish gel from tube workflows.",
      uk: "Це запропонована сторінка категорії; наведіть точний перелік продуктів і розмежуйте гелеві та пробіркові робочі процеси."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/blood-typing-screening-products?ID=KVSPOY15",
    canonicalPath: "/clinical-directions/blood-banks/gel-tube-testing"
  },
  {
    sourceRow: 62,
    id: "brand-about-bio-rad-clinical-diagnostics",
    slug: "about-bio-rad-clinical-diagnostics",
    kind: "brand",
    brand: "Bio-Rad",
    navLabel: {
      en: "About Bio-Rad Clinical Diagnostics",
      uk: "Про Clinical Diagnostics Bio-Rad"
    },
    title: {
      en: "Bio-Rad Clinical Diagnostics | Labwell",
      uk: "Клінічна діагностика Bio-Rad | Labwell"
    },
    description: {
      en: "Discover Bio-Rad’s clinical diagnostics portfolio, including diabetes testing, immunohematology, autoimmunity and quality control.",
      uk: "Ознайомтеся з портфелем клінічної діагностики Bio-Rad, що охоплює дослідження діабету, імуногематологію, аутоімунні захворювання та контроль якості."
    },
    todoNote: {
      en: "Write a Labwell partner introduction, confirm partnership wording and choose featured lines.",
      uk: "Підготуйте партнерський вступ для Labwell, підтвердьте формулювання щодо партнерства та оберіть ключові напрями."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/p/cd",
    canonicalPath: "/brands/bio-rad"
  },
  {
    sourceRow: 63,
    id: "brand-diabetes",
    slug: "diabetes",
    kind: "brand",
    brand: "Bio-Rad",
    navLabel: {
      en: "Diabetes",
      uk: "Діабет"
    },
    title: {
      en: "Bio-Rad Diabetes Testing | Labwell",
      uk: "Дослідження діабету Bio-Rad | Labwell"
    },
    description: {
      en: "Explore Bio-Rad HPLC systems and solutions for HbA1c and hemoglobin testing.",
      uk: "Ознайомтеся з системами ВЕРХ і рішеннями Bio-Rad для визначення HbA1c та дослідження гемоглобіну."
    },
    todoNote: {
      en: "Build a Labwell brand-category page and curate the supplied UK range.",
      uk: "Створіть брендово-категорійну сторінку Labwell і сформуйте добірку асортименту, що постачається у Великій Британії."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/hemoglobin-a1c-testing?ID=b26016d2-10a9-4020-bb12-e024c2c4fb17",
    canonicalPath: "/brands/bio-rad/diabetes"
  },
  {
    sourceRow: 64,
    id: "brand-autoimmunity",
    slug: "autoimmunity",
    kind: "brand",
    brand: "Bio-Rad",
    navLabel: {
      en: "Autoimmunity",
      uk: "Аутоімунітет"
    },
    title: {
      en: "Bio-Rad Autoimmune Testing | Labwell",
      uk: "Аутоімунні дослідження Bio-Rad | Labwell"
    },
    description: {
      en: "Bio-Rad autoantibody assays and automated systems for autoimmune testing laboratories.",
      uk: "Тести Bio-Rad на автоантитіла та автоматизовані системи для лабораторій, що проводять аутоімунні дослідження."
    },
    todoNote: {
      en: "Build a Labwell brand-category page and curate the supplied UK assays.",
      uk: "Створіть брендово-категорійну сторінку Labwell і сформуйте добірку тестів, що постачаються у Великій Британії."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/autoimmune-testing?ID=1a1ffd2e-c4cf-4752-83a8-4b93663b4a15",
    canonicalPath: "/brands/bio-rad/autoimmunity"
  },
  {
    sourceRow: 65,
    id: "brand-quality-control-qc",
    slug: "quality-control-qc",
    kind: "brand",
    brand: "Bio-Rad",
    navLabel: {
      en: "Quality Control (QC)",
      uk: "Контроль якості (QC)"
    },
    title: {
      en: "Bio-Rad Quality Controls | Labwell",
      uk: "Контролі якості Bio-Rad | Labwell"
    },
    description: {
      en: "Explore Bio-Rad independent quality controls and laboratory QC solutions.",
      uk: "Ознайомтеся з незалежними контрольними матеріалами Bio-Rad і рішеннями QC для лабораторій."
    },
    todoNote: {
      en: "Build a Labwell brand-category page and curate the supplied controls.",
      uk: "Створіть брендово-категорійну сторінку Labwell і сформуйте добірку контрольних матеріалів, що постачаються."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/quality-controls?ID=b11f022f-7ced-4bf0-aaaa-dcdc8affc787",
    canonicalPath: "/brands/bio-rad/quality-control-qc"
  },
  {
    sourceRow: 66,
    id: "brand-immunohematology",
    slug: "immunohematology",
    kind: "brand",
    brand: "Bio-Rad",
    navLabel: {
      en: "Immunohematology",
      uk: "Імуногематологія"
    },
    title: {
      en: "Bio-Rad Immunohematology | Labwell",
      uk: "Імуногематологія Bio-Rad | Labwell"
    },
    description: {
      en: "Bio-Rad instruments, reagents and software for blood group serology and blood banks.",
      uk: "Прилади, реагенти та програмне забезпечення Bio-Rad для серологічних досліджень груп крові та банків крові."
    },
    todoNote: {
      en: "Build a Labwell brand-category page and curate the supplied UK range.",
      uk: "Створіть брендово-категорійну сторінку Labwell і сформуйте добірку асортименту, що постачається у Великій Британії."
    },
    sourceUrl: "https://www.bio-rad.com/en-uk/category/blood-typing-screening-products?ID=KVSPOY15",
    canonicalPath: "/brands/bio-rad/immunohematology"
  },
  {
    sourceRow: 67,
    id: "brand-about-snibe",
    slug: "about-snibe",
    kind: "brand",
    brand: "Snibe",
    navLabel: {
      en: "About Snibe",
      uk: "Про компанію Snibe"
    },
    title: {
      en: "About Snibe | Labwell",
      uk: "Про Snibe | Labwell"
    },
    description: {
      en: "Learn about Snibe, a manufacturer of clinical laboratory instruments and in vitro diagnostic reagents.",
      uk: "Дізнайтеся про Snibe — виробника приладів для клінічних лабораторій і реагентів для діагностики in vitro."
    },
    todoNote: {
      en: "Create Labwell’s own About Snibe page; confirm partner status, UK offering and approved brand wording.",
      uk: "Створіть власну сторінку Labwell про Snibe; підтвердьте статус партнерства, пропозицію для Великої Британії та схвалені формулювання щодо бренду."
    },
    sourceUrl: "https://www.snibe.com/en/about/",
    canonicalPath: "/brands/snibe"
  },
  {
    sourceRow: 68,
    id: "brand-maglumi-immunochemistry",
    slug: "maglumi-immunochemistry",
    kind: "brand",
    brand: "Snibe",
    navLabel: {
      en: "MAGLUMI (Immunochemistry)",
      uk: "MAGLUMI (Імунохімія)"
    },
    title: {
      en: "Snibe MAGLUMI CLIA Systems | Labwell",
      uk: "CLIA-системи Snibe MAGLUMI | Labwell"
    },
    description: {
      en: "Explore MAGLUMI chemiluminescence immunoassay analyzers and their assay menu.",
      uk: "Ознайомтеся з аналізаторами MAGLUMI для хемілюмінесцентного імуноаналізу та їхнім меню тестів."
    },
    todoNote: {
      en: "Build a Labwell brand-category page and select the offered analyzer models.",
      uk: "Створіть брендово-категорійну сторінку Labwell і оберіть моделі аналізаторів, що пропонуються."
    },
    sourceUrl: "https://www.snibe.com/en/product/CLIA_analyzer/",
    canonicalPath: "/brands/snibe/maglumi-immunochemistry"
  },
  {
    sourceRow: 69,
    id: "brand-biossays-biochemistry",
    slug: "biossays-biochemistry",
    kind: "brand",
    brand: "Snibe",
    navLabel: {
      en: "Biossays (Biochemistry)",
      uk: "Biossays (Біохімія)"
    },
    title: {
      en: "Snibe Biossays Biochemistry | Labwell",
      uk: "Біохімічні системи Snibe Biossays | Labwell"
    },
    description: {
      en: "Explore Biossays analyzers and clinical chemistry testing solutions from Snibe.",
      uk: "Ознайомтеся з аналізаторами Biossays і рішеннями Snibe для досліджень клінічної хімії."
    },
    todoNote: {
      en: "Build a Labwell brand-category page and select the offered models and tests.",
      uk: "Створіть брендово-категорійну сторінку Labwell і оберіть моделі та тести, що пропонуються."
    },
    sourceUrl: "https://www.snibe.com/en/product/biochemistry_analyzer/",
    canonicalPath: "/brands/snibe/biossays-biochemistry"
  },
  {
    sourceRow: 70,
    id: "brand-satlars-automation",
    slug: "satlars-automation",
    kind: "brand",
    brand: "Snibe",
    navLabel: {
      en: "SATLARS (Automation)",
      uk: "SATLARS (Автоматизація)"
    },
    title: {
      en: "Snibe SATLARS Lab Automation | Labwell",
      uk: "Лабораторна автоматизація Snibe SATLARS | Labwell"
    },
    description: {
      en: "Explore SATLARS automation systems for connected clinical laboratory workflows.",
      uk: "Ознайомтеся з системами автоматизації SATLARS для інтегрованих процесів клінічної лабораторії."
    },
    todoNote: {
      en: "Build a Labwell brand-category page and confirm installation/service scope.",
      uk: "Створіть брендово-категорійну сторінку Labwell і підтвердьте обсяг послуг з інсталяції та сервісного обслуговування."
    },
    sourceUrl: "https://www.snibe.com/en/product/Lab_Automation/",
    canonicalPath: "/brands/snibe/satlars-automation"
  },
  {
    sourceRow: 71,
    id: "brand-molecision-molecular-diagnostics",
    slug: "molecision-molecular-diagnostics",
    kind: "brand",
    brand: "Snibe",
    navLabel: {
      en: "Molecision (Molecular diagnostics)",
      uk: "Molecision (Молекулярна діагностика)"
    },
    title: {
      en: "Snibe Molecision Molecular Diagnostics | Labwell",
      uk: "Молекулярна діагностика Snibe Molecision | Labwell"
    },
    description: {
      en: "Explore Molecision molecular instruments for clinical laboratory testing.",
      uk: "Ознайомтеся з молекулярними приладами Molecision для досліджень у клінічній лабораторії."
    },
    todoNote: {
      en: "Build a Labwell brand-category page and confirm the offered models and assays.",
      uk: "Створіть брендово-категорійну сторінку Labwell і підтвердьте моделі та тести, що пропонуються."
    },
    sourceUrl: "https://www.snibe.com/en/product/Molecular/",
    canonicalPath: "/brands/snibe/molecision-molecular-diagnostics"
  }
] as const satisfies readonly ContentPageRecord[];
export const navigationPlacements = [
  {
    sourceRow: 2,
    id: "product-maglumi-x10",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Immunochemical analyzers (CLIA)",
      uk: "Імунохімічні аналізатори (CLIA)"
    },
    navLabel: {
      en: "MAGLUMI X10",
      uk: "MAGLUMI X10"
    },
    path: "/products/maglumi-x10"
  },
  {
    sourceRow: 3,
    id: "product-maglumi-x8",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Immunochemical analyzers (CLIA)",
      uk: "Імунохімічні аналізатори (CLIA)"
    },
    navLabel: {
      en: "MAGLUMI X8",
      uk: "MAGLUMI X8"
    },
    path: "/products/maglumi-x8"
  },
  {
    sourceRow: 4,
    id: "product-maglumi-x6",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Immunochemical analyzers (CLIA)",
      uk: "Імунохімічні аналізатори (CLIA)"
    },
    navLabel: {
      en: "MAGLUMI X6",
      uk: "MAGLUMI X6"
    },
    path: "/products/maglumi-x6"
  },
  {
    sourceRow: 5,
    id: "product-maglumi-x3",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Immunochemical analyzers (CLIA)",
      uk: "Імунохімічні аналізатори (CLIA)"
    },
    navLabel: {
      en: "MAGLUMI X3",
      uk: "MAGLUMI X3"
    },
    path: "/products/maglumi-x3"
  },
  {
    sourceRow: 6,
    id: "product-biossays-c10",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Biochemical analyzers",
      uk: "Біохімічні аналізатори"
    },
    navLabel: {
      en: "Biossays C10",
      uk: "Biossays C10"
    },
    path: "/products/biossays-c10"
  },
  {
    sourceRow: 7,
    id: "product-biossays-240-plus",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Biochemical analyzers",
      uk: "Біохімічні аналізатори"
    },
    navLabel: {
      en: "Biossays 240 Plus",
      uk: "Biossays 240 Plus"
    },
    path: "/products/biossays-240-plus"
  },
  {
    sourceRow: 8,
    id: "product-biossays-e6-plus",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Biochemical analyzers",
      uk: "Біохімічні аналізатори"
    },
    navLabel: {
      en: "Biossays E6 Plus",
      uk: "Biossays E6 Plus"
    },
    path: "/products/biossays-e6-plus"
  },
  {
    sourceRow: 9,
    id: "product-d-100",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "HbA1c analyzers",
      uk: "Аналізатори HbA1c"
    },
    navLabel: {
      en: "D-100",
      uk: "D-100"
    },
    path: "/products/d-100"
  },
  {
    sourceRow: 10,
    id: "product-d-10",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "HbA1c analyzers",
      uk: "Аналізатори HbA1c"
    },
    navLabel: {
      en: "D-10",
      uk: "D-10"
    },
    path: "/products/d-10"
  },
  {
    sourceRow: 11,
    id: "product-variant-ii",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "HbA1c analyzers",
      uk: "Аналізатори HbA1c"
    },
    navLabel: {
      en: "VARIANT II",
      uk: "VARIANT II"
    },
    path: "/products/variant-ii"
  },
  {
    sourceRow: 12,
    id: "product-variant-ii-turbo",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "HbA1c analyzers",
      uk: "Аналізатори HbA1c"
    },
    navLabel: {
      en: "VARIANT II TURBO",
      uk: "VARIANT II TURBO"
    },
    path: "/products/variant-ii-turbo"
  },
  {
    sourceRow: 13,
    id: "product-ih-500-next-system",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Blood group analyzers",
      uk: "Аналізатори груп крові"
    },
    navLabel: {
      en: "IH-500 NEXT System",
      uk: "IH-500 NEXT System"
    },
    path: "/products/ih-500-next-system"
  },
  {
    sourceRow: 14,
    id: "product-ih-1000",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Blood group analyzers",
      uk: "Аналізатори груп крові"
    },
    navLabel: {
      en: "IH-1000",
      uk: "IH-1000"
    },
    path: "/products/ih-1000"
  },
  {
    sourceRow: 15,
    id: "product-ih-reader-24",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Blood group analyzers",
      uk: "Аналізатори груп крові"
    },
    navLabel: {
      en: "IH-Reader 24",
      uk: "IH-Reader 24"
    },
    path: "/products/ih-reader-24"
  },
  {
    sourceRow: 16,
    id: "product-bioplex-2200-system",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Autoimmune and infectious",
      uk: "Автоімунні та інфекційні"
    },
    navLabel: {
      en: "BioPlex 2200 System",
      uk: "BioPlex 2200 System"
    },
    path: "/products/bioplex-2200-system"
  },
  {
    sourceRow: 17,
    id: "product-phd-lx-system",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Autoimmune and infectious",
      uk: "Автоімунні та інфекційні"
    },
    navLabel: {
      en: "PhD lx System",
      uk: "PhD lx System"
    },
    path: "/products/phd-lx-system"
  },
  {
    sourceRow: 18,
    id: "product-geenius-system",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Autoimmune and infectious",
      uk: "Автоімунні та інфекційні"
    },
    navLabel: {
      en: "Geenius System",
      uk: "Geenius System"
    },
    path: "/products/geenius-system"
  },
  {
    sourceRow: 19,
    id: "product-satlars-tca",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Laboratory Automation (TLA)",
      uk: "Лабораторна автоматизація (TLA)"
    },
    navLabel: {
      en: "SATLARS-TCA",
      uk: "SATLARS-TCA"
    },
    path: "/products/satlars-tca"
  },
  {
    sourceRow: 20,
    id: "product-satlars-t8",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Laboratory Automation (TLA)",
      uk: "Лабораторна автоматизація (TLA)"
    },
    navLabel: {
      en: "SATLARS-T8",
      uk: "SATLARS-T8"
    },
    path: "/products/satlars-t8"
  },
  {
    sourceRow: 21,
    id: "product-satlars-mini-t8",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Laboratory Automation (TLA)",
      uk: "Лабораторна автоматизація (TLA)"
    },
    navLabel: {
      en: "SATLARS mini-T8",
      uk: "SATLARS mini-T8"
    },
    path: "/products/satlars-mini-t8"
  },
  {
    sourceRow: 22,
    id: "product-molecision-mp-96",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Molecular analyzers (PCR)",
      uk: "Молекулярні аналізатори (ПЛР)"
    },
    navLabel: {
      en: "Molecision MP-96",
      uk: "Molecision MP-96"
    },
    path: "/products/molecision-mp-96"
  },
  {
    sourceRow: 23,
    id: "product-molecision-mp-32",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Molecular analyzers (PCR)",
      uk: "Молекулярні аналізатори (ПЛР)"
    },
    navLabel: {
      en: "Molecision MP-32",
      uk: "Molecision MP-32"
    },
    path: "/products/molecision-mp-32"
  },
  {
    sourceRow: 24,
    id: "product-molecision-s6",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Molecular analyzers (PCR)",
      uk: "Молекулярні аналізатори (ПЛР)"
    },
    navLabel: {
      en: "Molecision S6",
      uk: "Molecision S6"
    },
    path: "/products/molecision-s6"
  },
  {
    sourceRow: 25,
    id: "product-molecision-r8",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Molecular analyzers (PCR)",
      uk: "Молекулярні аналізатори (ПЛР)"
    },
    navLabel: {
      en: "Molecision R8",
      uk: "Molecision R8"
    },
    path: "/products/molecision-r8"
  },
  {
    sourceRow: 26,
    id: "product-hemolumi-h6",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Equipment / Analyzers",
      uk: "Обладнання / Аналізатори"
    },
    group: {
      en: "Hemostasis analyzers",
      uk: "Аналізатори гемостазу"
    },
    navLabel: {
      en: "Hemolumi H6",
      uk: "Hemolumi H6"
    },
    path: "/products/hemolumi-h6"
  },
  {
    sourceRow: 27,
    id: "product-ih-systems-reagents",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Reagents and test systems",
      uk: "Реагенти та тест-системи"
    },
    navLabel: {
      en: "IH-Systems reagents",
      uk: "IH-Systems reagents"
    },
    path: "/products/ih-systems-reagents"
  },
  {
    sourceRow: 28,
    id: "product-gel-testing",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Reagents and test systems",
      uk: "Реагенти та тест-системи"
    },
    navLabel: {
      en: "Gel Testing",
      uk: "Gel Testing"
    },
    path: "/products/gel-testing"
  },
  {
    sourceRow: 29,
    id: "product-tube-testing",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Reagents and test systems",
      uk: "Реагенти та тест-системи"
    },
    navLabel: {
      en: "Tube Testing",
      uk: "Tube Testing"
    },
    path: "/products/tube-testing"
  },
  {
    sourceRow: 30,
    id: "product-chromogenic-culture-media",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Reagents and test systems",
      uk: "Реагенти та тест-системи"
    },
    navLabel: {
      en: "Chromogenic Culture Media",
      uk: "Chromogenic Culture Media"
    },
    path: "/products/chromogenic-culture-media"
  },
  {
    sourceRow: 31,
    id: "product-blood-agar-media",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Reagents and test systems",
      uk: "Реагенти та тест-системи"
    },
    navLabel: {
      en: "Blood Agar Media",
      uk: "Blood Agar Media"
    },
    path: "/products/blood-agar-media"
  },
  {
    sourceRow: 32,
    id: "product-maglumi-clia-test-menu-278-parameters",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Reagents and test systems",
      uk: "Реагенти та тест-системи"
    },
    navLabel: {
      en: "MAGLUMI CLIA Test Menu (278 parameters)",
      uk: "MAGLUMI CLIA Test Menu (278 parameters)"
    },
    path: "/products/maglumi-clia-test-menu-278-parameters"
  },
  {
    sourceRow: 33,
    id: "product-biochemistry-test-menu",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Reagents and test systems",
      uk: "Реагенти та тест-системи"
    },
    navLabel: {
      en: "Biochemistry Test Menu",
      uk: "Biochemistry Test Menu"
    },
    path: "/products/biochemistry-test-menu"
  },
  {
    sourceRow: 34,
    id: "product-inteliq",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Quality Control (QC) and Software",
      uk: "Контроль якості (QC) та ПЗ"
    },
    group: {
      en: "Quality Control (QC)",
      uk: "Контроль якості (QC)"
    },
    navLabel: {
      en: "InteliQ",
      uk: "InteliQ"
    },
    path: "/products/inteliq"
  },
  {
    sourceRow: 35,
    id: "product-immunoassay-controls",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Quality Control (QC) and Software",
      uk: "Контроль якості (QC) та ПЗ"
    },
    group: {
      en: "Quality Control (QC)",
      uk: "Контроль якості (QC)"
    },
    navLabel: {
      en: "Immunoassay Controls",
      uk: "Immunoassay Controls"
    },
    path: "/products/immunoassay-controls"
  },
  {
    sourceRow: 36,
    id: "product-infectious-disease-controls",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Quality Control (QC) and Software",
      uk: "Контроль якості (QC) та ПЗ"
    },
    group: {
      en: "Quality Control (QC)",
      uk: "Контроль якості (QC)"
    },
    navLabel: {
      en: "Infectious Disease Controls",
      uk: "Infectious Disease Controls"
    },
    path: "/products/infectious-disease-controls"
  },
  {
    sourceRow: 37,
    id: "product-liquichek-serum-indices",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Quality Control (QC) and Software",
      uk: "Контроль якості (QC) та ПЗ"
    },
    group: {
      en: "Quality Control (QC)",
      uk: "Контроль якості (QC)"
    },
    navLabel: {
      en: "Liquichek Serum Indices",
      uk: "Liquichek Serum Indices"
    },
    path: "/products/liquichek-serum-indices"
  },
  {
    sourceRow: 38,
    id: "product-unity-next-peer-qc",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Quality Control (QC) and Software",
      uk: "Контроль якості (QC) та ПЗ"
    },
    group: {
      en: "Software",
      uk: "Програмне забезпечення"
    },
    navLabel: {
      en: "Unity Next Peer QC",
      uk: "Unity Next Peer QC"
    },
    path: "/products/unity-next-peer-qc"
  },
  {
    sourceRow: 39,
    id: "product-unityweb",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Quality Control (QC) and Software",
      uk: "Контроль якості (QC) та ПЗ"
    },
    group: {
      en: "Software",
      uk: "Програмне забезпечення"
    },
    navLabel: {
      en: "UnityWeb",
      uk: "UnityWeb"
    },
    path: "/products/unityweb"
  },
  {
    sourceRow: 40,
    id: "product-unity-real-time",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Quality Control (QC) and Software",
      uk: "Контроль якості (QC) та ПЗ"
    },
    group: {
      en: "Software",
      uk: "Програмне забезпечення"
    },
    navLabel: {
      en: "Unity Real Time",
      uk: "Unity Real Time"
    },
    path: "/products/unity-real-time"
  },
  {
    sourceRow: 41,
    id: "product-bricare",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Quality Control (QC) and Software",
      uk: "Контроль якості (QC) та ПЗ"
    },
    group: {
      en: "Software",
      uk: "Програмне забезпечення"
    },
    navLabel: {
      en: "BRiCare",
      uk: "BRiCare"
    },
    path: "/products/bricare"
  },
  {
    sourceRow: 42,
    id: "product-ih-com",
    kind: "product",
    category: {
      en: "Product catalog",
      uk: "Каталог продукції"
    },
    subcategory: {
      en: "Quality Control (QC) and Software",
      uk: "Контроль якості (QC) та ПЗ"
    },
    group: {
      en: "Software",
      uk: "Програмне забезпечення"
    },
    navLabel: {
      en: "IH-Com",
      uk: "IH-Com"
    },
    path: "/products/ih-com"
  },
  {
    sourceRow: 43,
    id: "product-d-100",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Diabetes and metabolism",
      uk: "Діабет та метаболізм"
    },
    group: {
      en: "HbA1c analyzers",
      uk: "Аналізатори HbA1c"
    },
    navLabel: {
      en: "D-100",
      uk: "D-100"
    },
    path: "/products/d-100"
  },
  {
    sourceRow: 44,
    id: "product-d-10",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Diabetes and metabolism",
      uk: "Діабет та метаболізм"
    },
    group: {
      en: "HbA1c analyzers",
      uk: "Аналізатори HbA1c"
    },
    navLabel: {
      en: "D-10",
      uk: "D-10"
    },
    path: "/products/d-10"
  },
  {
    sourceRow: 45,
    id: "product-variant-ii",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Diabetes and metabolism",
      uk: "Діабет та метаболізм"
    },
    group: {
      en: "HbA1c analyzers",
      uk: "Аналізатори HbA1c"
    },
    navLabel: {
      en: "VARIANT II",
      uk: "VARIANT II"
    },
    path: "/products/variant-ii"
  },
  {
    sourceRow: 46,
    id: "product-variant-ii-turbo",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Diabetes and metabolism",
      uk: "Діабет та метаболізм"
    },
    group: {
      en: "HbA1c analyzers",
      uk: "Аналізатори HbA1c"
    },
    navLabel: {
      en: "VARIANT II TURBO",
      uk: "VARIANT II TURBO"
    },
    path: "/products/variant-ii-turbo"
  },
  {
    sourceRow: 47,
    id: "clinical-metabolic-panel",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Diabetes and metabolism",
      uk: "Діабет та метаболізм"
    },
    navLabel: {
      en: "Metabolic panel",
      uk: "Метаболічна панель"
    },
    path: "/clinical-directions/diabetes-and-metabolism/metabolic-panel"
  },
  {
    sourceRow: 48,
    id: "clinical-maglumi-thyroid-panel",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Thyroid function",
      uk: "Функція щитоподібної залози"
    },
    navLabel: {
      en: "MAGLUMI Thyroid Panel",
      uk: "Тиреоїдна панель MAGLUMI"
    },
    path: "/clinical-directions/thyroid-function/maglumi-thyroid-panel"
  },
  {
    sourceRow: 49,
    id: "clinical-oncopanel-maglumi-oncomarkers",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Oncology",
      uk: "Онкологія"
    },
    navLabel: {
      en: "Oncopanel MAGLUMI (Oncomarkers)",
      uk: "Онкопанель MAGLUMI (Онкомаркери)"
    },
    path: "/clinical-directions/oncology/oncopanel-maglumi-oncomarkers"
  },
  {
    sourceRow: 50,
    id: "product-geenius-system",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Infectious diseases",
      uk: "Інфекційні захворювання"
    },
    navLabel: {
      en: "Geenius System",
      uk: "Geenius System"
    },
    path: "/products/geenius-system"
  },
  {
    sourceRow: 51,
    id: "clinical-bioplex-2200-infection-panels",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Infectious diseases",
      uk: "Інфекційні захворювання"
    },
    navLabel: {
      en: "BioPlex 2200 Infection Panels",
      uk: "BioPlex 2200 Інфекційні панелі"
    },
    path: "/clinical-directions/infectious-diseases/bioplex-2200-infection-panels"
  },
  {
    sourceRow: 52,
    id: "clinical-maglumi-infection-panel",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Infectious diseases",
      uk: "Інфекційні захворювання"
    },
    navLabel: {
      en: "MAGLUMI Infection Panel",
      uk: "Інфекційна панель MAGLUMI"
    },
    path: "/clinical-directions/infectious-diseases/maglumi-infection-panel"
  },
  {
    sourceRow: 53,
    id: "clinical-systemic-autoimmune-tests",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Autoimmune diseases",
      uk: "Аутоімунні захворювання"
    },
    navLabel: {
      en: "Systemic autoimmune tests",
      uk: "Системні аутоімунні тести"
    },
    path: "/clinical-directions/autoimmune-diseases/systemic-autoimmune-tests"
  },
  {
    sourceRow: 54,
    id: "clinical-vasculitis",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Autoimmune diseases",
      uk: "Аутоімунні захворювання"
    },
    navLabel: {
      en: "Vasculitis",
      uk: "Васкуліти"
    },
    path: "/clinical-directions/autoimmune-diseases/vasculitis"
  },
  {
    sourceRow: 55,
    id: "product-bioplex-2200-system",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Autoimmune diseases",
      uk: "Аутоімунні захворювання"
    },
    navLabel: {
      en: "BioPlex 2200 System",
      uk: "BioPlex 2200 System"
    },
    path: "/products/bioplex-2200-system"
  },
  {
    sourceRow: 56,
    id: "clinical-maglumi-cardiac-markers",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Cardiology",
      uk: "Кардіологія"
    },
    navLabel: {
      en: "MAGLUMI cardiac markers",
      uk: "Кардіомаркери MAGLUMI"
    },
    path: "/clinical-directions/cardiology/maglumi-cardiac-markers"
  },
  {
    sourceRow: 57,
    id: "clinical-cardiac-advance-qc",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Cardiology",
      uk: "Кардіологія"
    },
    navLabel: {
      en: "Cardiac Advance QC",
      uk: "Cardiac Advance QC"
    },
    path: "/clinical-directions/cardiology/cardiac-advance-qc"
  },
  {
    sourceRow: 58,
    id: "product-ih-500-next-system",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Blood banks",
      uk: "Банки крові"
    },
    navLabel: {
      en: "IH-500 NEXT System",
      uk: "IH-500 NEXT System"
    },
    path: "/products/ih-500-next-system"
  },
  {
    sourceRow: 59,
    id: "product-ih-1000",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Blood banks",
      uk: "Банки крові"
    },
    navLabel: {
      en: "IH-1000",
      uk: "IH-1000"
    },
    path: "/products/ih-1000"
  },
  {
    sourceRow: 60,
    id: "product-ih-reader-24",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Blood banks",
      uk: "Банки крові"
    },
    navLabel: {
      en: "IH-Reader 24",
      uk: "IH-Reader 24"
    },
    path: "/products/ih-reader-24"
  },
  {
    sourceRow: 61,
    id: "clinical-gel-tube-testing",
    kind: "clinical",
    category: {
      en: "Clinical directions",
      uk: "Клінічні напрямки"
    },
    subcategory: {
      en: "Blood banks",
      uk: "Банки крові"
    },
    navLabel: {
      en: "Gel/Tube testing",
      uk: "Gel/Tube testing"
    },
    path: "/clinical-directions/blood-banks/gel-tube-testing"
  },
  {
    sourceRow: 62,
    id: "brand-about-bio-rad-clinical-diagnostics",
    kind: "brand",
    category: {
      en: "Brands",
      uk: "Бренди"
    },
    subcategory: {
      en: "Bio-Rad",
      uk: "Bio-Rad"
    },
    navLabel: {
      en: "About Bio-Rad Clinical Diagnostics",
      uk: "Про Clinical Diagnostics Bio-Rad"
    },
    path: "/brands/bio-rad"
  },
  {
    sourceRow: 63,
    id: "brand-diabetes",
    kind: "brand",
    category: {
      en: "Brands",
      uk: "Бренди"
    },
    subcategory: {
      en: "Bio-Rad",
      uk: "Bio-Rad"
    },
    navLabel: {
      en: "Diabetes",
      uk: "Діабет"
    },
    path: "/brands/bio-rad/diabetes"
  },
  {
    sourceRow: 64,
    id: "brand-autoimmunity",
    kind: "brand",
    category: {
      en: "Brands",
      uk: "Бренди"
    },
    subcategory: {
      en: "Bio-Rad",
      uk: "Bio-Rad"
    },
    navLabel: {
      en: "Autoimmunity",
      uk: "Аутоімунітет"
    },
    path: "/brands/bio-rad/autoimmunity"
  },
  {
    sourceRow: 65,
    id: "brand-quality-control-qc",
    kind: "brand",
    category: {
      en: "Brands",
      uk: "Бренди"
    },
    subcategory: {
      en: "Bio-Rad",
      uk: "Bio-Rad"
    },
    navLabel: {
      en: "Quality Control (QC)",
      uk: "Контроль якості (QC)"
    },
    path: "/brands/bio-rad/quality-control-qc"
  },
  {
    sourceRow: 66,
    id: "brand-immunohematology",
    kind: "brand",
    category: {
      en: "Brands",
      uk: "Бренди"
    },
    subcategory: {
      en: "Bio-Rad",
      uk: "Bio-Rad"
    },
    navLabel: {
      en: "Immunohematology",
      uk: "Імуногематологія"
    },
    path: "/brands/bio-rad/immunohematology"
  },
  {
    sourceRow: 67,
    id: "brand-about-snibe",
    kind: "brand",
    category: {
      en: "Brands",
      uk: "Бренди"
    },
    subcategory: {
      en: "Snibe",
      uk: "Snibe"
    },
    navLabel: {
      en: "About Snibe",
      uk: "Про компанію Snibe"
    },
    path: "/brands/snibe"
  },
  {
    sourceRow: 68,
    id: "brand-maglumi-immunochemistry",
    kind: "brand",
    category: {
      en: "Brands",
      uk: "Бренди"
    },
    subcategory: {
      en: "Snibe",
      uk: "Snibe"
    },
    navLabel: {
      en: "MAGLUMI (Immunochemistry)",
      uk: "MAGLUMI (Імунохімія)"
    },
    path: "/brands/snibe/maglumi-immunochemistry"
  },
  {
    sourceRow: 69,
    id: "brand-biossays-biochemistry",
    kind: "brand",
    category: {
      en: "Brands",
      uk: "Бренди"
    },
    subcategory: {
      en: "Snibe",
      uk: "Snibe"
    },
    navLabel: {
      en: "Biossays (Biochemistry)",
      uk: "Biossays (Біохімія)"
    },
    path: "/brands/snibe/biossays-biochemistry"
  },
  {
    sourceRow: 70,
    id: "brand-satlars-automation",
    kind: "brand",
    category: {
      en: "Brands",
      uk: "Бренди"
    },
    subcategory: {
      en: "Snibe",
      uk: "Snibe"
    },
    navLabel: {
      en: "SATLARS (Automation)",
      uk: "SATLARS (Автоматизація)"
    },
    path: "/brands/snibe/satlars-automation"
  },
  {
    sourceRow: 71,
    id: "brand-molecision-molecular-diagnostics",
    kind: "brand",
    category: {
      en: "Brands",
      uk: "Бренди"
    },
    subcategory: {
      en: "Snibe",
      uk: "Snibe"
    },
    navLabel: {
      en: "Molecision (Molecular diagnostics)",
      uk: "Molecision (Молекулярна діагностика)"
    },
    path: "/brands/snibe/molecision-molecular-diagnostics"
  }
] as const satisfies readonly NavigationPlacement[];

/** Notes attached to repeated clinical placements (their canonical page owns the product note). */
export const repeatedClinicalPlacementNotes = [
  { sourceRow: 43, todoNote: { en: "Same model as row 9; consider one shared Labwell product page.", uk: "Та сама модель, що й у рядку 9; розгляньте одну спільну сторінку продукту Labwell." } },
  { sourceRow: 44, todoNote: { en: "Same model as row 10; consider one shared Labwell product page.", uk: "Та сама модель, що й у рядку 10; розгляньте одну спільну сторінку продукту Labwell." } },
  { sourceRow: 45, todoNote: { en: "Same model as row 11; check diabetes application and legacy availability.", uk: "Та сама модель, що й у рядку 11; перевірте застосування для діабету та доступність застарілої моделі." } },
  { sourceRow: 46, todoNote: { en: "Same model as row 12; consider one shared Labwell product page.", uk: "Та сама модель, що й у рядку 12; розгляньте одну спільну сторінку продукту Labwell." } },
  { sourceRow: 49, todoNote: { en: "Same range as row 18; choose the exact instrument and assay pages.", uk: "Той самий асортимент, що й у рядку 18; оберіть точні сторінки приладу та тестів." } },
  { sourceRow: 55, todoNote: { en: "Same system as row 16; list the exact autoimmune assays for this clinical page.", uk: "Та сама система, що й у рядку 16; перелічіть точні аутоімунні тести для цієї клінічної сторінки." } },
  { sourceRow: 58, todoNote: { en: "Same model as row 13; consider one shared Labwell product page.", uk: "Та сама модель, що й у рядку 13; розгляньте одну спільну сторінку продукту Labwell." } },
  { sourceRow: 59, todoNote: { en: "Same model as row 14; consider one shared Labwell product page.", uk: "Та сама модель, що й у рядку 14; розгляньте одну спільну сторінку продукту Labwell." } },
  { sourceRow: 60, todoNote: { en: "Same model as row 15; linked source uses a US locale.", uk: "Та сама модель, що й у рядку 15; пов’язане джерело використовує локаль US." } },
] as const;

export const productPages = contentPages.filter((page) => page.kind === 'product');
export const clinicalPages = contentPages.filter((page) => page.kind === 'clinical');
export const brandPages = contentPages.filter((page) => page.kind === 'brand');

export const megaMenuLabels = {
  productCatalog: { en: 'Product catalog', uk: 'Каталог продукції' },
  clinicalDirections: { en: 'Clinical directions', uk: 'Клінічні напрямки' },
  brands: { en: 'Brands', uk: 'Бренди' },
} as const satisfies Readonly<Record<string, LocalizedText>>;

export const megaMenuGroups = {
  productCatalog: ['Equipment / Analyzers', 'Reagents and test systems', 'Quality Control (QC) and Software'],
  clinicalDirections: ['Diabetes and metabolism', 'Thyroid function', 'Oncology', 'Infectious diseases', 'Autoimmune diseases', 'Cardiology', 'Blood banks'],
  brands: ['Bio-Rad', 'Snibe'],
} as const;

export function getPageById(id: string): ContentPageRecord | undefined { return contentPages.find((page) => page.id === id); }
export function getPageBySlug(slug: string): ContentPageRecord | undefined { return contentPages.find((page) => page.slug === slug); }
export function getPageByPath(path: string): ContentPageRecord | undefined { return contentPages.find((page) => page.canonicalPath === path); }
