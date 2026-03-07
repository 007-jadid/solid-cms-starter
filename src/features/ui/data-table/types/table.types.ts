import type { ColumnDef, ExpandedState, Row, Table } from "@tanstack/solid-table";
import type { Accessor, Component, JSX } from "solid-js";
import type { ExportColumn } from "~/features/lib/export";
import type { BulkAction } from "../data-table-bulk-actions";
import type { FetcherOptions, QueryParser, ResponseKeys, ResponseMapperResult } from "./api.types";
import type { DataTableAdvancedFilterField, DataTableFilterField } from "./filter.types";

// ============================================================================
// Table Meta Extensions
// ============================================================================

declare module "@tanstack/solid-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    editable?: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    editable?: boolean;
    editingRowId?: string | null | Accessor<string | null>;
    editingColumnId?: string | null | Accessor<string | null>;
    isSaving?: boolean | Accessor<boolean>;
    setEditingRowId?: (id: string) => void;
    startEditing?: (rowId: string, columnId?: string) => void;
    updateData?: (rowId: string, columnId: string, value: unknown) => void;
    enableRowEditing?: boolean;
    handleSave?: () => Promise<void>;
    handleCancel?: () => void;
    clearEditingColumnId?: () => void;
    density?: DensityState;
    setDensity?: (density: DensityState) => void;
    editingData?: Record<string, unknown>;
    updateEditingData?: (key: string, value: unknown) => void;
  }
}

// ============================================================================
// UI State Types
// ============================================================================

export type DensityState = "sm" | "md" | "lg";

export interface DataTab {
  keyName: string;
  title: string;
  icon?: Component<{ class?: string }>;
}

// ============================================================================
// Row Types
// ============================================================================

export type RowWithId<TData> = TData & { id?: string | number };

export interface EditingHelpers<TData> {
  updateRow: (updatedData: TData) => void;
  revert: () => void;
  refetch?: () => Promise<void>;
}

// ============================================================================
// Sub Grid Config
// ============================================================================

export interface SubGridConfig<TData, TSubData> {
  columns: ColumnDef<TSubData, unknown>[];
  getSubData?: (row: TData) => TSubData[];
  getSubUrl?: (row: TData) => string;
  getSubFetcher?: (row: TData, params: FetcherOptions) => Promise<unknown>;
  enableRowSelection?: boolean;
  enableDragAndDrop?: boolean;
  enableColumnPinning?: boolean;
  enableRowEditable?: boolean;
  enableExpanding?: boolean;
  defaultItemsPerPage?: number;
  responseMapper?: (response: unknown) => ResponseMapperResult<TSubData>;
  extraProps?: Partial<DataTableProps<TSubData, unknown>>;
  renderAdditionalContent?: (props: { row: Row<TData> }) => JSX.Element;
}

