import { RouteTargetPage } from "@/components/patterns/route-target-page";
import { getRouteParams } from "@/lib/catalog";
import { routeMetadata } from "@/lib/content-route";

type Props = { params: Promise<{ locale: string; brandSlug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getRouteParams("/brands", ["brandSlug"]);
}

export async function generateMetadata({ params }: Props) {
  const { locale, brandSlug } = await params;
  return routeMetadata(locale, `/brands/${brandSlug}`);
}

export default async function BrandOverviewPage({ params }: Props) {
  const { locale, brandSlug } = await params;
  return <RouteTargetPage locale={locale} path={`/brands/${brandSlug}`} />;
}
