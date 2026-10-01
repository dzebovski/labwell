import type { MetadataRoute } from "next";

import { buildRobots } from "@/lib/metadata-routes";
import { SITE_URL } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return buildRobots(SITE_URL);
}
