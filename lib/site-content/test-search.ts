/**
 * Search and group filter of the test menu (template C1). Pure functions: the
 * client component only holds the query and the selected group.
 *
 * A test that stands in several groups keeps one `id`, so the counter counts unique ids,
 * while every group still lists the test.
 */
export type MenuTest = { id: string; name: string };
export type MenuGroup = { id: string; name: string; tests: MenuTest[] };

export type MenuFilter = { query: string; groupId?: string };

/** Case-insensitive, whitespace-collapsed form used for matching. */
export function normalizeQuery(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

export function isFilterActive(filter: MenuFilter): boolean {
  return normalizeQuery(filter.query) !== "" || Boolean(filter.groupId);
}

/** Number of different tests (by id) in the given groups. */
export function countUniqueTests(groups: MenuGroup[]): number {
  const ids = new Set<string>();
  for (const group of groups) for (const test of group.tests) ids.add(test.id);
  return ids.size;
}

export type MenuResult = {
  /** Groups with at least one matching test; each keeps only the matching tests. */
  groups: MenuGroup[];
  /** Unique matching tests; `null` when no filter is active (the counter is not shown). */
  found: number | null;
};

export function filterMenu(groups: MenuGroup[], filter: MenuFilter): MenuResult {
  const query = normalizeQuery(filter.query);
  if (!query && !filter.groupId) return { groups, found: null };

  const visible = groups
    .filter((group) => !filter.groupId || group.id === filter.groupId)
    .map((group) => ({
      ...group,
      tests: query ? group.tests.filter((test) => normalizeQuery(test.name).includes(query)) : group.tests,
    }))
    .filter((group) => group.tests.length > 0);

  return { groups: visible, found: countUniqueTests(visible) };
}

/** Fills `{count}` in labels such as "Знайдено {count}". */
export function fillCount(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

/** Text put into the contact form by the "test not found" button. */
export function missingTestPrefill(prefill: string | undefined, query: string): string {
  return `${prefill ?? ""}${query.trim()}`;
}
