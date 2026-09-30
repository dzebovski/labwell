import { existsSync } from "node:fs";
import path from "node:path";

/** Public path of `public/products/{slug}/main.webp`, or undefined when the photo has not been added yet. */
export function mainPhoto(slug: string): string | undefined {
  const file = path.join(process.cwd(), "public", "products", slug, "main.webp");
  return existsSync(file) ? `/products/${slug}/main.webp` : undefined;
}
