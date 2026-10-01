import type { CrumbLabels } from "@/components/patterns/breadcrumbs";

/** The texts of the breadcrumbs, from either dictionary. */
export function crumbLabels(dictionary: {
  accessibility: { breadcrumbs: string };
  productPage: { home: string; showHidden: string; up: string };
}): CrumbLabels {
  return {
    breadcrumbs: dictionary.accessibility.breadcrumbs,
    home: dictionary.productPage.home,
    showHidden: dictionary.productPage.showHidden,
    up: dictionary.productPage.up,
  };
}
