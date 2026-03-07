/**
 * DataTable Component
 * Main data table component that orchestrates all sub-components
 *
 * Features:
 * - Server-side and client-side data handling
 * - URL state synchronization
 * - Row selection, editing, and drag-and-drop
 * - Expandable rows with sub-components or sub-grids
 * - Faceted and advanced filtering
 * - Column visibility and pinning
 * - Density customization
 * - Pagination with configurable page sizes
 */

import { Show } from "solid-js";

import { DataTableContent } from "./data-table-content";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableRefreshButton } from "./data-table-refresh-button";
import { DataTableToolbar } from "./data-table-toolbar";
import { useDataTable } from "./hooks";
import type { DataTab, DataTableProps } from "./types";

const DEFAULT_TABS: DataTab[] = [
  { keyName: "active", title: "Active" },
  { keyName: "inactive", title: "Inactive" },
];

export function DataTable<TData extends { id?: string | number }, TValue>(
  props: DataTableProps<TData, TValue>,
) {
  const {
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
    isSaving,
    handleSave,
    handleCancel,

    // Filters
    facetedFilters,
    setFacetedFilters,
    totalFilterCount,

    // Search
    resetSearch,

    // Helpers
    resetFilters,
  } = useDataTable(props);

  // Combine default and custom tabs; fall back to DEFAULT_TABS when none provided
  // and tabs are not explicitly disabled (showTab !== false)
  const tabs = (): DataTab[] => {
    if (props.showTab === false) return [];
    const combined = [...(props.defaultTabs ?? []), ...(props.customTabs ?? [])];
    return combined.length > 0 ? combined : DEFAULT_TABS;
  };

  // Show tabs unless explicitly disabled
  const showTab = () => props.showTab !== false;

  const hasActiveFilters = () => totalFilterCount() > 0;

  // Handle reset action
  const handleReset = () => {
    resetFilters();
    if (props.resetSearchOnReset) {
      resetSearch();
    }
    props.onReset?.();
  };

  return (
    <div class="m-2 space-y-4 font-sans">
      {/* Toolbar with search, filters, tabs, and settings */}
      <DataTableToolbar
        table={table}
        filterFields={props.filterFields}
        facetedFilters={facetedFilters()}
        setFacetedFilters={setFacetedFilters}
        advancedFilterFields={props.advancedFilterFields}
        filters={props.filters}
        tabs={tabs()}
        showTab={showTab()}
        filterCount={totalFilterCount()}
        onReset={handleReset}
        searchKey={props.searchKey}
        searchPlaceholder={props.searchPlaceholder}
        tableId={props.tableId}
        enableExport={props.enableExport}
        exportData={tableData}
        exportFilename={props.exportFilename}
        exportColumns={props.exportColumns}
        bulkActions={props.bulkActions}
        selectedRows={() => table.getFilteredSelectedRowModel().rows.map((r) => r.original)}
        onClearSelection={() => table.resetRowSelection()}
      >
        {/* Refresh button slot */}
        <Show when={props.url || props.fetcher}>
          <DataTableRefreshButton onClick={() => refetch()} isFetching={isFetching()} />
        </Show>
      </DataTableToolbar>

      {/* Table content with header and body */}
      <DataTableContent
        table={table}
        columns={props.columns}
        tableData={tableData()}
        enableExpanding={props.enableExpanding}
        enableDragAndDrop={props.enableDragAndDrop}
        enableRowEditable={props.enableRowEditable}
        isFetching={isFetching()}
        isError={isError()}
        onRetry={() => refetch()}
        editingRowId={editingRowId()}
        handleSave={handleSave}
        handleCancel={handleCancel}
        isSaving={isSaving()}
        renderSubComponent={props.renderSubComponent}
        subGridConfig={props.subGridConfig}
        showDefaultRowActions={props.showDefaultRowActions}
        hasActiveFilters={hasActiveFilters()}
        fixedHeader={props.fixedHeader}
        maxHeight={props.maxHeight}
        onDragEnd={handleDragEnd}
        enableVirtual={props.enableVirtual}
        virtualRowHeight={props.virtualRowHeight}
        virtualOverscan={props.virtualOverscan}
      />

      {/* Pagination controls */}
      <DataTablePagination
        table={table}
        totalItems={totalItems()}
        enableRowSelection={props.enableRowSelection}
      />
    </div>
  );
}

// Re-export for backward compatibility
export type { DataTableProps };
