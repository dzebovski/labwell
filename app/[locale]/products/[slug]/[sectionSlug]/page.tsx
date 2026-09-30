import { RouteTargetPage } from "@/components/patterns/route-target-page";
import { getRouteParams } from "@/lib/catalog";
import { routeMetadata } from "@/lib/content-route";

/** A catalog section (/products/equipment/biochemistry). */
type Props = { params: Promise<{ locale: string; slug: string; sectionSlug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getRouteParams("/products", ["slug", "sectionSlug"]);
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug, sectionSlug } = await params;
  return routeMetadata(locale, `/products/${slug}/${sectionSlug}`);
}

export default async function CatalogSectionPage({ params }: Props) {
  const { locale, slug, sectionSlug } = await params;
  return <RouteTargetPage locale={locale} path={`/products/${slug}/${sectionSlug}`} />;
}
