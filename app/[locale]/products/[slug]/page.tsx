import { ContentDetailPage } from "@/components/patterns/content-detail-page";
import { getProduct, listPages } from "@/lib/catalog";
import { contentPageMetadata, requireContentPage } from "@/lib/content-route";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listPages("product").map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return contentPageMetadata(locale, getProduct(slug));
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  return <ContentDetailPage {...requireContentPage(locale, getProduct(slug))} />;
}
