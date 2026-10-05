import type { Metadata } from "next";

import { ClinicalPage } from "@/components/clinical-page/clinical-page";
import { RouteTargetPage } from "@/components/patterns/route-target-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getClinicalPage, getRouteParams } from "@/lib/catalog";
import { hasClinicalContent, loadClinicalContent } from "@/lib/clinical-content";
import { routeMetadata } from "@/lib/content-route";
import { contentMetadata } from "@/lib/site-content/metadata";

/** A clinical page or a section of a direction (/clinical-directions/diabetes-and-metabolism/hba1c-analyzers). */
type Props = { params: Promise<{ locale: string; directionSlug: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getRouteParams("/clinical-directions", ["directionSlug", "slug"]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, directionSlug, slug } = await params;
  const path = `/clinical-directions/${directionSlug}/${slug}`;
  const registryPage = getClinicalPage(directionSlug, slug);
  if (isLocale(locale) && registryPage?.kind === "clinical" && hasClinicalContent(slug)) {
    const page = loadClinicalContent(slug, locale, path);
    return contentMetadata(page.seo, page.url, locale);
  }
  return routeMetadata(locale, path);
}

export default async function ClinicalDetailPage({ params }: Props) {
  const { locale, directionSlug, slug } = await params;
  const path = `/clinical-directions/${directionSlug}/${slug}`;
  const registryPage = getClinicalPage(directionSlug, slug);
  if (isLocale(locale) && registryPage?.kind === "clinical" && hasClinicalContent(slug)) {
    const dictionary = await getDictionary(locale);
    return (
      <ClinicalPage
        page={loadClinicalContent(slug, locale, path)}
        locale={locale}
        labels={{ ...dictionary.productPage, breadcrumbs: dictionary.accessibility.breadcrumbs }}
      />
    );
  }
  return <RouteTargetPage locale={locale} path={path} />;
}
