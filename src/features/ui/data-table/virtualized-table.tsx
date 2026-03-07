/**
 * VirtualizedTable Component
 * Virtual-rendered table with two modes:
 * - "scroll" (default): Infinite scroll with useInfiniteQuery. No page number navigation.
 * - "cursor": Traditional pagination with page navigation (first/prev/next/last).
 */

import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  createSolidTable,
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/solid-table";
import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  on,
  Show,
} from "solid-js";
import type { ExportColumn } from "~/features/lib/export";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import type { BulkAction } from "./data-table-bulk-actions";
import { DataTableContent } from "./data-table-content";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableRefreshButton } from "./data-table-refresh-button";
import { DataTableToolbar } from "./data-table-toolbar";
import { useDataTableSource } from "./hooks/use-data-table-source";
import { useInfiniteTableSource } from "./hooks/use-infinite-table-source";
import type {
  ColumnFilterParam,
  DataTab,
  DataTableAdvancedFilterField,
  DataTableFilterField,
  DensityState,
  FetcherOptions,
  ResponseKeys,
  ResponseMapperResult,
  SortingParam,
  SubGridConfig,
} from "./types";
import { densityStorage, PAGE_SIZE_OPTIONS } from "./utils";

// ============================================================================
// Props
// ============================================================================

export interface VirtualizedTableProps<TData extends { id?: string | number }, TValue> {
  columns: ColumnDef<TData, TValue>[];

  // Data Source (one required)
  url?: string;
  fetcher?: (params: FetcherOptions) => Promise<unknown>;

  /**
   * Table mode:
   * - "scroll" (default): Infinite scroll — pages load as user scrolls. No page number navigation.
   * - "cursor": Traditional pagination — user can navigate pages (first/prev/next/last).
   */
  mode?: "scroll" | "cursor";

  /** Initial items per page sent to the server for each page. @default 30 */
  itemsPerPage?: number;

  /** Available page size options for the selector. @default PAGE_SIZE_OPTIONS */
  pageSizeOptions?: readonly number[];

  // Table features
  enableRowSelection?: boolean;
  enableColumnPinning?: boolean;
  defaultColumnPinning?: {
    left?: Array<Extract<keyof TData, string> | (string & {})>;
    right?: Array<Extract<keyof TData, string> | (string & {})>;
  };
  enableExpanding?: boolean;
  renderSubComponent?: (props: { row: Row<TData> }) => JSX.Element;
  subGridConfig?: SubGridConfig<TData, unknown>;

  // Toolbar
  filterFields?: DataTableFilterField<TData>[];
  advancedFilterFields?: DataTableAdvancedFilterField[];
  filters?: Component<{ table: unknown }>;
  searchKey?: string;
  searchPlaceholder?: string;
  showTab?: boolean;
  defaultTabs?: DataTab[];
  customTabs?: DataTab[];

  // Response
  responseMapper?: (response: unknown) => ResponseMapperResult<TData>;
  responseKeys?: ResponseKeys;
  extraQueryParams?: Record<string, string | number | boolean>;
  queryOptions?: {
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  };

  // Virtual / Layout
  /** Maximum height for the table container. @default "600px" */
  maxHeight?: string;
  virtualRowHeight?: number;
  virtualOverscan?: number;

  // Export
  enableExport?: boolean;
  exportFilename?: string;
  exportColumns?: ExportColumn<TData>[];

  // Bulk actions
  bulkActions?: BulkAction<TData>[];

  /** Unique identifier for persisting table settings */
  tableId?: string;
}

// ============================================================================
// Component
// ============================================================================

