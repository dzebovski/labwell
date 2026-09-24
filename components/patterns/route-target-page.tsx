import { ContentDetailPage } from "@/components/patterns/content-detail-page";
import { ListingPage } from "@/components/patterns/listing-page";
import { getDictionary } from "@/i18n/dictionaries";
import { getCategoryBreadcrumbs, getListingBlocks } from "@/lib/catalog";
import { requireRouteTarget } from "@/lib/content-route";

/** Renders whatever lives at a catalog path: a content page or a category listing. */
export async function RouteTargetPage({ locale, path }: { locale: string; path: string }) {
  const { locale: resolvedLocale, target } = requireRouteTarget(locale, path);
  if (target.type === "page") return <ContentDetailPage locale={resolvedLocale} page={target.page} />;

  const { category } = target;
  const dictionary = await getDictionary(resolvedLocale);
  const defaultSectionLabel =
    category.menu === "catalog" ? dictionary.navigation.portfolio : dictionary.navigation.otherSolutions;

  return (
    <ListingPage
      locale={resolvedLocale}
      title={(category.section ?? category.group).label[resolvedLocale]}
      breadcrumbs={getCategoryBreadcrumbs(category, resolvedLocale, dictionary.pages)}
      blocks={getListingBlocks(category.menu, resolvedLocale, defaultSectionLabel, category)}
    />
  );
}
