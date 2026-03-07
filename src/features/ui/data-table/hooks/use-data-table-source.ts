/**
 * Data Table Source Hook
 * Handles data fetching from URL, fetcher function, or static data
 */

import { useQuery } from "@tanstack/solid-query";
import { type Accessor, createMemo, createSignal } from "solid-js";

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

interface UseDataTableSourceOptions<TData> {
  data?: TData[];
  url?: string;
  fetcher?: (params: FetcherOptions) => Promise<unknown>;
  queryOptions?: {
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
    refetchInterval?: number | false;
  };
  extraQueryParams?: Record<string, string | number | boolean>;
  responseMapper?: (response: unknown) => ResponseMapperResult<TData>;
  responseKeys?: ResponseKeys;
  queryParser?: QueryParser;
  // State accessors
  pageNumber: Accessor<number>;
  itemsPerPage: Accessor<number>;
  sorting: Accessor<SortingParam[]>;
  columnFilters: Accessor<ColumnFilterParam[]>;
  search: Accessor<string>;
  tab: Accessor<string>;
  facetedFilters: Accessor<Record<string, string[] | null>>;
  advancedFilters?: Accessor<Record<string, string[] | null>>;
}

interface UseDataTableSourceReturn<TData> {
  tableData: Accessor<TData[]>;
  totalItems: Accessor<number>;
  pageCount: Accessor<number>;
  isFetching: Accessor<boolean>;
  isError: Accessor<boolean>;
  error: Accessor<Error | null>;
  refetch: () => void;
  shouldUseServer: Accessor<boolean>;
  localData: Accessor<TData[]>;
  setLocalData: (updater: TData[] | ((prev: TData[]) => TData[])) => void;
}

export function useDataTableSource<TData>(
  options: UseDataTableSourceOptions<TData>,
): UseDataTableSourceReturn<TData> {
  // Local data state for client-side operations
  const [localData, setLocalDataRaw] = createSignal<TData[]>(options.data ?? []);

  // Determine if we should use server-side data
  const shouldUseServer = createMemo(() => !!(options.url || options.fetcher));

  // Query key that changes when params change
  const queryKey = createMemo(() => [
    QUERY_KEYS.DATA_TABLE,
    options.url ?? "custom-fetcher",
    {
      pageNumber: options.pageNumber(),
      itemsPerPage: options.itemsPerPage(),
      search: options.search(),
      sorting: options.sorting(),
      columnFilters: options.columnFilters(),
      facetedFilters: options.facetedFilters(),
      advancedFilters: options.advancedFilters?.() ?? {},
      tab: options.tab(),
    },
  ]);

  // Server-side data query
  const query = useQuery(() => ({
    queryKey: queryKey(),
    queryFn: async ({ signal }): Promise<ResponseMapperResult<TData>> => {
      const params: FetcherOptions = {
        pageNumber: options.pageNumber(),
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
          advancedFilters: options.advancedFilters?.(),
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
    enabled: shouldUseServer(),
    staleTime: options.queryOptions?.staleTime ?? 5 * 60 * 1000,
    refetchOnWindowFocus: options.queryOptions?.refetchOnWindowFocus ?? false,
    refetchInterval: options.queryOptions?.refetchInterval ?? false,
    placeholderData: (previousData) => previousData,
  }));

  // Computed values
  const tableData = createMemo(() => {
    if (shouldUseServer()) {
      return query.data?.items ?? [];
    }
    return localData();
  });

  const totalItems = createMemo(() => {
    if (shouldUseServer()) {
      return query.data?.totalItems ?? 0;
    }
    return localData().length;
  });

  const pageCount = createMemo(() => {
    if (shouldUseServer()) {
      return query.data?.totalPage ?? 1;
    }
    return Math.max(1, Math.ceil(localData().length / options.itemsPerPage()));
  });

  const isFetching = createMemo(() => (shouldUseServer() ? query.isFetching : false));

  const isError = createMemo(() => (shouldUseServer() ? query.isError : false));

  const error = createMemo(() => (shouldUseServer() ? (query.error as Error | null) : null));

  // Setter that handles both value and function
  const setLocalData = (updater: TData[] | ((prev: TData[]) => TData[])) => {
    if (typeof updater === "function") {
      setLocalDataRaw((prev) => updater(prev));
    } else {
      setLocalDataRaw(updater);
    }
  };

  return {
    tableData,
    totalItems,
    pageCount,
    isFetching,
    isError,
    error,
    refetch: () => query.refetch(),
    shouldUseServer,
    localData,
    setLocalData,
  };
}
