/**
 * LocalStorage utilities for DataTable
 * Provides type-safe caching with version management
 */

import type { FilterOption } from "../types";

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  DENSITY: "table-density",
  COLUMN_VISIBILITY: "table-column-visibility",
  SELECTED_OPTIONS_PREFIX: "data-table-selected-options-",
  CACHE_VERSION: "v1",
} as const;

// ============================================================================
// Type Definitions
// ============================================================================

interface CachedOption {
  label: string;
  value: string;
}

type DensityState = "sm" | "md" | "lg";

// ============================================================================
// Generic Storage Helpers
// ============================================================================

/**
 * Safely get an item from localStorage
 */
const getStorageItem = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;

  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Safely set an item in localStorage
 */
const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail (quota exceeded, etc.)
  }
};

/**
 * Get raw string from localStorage
 */
const getStorageString = (key: string, fallback: string): string => {
  if (typeof window === "undefined") return fallback;

  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

/**
 * Set raw string in localStorage
 */
const setStorageString = (key: string, value: string): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently fail
  }
};

// ============================================================================
// Density Storage
// ============================================================================

export const densityStorage = {
  get: (): DensityState => getStorageString(STORAGE_KEYS.DENSITY, "md") as DensityState,

  set: (density: DensityState): void => setStorageString(STORAGE_KEYS.DENSITY, density),
};

// ============================================================================
// Column Visibility Storage
// ============================================================================

const getColumnVisibilityKey = (tableId?: string): string =>
  tableId ? `${STORAGE_KEYS.COLUMN_VISIBILITY}-${tableId}` : STORAGE_KEYS.COLUMN_VISIBILITY;

export const columnVisibilityStorage = {
  get: (tableId?: string): Record<string, boolean> | null =>
    getStorageItem<Record<string, boolean> | null>(getColumnVisibilityKey(tableId), null),

  set: (visibility: Record<string, boolean>, tableId?: string): void =>
    setStorageItem(getColumnVisibilityKey(tableId), visibility),
};

// ============================================================================
// Selected Options Cache
// Persists option labels across page reloads
// ============================================================================

const getSelectedOptionsCacheKey = (filterKey: string): string =>
  `${STORAGE_KEYS.SELECTED_OPTIONS_PREFIX}${STORAGE_KEYS.CACHE_VERSION}-${filterKey}`;

export const selectedOptionsCache = {
  /**
   * Get cached options as a Map for O(1) lookup
   */
  get: (filterKey: string): Map<string, CachedOption> => {
    const cached = getStorageItem<CachedOption[]>(getSelectedOptionsCacheKey(filterKey), []);
    return new Map(cached.map((opt) => [opt.value, opt]));
  },

  /**
   * Save options to cache (keeps last 100 to prevent unbounded growth)
   */
  set: (filterKey: string, options: CachedOption[]): void => {
    const trimmed = options.slice(-100);
    setStorageItem(getSelectedOptionsCacheKey(filterKey), trimmed);
  },

  /**
   * Add options to existing cache (merge)
   */
  add: (filterKey: string, newOptions: FilterOption[]): void => {
    const existing = selectedOptionsCache.get(filterKey);

    for (const opt of newOptions) {
      existing.set(opt.value, { label: opt.label, value: opt.value });
    }

    selectedOptionsCache.set(filterKey, Array.from(existing.values()));
  },

  /**
   * Get a single option label from cache
   */
  getLabel: (filterKey: string, value: string): string | undefined => {
    const cached = selectedOptionsCache.get(filterKey);
    return cached.get(value)?.label;
  },
};