// ============================================================================
// Main DataTable Props
// ============================================================================

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];

  // Data Source (One of these is required)
  data?: TData[];
  url?: string;
  fetcher?: (params: FetcherOptions) => Promise<unknown>;

  /** Unique identifier for persisting table settings */
  tableId?: string;

  // Configuration
  enableRowSelection?: boolean;
  enableDragAndDrop?: boolean;
  enableColumnPinning?: boolean;
  defaultColumnPinning?: {
    left?: Array<Extract<keyof TData, string> | (string & {})>;
    right?: Array<Extract<keyof TData, string> | (string & {})>;
  };
  enableRowEditable?: boolean;
  showDefaultRowActions?: boolean;
  rowEditAction?: (
    originalRow: TData,
    newRow: TData,
    helpers: EditingHelpers<TData>,
  ) => Promise<void> | void;
  onReorder?: (newOrder: TData[]) => void;

  // Expansion features
  enableExpanding?: boolean;
  renderSubComponent?: (props: { row: Row<TData> }) => JSX.Element;
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
  defaultExpanded?: ExpandedState;

  // Sub Data-Grid feature
  subGridConfig?: SubGridConfig<TData, unknown>;

  // Tabs
  /**
   * Set to `false` to hide tabs entirely.
   * When omitted (or `true`) and no `defaultTabs`/`customTabs` are provided,
   * the table defaults to [Active · Inactive] tabs.
   */
  showTab?: boolean;
  /**
   * Override the built-in default tabs (Active · Inactive).
   * When provided, these replace the defaults entirely.
   * Combined with `customTabs` if both are set.
   */
  defaultTabs?: DataTab[];
  customTabs?: DataTab[];

  // Filters
  filterFields?: DataTableFilterField<TData>[];
  filters?: Component<{ table: Table<TData> }>;
  filterCount?: number;
  onReset?: () => void;
  advancedFilterFields?: DataTableAdvancedFilterField[];

  /**
   * When true, clicking reset will also clear the search field.
   * @default false
   */
  resetSearchOnReset?: boolean;

  /**
   * When true, changing the search query will reset all filters.
   * @default false
   */
  resetFiltersOnSearch?: boolean;

  /**
   * Callback when any filter value changes.
   */
  onFilterChange?: (
    filterKey: Extract<keyof TData, string>,
    value: string[] | null,
    allFilters: Record<string, string[] | null>,
  ) => void;

  /**
   * Override the default query string builder for URL-mode tables.
   * Receives all normalized table state and must return a query string
   * (without the leading `?`). Use this when your API expects different
   * parameter names or formats.
   *
   * @example
   * queryParser={(p) => {
   *   const q = new URLSearchParams();
   *   q.set("pageNumber", String(p.pageNumber));
   *   q.set("limit", String(p.itemsPerPage));
   *   if (p.search) q.set("keyword", p.search);
   *   return q.toString();
   * }}
   */
  queryParser?: QueryParser;

  // Query Options
  queryOptions?: {
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
    refetchInterval?: number | false;
  };
  extraQueryParams?: Record<string, string | number | boolean>;

  // Search
  searchKey?: string;
  searchPlaceholder?: string;

  /**
   * When true, the table header will remain fixed/sticky at the top while scrolling.
   * @default false
   */
  fixedHeader?: boolean;

  /**
   * Maximum height for the table container (e.g., "400px", "50vh").
   */
  maxHeight?: string;

  // Custom Response Mapper
  responseMapper?: (response: unknown) => ResponseMapperResult<TData>;
  responseKeys?: ResponseKeys;

  // Export
  enableExport?: boolean;
  exportFilename?: string;
  exportColumns?: ExportColumn<TData>[];

  // Bulk actions (shown when rows are selected)
  bulkActions?: BulkAction<TData>[];

  // Virtual scrolling
  /**
   * When true, renders rows using TanStack Virtual for efficient rendering
   * of large datasets. Uses CSS Grid layout with absolute-positioned rows.
   * Automatically enables fixedHeader. Requires maxHeight (defaults to "600px").
   * Columns should define `size` on their ColumnDef for best results.
   */
  enableVirtual?: boolean;

  /**
   * Custom row height estimate for the virtualizer (in pixels).
   * When not provided, derived from the current density setting.
   */
  virtualRowHeight?: number;

  /**
   * Number of rows to render outside the visible area.
   * @default 5
   */
  virtualOverscan?: number;
}

// ============================================================================
// Toolbar Props
// ============================================================================

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
  advancedFilterFields?: DataTableAdvancedFilterField[];
  tabs?: DataTab[];
  showTab?: boolean;
  filterCount?: number;
  onReset?: () => void;
  children?: JSX.Element;
  searchKey?: string;
  searchPlaceholder?: string;
  filters?: Component<{ table: Table<TData> }>;
  tableId?: string;
  facetedFilters?: Record<string, string[] | null>;
  setFacetedFilters?: (
    updater:
      | Record<string, string[] | null>
      | ((prev: Record<string, string[] | null>) => Record<string, string[] | null>),
  ) => void;
}
