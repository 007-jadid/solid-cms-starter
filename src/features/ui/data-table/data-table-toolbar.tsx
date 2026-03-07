/**
 * DataTable Toolbar Component
 * Contains search, filters, tabs, and settings
 */

import type { Table } from "@tanstack/solid-table";
import { For, type JSX, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { ExportColumn } from "~/features/lib/export";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";
import { type BulkAction, DataTableBulkActions } from "./data-table-bulk-actions";
import { DataTableColumnVisibility } from "./data-table-column-visibility";
import { DataTableExport } from "./data-table-export";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableInputFilter } from "./data-table-input-filter";
import { DataTableSearch } from "./data-table-search";
import { DataTableSettings } from "./data-table-settings";
import { DataTableTabs } from "./data-table-tabs";
import type { DataTab, DataTableAdvancedFilterField, DataTableFilterField } from "./types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
  facetedFilters?: Record<string, string[] | null>;
  setFacetedFilters?: (
    updater:
      | Record<string, string[] | null>
      | ((prev: Record<string, string[] | null>) => Record<string, string[] | null>),
  ) => void;
  advancedFilterFields?: DataTableAdvancedFilterField[];
  filters?: (props: { table: Table<TData> }) => JSX.Element;
  tabs?: DataTab[];
  showTab?: boolean;
  filterCount?: number;
  onReset?: () => void;
  children?: JSX.Element;
  searchKey?: string;
  searchPlaceholder?: string;
  tableId?: string;
  // Export
  enableExport?: boolean;
  exportData?: () => TData[];
  exportFilename?: string;
  exportColumns?: ExportColumn<TData>[];
  // Bulk actions
  bulkActions?: BulkAction<TData>[];
  selectedRows?: () => TData[];
  onClearSelection?: () => void;
  // Tab change callback (for re-animating rows)
  onTabChange?: (tab: string) => void;
}

export function DataTableToolbar<TData>(props: DataTableToolbarProps<TData>) {
  const isFiltered = () => (props.filterCount ?? 0) > 0;

  const handleReset = () => {
    props.table.resetColumnFilters();
    props.onReset?.();
  };

  const selectedCount = () => props.table.getFilteredSelectedRowModel().rows.length;

  return (
    <div class="flex flex-col gap-4">
      {/* Tabs */}
      <Show when={props.showTab && props.tabs && props.tabs.length > 0}>
        <DataTableTabs tabs={props.tabs!} onTabChange={props.onTabChange} />
      </Show>

      {/* Bulk actions bar */}
      <Show when={(props.bulkActions?.length ?? 0) > 0 && selectedCount() > 0}>
        <DataTableBulkActions
          selectedCount={selectedCount()}
          selectedRows={props.selectedRows ?? (() => [])}
          actions={props.bulkActions!}
          onClearSelection={props.onClearSelection ?? (() => {})}
        />
      </Show>

      {/* Main toolbar row */}
      <div class="flex items-start justify-between gap-2">
        <div class="flex flex-1 flex-wrap items-center gap-2">
          {/* Search */}
          <DataTableSearch searchKey={props.searchKey} placeholder={props.searchPlaceholder} />

          {/* Filter fields */}
          <For each={props.filterFields}>
            {(field) => (
              <Show
                when={field.type === "input"}
                fallback={
                  <DataTableFacetedFilter
                    filterKey={field.value as string}
                    title={field.label}
                    options={field.options}
                    fetchOptions={field.fetchOptions}
                    fetchOptionsSimple={field.fetchOptionsSimple}
                    fetchSelectedOptions={field.fetchSelectedOptions}
                    optionMapper={field.optionMapper}
                    asyncConfig={field.asyncConfig}
                    multiSelect={field.multiSelect}
                    value={props.facetedFilters?.[field.value as string] ?? null}
                    onChange={(newValue) => {
                      props.setFacetedFilters?.((prev) => ({
                        ...prev,
                        [field.value as string]: newValue,
                      }));
                    }}
                    column={props.table.getColumn(field.value as string)}
                  />
                }
              >
                <DataTableInputFilter
                  filterKey={field.value as string}
                  title={field.label}
                  placeholder={field.placeholder}
                  inputType={field.inputType}
                  validation={field.validation}
                  value={props.facetedFilters?.[field.value as string]?.[0] ?? null}
                  onChange={(newValue) => {
                    props.setFacetedFilters?.((prev) => ({
                      ...prev,
                      [field.value as string]: newValue ? [newValue] : null,
                    }));
                  }}
                />
              </Show>
            )}
          </For>

          {/* Advanced filters popover */}
          <Show when={props.filters || props.advancedFilterFields?.length}>
            <AdvancedFiltersPopover
              table={props.table}
              CustomFilters={props.filters}
              advancedFilterFields={props.advancedFilterFields}
              filterCount={props.filterCount ?? 0}
            />
          </Show>

          {/* Reset button */}
          <Show when={isFiltered()}>
            <Button variant="ghost" onClick={handleReset} class="h-8 px-2 lg:px-3">
              Reset
              <svg class="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                <path
                  fill="currentColor"
                  d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"
                />
              </svg>
            </Button>
          </Show>

          {/* Custom children (like refresh button) */}
          {props.children}
        </div>

        {/* Column visibility + Export + Settings */}
        <div class="flex items-center gap-2">
          <Show when={props.enableExport && props.exportData}>
            <DataTableExport
              data={props.exportData!}
              filename={props.exportFilename ?? "export"}
              columns={props.exportColumns}
            />
          </Show>
          <DataTableColumnVisibility table={props.table} tableId={props.tableId} />
          <DataTableSettings table={props.table} tableId={props.tableId} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Advanced Filters Popover
// ============================================================================

interface AdvancedFiltersPopoverProps<TData> {
  table: Table<TData>;
  CustomFilters?: (props: { table: Table<TData> }) => JSX.Element;
  advancedFilterFields?: DataTableAdvancedFilterField[];
  filterCount: number;
}

function AdvancedFiltersPopover<TData>(props: AdvancedFiltersPopoverProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger
        as={(triggerProps: Record<string, unknown>) => (
          <Button {...triggerProps} variant="outline" size="sm" class="h-8 border-dashed">
            <svg
              class="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
            <Show when={props.filterCount > 0}>
              <Badge variant="secondary" class="ml-2 rounded-sm px-1 font-normal lg:hidden">
                {props.filterCount}
              </Badge>
            </Show>
          </Button>
        )}
      />
      <PopoverContent class="w-80 p-4">
        <Show when={props.CustomFilters}>
          <Dynamic component={props.CustomFilters!} table={props.table} />
        </Show>
        <For each={props.advancedFilterFields}>
          {(field) => (
            <div class="mb-4">
              <label class="text-sm font-medium">{field.label}</label>
              {/* Advanced filter implementation */}
            </div>
          )}
        </For>
      </PopoverContent>
    </Popover>
  );
}
