/**
 * Cache Helpers — cacheOps
 *
 * Utilities for `meta.cacheUpdate.updater` that understand both:
 *   1. Paginated data  — ResponseMapperResult<T>  (used by DataTable)
 *   2. Plain arrays    — T[]                      (used by useGet)
 *
 * ─────────────────────────────────────────────────────────────────────────
 * IMPORTANT: cacheUpdate is reliable on page 1 only.
 * On page N (N > 1) the new/updated item doesn't belong in the visible slice,
 * so helpers return the old data unchanged and let `invalidates` handle the
 * eventual refetch.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { ResponseMapperResult } from "~/features/ui/data-table/types";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function isPaginated<T>(data: unknown): data is ResponseMapperResult<T> {
  return (
    data !== null &&
    typeof data === "object" &&
    "items" in (data as object) &&
    "itemPerPage" in (data as object) &&
    "totalItems" in (data as object)
  );
}

function isOnFirstPage<T>(data: ResponseMapperResult<T>): boolean {
  return data.pageNumber === 1;
}

function recalcTotalPage(totalItems: number, itemPerPage: number): number {
  return Math.max(1, Math.ceil(totalItems / itemPerPage));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const cacheOps = {
  /**
   * Prepend a new item at the top of the list.
   *
   * ▸ Maintains page size — if page size is 10, list stays 10 (last item dropped).
   * ▸ Increments totalItems and recalculates totalPage.
   * ▸ On page > 1: returns old data unchanged (item belongs on page 1).
   * ▸ Plain array fallback: simply prepends, no size limit.
   *
   * @example
   *   updater: (old, newUser) => cacheOps.prepend<User>(old, newUser as User)
   */
  prepend<T>(old: unknown, newItem: T): unknown {
    if (isPaginated<T>(old)) {
      if (!isOnFirstPage(old)) return old;

      const items = [newItem, ...old.items].slice(0, old.itemPerPage);
      const totalItems = old.totalItems + 1;

      return {
        ...old,
        items,
        totalItems,
        totalPage: recalcTotalPage(totalItems, old.itemPerPage),
      } satisfies ResponseMapperResult<T>;
    }

    if (Array.isArray(old)) {
      return [newItem, ...old] as T[];
    }

    return old;
  },

  /**
   * Replace the first item in the list that satisfies `matcher`.
   *
   * ▸ On page > 1: still updates in place — the updated item may be visible.
   * ▸ If no item matches, returns old data unchanged.
   * ▸ Does NOT change totalItems or totalPage.
   *
   * @example
   *   updater: (old, updated) =>
   *     cacheOps.updateItem<User>((u) => u.id === (updated as User).id, old, updated as User)
   */
  updateItem<T>(matcher: (item: T) => boolean, old: unknown, updated: T): unknown {
    if (isPaginated<T>(old)) {
      const idx = old.items.findIndex(matcher);
      if (idx === -1) return old;

      const items = [...old.items];
      items[idx] = updated;

      return { ...old, items } satisfies ResponseMapperResult<T>;
    }

    if (Array.isArray(old)) {
      return (old as T[]).map((item) => (matcher(item) ? updated : item));
    }

    return old;
  },

  /**
   * Remove the first item in the list that satisfies `matcher`.
   *
   * ▸ Decrements totalItems and recalculates totalPage.
   * ▸ Works on any page — the deleted item may be on the current page.
   * ▸ If no item matches, returns old data unchanged.
   *
   * NOTE: After removal the current page may appear short (e.g. 9 of 10 items).
   * Pair with `invalidates` to trigger a background refetch that fills the gap.
   *
   * @example
   *   updater: (old, _) =>
   *     cacheOps.removeItem<User>((u) => u.id === deletedId, old)
   */
  removeItem<T>(matcher: (item: T) => boolean, old: unknown): unknown {
    if (isPaginated<T>(old)) {
      const idx = old.items.findIndex(matcher);
      if (idx === -1) return old;

      const items = old.items.filter((_, i) => i !== idx);
      const totalItems = Math.max(0, old.totalItems - 1);

      return {
        ...old,
        items,
        totalItems,
        totalPage: recalcTotalPage(totalItems, old.itemPerPage),
      } satisfies ResponseMapperResult<T>;
    }

    if (Array.isArray(old)) {
      return (old as T[]).filter((item) => !matcher(item));
    }

    return old;
  },
};
