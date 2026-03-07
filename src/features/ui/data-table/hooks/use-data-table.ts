/**
 * Main DataTable Hook
 * Orchestrates all table state, data fetching, and features
 */

import { useRouter } from "@tanstack/solid-router";
import {
  type ColumnFiltersState,
  type ColumnPinningState,
  createSolidTable,
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type VisibilityState,
} from "@tanstack/solid-table";
import { batch, createEffect, createMemo, createSignal, on } from "solid-js";

import { useSettings } from "~/features/context/settings/settings.context";
import { createEditableCell } from "../data-table-editable-cell";
import type { ColumnFilterParam, DataTableProps, DensityState, SortingParam } from "../types";
import { arraysShallowEqual, densityStorage } from "../utils";
import { useDataTableSource } from "./use-data-table-source";
import { useRowEditing } from "./use-row-editing";
import { serializers, useUrlState, useUrlStates } from "./use-url-state";

export function useDataTable<TData extends { id?: string | number }, TValue>(
  props: DataTableProps<TData, TValue>,
) {
  const router = useRouter();
  const settings = useSettings();

  const getParams = () => {
    const searchStr = router.state.location.searchStr || "";
    return new URLSearchParams(searchStr);
  };

  // ============================================================================
  // URL State Management
  // ============================================================================

  // Pagination state (URL synced)
  const [paginationState, setPaginationState] = useUrlStates(
    {
      pageNumber: serializers.integer,
      itemsPerPage: serializers.integer,
    },
    {
      pageNumber: 1,
      itemsPerPage: settings.state.table.pageSize,
    },
  );

  const pageNumber = createMemo(() => paginationState().pageNumber);
  const itemsPerPage = createMemo(() => paginationState().itemsPerPage);

  // Search state (URL synced)
  const [searchValue, setSearch] = useUrlState(props.searchKey || "search", "", serializers.string);

  // Tab state (URL synced)
  const [tab, setTab] = useUrlState("tab", "", serializers.string);

  // ============================================================================
  // Local State
  // ============================================================================

  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>({});
  const [rowSelection, setRowSelection] = createSignal<Record<string, boolean>>({});
  const [columnPinning, setColumnPinning] = createSignal<ColumnPinningState>(
    props.defaultColumnPinning || {},
  );
  const [expanded, setExpanded] = createSignal<ExpandedState>(props.defaultExpanded || {});

  // Density state (persisted to localStorage)
  const [density, setDensityRaw] = createSignal<DensityState>(densityStorage.get());

  const setDensity = (newDensity: DensityState) => {
    setDensityRaw(newDensity);
    densityStorage.set(newDensity);
  };

  // ============================================================================
  // Faceted Filters State (URL synced)
  // ============================================================================

  const [facetedFilters, setFacetedFiltersRaw] = createSignal<Record<string, string[] | null>>(
    (() => {
      const params = getParams();
      const filters: Record<string, string[] | null> = {};

      props.filterFields?.forEach((field) => {
        const param = params.get(field.value as string);
        if (param != null && param.length > 0) {
          filters[field.value as string] = param.split(",").filter(Boolean);
        } else {
          filters[field.value as string] = null;
        }
      });

      return filters;
    })(),
  );

  // Sync faceted filters to URL
  createEffect(() => {
    const filters = facetedFilters();
    const params = getParams();

    let changed = false;
    Object.entries(filters).forEach(([key, values]) => {
      const serialized = values && values.length > 0 ? values.join(",") : null;
      const currentSerialized = params.get(key);
      const same =
        (serialized === null && currentSerialized == null) || currentSerialized === serialized;
      if (!same) {
        changed = true;
      }
    });

    if (!changed) return;

    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }
    });

    const nextSearch = params.toString();
    const nextUrl = nextSearch
      ? `${router.state.location.pathname}?${nextSearch}`
      : router.state.location.pathname;

    router.history.replace(nextUrl);
  });

  // Wrapper for faceted filters with change callback
  const setFacetedFilters = (
    updater:
      | Record<string, string[] | null>
      | ((prev: Record<string, string[] | null>) => Record<string, string[] | null>),
  ) => {
    const prev = facetedFilters();
    const next = typeof updater === "function" ? updater(prev) : updater;

    // Call onFilterChange callback if provided
    if (props.onFilterChange) {
      for (const key of Object.keys(next)) {
        const prevValue = prev[key];
        const newValue = next[key];
        const prevArr = Array.isArray(prevValue) ? prevValue : [];
        const newArr = Array.isArray(newValue) ? newValue : [];

        if (!arraysShallowEqual(prevArr, newArr)) {
          props.onFilterChange(key as Extract<keyof TData, string>, newValue, next);
        }
      }
    }

    setFacetedFiltersRaw(next);
  };

  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = createSignal<Record<string, string[] | null>>({});

  // ============================================================================
  // Data Source
  // ============================================================================

  const sortingParams = createMemo((): SortingParam[] =>
    sorting().map((s) => ({ id: s.id, desc: s.desc })),
  );

  const columnFilterParams = createMemo((): ColumnFilterParam[] =>
    columnFilters().map((f) => ({ id: f.id, value: f.value })),
  );

  const {
    tableData,
    totalItems,
    pageCount,
    isFetching,
    isError,
    refetch,
    shouldUseServer,
    setLocalData,
  } = useDataTableSource<TData>({
    data: props.data,
    url: props.url,
    fetcher: props.fetcher,
    queryOptions: props.queryOptions,
    extraQueryParams: props.extraQueryParams,
    responseMapper: props.responseMapper,
    responseKeys: props.responseKeys,
    queryParser: props.queryParser,
    pageNumber,
    itemsPerPage,
    sorting: sortingParams,
    columnFilters: columnFilterParams,
    search: searchValue,
    tab,
    facetedFilters,
    advancedFilters,
  });

  // ============================================================================
  // Row Editing
  // ============================================================================

  const {
    editingRowId,
    editingData,
    isSaving,
    startEditing,
    handleSave,
    handleCancel,
    updateEditingData,
    meta: rowEditingMeta,
  } = useRowEditing<TData>({
    enableRowEditable: props.enableRowEditable ?? false,
    rowEditAction: props.rowEditAction,
    shouldUseServer,
    refetch,
    setLocalData,
    getRowById: (id: string) => tableData().find((row) => String(row.id) === id),
  });

  // ============================================================================
  // Drag and Drop
  // ============================================================================

  const handleDragEnd = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    if (shouldUseServer()) return; // Only for client-side data

    setLocalData((items) => {
      const newItems = [...items];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);

      props.onReorder?.(newItems);
      return newItems;
    });
  };

  // ============================================================================
  // Table Meta
  // ============================================================================

  const tableMeta = createMemo(() => ({
    ...rowEditingMeta,
    density: density(),
    setDensity,
    editingData,
    updateEditingData,
  }));

  // ============================================================================
  // Default Column (for editable cells)
  // ============================================================================

  const defaultColumn = {
    cell: createEditableCell<TData, unknown>(),
  };

  // ============================================================================
  // Table Instance
  // ============================================================================

  const table = createSolidTable({
    get data() {
      return tableData();
    },
    columns: props.columns,
    defaultColumn,
    state: {
      get sorting() {
        return sorting();
      },
      get columnFilters() {
        return columnFilters();
      },
      get columnVisibility() {
        return columnVisibility();
      },
      get rowSelection() {
        return rowSelection();
      },
      get columnPinning() {
        return columnPinning();
      },
      get expanded() {
        return expanded();
      },
      get pagination() {
        return {
          pageIndex: pageNumber() - 1,
          pageSize: itemsPerPage(),
        };
      },
    },
    get meta() {
      return tableMeta();
    },
    get pageCount() {
      return pageCount();
    },
    enableRowSelection: props.enableRowSelection ?? false,
    enableColumnPinning: props.enableColumnPinning ?? false,
    manualPagination: shouldUseServer(),
    manualSorting: shouldUseServer(),
    manualFiltering: shouldUseServer(),
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting()) : updater;
      setSorting(next);
    },
    onColumnFiltersChange: (updater) => {
      const next = typeof updater === "function" ? updater(columnFilters()) : updater;
      setColumnFilters(next);
    },
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === "function" ? updater(columnVisibility()) : updater;
      setColumnVisibility(next);
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(rowSelection()) : updater;
      setRowSelection(next);
    },
    onColumnPinningChange: (updater) => {
      const next = typeof updater === "function" ? updater(columnPinning()) : updater;
      setColumnPinning(next);
    },
    onPaginationChange: (updater) => {
      const current = { pageIndex: pageNumber() - 1, pageSize: itemsPerPage() };
      const next = typeof updater === "function" ? updater(current) : updater;

      batch(() => {
        setPaginationState({
          pageNumber: next.pageIndex + 1,
          itemsPerPage: next.pageSize,
        });
      });
    },
    onExpandedChange: (updater) => {
      const next = typeof updater === "function" ? updater(expanded()) : updater;
      setExpanded(next);
    },
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () =>
      (props.enableExpanding ?? false) && (!!props.renderSubComponent || !!props.subGridConfig),
    getSubRows: props.getSubRows,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: (originalRow, index) => {
      return String(originalRow.id ?? index);
    },
  });

  // ============================================================================
  // Filter Counts
  // ============================================================================

  const activeFacetedFiltersCount = createMemo(
    () => Object.values(facetedFilters()).filter((v) => Array.isArray(v) && v.length > 0).length,
  );

  const activeAdvancedFiltersCount = createMemo(
    () => Object.values(advancedFilters()).filter((v) => Array.isArray(v) && v.length > 0).length,
  );

  const totalFilterCount = createMemo(
    () => (props.filterCount ?? 0) + activeFacetedFiltersCount() + activeAdvancedFiltersCount(),
  );

  // ============================================================================
  // Reset Helpers
  // ============================================================================

  const resetSearch = () => {
    setSearch("");
  };

  const resetFilters = () => {
    const clearedFilters = Object.keys(facetedFilters()).reduce(
      (acc, key) => ({ ...acc, [key]: null }),
      {} as Record<string, null>,
    );
    setFacetedFilters(clearedFilters);
    setAdvancedFilters({});
  };

  // Reset filters when search changes (if enabled).
  // on() provides the previous value natively — no manual variable needed.
  createEffect(
    on(
      () => searchValue(),
      (currentSearch, previousSearch) => {
        if (
          props.resetFiltersOnSearch &&
          currentSearch !== previousSearch &&
          (previousSearch !== "" || currentSearch !== "")
        ) {
          resetFilters();
        }
      },
    ),
  );

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // Table instance
    table,

    // Data
    tableData,
    totalItems,

    // Loading states
    isFetching,
    isError,

    // Actions
    refetch,
    handleDragEnd,

    // Row editing
    editingRowId,
    editingData,
    isSaving,
    startEditing,
    handleSave,
    handleCancel,
    updateEditingData,

    // Filters
    facetedFilters,
    setFacetedFilters,
    advancedFilters,
    setAdvancedFilters,
    totalFilterCount,

    // Search
    search: searchValue,
    setSearch,
    resetSearch,

    // Tab
    tab,
    setTab,

    // Density
    density,
    setDensity,

    // Pagination
    pageNumber,
    itemsPerPage,
    pageCount,

    // Helpers
    shouldUseServer,
    resetFilters,
  };
}
