import { RouteTargetPage } from "@/components/patterns/route-target-page";
import { getRouteParams } from "@/lib/catalog";
import { routeMetadata } from "@/lib/content-route";

type Props = { params: Promise<{ locale: string; brandSlug: string; topicSlug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getRouteParams("/brands", ["brandSlug", "topicSlug"]);
}

export async function generateMetadata({ params }: Props) {
  const { locale, brandSlug, topicSlug } = await params;
  return routeMetadata(locale, `/brands/${brandSlug}/${topicSlug}`);
}

export default async function BrandTopicPage({ params }: Props) {
  const { locale, brandSlug, topicSlug } = await params;
  return <RouteTargetPage locale={locale} path={`/brands/${brandSlug}/${topicSlug}`} />;
}
