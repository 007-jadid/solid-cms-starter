/**
 * API Endpoints Registry
 *
 * Single source of truth for all API endpoint URLs.
 * ─────────────────────────────────────────────────
 * CONVENTIONS (follow these when adding a new resource group):
 *
 *  ▸ Static strings  → list, create, bulk endpoints
 *    e.g.  LIST:   '/api/users'
 *          CREATE: '/api/users'
 *
 *  ▸ Functions       → parameterized endpoints (detail, update, delete)
 *    e.g.  DETAIL: (id: string) => `/api/users/${id}`
 *
 *  ▸ Group name      → SCREAMING_SNAKE by resource noun (USER, ROLE, ORDER …)
 *  ▸ Key name        → SCREAMING_SNAKE verb/noun (LIST, CREATE, DETAIL …)
 *
 * The `ApiEndpointUrl` type is automatically derived from this object.
 * It only includes static string values — functions are excluded.
 * Use it to type `meta.invalidates` and `meta.cacheUpdate.resource`.
 * ─────────────────────────────────────────────────
 */

// ---------------------------------------------------------------------------
// Shape contract — enforced via `satisfies` below
// ---------------------------------------------------------------------------

type EndpointValue = string | ((...args: string[]) => string);

type ResourceGroup = Record<string, EndpointValue>;

type EndpointRegistry = Record<string, ResourceGroup>;

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const API_ENDPOINTS = {
  USER: {
    LIST:   "/api/users",
    CREATE: "/api/users",
    DETAIL: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },
  // ── add more resource groups here ──────────────────────────────────────
} as const satisfies EndpointRegistry;

// ---------------------------------------------------------------------------
// Derived types
// ---------------------------------------------------------------------------

/**
 * Recursively extracts all static string leaf values from the registry.
 * Functions (parameterised endpoints) are excluded.
 */
type ExtractStaticUrls<T> =
  T extends string
    ? T
    : T extends (...args: string[]) => string
      ? never
      : { [K in keyof T]: ExtractStaticUrls<T[K]> }[keyof T];

/**
 * Union of every static endpoint URL in the registry.
 *
 * @example
 *   // '/api/users' | ...future static URLs
 *   meta: { invalidates: [API_ENDPOINTS.USER.LIST] }  // ✅ typed + autocomplete
 *   meta: { invalidates: [API_ENDPOINTS.USER.DETAIL]  } // ❌ compile error (function)
 *   meta: { invalidates: ['/api/typo'] }              // ❌ compile error (unknown URL)
 */
export type ApiEndpointUrl = ExtractStaticUrls<typeof API_ENDPOINTS>;
