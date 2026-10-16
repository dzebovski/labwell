/**
 * Editorial placeholders look like `[ТЕЛЕФОН]` or `[політикою конфіденційності]`.
 * Text that contains one is never shown on the page: the row or block is hidden.
 */
export function hasPlaceholder(value: string | undefined | null): boolean {
  // `[label](/path)` is a link, not a placeholder.
  return typeof value === "string" && /\[[^\]]+\](?!\()/.test(value);
}

export type LinkedText = { before: string; link?: { label: string; href: string }; after: string };

/**
 * Text with at most one Markdown-style link, e.g. the form consent
 * "… you agree to the [privacy policy](/privacy)." Undefined while a placeholder remains.
 */
export function linkedText(value: string | undefined | null): LinkedText | undefined {
  const text = publishable(value);
  if (!text) return undefined;
  const match = /\[([^\]]+)\]\(([^)\s]+)\)/.exec(text);
  if (!match) return { before: text, after: "" };
  return {
    before: text.slice(0, match.index),
    link: { label: match[1], href: match[2] },
    after: text.slice(match.index + match[0].length),
  };
}

/** Returns the value, or undefined when it is empty or still a placeholder. */
export function publishable(value: string | undefined | null): string | undefined {
  return value && !hasPlaceholder(value) ? value : undefined;
}
