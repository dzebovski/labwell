import { buildLlmsTxt } from "@/lib/llms";
import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(SITE_URL), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
