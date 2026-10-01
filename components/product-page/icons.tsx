import {
  ArrowLeftRight,
  Barcode,
  Box,
  CalendarClock,
  ChartLine,
  ChartNoAxesCombined,
  Clock,
  Combine,
  Database,
  Droplet,
  FileCheck,
  FlaskConical,
  GraduationCap,
  Layers,
  LayoutGrid,
  LayoutPanelTop,
  List,
  Maximize,
  MessageCircle,
  Minimize,
  MonitorCog,
  PanelRight,
  PanelTopClose,
  Pipette,
  RefreshCw,
  Repeat2,
  Ruler,
  ScanLine,
  ScanSearch,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  SquarePlus,
  TestTubes,
  Thermometer,
  Truck,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { isIconName, type IconName } from "@/lib/site-content/icon-names";

/**
 * Icon names used in `content/` → components. The names are validated when the
 * content is loaded (`lib/site-content/icon-names.ts`); `Record<IconName, …>`
 * makes TypeScript require a component for every name on that list.
 */
const icons: Record<IconName, LucideIcon> = {
  "arrow-left-right": ArrowLeftRight,
  barcode: Barcode,
  box: Box,
  "calendar-clock": CalendarClock,
  "chart-line": ChartLine,
  "chart-no-axes-combined": ChartNoAxesCombined,
  clock: Clock,
  combine: Combine,
  database: Database,
  droplet: Droplet,
  "file-check": FileCheck,
  flask: FlaskConical,
  "graduation-cap": GraduationCap,
  layers: Layers,
  "layout-grid": LayoutGrid,
  "layout-panel": LayoutPanelTop,
  list: List,
  maximize: Maximize,
  message: MessageCircle,
  minimize: Minimize,
  "monitor-cog": MonitorCog,
  "panel-right": PanelRight,
  "panel-top-close": PanelTopClose,
  pipette: Pipette,
  "plus-square": SquarePlus,
  "refresh-cw": RefreshCw,
  "repeat-2": Repeat2,
  ruler: Ruler,
  "scan-line": ScanLine,
  "scan-search": ScanSearch,
  settings: Settings,
  "shield-check": ShieldCheck,
  "sliders-horizontal": SlidersHorizontal,
  snowflake: Snowflake,
  "test-tubes": TestTubes,
  thermometer: Thermometer,
  truck: Truck,
  workflow: Workflow,
  wrench: Wrench,
  zap: Zap,
};

export function ContentIcon({ name, size = 22 }: { name: string; size?: number }) {
  if (!isIconName(name)) {
    throw new Error(`Unknown icon "${name}": the content loader should have rejected it.`);
  }
  const Icon = icons[name];
  return <Icon aria-hidden="true" size={size} strokeWidth={1.8} />;
}
