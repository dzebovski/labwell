import { ContentDetailPage } from "@/components/patterns/content-detail-page";
import { getBrandPage, listPages } from "@/lib/catalog";
import { contentPageMetadata, requireContentPage } from "@/lib/content-route";

type Props = { params: Promise<{ locale: string; brandSlug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listPages("brand")
    .filter((page) => !page.slug)
    .map((page) => ({ brandSlug: page.brand.id }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, brandSlug } = await params;
  return contentPageMetadata(locale, getBrandPage(brandSlug));
}

export default async function BrandOverviewPage({ params }: Props) {
  const { locale, brandSlug } = await params;
  return <ContentDetailPage {...requireContentPage(locale, getBrandPage(brandSlug))} />;
}
