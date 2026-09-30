/**
 * Editorial placeholders look like `[ТЕЛЕФОН]` or `[політикою конфіденційності]`.
 * Text that contains one is never shown on the page: the row or block is hidden.
 */
export function hasPlaceholder(value: string | undefined | null): boolean {
  return typeof value === "string" && /\[[^\]]+\]/.test(value);
}

/** Returns the value, or undefined when it is empty or still a placeholder. */
export function publishable(value: string | undefined | null): string | undefined {
  return value && !hasPlaceholder(value) ? value : undefined;
}
