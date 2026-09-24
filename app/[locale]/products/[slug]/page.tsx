import { RouteTargetPage } from "@/components/patterns/route-target-page";
import { getRouteParams } from "@/lib/catalog";
import { routeMetadata } from "@/lib/content-route";

/** A product (/products/maglumi-x10) or a catalog group (/products/equipment). */
type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getRouteParams("/products", ["slug"]);
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return routeMetadata(locale, `/products/${slug}`);
}

export default async function ProductOrGroupPage({ params }: Props) {
  const { locale, slug } = await params;
  return <RouteTargetPage locale={locale} path={`/products/${slug}`} />;
}
