import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/patterns/content-detail-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { clinicalPages, getPageByPath } from "@/lib/navigation-content";
import { createPageMetadata } from "@/lib/page-metadata";
import { getCanonicalPlacement } from "@/lib/site-navigation";
type Props = { params: Promise<{ locale: string; directionSlug: string; slug: string }> };
const clinicalDetailPages = clinicalPages.filter((page) => page.canonicalPath.startsWith("/clinical-directions/"));
export function generateStaticParams() { return clinicalDetailPages.map((page) => { const [, , directionSlug, slug] = page.canonicalPath.split("/"); return { directionSlug, slug }; }); }
async function resolve({ params }: Props) { const { locale, directionSlug, slug } = await params; if (!isLocale(locale)) notFound(); const page = getPageByPath(`/clinical-directions/${directionSlug}/${slug}`); const placement = page?.kind === "clinical" ? getCanonicalPlacement(page.id) : undefined; if (!page || !placement) notFound(); return { locale, page, placement }; }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const result = await resolve({ params }); return createPageMetadata(result.locale, result.page.title[result.locale], result.page.description[result.locale], result.page.canonicalPath); }
export default async function ClinicalDetailPage({ params }: Props) { const { locale, page, placement } = await resolve({ params }); const dictionary = await getDictionary(locale); return <ContentDetailPage locale={locale} page={page} placement={placement} labels={{ ...dictionary.pages, breadcrumbs: dictionary.accessibility.breadcrumbs }} />; }
