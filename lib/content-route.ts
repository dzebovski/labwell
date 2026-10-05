import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/i18n/config";
import { getRouteTarget, type RouteTarget } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/page-metadata";
import { getDirectionMetadata } from "@/lib/site-content/directions";

/** Shared by the catalog routes: 404 for an unknown locale or path. */
export function requireRouteTarget(
  locale: string,
  path: string,
): { locale: Locale; target: RouteTarget } {
  const target = getRouteTarget(path);
  if (!isLocale(locale) || !target) notFound();
  return { locale, target };
}

export function routeMetadata(locale: string, path: string): Metadata {
  const { locale: resolvedLocale, target } = requireRouteTarget(locale, path);
  if (target.type === "page") {
    const { page } = target;
    return createPageMetadata(resolvedLocale, page.seoTitle[resolvedLocale], page.description[resolvedLocale], page.path);
  }
  const { category } = target;
  // Catalog groups and directions have their own texts in content/directions/.
  if (category.menu === "catalog") return getDirectionMetadata(category, resolvedLocale);
  const label = (category.section ?? category.group).label[resolvedLocale];
  return createPageMetadata(resolvedLocale, label, category.path);
}
