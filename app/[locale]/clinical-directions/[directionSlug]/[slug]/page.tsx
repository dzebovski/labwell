import { RouteTargetPage } from "@/components/patterns/route-target-page";
import { getRouteParams } from "@/lib/catalog";
import { routeMetadata } from "@/lib/content-route";

/** A clinical page or a section of a direction (/clinical-directions/diabetes-and-metabolism/hba1c-analyzers). */
type Props = { params: Promise<{ locale: string; directionSlug: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getRouteParams("/clinical-directions", ["directionSlug", "slug"]);
}

export async function generateMetadata({ params }: Props) {
  const { locale, directionSlug, slug } = await params;
  return routeMetadata(locale, `/clinical-directions/${directionSlug}/${slug}`);
}

export default async function ClinicalDetailPage({ params }: Props) {
  const { locale, directionSlug, slug } = await params;
  return <RouteTargetPage locale={locale} path={`/clinical-directions/${directionSlug}/${slug}`} />;
}
