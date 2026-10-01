/**
 * Icon names that `content/` may use (kebab-case, as in lucide; a few are older
 * lucide names: flask, layout-panel, message, plus-square). The schema checks
 * against this list at load time, so an unknown icon fails the build with the
 * file and the path instead of crashing later during prerender.
 * Components for these names live in `components/product-page/icons.tsx`
 * (typed on this list, so the two cannot drift apart).
 */
export const iconNames = [
  "arrow-left-right",
  "barcode",
  "box",
  "calendar-clock",
  "chart-line",
  "chart-no-axes-combined",
  "clock",
  "combine",
  "database",
  "droplet",
  "file-check",
  "flask",
  "graduation-cap",
  "layers",
  "layout-grid",
  "layout-panel",
  "list",
  "maximize",
  "message",
  "minimize",
  "monitor-cog",
  "panel-right",
  "panel-top-close",
  "pipette",
  "plus-square",
  "refresh-cw",
  "repeat-2",
  "ruler",
  "scan-line",
  "scan-search",
  "settings",
  "shield-check",
  "sliders-horizontal",
  "snowflake",
  "test-tubes",
  "thermometer",
  "truck",
  "workflow",
  "wrench",
  "zap",
] as const;

export type IconName = (typeof iconNames)[number];

export function isIconName(value: string): value is IconName {
  return (iconNames as readonly string[]).includes(value);
}
