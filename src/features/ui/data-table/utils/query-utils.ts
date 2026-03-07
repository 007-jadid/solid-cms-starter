/**
 * Shared Query Utilities
 * Used by both useDataTableSource and useInfiniteTableSource
 */

import type { ColumnFilterParam, ResponseKeys, ResponseMapperResult, SortingParam } from "../types";

/**
 * Default response mapper that handles common API response formats
 */
export function defaultResponseMapper<TData>(
  response: unknown,
  keys?: ResponseKeys,
): ResponseMapperResult<TData> {
  const data = response as Record<string, unknown>;

  // Check if response has a nested 'data' property (common pattern)
  const root = data.data ? (data.data as Record<string, unknown>) : data;

  const itemsKey = keys?.items ?? "items";
  const totalItemsKey = keys?.totalItems ?? "totalItems";
  const totalPageKey = keys?.totalPage ?? "totalPage";
  const pageNumberKey = keys?.pageNumber ?? "pageNumber";
  const itemPerPageKey = keys?.itemPerPage ?? "itemPerPage";
  const hasNextKey = keys?.hasNext ?? "hasNext";
  const hasPrevKey = keys?.hasPrev ?? "hasPrev";

  return {
    items: (root[itemsKey] as TData[]) ?? [],
    totalItems: (root[totalItemsKey] as number) ?? 0,
    totalPage: (root[totalPageKey] as number) ?? 1,
    pageNumber: (root[pageNumberKey] as number) ?? 1,
    itemPerPage: (root[itemPerPageKey] as number) ?? 10,
    hasNext: (root[hasNextKey] as boolean) ?? false,
    hasPrev: (root[hasPrevKey] as boolean) ?? false,
  };
}

/**
 * Build query string from parameters
 */
export function buildQueryString(params: {
  pageNumber: number;
  itemsPerPage: number;
  search?: string;
  sorting?: SortingParam[];
  columnFilters?: ColumnFilterParam[];
  facetedFilters?: Record<string, string[] | null>;
  advancedFilters?: Record<string, string[] | null>;
  tab?: string;
  extraQueryParams?: Record<string, string | number | boolean>;
}): string {
  const query = new URLSearchParams();

  query.set("page", String(params.pageNumber));
  query.set("size", String(params.itemsPerPage));

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.tab) {
    query.set("tab", params.tab);
  }

  if (params.sorting && params.sorting.length > 0) {
    query.set("sort", params.sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(","));
  }

  // Column filters
  params.columnFilters?.forEach((filter) => {
    if (filter.value !== undefined && filter.value !== null) {
      query.set(filter.id, String(filter.value));
    }
  });

  // Faceted filters
  if (params.facetedFilters) {
    Object.entries(params.facetedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        query.set(key, values.join(","));
      }
    });
  }

  // Advanced filters
  if (params.advancedFilters) {
    Object.entries(params.advancedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        query.set(key, values.join(","));
      }
    });
  }

  // Extra query params
  if (params.extraQueryParams) {
    Object.entries(params.extraQueryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.set(key, String(value));
      }
    });
  }

  return query.toString();
}
