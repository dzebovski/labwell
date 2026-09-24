import { RouteTargetPage } from "@/components/patterns/route-target-page";
import { getRouteParams } from "@/lib/catalog";
import { routeMetadata } from "@/lib/content-route";

/** A clinical direction (/clinical-directions/oncology). */
type Props = { params: Promise<{ locale: string; directionSlug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getRouteParams("/clinical-directions", ["directionSlug"]);
}

export async function generateMetadata({ params }: Props) {
  const { locale, directionSlug } = await params;
  return routeMetadata(locale, `/clinical-directions/${directionSlug}`);
}

export default async function ClinicalDirectionPage({ params }: Props) {
  const { locale, directionSlug } = await params;
  return <RouteTargetPage locale={locale} path={`/clinical-directions/${directionSlug}`} />;
}
