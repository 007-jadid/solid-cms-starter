import type { Component } from "solid-js";
import type { GenericSchema } from "valibot";

// ============================================================================
// Filter Option Types
// ============================================================================

export interface FilterOption {
  label: string;
  value: string;
  icon?: Component<{ class?: string }>;
}

/**
 * Raw option from API before mapping.
 * APIs may return different shapes like {id, name} or {label, value}.
 */
export type RawFilterOption = Record<string, unknown>;

/**
 * Function to transform raw API response items to FilterOption format.
 */
export type OptionMapper = (item: RawFilterOption) => FilterOption;

// ============================================================================
// Async Options Types
// ============================================================================

/**
 * Response shape expected from async options fetch function
 */
export interface AsyncOptionsResponse {
  items: FilterOption[];
  hasNextPage: boolean;
  nextCursor?: string | number;
  totalItems?: number;
}

/**
 * Parameters passed to the async options fetch function
 */
export interface AsyncOptionsFetchParams {
  pageParam: string | number | undefined;
  search: string;
  limit: number;
}

/**
 * Configuration for async options with pagination and search
 */
export interface AsyncOptionsConfig {
  /**
   * Enable/disable async fetching. Defaults to true.
   */
  enabled?: boolean;

  /**
   * How to load more options:
   * - "scroll": Load more when user scrolls near the bottom (infinite scroll)
   * - "click": Show a "Load more" button at the bottom
   * @default "scroll"
   */
  paginationType?: "scroll" | "click";

  /**
   * Number of items to fetch per page
   * @default 20
   */
  pageSize?: number;

  /**
   * Where to perform search:
   * - "client": Filter loaded options in memory (good for small datasets)
   * - "server": Send search query to API (good for large datasets)
   * @default "client"
   */
  searchMode?: "client" | "server";

  /**
   * Debounce delay for server-side search (in milliseconds)
   * @default 300
   */
  searchDebounceMs?: number;

  /**
   * How long data is considered fresh (in milliseconds)
   * @default 300000 (5 minutes)
   */
  staleTime?: number;

  /**
   * How long to keep data in cache after it becomes unused (in milliseconds)
   * @default 1800000 (30 minutes)
   */
  gcTime?: number;

  /**
   * Whether to refetch when window regains focus
   * @default false
   */
  refetchOnWindowFocus?: boolean;

  /**
   * Scroll threshold for triggering next page load (0-1)
   * @default 0.8
   */
  scrollThreshold?: number;

  /**
   * Function to fetch details for selected options by their values.
   */
  fetchSelectedOptions?: (values: string[]) => Promise<FilterOption[]>;

  /**
   * Transform raw API response items to FilterOption format.
   */
  optionMapper?: OptionMapper;

  /**
   * Cache selected options in localStorage so labels persist across page reloads.
   * @default true
   */
  cacheSelectedOptions?: boolean;
}

// ============================================================================
// Filter Field Types
// ============================================================================

export interface DataTableFilterField<TData> {
  label: string;
  value: Extract<keyof TData, string>;
  placeholder?: string;
  /**
   * Filter type:
   * - "select": Dropdown with options (default)
   * - "input": Free text input field
   * @default "select"
   */
  type?: "select" | "input";
  /**
   * Input type when type is "input"
   * @default "text"
   */
  inputType?: "text" | "number" | "date" | "email" | "tel";
  /** Static options for the filter (only for type="select") */
  options?: FilterOption[];
  /**
   * Async function to fetch options from API with pagination support.
   */
  fetchOptions?: (params: AsyncOptionsFetchParams) => Promise<AsyncOptionsResponse>;
  /**
   * Simple async function that returns all options at once.
   * @deprecated Prefer fetchOptions with AsyncOptionsResponse for better performance
   */
  fetchOptionsSimple?: () => Promise<FilterOption[]>;
  /**
   * Configuration for async options (pagination, search, caching)
   */
  asyncConfig?: AsyncOptionsConfig;
  /**
   * Function to fetch details for selected options by their values.
   */
  fetchSelectedOptions?: (values: string[]) => Promise<FilterOption[]>;
  /**
   * Transform raw API response items to FilterOption format.
   */
  optionMapper?: OptionMapper;
  /**
   * Allow multiple selections. Defaults to true.
   */
  multiSelect?: boolean;
  /**
   * Valibot validation schema for input filters.
   */
  validation?: GenericSchema;
}

export interface DataTableAdvancedFilterField {
  label: string;
  value: string;
  options: {
    label: string;
    value: string;
    icon?: Component<{ class?: string }>;
  }[];
}
