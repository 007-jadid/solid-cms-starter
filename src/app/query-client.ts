import { MutationCache, QueryClient } from "@tanstack/solid-query";

// Load typed meta augmentation (no runtime effect — types only)
import "~/features/api/query-meta";

// ---------------------------------------------------------------------------
// URL segment matching
// ---------------------------------------------------------------------------

/**
 * Safe segment-aware URL match.
 *
 * Ensures '/api/users' matches:
 *   ✅  '/api/users'          (exact)
 *   ✅  '/api/users/123'      (child path)
 *   ✅  '/api/users?page=1'   (with query string)
 *
 * Does NOT match:
 *   ❌  '/api/users-legacy'   (different resource)
 */
function urlMatches(cacheKey: unknown, url: string): boolean {
  if (typeof cacheKey !== "string") return false;
  return (
    cacheKey === url ||
    cacheKey.startsWith(`${url}/`) ||
    cacheKey.startsWith(`${url}?`)
  );
}

/**
 * Returns true if any element of a queryKey matches the given URL.
 * Works across all key structures used in this codebase:
 *   ['/api/users']                                — useGet
 *   ['data-table', '/api/users', { ...params }]   — DataTable
 *   ['sub-grid', '/api/users/123/orders']          — SubGrid
 */
function queryKeyContainsUrl(queryKey: readonly unknown[], url: string): boolean {
  return queryKey.some((k) => urlMatches(k, url));
}

// ---------------------------------------------------------------------------
// QueryClient
// ---------------------------------------------------------------------------

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    /**
     * Global mutation success handler.
     *
     * Fires after EVERY mutation in the app. Reads `meta.cacheUpdate` and
     * `meta.invalidates` to decide what to do with the query cache.
     *
     * All mutation hooks (usePost / usePut / usePatch / useDelete) are
     * unchanged — all cache logic lives here in one place.
     */
    onSuccess: (data, _variables, _context, mutation) => {
      const { cacheUpdate, invalidates } = mutation.meta ?? {};

      // ── Scenario 1: direct cache update (instant UI, no refetch) ─────────
      //
      // Finds every cached query whose key contains `resource` URL,
      // then applies `updater(oldData, serverResponse)` to each.
      // Use cacheOps helpers (prepend / updateItem / removeItem) for
      // paginated-aware updates.
      if (cacheUpdate) {
        const { resource, updater } = cacheUpdate;

        const matched = queryClient.getQueriesData<unknown>({
          predicate: (q) => queryKeyContainsUrl(q.queryKey, resource),
        });

        for (const [key, oldData] of matched) {
          queryClient.setQueryData(key, updater(oldData, data));
        }
      }

      // ── Scenario 2: invalidate → TanStack refetches active queries ────────
      //
      // Active queries (currently mounted) refetch immediately.
      // Inactive queries are marked stale and refetch on next access.
      if (invalidates?.length) {
        for (const url of invalidates) {
          queryClient.invalidateQueries({
            predicate: (q) => queryKeyContainsUrl(q.queryKey, url),
          });
        }
      }
    },
  }),

  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});
