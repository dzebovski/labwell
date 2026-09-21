import { redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { localizePath } from "@/lib/site-navigation";
type Props = { params: Promise<{ locale: string; slug: string; areaSlug: string }> };
export function generateStaticParams() { return []; }
export default async function LegacyProductAreaPage({ params }: Props) {
  const { locale } = await params;
  redirect(isLocale(locale) ? localizePath(locale, "/products") : "/uk/products");
}
