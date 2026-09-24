import { ContentDetailPage } from "@/components/patterns/content-detail-page";
import { getClinicalPage, listPages } from "@/lib/catalog";
import { contentPageMetadata, requireContentPage } from "@/lib/content-route";

type Props = { params: Promise<{ locale: string; directionSlug: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listPages("clinical").map((page) => ({
    directionSlug: page.placements[0].group,
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, directionSlug, slug } = await params;
  return contentPageMetadata(locale, getClinicalPage(directionSlug, slug));
}

export default async function ClinicalDetailPage({ params }: Props) {
  const { locale, directionSlug, slug } = await params;
  return <ContentDetailPage {...requireContentPage(locale, getClinicalPage(directionSlug, slug))} />;
}
