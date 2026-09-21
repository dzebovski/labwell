import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/patterns/content-detail-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { brandPages, getPageByPath } from "@/lib/navigation-content";
import { createPageMetadata } from "@/lib/page-metadata";
import { getCanonicalPlacement } from "@/lib/site-navigation";
type Props = { params: Promise<{ locale: string; brandSlug: string; topicSlug: string }> };
const topicPages = brandPages.filter((page) => page.canonicalPath.split("/").length === 4);
export function generateStaticParams() { return topicPages.map((page) => { const [, , brandSlug, topicSlug] = page.canonicalPath.split("/"); return { brandSlug, topicSlug }; }); }
async function resolve({ params }: Props) { const { locale, brandSlug, topicSlug } = await params; if (!isLocale(locale)) notFound(); const page = getPageByPath(`/brands/${brandSlug}/${topicSlug}`); const placement = page?.kind === "brand" ? getCanonicalPlacement(page.id) : undefined; if (!page || !placement) notFound(); return { locale, page, placement }; }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const result = await resolve({ params }); return createPageMetadata(result.locale, result.page.title[result.locale], result.page.description[result.locale], result.page.canonicalPath); }
export default async function BrandTopicPage({ params }: Props) { const { locale, page, placement } = await resolve({ params }); const dictionary = await getDictionary(locale); return <ContentDetailPage locale={locale} page={page} placement={placement} labels={{ ...dictionary.pages, breadcrumbs: dictionary.accessibility.breadcrumbs }} />; }
