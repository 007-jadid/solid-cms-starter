/**
 * Async Options Hook
 * Handles async loading, pagination, and caching of filter options
 */

import { useInfiniteQuery, useQuery } from "@tanstack/solid-query";
import { type Accessor, createEffect, createMemo, createSignal } from "solid-js";

import type {
  AsyncOptionsConfig,
  AsyncOptionsFetchParams,
  AsyncOptionsResponse,
  FilterOption,
  OptionMapper,
} from "../types";
import {
  DEFAULT_ASYNC_CONFIG,
  filterOptionsBySearch,
  QUERY_KEYS,
  selectedOptionsCache,
} from "../utils";

interface UseAsyncOptionsParams {
  filterKey: string;
  staticOptions?: FilterOption[];
  fetchOptions?: (params: AsyncOptionsFetchParams) => Promise<AsyncOptionsResponse>;
  legacyFetchOptions?: () => Promise<FilterOption[]>;
  fetchSelectedOptions?: (values: string[]) => Promise<FilterOption[]>;
  optionMapper?: OptionMapper;
  selectedValues: string[];
  config?: AsyncOptionsConfig;
  isOpen: boolean;
}

interface UseAsyncOptionsReturn {
  options: Accessor<FilterOption[]>;
  filteredOptions: Accessor<FilterOption[]>;
  isLoading: Accessor<boolean>;
  isLoadingSelected: Accessor<boolean>;
  isFetchingNextPage: Accessor<boolean>;
  hasNextPage: Accessor<boolean>;
  totalItems: Accessor<number | undefined>;
  searchValue: Accessor<string>;
  setSearchValue: (value: string) => void;
  loadNextPage: () => void;
  reset: () => void;
  cacheOption: (option: FilterOption) => void;
  getOptionLabel: (value: string) => string | undefined;
}

export function useAsyncOptions(params: UseAsyncOptionsParams): UseAsyncOptionsReturn {
  const config = { ...DEFAULT_ASYNC_CONFIG, ...params.config };
  const [searchValue, setSearchValue] = createSignal("");
  const [cachedOptions, setCachedOptions] = createSignal<Map<string, string>>(new Map());

  // Initialize cache from localStorage
  createEffect(() => {
    if (config.cacheSelectedOptions) {
      const cached = selectedOptionsCache.get(params.filterKey);
      setCachedOptions(new Map(Array.from(cached).map(([k, v]) => [k, v.label])));
    }
  });

  // Determine if we need async loading
  const isAsync = createMemo(
    () => config.enabled && !!(params.fetchOptions || params.legacyFetchOptions),
  );

  // Static options (when not async)
  const staticOptions = createMemo(() => params.staticOptions ?? []);

  // Query for paginated async options
  const infiniteQuery = useInfiniteQuery(() => ({
    queryKey: [
      QUERY_KEYS.ASYNC_OPTIONS,
      params.filterKey,
      config.searchMode === "server" ? searchValue() : "",
    ],
    queryFn: async ({ pageParam }): Promise<AsyncOptionsResponse> => {
      if (params.fetchOptions) {
        const response = await params.fetchOptions({
          pageParam,
          search: config.searchMode === "server" ? searchValue() : "",
          limit: config.pageSize ?? 20,
        });

        // Apply option mapper if provided
        if (params.optionMapper) {
          return {
            ...response,
            items: response.items.map((item) =>
              params.optionMapper!(item as unknown as Record<string, unknown>),
            ),
          };
        }

        return response;
      }

      // Legacy simple fetch
      if (params.legacyFetchOptions) {
        const items = await params.legacyFetchOptions();
        return {
          items: params.optionMapper
            ? items.map((item) => params.optionMapper!(item as unknown as Record<string, unknown>))
            : items,
          hasNextPage: false,
        };
      }

      return { items: [], hasNextPage: false };
    },
    initialPageParam: undefined as string | number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextCursor : undefined),
    enabled: isAsync() && params.isOpen,
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    refetchOnWindowFocus: config.refetchOnWindowFocus,
  }));

  // Query for fetching selected options' labels
  const selectedOptionsQuery = useQuery(() => ({
    queryKey: [QUERY_KEYS.SELECTED_OPTIONS, params.filterKey, params.selectedValues],
    queryFn: async () => {
      if (!params.fetchSelectedOptions) return [];

      // Only fetch values we don't have cached
      const uncachedValues = params.selectedValues.filter((v) => !cachedOptions().has(v));

      if (uncachedValues.length === 0) return [];

      const options = await params.fetchSelectedOptions(uncachedValues);

      // Cache the fetched options
      if (config.cacheSelectedOptions) {
        selectedOptionsCache.add(params.filterKey, options);
        setCachedOptions((prev) => {
          const next = new Map(prev);
          for (const opt of options) next.set(opt.value, opt.label);
          return next;
        });
      }

      return options;
    },
    enabled:
      params.selectedValues.length > 0 &&
      !!params.fetchSelectedOptions &&
      !config.cacheSelectedOptions,
    staleTime: config.staleTime,
  }));

  // Combined options from all pages
  const asyncOptions = createMemo(() => {
    if (!isAsync()) return [];

    const pages = infiniteQuery.data?.pages ?? [];
    return pages.flatMap((page) => page.items);
  });

  // All options (static or async)
  const options = createMemo(() => (isAsync() ? asyncOptions() : staticOptions()));

  // Filtered options (client-side search)
  const filteredOptions = createMemo(() => {
    const allOptions = options();

    if (config.searchMode === "client" && searchValue()) {
      return filterOptionsBySearch(allOptions, searchValue());
    }

    return allOptions;
  });

  // Loading states
  const isLoading = createMemo(() => (isAsync() ? infiniteQuery.isLoading : false));

  const isFetchingNextPage = createMemo(() =>
    isAsync() ? infiniteQuery.isFetchingNextPage : false,
  );

  const isLoadingSelected = createMemo(() => selectedOptionsQuery.isLoading);

  // Pagination state
  const hasNextPage = createMemo(() => (isAsync() ? (infiniteQuery.hasNextPage ?? false) : false));

  const totalItems = createMemo(() => {
    if (!isAsync()) return undefined;
    const lastPage = infiniteQuery.data?.pages[infiniteQuery.data.pages.length - 1];
    return lastPage?.totalItems;
  });

  // Actions
  const loadNextPage = () => {
    if (hasNextPage() && !isFetchingNextPage()) {
      infiniteQuery.fetchNextPage();
    }
  };

  const reset = () => {
    setSearchValue("");
  };

  const cacheOption = (option: FilterOption) => {
    if (config.cacheSelectedOptions) {
      selectedOptionsCache.add(params.filterKey, [option]);
      setCachedOptions((prev) => {
        const next = new Map(prev);
        next.set(option.value, option.label);
        return next;
      });
    }
  };

  const getOptionLabel = (value: string): string | undefined => {
    // First check options
    const option = options().find((o) => o.value === value);
    if (option) return option.label;

    // Then check cache
    return cachedOptions().get(value);
  };

  return {
    options,
    filteredOptions,
    isLoading,
    isLoadingSelected,
    isFetchingNextPage,
    hasNextPage,
    totalItems,
    searchValue,
    setSearchValue,
    loadNextPage,
    reset,
    cacheOption,
    getOptionLabel,
  };
}
