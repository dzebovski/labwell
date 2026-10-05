import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomePage } from "@/components/home-page/home-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getHomeMetadata, getHomeModel } from "@/lib/site-content/home-page";

type HomePageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? getHomeMetadata(locale) : {};
}

export default async function Page({ params }: HomePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  const texts = dictionary.homePage;

  return (
    <HomePage
      model={await getHomeModel(locale)}
      labels={{
        consult: texts.consult,
        official: texts.official,
        startHeading: texts.startHeading,
        allCatalog: texts.allCatalog,
        brandsHeading: texts.brandsHeading,
        heroPhotos: texts.heroPhotos,
      }}
      productLabels={{ ...dictionary.productPage, breadcrumbs: dictionary.accessibility.breadcrumbs }}
    />
  );
}
