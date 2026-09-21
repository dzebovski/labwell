import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentDetailPage } from "@/components/patterns/content-detail-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { brandPages, getPageByPath } from "@/lib/navigation-content";
import { createPageMetadata } from "@/lib/page-metadata";
import { getCanonicalPlacement } from "@/lib/site-navigation";

type Props = {
  params: Promise<{ locale: string; brandSlug: string }>;
};

const aboutPages = brandPages.filter(
  (page) => page.canonicalPath.split("/").length === 3,
);

export function generateStaticParams() {
  return aboutPages.map((page) => ({
    brandSlug: page.canonicalPath.split("/").at(-1)!,
  }));
}

async function resolve({ params }: Props) {
  const { locale, brandSlug } = await params;

  if (!isLocale(locale)) notFound();

  const page = getPageByPath(`/brands/${brandSlug}`);
  const placement =
    page?.kind === "brand" ? getCanonicalPlacement(page.id) : undefined;

  if (!page || !placement) notFound();

  return { locale, page, placement };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await resolve({ params });

  return createPageMetadata(
    result.locale,
    result.page.title[result.locale],
    result.page.description[result.locale],
    result.page.canonicalPath,
  );
}

export default async function BrandAboutPage({ params }: Props) {
  const { locale, page, placement } = await resolve({ params });
  const dictionary = await getDictionary(locale);

  return (
    <ContentDetailPage
      locale={locale}
      page={page}
      placement={placement}
      labels={{
        ...dictionary.pages,
        breadcrumbs: dictionary.accessibility.breadcrumbs,
      }}
    />
  );
}
