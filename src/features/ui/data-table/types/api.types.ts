// ============================================================================
// API Response Types
// ============================================================================

export interface DefaultApiResponse<TData> {
  data: {
    items: TData[];
    itemPerPage: number;
    pageNumber: number;
    totalItems: number;
    totalPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  status: boolean;
  message: string;
}

export type ApiResponse<TData> = DefaultApiResponse<TData> | Record<string, unknown>;

export type PaginationResponse<TData> = DefaultApiResponse<TData>;

// ============================================================================
// API Parameter Types
// ============================================================================

export interface SortingParam {
  id: string;
  desc: boolean;
}

export interface ColumnFilterParam {
  id: string;
  value: unknown;
}

export interface PaginationParams {
  pageNumber: number;
  itemsPerPage: number;
  search?: string;
  sorting?: SortingParam[];
  columnFilters?: ColumnFilterParam[];
  tab?: string;
}

export interface FetcherOptions {
  pageNumber: number;
  itemsPerPage: number;
  search?: string;
  sorting?: SortingParam[];
  columnFilters?: ColumnFilterParam[];
  tab?: string;
  queryKey?: unknown[];
  signal?: AbortSignal;
}

// ============================================================================
// Query Parser Types
// ============================================================================

/**
 * All table state passed into a queryParser function.
 * The parser returns a raw query string (without leading `?`).
 */
export interface QueryParserInput {
  pageNumber: number;
  itemsPerPage: number;
  search?: string;
  sorting?: SortingParam[];
  columnFilters?: ColumnFilterParam[];
  facetedFilters?: Record<string, string[] | null>;
  advancedFilters?: Record<string, string[] | null>;
  tab?: string;
  extraQueryParams?: Record<string, string | number | boolean>;
}

/**
 * Override the default query string builder.
 * Receives the full normalized table state and must return a query string
 * (without the leading `?`). Use this when your API expects different
 * parameter names or formats than the built-in defaults.
 *
 * @example
 * const queryParser: QueryParser = (p) => {
 *   const q = new URLSearchParams();
 *   q.set("pageNumber", String(p.pageNumber));
 *   q.set("limit", String(p.itemsPerPage));
 *   if (p.search) q.set("keyword", p.search);
 *   return q.toString();
 * };
 */
export type QueryParser = (params: QueryParserInput) => string;

// ============================================================================
// Response Mapper Types
// ============================================================================

export interface ResponseMapperResult<TData> {
  items: TData[];
  itemPerPage: number;
  pageNumber: number;
  totalItems: number;
  totalPage: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface ResponseKeys {
  items?: string;
  itemPerPage?: string;
  pageNumber?: string;
  totalItems?: string;
  totalPage?: string;
  hasNext?: string;
  hasPrev?: string;
}
