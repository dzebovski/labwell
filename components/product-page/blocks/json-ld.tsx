import { serializeJsonLd } from "@/lib/site-content/jsonld";

export function JsonLdScripts({ data }: { data: Array<Record<string, unknown>> }) {
  return data.map((item) => (
    <script
      key={String(item["@type"])}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }}
    />
  ));
}
