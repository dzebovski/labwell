import { isLocale, locales } from "@/i18n/config";
import { listPublicPaths } from "@/lib/metadata-routes";
import { renderOgCard } from "@/lib/og/card";
import { getOgSubject } from "@/lib/og/subject";

/** Open Graph card of a page, e.g. /uk/og/products/maglumi-x8.png; the home page is /uk/og/index.png. */
type Context = { params: Promise<{ locale: string; path?: string[] }> };

export const dynamicParams = false;

/** `/` → `["index.png"]`, `/products/x` → `["products", "x.png"]`. */
function toSegments(sitePath: string): string[] {
  const segments = sitePath === "/" ? ["index"] : sitePath.split("/").filter(Boolean);
  return [...segments.slice(0, -1), `${segments.at(-1)}.png`];
}

export function generateStaticParams() {
  return locales.flatMap((locale) => listPublicPaths().map((sitePath) => ({ locale, path: toSegments(sitePath) })));
}

export async function GET(_request: Request, { params }: Context) {
  const { locale, path = [] } = await params;
  const file = path.at(-1);
  if (!isLocale(locale) || !file?.endsWith(".png")) return new Response("Not found", { status: 404 });

  const segments = [...path.slice(0, -1), file.slice(0, -".png".length)];
  const sitePath = segments.length === 1 && segments[0] === "index" ? "/" : `/${segments.join("/")}`;
  if (!listPublicPaths().includes(sitePath)) return new Response("Not found", { status: 404 });

  return renderOgCard(await getOgSubject(locale, sitePath));
}
