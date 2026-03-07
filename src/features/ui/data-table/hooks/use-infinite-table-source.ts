/**
 * Infinite Table Source Hook
 * Handles infinite-scroll data fetching using useInfiniteQuery.
 * Flattens all pages into a single array for TanStack Table consumption.
 */

import { useInfiniteQuery } from "@tanstack/solid-query";
import { type Accessor, createMemo } from "solid-js";

import { apiClient } from "~/features/lib/api-client";

import type {
  ColumnFilterParam,
  FetcherOptions,
  QueryParser,
  ResponseKeys,
  ResponseMapperResult,
  SortingParam,
} from "../types";
import { QUERY_KEYS } from "../utils";
import { buildQueryString, defaultResponseMapper } from "../utils/query-utils";

interface UseInfiniteTableSourceOptions<TData> {
  url?: string;
  fetcher?: (params: FetcherOptions) => Promise<unknown>;
  queryOptions?: {
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  };
  extraQueryParams?: Record<string, string | number | boolean>;
  responseMapper?: (response: unknown) => ResponseMapperResult<TData>;
  responseKeys?: ResponseKeys;
  queryParser?: QueryParser;
  itemsPerPage: Accessor<number>;
  sorting: Accessor<SortingParam[]>;
  columnFilters: Accessor<ColumnFilterParam[]>;
  search: Accessor<string>;
  tab: Accessor<string>;
  facetedFilters: Accessor<Record<string, string[] | null>>;
}

interface UseInfiniteTableSourceReturn<TData> {
  /** Flattened array of all loaded items across all pages */
  allData: Accessor<TData[]>;
  /** Total items reported by the server */
  totalItems: Accessor<number>;
  /** Whether the initial load is in progress */
  isLoading: Accessor<boolean>;
  /** Whether any fetch (initial or next page) is in progress */
  isFetching: Accessor<boolean>;
  /** Whether the next page is being fetched */
  isFetchingNextPage: Accessor<boolean>;
  /** Whether more pages are available */
  hasNextPage: Accessor<boolean>;
  /** Trigger loading the next page */
  fetchNextPage: () => void;
  /** Whether the query errored */
  isError: Accessor<boolean>;
  /** Refetch from scratch */
  refetch: () => void;
}

export function useInfiniteTableSource<TData>(
  options: UseInfiniteTableSourceOptions<TData>,
): UseInfiniteTableSourceReturn<TData> {
  const shouldUseServer = createMemo(() => !!(options.url || options.fetcher));

  const queryKey = createMemo(() => [
    QUERY_KEYS.DATA_TABLE,
    "infinite",
    options.url ?? "custom-fetcher",
    {
      itemsPerPage: options.itemsPerPage(),
      search: options.search(),
      sorting: options.sorting(),
      columnFilters: options.columnFilters(),
      facetedFilters: options.facetedFilters(),
      tab: options.tab(),
    },
  ]);

  const query = useInfiniteQuery(() => ({
    queryKey: queryKey(),
    queryFn: async ({ pageParam, signal }): Promise<ResponseMapperResult<TData>> => {
      const pageNumber = (pageParam as number) ?? 1;

      const params: FetcherOptions = {
        pageNumber,
        itemsPerPage: options.itemsPerPage(),
        search: options.search() || undefined,
        sorting: options.sorting(),
        columnFilters: options.columnFilters(),
        tab: options.tab() || undefined,
        signal,
      };

      // Use custom fetcher if provided
      if (options.fetcher) {
        const response = await options.fetcher(params);
        return options.responseMapper
          ? options.responseMapper(response)
          : defaultResponseMapper<TData>(response, options.responseKeys);
      }

      // Use URL with apiClient
      if (options.url) {
        const parserInput = {
          ...params,
          facetedFilters: options.facetedFilters(),
          extraQueryParams: options.extraQueryParams,
        };
        const queryString = options.queryParser
          ? options.queryParser(parserInput)
          : buildQueryString(parserInput);

        const response = await apiClient.get<unknown>(`${options.url}?${queryString}`, { signal });

        return options.responseMapper
          ? options.responseMapper(response)
          : defaultResponseMapper<TData>(response, options.responseKeys);
      }

      // Fallback empty response
      return {
        items: [],
        totalItems: 0,
        totalPage: 1,
        pageNumber: 1,
        itemPerPage: options.itemsPerPage(),
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Use hasNext if available, otherwise check pageNumber < totalPage
      if (lastPage.hasNext) {
        return (lastPage.pageNumber ?? 1) + 1;
      }
      if (
        lastPage.pageNumber != null &&
        lastPage.totalPage != null &&
        lastPage.pageNumber < lastPage.totalPage
      ) {
        return lastPage.pageNumber + 1;
      }
      return undefined;
    },
    enabled: shouldUseServer(),
    staleTime: options.queryOptions?.staleTime ?? 5 * 60 * 1000,
    refetchOnWindowFocus: options.queryOptions?.refetchOnWindowFocus ?? false,
  }));

  // Flatten all pages into single array
  const allData = createMemo(() => {
    if (!query.data) return [];
    return query.data.pages.flatMap((page) => page.items);
  });

  // Total items from the most recent page
  const totalItems = createMemo(() => {
    if (!query.data?.pages.length) return 0;
    return query.data.pages[query.data.pages.length - 1].totalItems ?? 0;
  });

  return {
    allData,
    totalItems,
    isLoading: () => query.isLoading,
    isFetching: () => query.isFetching,
    isFetchingNextPage: () => query.isFetchingNextPage,
    hasNextPage: () => query.hasNextPage ?? false,
    fetchNextPage: () => query.fetchNextPage(),
    isError: () => query.isError,
    refetch: () => query.refetch(),
  };
}
