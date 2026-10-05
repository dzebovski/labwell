import { DirectionPage } from "@/components/direction-page/direction-page";
import { ContentDetailPage } from "@/components/patterns/content-detail-page";
import { ListingPage } from "@/components/patterns/listing-page";
import { getDictionary } from "@/i18n/dictionaries";
import { getCategoryTrail } from "@/lib/breadcrumbs";
import { getListingBlocks } from "@/lib/catalog";
import { requireRouteTarget } from "@/lib/content-route";
import { getDirectionPageModel } from "@/lib/site-content/directions";
import { crumbLabels } from "@/components/patterns/crumb-labels";

/** Renders whatever lives at a catalog path: a content page or a category listing. */
export async function RouteTargetPage({ locale, path }: { locale: string; path: string }) {
  const { locale: resolvedLocale, target } = requireRouteTarget(locale, path);
  if (target.type === "page") return <ContentDetailPage locale={resolvedLocale} page={target.page} />;

  const { category } = target;
  const dictionary = await getDictionary(resolvedLocale);

  // Groups and directions of the product catalog use template D; clinical directions keep the list.
  if (category.menu === "catalog") {
    const texts = dictionary.directionPage;
    return (
      <DirectionPage
        page={await getDirectionPageModel(category, resolvedLocale)}
        locale={resolvedLocale}
        crumbs={crumbLabels(dictionary)}
        productLabels={{ ...dictionary.productPage, breadcrumbs: dictionary.accessibility.breadcrumbs }}
        labels={{
          consult: texts.consult,
          listDirection: texts.listDirection,
          listGroup: texts.listGroup,
          listDirections: texts.listDirections,
          details: texts.details,
          badgeProduct: texts.badgeProduct,
          badgeGroup: texts.badgeGroup,
          overviewBadge: texts.overviewBadge,
          menuBadge: texts.menuBadge,
          filter: { group: texts.filterLabel, brand: texts.filterBrand, all: texts.filterAll, status: texts.filterStatus },
        }}
      />
    );
  }
  const defaultSectionLabel = dictionary.navigation.otherSolutions;

  return (
    <ListingPage
      locale={resolvedLocale}
      title={(category.section ?? category.group).label[resolvedLocale]}
      trail={getCategoryTrail(category, resolvedLocale)}
      blocks={getListingBlocks(category.menu, resolvedLocale, defaultSectionLabel, category)}
    />
  );
}
