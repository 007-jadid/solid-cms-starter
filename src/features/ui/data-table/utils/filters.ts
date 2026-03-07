/**
 * Filter Utility Functions
 * Pure functional helpers for filter operations
 */

import type { FilterOption, OptionMapper } from "../types";

// ============================================================================
// Filter Value Operations
// ============================================================================

/**
 * Toggle a value in a filter selection set
 * Returns null if the result is empty (for URL state cleanup)
 */
export const toggleFilterValue = (
  currentValues: string[] | null,
  value: string,
  multiSelect: boolean = true,
): string[] | null => {
  const values = currentValues ?? [];
  const isSelected = values.includes(value);

  if (multiSelect) {
    const newValues = isSelected ? values.filter((v) => v !== value) : [...values, value];
    return newValues.length > 0 ? newValues : null;
  }

  // Single select: toggle off if same, otherwise replace
  return isSelected ? null : [value];
};

/**
 * Clear all filter values
 */
export const clearFilterValues = (): null => null;

/**
 * Check if a value is selected in a filter
 */
export const isValueSelected = (values: string[] | null | undefined, value: string): boolean =>
  values?.includes(value) ?? false;

/**
 * Count active filters from a filter record
 */
export const countActiveFilters = (
  filters: Record<string, string[] | null> | null | undefined,
): number => {
  if (!filters) return 0;

  return Object.values(filters).filter((v) => Array.isArray(v) && v.length > 0).length;
};

/**
 * Create cleared filters object from existing filters
 */
export const clearAllFilters = (filters: Record<string, string[] | null>): Record<string, null> =>
  Object.keys(filters).reduce((acc, key) => ({ ...acc, [key]: null }), {} as Record<string, null>);

// ============================================================================
// Option Operations
// ============================================================================

/**
 * Apply option mapper to transform raw API items to FilterOption format
 */
export const mapOptions = (items: FilterOption[], mapper?: OptionMapper): FilterOption[] => {
  if (!mapper) return items;
  return items.map((item) => mapper(item as unknown as Record<string, unknown>));
};

/**
 * Filter options by search term (client-side)
 */
export const filterOptionsBySearch = (
  options: FilterOption[],
  searchTerm: string,
): FilterOption[] => {
  if (!searchTerm) return options;

  const lowerSearch = searchTerm.toLowerCase();
  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(lowerSearch) ||
      option.value.toLowerCase().includes(lowerSearch),
  );
};

/**
 * Find option by value
 */
export const findOptionByValue = (
  options: FilterOption[],
  value: string,
): FilterOption | undefined => options.find((opt) => opt.value === value);

/**
 * Get labels for selected values
 */
export const getSelectedLabels = (options: FilterOption[], selectedValues: string[]): string[] =>
  selectedValues
    .map((value) => findOptionByValue(options, value)?.label)
    .filter((label): label is string => label !== undefined);

// ============================================================================
// URL Param Helpers
// ============================================================================

/**
 * Build URL search params from filter values
 * Skips null/empty values
 */
export const buildFilterParams = (
  filters: Record<string, string[] | null>,
): Record<string, string> => {
  const params: Record<string, string> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      params[key] = value.join(",");
    }
  });

  return params;
};

/**
 * Parse comma-separated string to array
 */
export const parseFilterParam = (param: string | null): string[] | null => {
  if (!param) return null;
  const values = param.split(",").filter(Boolean);
  return values.length > 0 ? values : null;
};

// ============================================================================
// Filter Comparison
// ============================================================================

/**
 * Check if two filter arrays are equal
 */
export const areFiltersEqual = (
  a: string[] | null | undefined,
  b: string[] | null | undefined,
): boolean => {
  const arrA = a ?? [];
  const arrB = b ?? [];

  if (arrA.length !== arrB.length) return false;
  return JSON.stringify([...arrA].sort()) === JSON.stringify([...arrB].sort());
};

/**
 * Find which filter changed between two filter states
 */
export const findChangedFilter = (
  prev: Record<string, string[] | null>,
  next: Record<string, string[] | null>,
): {
  key: string;
  oldValue: string[] | null;
  newValue: string[] | null;
} | null => {
  const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)]);

  for (const key of allKeys) {
    if (!areFiltersEqual(prev[key], next[key])) {
      return {
        key,
        oldValue: prev[key] ?? null,
        newValue: next[key] ?? null,
      };
    }
  }

  return null;
};

/**
 * Shallow comparison of two string arrays.
 * More performant than JSON.stringify comparison.
 */
export const arraysShallowEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};
