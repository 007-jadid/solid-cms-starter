/**
 * TanStack Query — typed `meta` augmentation
 *
 * Extends TanStack's `Register` interface so that `meta` on every
 * `useMutation` / `usePost` / `usePut` / `usePatch` / `useDelete` call
 * is fully typed and autocompleted — no casting needed anywhere.
 *
 * Import this file once (done in query-client.ts) and the types are
 * available globally via module augmentation.
 */

import type { ApiEndpointUrl } from "./endpoints";

declare module "@tanstack/solid-query" {
  interface Register {
    mutationMeta: {
      /**
       * Scenario 2 — Invalidate queries after mutation succeeds.
       *
       * TanStack will refetch every **active** query whose key contains
       * one of these URLs. Inactive queries are marked stale and refetch
       * on next access.
       *
       * Supports partial/prefix matching — `API_ENDPOINTS.USER.LIST`
       * (`'/api/users'`) also invalidates `'/api/users/123'` etc.
       *
       * @example
       *   meta: { invalidates: [API_ENDPOINTS.USER.LIST] }
       *   meta: { invalidates: [API_ENDPOINTS.USER.LIST, API_ENDPOINTS.DASHBOARD.STATS] }
       */
      invalidates?: ApiEndpointUrl[];

      /**
       * Scenario 1 — Update the cache directly without a refetch.
       *
       * Applies `updater` to every cached query whose key contains `resource`.
       * Use `cacheOps` helpers from `~/features/api/cache-helpers` for
       * paginated-aware updates (prepend / updateItem / removeItem).
       *
       * IMPORTANT: for paginated lists, this is reliable on page 1 only.
       * Pair with `invalidates` to resync other pages in the background.
       *
       * @example
       *   import { cacheOps } from '~/features/api/cache-helpers';
       *
       *   // Create — new item at top, page size maintained
       *   meta: {
       *     cacheUpdate: {
       *       resource: API_ENDPOINTS.USER.LIST,
       *       updater: (old, newUser) => cacheOps.prepend<User>(old, newUser as User),
       *     },
       *   }
       *
       *   // Update — replace matching item
       *   meta: {
       *     cacheUpdate: {
       *       resource: API_ENDPOINTS.USER.LIST,
       *       updater: (old, updated) =>
       *         cacheOps.updateItem<User>((u) => u.id === (updated as User).id, old, updated as User),
       *     },
       *   }
       *
       *   // Delete — remove matching item
       *   meta: {
       *     cacheUpdate: {
       *       resource: API_ENDPOINTS.USER.LIST,
       *       updater: (old, _) =>
       *         cacheOps.removeItem<User>((u) => u.id === deletedId, old),
       *     },
       *   }
       */
      cacheUpdate?: {
        resource: ApiEndpointUrl;
        updater: (oldData: unknown, response: unknown) => unknown;
      };
    };
  }
}