export function VirtualizedTable<TData extends { id?: string | number }, TValue>(
  props: VirtualizedTableProps<TData, TValue>,
) {
  // ---- Mode ----
  const isScrollMode = () => (props.mode ?? "scroll") === "scroll";

  // ---- State ----
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>({});
  const [rowSelection, setRowSelection] = createSignal<Record<string, boolean>>({});
  const [columnPinning, setColumnPinning] = createSignal<ColumnPinningState>(
    props.defaultColumnPinning ?? {},
  );
  const [expanded, setExpanded] = createSignal<ExpandedState>({});
  const [search] = createSignal("");
  const [tab] = createSignal("");
  const [facetedFilters, setFacetedFilters] = createSignal<Record<string, string[] | null>>({});

  const [density, setDensityRaw] = createSignal<DensityState>(densityStorage.get());
  const setDensity = (d: DensityState) => {
    setDensityRaw(d);
    densityStorage.set(d);
  };

  const [itemsPerPage, setItemsPerPage] = createSignal(props.itemsPerPage ?? 30);
  const [pageNumber, setPageNumber] = createSignal(1);

  /** Page size options for the selector */
  const pageSizeOptions = () => props.pageSizeOptions ?? PAGE_SIZE_OPTIONS;

  const sortingParams = createMemo((): SortingParam[] =>
    sorting().map((s) => ({ id: s.id, desc: s.desc })),
  );
  const columnFilterParams = createMemo((): ColumnFilterParam[] =>
    columnFilters().map((f) => ({ id: f.id, value: f.value })),
  );

  // ---- Data Sources (mode-dependent) ----

  // Scroll mode: infinite query (accumulates pages via useInfiniteQuery)
  const scrollSource = useInfiniteTableSource<TData>({
    url: isScrollMode() ? props.url : undefined,
    fetcher: isScrollMode() ? props.fetcher : undefined,
    queryOptions: props.queryOptions,
    extraQueryParams: props.extraQueryParams,
    responseMapper: props.responseMapper,
    responseKeys: props.responseKeys,
    itemsPerPage: () => itemsPerPage(),
    sorting: sortingParams,
    columnFilters: columnFilterParams,
    search,
    tab,
    facetedFilters,
  });

  // Cursor mode: single-page query (useQuery, fetches one page at a time)
  const cursorSource = useDataTableSource<TData>({
    url: !isScrollMode() ? props.url : undefined,
    fetcher: !isScrollMode() ? props.fetcher : undefined,
    queryOptions: props.queryOptions,
    extraQueryParams: props.extraQueryParams,
    responseMapper: props.responseMapper,
    responseKeys: props.responseKeys,
    pageNumber,
    itemsPerPage: () => itemsPerPage(),
    sorting: sortingParams,
    columnFilters: columnFilterParams,
    search,
    tab,
    facetedFilters,
  });

  // Unified accessors
  const tableData = () => (isScrollMode() ? scrollSource.allData() : cursorSource.tableData());
  const totalItemsValue = () =>
    isScrollMode() ? scrollSource.totalItems() : cursorSource.totalItems();
  const isFetchingValue = () =>
    isScrollMode() ? scrollSource.isFetching() : cursorSource.isFetching();
  const isErrorValue = () => (isScrollMode() ? scrollSource.isError() : cursorSource.isError());
  const refetchAll = () => {
    if (isScrollMode()) scrollSource.refetch();
    else cursorSource.refetch();
  };

  // Reset to page 1 when search/sorting/filters change (cursor mode)
  createEffect(
    on(
      () => [search(), sortingParams(), columnFilterParams(), facetedFilters()],
      () => {
        if (!isScrollMode()) {
          setPageNumber(1);
        }
      },
      { defer: true },
    ),
  );

  // ---- Table Instance ----
  const table = createSolidTable({
    get data() {
      return tableData();
    },
    columns: props.columns,
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
        return { pageIndex: pageNumber() - 1, pageSize: itemsPerPage() };
      },
    },
    get meta() {
      return { density: density(), setDensity };
    },
    enableRowSelection: props.enableRowSelection ?? false,
    enableColumnPinning: props.enableColumnPinning ?? false,
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    get pageCount() {
      return isScrollMode() ? -1 : cursorSource.pageCount();
    },
    onSortingChange: (u) => setSorting(typeof u === "function" ? u(sorting()) : u),
    onColumnFiltersChange: (u) =>
      setColumnFilters(typeof u === "function" ? u(columnFilters()) : u),
    onColumnVisibilityChange: (u) =>
      setColumnVisibility(typeof u === "function" ? u(columnVisibility()) : u),
    onRowSelectionChange: (u) => setRowSelection(typeof u === "function" ? u(rowSelection()) : u),
    onColumnPinningChange: (u) =>
      setColumnPinning(typeof u === "function" ? u(columnPinning()) : u),
    onExpandedChange: (u) => setExpanded(typeof u === "function" ? u(expanded()) : u),
    onPaginationChange: (u) => {
      const current = {
        pageIndex: pageNumber() - 1,
        pageSize: itemsPerPage(),
      };
      const next = typeof u === "function" ? u(current) : u;
      setPageNumber(next.pageIndex + 1);
      setItemsPerPage(next.pageSize);
    },
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () =>
      !!props.enableExpanding && (!!props.renderSubComponent || !!props.subGridConfig),
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => String(row.id ?? index),
  });

  // ---- Scroll detection for infinite loading (scroll mode only) ----
  let scrollContainerRef: HTMLDivElement | undefined;

  const handleScroll = (e: Event) => {
    if (!isScrollMode()) return;
    const target = e.currentTarget as HTMLDivElement;
    const { scrollHeight, scrollTop, clientHeight } = target;
    if (
      scrollHeight - scrollTop - clientHeight < 500 &&
      !scrollSource.isFetchingNextPage() &&
      scrollSource.hasNextPage()
    ) {
      scrollSource.fetchNextPage();
    }
  };

  // Check on mount and after data loads — in case the table doesn't fill the viewport
  createEffect(
    on(
      () => tableData().length,
      () => {
        if (!isScrollMode()) return;
        if (scrollContainerRef) {
          const { scrollHeight, scrollTop, clientHeight } = scrollContainerRef;
          if (
            scrollHeight - scrollTop - clientHeight < 500 &&
            !scrollSource.isFetchingNextPage() &&
            scrollSource.hasNextPage()
          ) {
            scrollSource.fetchNextPage();
          }
        }
      },
      { defer: true },
    ),
  );

  // Tabs
  const tabs = (): DataTab[] => [...(props.defaultTabs ?? []), ...(props.customTabs ?? [])];

  // Tab change counter — incremented to trigger row re-animation
  const [_tabChangeCount, setTabChangeCount] = createSignal(0);
  const handleTabChange = () => setTabChangeCount((c) => c + 1);

  return (
    <div class="m-2 space-y-4 font-sans">
      {/* Toolbar */}
      <DataTableToolbar
        table={table}
        filterFields={props.filterFields}
        facetedFilters={facetedFilters()}
        setFacetedFilters={setFacetedFilters}
        advancedFilterFields={props.advancedFilterFields}
        tabs={tabs()}
        showTab={props.showTab}
        searchKey={props.searchKey}
        searchPlaceholder={props.searchPlaceholder}
        tableId={props.tableId}
        enableExport={props.enableExport}
        exportData={() => tableData()}
        exportFilename={props.exportFilename}
        exportColumns={props.exportColumns}
        bulkActions={props.bulkActions}
        selectedRows={() => table.getFilteredSelectedRowModel().rows.map((r) => r.original)}
        onClearSelection={() => table.resetRowSelection()}
        onTabChange={handleTabChange}
      >
        <Show when={props.url || props.fetcher}>
          <DataTableRefreshButton onClick={() => refetchAll()} isFetching={isFetchingValue()} />
        </Show>
      </DataTableToolbar>

      {/* Table content (virtual mode always on) */}
      <DataTableContent
        table={table}
        columns={props.columns}
        tableData={tableData()}
        enableExpanding={props.enableExpanding}
        isFetching={isFetchingValue()}
        isError={isErrorValue()}
        onRetry={() => refetchAll()}
        editingRowId={null}
        handleSave={async () => {}}
        handleCancel={() => {}}
        isSaving={false}
        renderSubComponent={props.renderSubComponent}
        subGridConfig={props.subGridConfig}
        fixedHeader
        maxHeight={props.maxHeight ?? "600px"}
        enableVirtual
        virtualRowHeight={props.virtualRowHeight}
        virtualOverscan={props.virtualOverscan}
        onScrollRef={(el) => {
          scrollContainerRef = el;
        }}
        onScroll={handleScroll}
      />

      {/* Scroll mode: loading indicator for next page */}
      <Show when={isScrollMode() && scrollSource.isFetchingNextPage()}>
        <div class="flex items-center justify-center py-2">
          <svg
            class="h-5 w-5 animate-spin text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span class="ml-2 text-sm text-muted-foreground">Loading more...</span>
        </div>
      </Show>

      {/* Footer: mode-dependent */}
      <Show
        when={!isScrollMode()}
        fallback={
          /* Scroll mode: status bar with page size selector (no page navigation) */
          <div class="flex items-center justify-between px-2">
            <div class="flex-1 text-sm text-muted-foreground">
              <Show
                when={
                  props.enableRowSelection && table.getFilteredSelectedRowModel().rows.length > 0
                }
              >
                <span>
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {totalItemsValue() > 0 ? totalItemsValue() : tableData().length} row(s) selected
                </span>
              </Show>
            </div>
            <div class="flex items-center space-x-6 lg:space-x-8">
              <div class="flex items-center space-x-2">
                <p class="text-sm font-medium">Rows per page</p>
                <Select<string>
                  value={String(itemsPerPage())}
                  onChange={(value) => {
                    if (value) setItemsPerPage(Number(value));
                  }}
                  options={pageSizeOptions().map(String)}
                  itemComponent={(itemProps) => (
                    <SelectItem item={itemProps.item}>{itemProps.item.rawValue}</SelectItem>
                  )}
                >
                  <SelectTrigger class="h-8 w-[70px]">
                    <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
                  </SelectTrigger>
                  <SelectContent />
                </Select>
              </div>
              <div class="text-sm text-muted-foreground">
                Showing {tableData().length}
                <Show when={totalItemsValue() > 0}> of {totalItemsValue()}</Show> items
              </div>
            </div>
          </div>
        }
      >
        {/* Cursor mode: full pagination with page navigation */}
        <DataTablePagination
          table={table}
          totalItems={totalItemsValue()}
          enableRowSelection={props.enableRowSelection}
        />
      </Show>
    </div>
  );
}
