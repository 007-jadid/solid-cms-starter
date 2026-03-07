/**
 * DataTable Utilities
 * Centralized exports for utility functions
 */

// Constants and configuration
export {
  DEFAULT_ASYNC_CONFIG,
  DEFAULT_DENSITY,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SEARCH_DEBOUNCE_MS,
  DEFAULT_SEARCH_KEY,
  DEFAULT_TABS,
  DEFAULT_VIRTUAL_MAX_HEIGHT,
  DEFAULT_VIRTUAL_OVERSCAN,
  DENSITY_CLASSES,
  DENSITY_OPTIONS,
  PAGE_SIZE_OPTIONS,
  QUERY_KEYS,
  VIRTUAL_ROW_HEIGHTS,
} from "./constants";
// Filter utilities
export {
  areFiltersEqual,
  arraysShallowEqual,
  buildFilterParams,
  clearAllFilters,
  clearFilterValues,
  countActiveFilters,
  filterOptionsBySearch,
  findChangedFilter,
  findOptionByValue,
  getSelectedLabels,
  isValueSelected,
  mapOptions,
  parseFilterParam,
  toggleFilterValue,
} from "./filters";

// Query utilities (shared between useDataTableSource and useInfiniteTableSource)
export { buildQueryString, defaultResponseMapper } from "./query-utils";
// Storage utilities
export {
  columnVisibilityStorage,
  densityStorage,
  STORAGE_KEYS,
  selectedOptionsCache,
} from "./storage";

/**
 * Get a nested value from an object using dot notation path.
 * @example getNestedValue({ a: { b: 1 } }, 'a.b') // 1
 */
export function getNestedValue<T = unknown>(obj: unknown, path: string, defaultValue?: T): T {
  const keys = path.split(".");
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue as T;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return (result === undefined ? defaultValue : result) as T;
}
