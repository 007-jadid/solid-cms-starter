/**
 * DataTable Constants
 * Centralized configuration values and default settings
 */

import type { AsyncOptionsConfig, DataTab, DensityState } from "../types";

// ============================================================================
// Density Configuration
// ============================================================================

export const DENSITY_CLASSES: Record<DensityState, string> = {
  sm: "py-2",
  md: "py-4",
  lg: "py-6",
} as const;

export const DENSITY_OPTIONS: Array<{ value: DensityState; label: string }> = [
  { value: "sm", label: "Compact" },
  { value: "md", label: "Standard" },
  { value: "lg", label: "Comfortable" },
] as const;

export const DEFAULT_DENSITY: DensityState = "md";

// ============================================================================
// Pagination Configuration
// ============================================================================

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGE_NUMBER = 1;

// ============================================================================
// Async Options Configuration
// ============================================================================

export const DEFAULT_ASYNC_CONFIG: Required<
  Omit<AsyncOptionsConfig, "fetchSelectedOptions" | "optionMapper">
> = {
  enabled: true,
  paginationType: "scroll",
  pageSize: 20,
  searchMode: "client",
  searchDebounceMs: 300,
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
  refetchOnWindowFocus: false,
  scrollThreshold: 0.8,
  cacheSelectedOptions: true,
} as const;

// ============================================================================
// Search Configuration
// ============================================================================

export const DEFAULT_SEARCH_DEBOUNCE_MS = 500;

export const DEFAULT_SEARCH_KEY = "search";

// ============================================================================
// Tab Configuration
// ============================================================================

export const DEFAULT_TABS: DataTab[] = [
  { keyName: "active", title: "Active" },
  { keyName: "inActive", title: "In-active" },
];

// ============================================================================
// Virtual Scrolling Configuration
// ============================================================================

export const VIRTUAL_ROW_HEIGHTS: Record<DensityState, number> = {
  sm: 40,
  md: 52,
  lg: 68,
} as const;

export const DEFAULT_VIRTUAL_OVERSCAN = 5;

export const DEFAULT_VIRTUAL_MAX_HEIGHT = "600px";

// ============================================================================
// Query Keys
// ============================================================================

export const QUERY_KEYS = {
  ASYNC_OPTIONS: "async-options",
  SELECTED_OPTIONS: "selected-options",
  SUB_GRID: "sub-grid",
  DATA_TABLE: "data-table",
} as const;
