"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { LabLink } from "@/components/ui/primitives";
import {
  fillCount,
  filterMenu,
  isFilterActive,
  missingTestPrefill,
  type MenuGroup,
} from "@/lib/site-content/test-search";
import type { TestMenuPageModel } from "@/lib/site-content/menu-model";

import styles from "../product-page.module.css";
import t from "../templates.module.css";
import { prefillContactMessage } from "./prefill";

/**
 * Test list of template C1 (C1.2 search and group filter, C1.3 groups).
 *
 * Every group and test name is rendered on the server (the first render has no filter), so search
 * engines and visitors without JavaScript get the whole menu. The controls only narrow that list.
 * The counter ("Found N") counts unique tests by id and is shown only while a search or a filter is active.
 */
export function TestMenu({
  groups,
  search,
  labels,
  contactAvailable,
}: {
  groups: MenuGroup[];
  search?: NonNullable<TestMenuPageModel["search"]>;
  labels: { groupFilter: string };
  /** Without the contact block there is nothing to scroll to. */
  contactAvailable: boolean;
}) {
  const [query, setQuery] = useState("");
  const [groupId, setGroupId] = useState<string | undefined>();
  const inputId = useId();

  // Clinical pages link directly to a menu group. Select that group while keeping
  // the unfiltered list in the server HTML for search engines and no-JS visitors.
  useEffect(() => {
    function selectHashGroup() {
      const group = /^#group-([a-z0-9-]+)$/.exec(window.location.hash)?.[1];
      if (group && groups.some((item) => item.id === group)) setGroupId(group);
    }
    selectHashGroup();
    window.addEventListener("hashchange", selectHashGroup);
    return () => window.removeEventListener("hashchange", selectHashGroup);
  }, [groups]);

  const active = isFilterActive({ query, groupId });
  const result = useMemo(() => filterMenu(groups, { query, groupId }), [groups, query, groupId]);
  const empty = active && result.groups.length === 0;

  function reset() {
    setQuery("");
    setGroupId(undefined);
  }

  return (
    <>
      {search ? (
        <section className={t.searchBlock} aria-label={search.searchLabel}>
          <div className={`${styles.card} ${t.searchCard}`}>
            <div className={t.searchRow}>
              <label className={t.searchField} htmlFor={inputId}>
                <Search size={20} aria-hidden="true" />
                <span className="sr-only">{search.searchLabel}</span>
                <input
                  id={inputId}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={search.placeholder}
                  autoComplete="off"
                  spellCheck={false}
                  className={t.searchInput}
                />
              </label>
              {/* Live region: announces the number when it changes; absent without a filter. */}
              <p className={t.found} role="status">
                {result.found !== null ? (
                  <strong>{fillCount(search.foundLabel, result.found)}</strong>
                ) : null}
              </p>
              {active ? (
                <button type="button" className={t.resetButton} onClick={reset}>
                  {search.resetLabel}
                </button>
              ) : null}
            </div>

            <div role="group" aria-label={labels.groupFilter} className={t.groupChips}>
              <button
                type="button"
                className={t.groupChip}
                aria-pressed={!groupId}
                onClick={() => setGroupId(undefined)}
              >
                {search.allGroupsLabel}
              </button>
              {groups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className={t.groupChip}
                  aria-pressed={groupId === group.id}
                  onClick={() => setGroupId(groupId === group.id ? undefined : group.id)}
                >
                  {group.name}
                  <span className={t.groupChipCount}>{group.tests.length}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={t.groupsBlock} aria-label={search?.allGroupsLabel}>
        {empty && search ? (
          <div className={t.empty}>
            <strong className={t.emptyTitle}>{search.empty.title}</strong>
            <span className={t.emptyText}>{search.empty.text}</span>
            {contactAvailable ? (
              <LabLink
                href="#contact"
                variant="button-primary"
                size="lg"
                onClick={() => prefillContactMessage(missingTestPrefill(search.messagePrefill, query))}
              >
                {search.empty.ctaLabel}
              </LabLink>
            ) : null}
          </div>
        ) : (
          <div className={t.groups}>
            {result.groups.map((group) => (
              <section key={group.id} id={`group-${group.id}`} className={`${styles.card} ${t.group}`} aria-labelledby={`group-${group.id}-title`}>
                <div className={t.groupHead}>
                  <h2 id={`group-${group.id}-title`} className={t.groupTitle}>
                    {group.name}
                  </h2>
                  {search ? (
                    <span className={t.groupCount}>{fillCount(search.groupCountLabel, group.tests.length)}</span>
                  ) : null}
                </div>
                <ul className={t.tests}>
                  {group.tests.map((test) => (
                    <li key={test.id} className={t.test}>
                      {test.name}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
