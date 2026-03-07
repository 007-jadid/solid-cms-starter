/**
 * DataTable Module Exports
 *
 * This module provides a fully-featured data table component with:
 * - Server-side and client-side data handling
 * - URL state synchronization
 * - Row selection, editing, and drag-and-drop
 * - Expandable rows with sub-components or sub-grids
 * - Faceted and advanced filtering
 * - Column visibility and pinning
 * - Density customization
 * - Pagination with configurable page sizes
 */

// ============================================================================
// Main Component
// ============================================================================

export { DataTable } from "./data-table";
export type { BulkAction } from "./data-table-bulk-actions";
export { DataTableBulkActions } from "./data-table-bulk-actions";
export { DataTableExport } from "./data-table-export";
export type { VirtualizedTableProps } from "./virtualized-table";
export { VirtualizedTable } from "./virtualized-table";

// ============================================================================
// Sub-Components (for custom compositions)
// ============================================================================

export { DataTableBody } from "./data-table-body";
export { DataTableColumnHeader } from "./data-table-column-header";
export { DataTableContent } from "./data-table-content";
export { DataTableEditableCell } from "./data-table-editable-cell";
export { DataTableExpandToggle } from "./data-table-expand-toggle";
export { DataTableFacetedFilter } from "./data-table-faceted-filter";
export { DataTableInputFilter } from "./data-table-input-filter";
export { DataTablePagination } from "./data-table-pagination";
export { DataTableRowComponent } from "./data-table-row";
export { DataTableRowActions } from "./data-table-row-actions";
export { DataTableSearch } from "./data-table-search";
export { DataTableSettings } from "./data-table-settings";
export {
  DataTableEmptyRow,
  DataTableErrorRow,
  DataTableLoadingOverlay,
  DataTableLoadingRow,
} from "./data-table-states";
export { DataTableSubGrid } from "./data-table-sub-grid";
export { DataTableTabs } from "./data-table-tabs";
export { DataTableToolbar } from "./data-table-toolbar";
export { DataTableVirtualBody } from "./data-table-virtual-body";

// ============================================================================
// Hooks
// ============================================================================

export { useAsyncOptions } from "./hooks/use-async-options";
export { useDataTable } from "./hooks/use-data-table";
export { useDataTableSource } from "./hooks/use-data-table-source";
export { useInfiniteTableSource } from "./hooks/use-infinite-table-source";
export { useRowEditing } from "./hooks/use-row-editing";
export { serializers, useUrlState, useUrlStates } from "./hooks/use-url-state";

// ============================================================================
// Utilities
// ============================================================================

export { getCommonPinningStyles } from "./get-common-pinning-styles";
export {
  DEFAULT_ASYNC_CONFIG,
  DEFAULT_VIRTUAL_MAX_HEIGHT,
  DEFAULT_VIRTUAL_OVERSCAN,
  DENSITY_CLASSES,
  PAGE_SIZE_OPTIONS,
  QUERY_KEYS,
  VIRTUAL_ROW_HEIGHTS,
} from "./utils/constants";
export {
  arraysShallowEqual,
  countActiveFilters,
  filterOptionsBySearch,
  toggleFilterValue,
} from "./utils/filters";
export { buildQueryString, defaultResponseMapper } from "./utils/query-utils";
export {
  columnVisibilityStorage,
  densityStorage,
  STORAGE_KEYS,
  selectedOptionsCache,
} from "./utils/storage";

// ============================================================================
// Types
// ============================================================================

export type {
  ColumnFilterParam,
  // API Types
  FetcherOptions,
  PaginationResponse,
  QueryParser,
  QueryParserInput,
  ResponseKeys,
  ResponseMapperResult,
  SortingParam,
} from "./types/api.types";

export type {
  // Filter Types
  AsyncOptionsConfig,
  AsyncOptionsResponse,
  DataTableAdvancedFilterField,
  DataTableFilterField,
  FilterOption,
} from "./types/filter.types";

export type {
  // Table Types
  DataTab,
  DataTableProps,
  DataTableToolbarProps,
  DensityState,
  EditingHelpers,
  RowWithId,
  SubGridConfig,
} from "./types/table.types";
