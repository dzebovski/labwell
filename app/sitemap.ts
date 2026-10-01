import type { MetadataRoute } from "next";

import { buildSitemap } from "@/lib/metadata-routes";
import { SITE_URL } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(SITE_URL);
}
