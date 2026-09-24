import { ContentDetailPage } from "@/components/patterns/content-detail-page";
import { getBrandPage, listPages } from "@/lib/catalog";
import { contentPageMetadata, requireContentPage } from "@/lib/content-route";

type Props = { params: Promise<{ locale: string; brandSlug: string; topicSlug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listPages("brand")
    .filter((page) => page.slug)
    .map((page) => ({ brandSlug: page.brand.id, topicSlug: page.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, brandSlug, topicSlug } = await params;
  return contentPageMetadata(locale, getBrandPage(brandSlug, topicSlug));
}

export default async function BrandTopicPage({ params }: Props) {
  const { locale, brandSlug, topicSlug } = await params;
  return <ContentDetailPage {...requireContentPage(locale, getBrandPage(brandSlug, topicSlug))} />;
}
