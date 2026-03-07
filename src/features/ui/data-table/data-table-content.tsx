/**
 * DataTable Content Component
 * Wraps the table with header and body.
 * Supports two rendering modes:
 * - Standard: uses Table/TableHeader/TableRow/TableHead UI primitives
 * - Virtual: uses raw <table> with CSS Grid layout + absolute-positioned rows
 */

import {
  type ColumnDef,
  flexRender,
  type Row,
  type Table as TableType,
} from "@tanstack/solid-table";
import { createVirtualizer } from "@tanstack/solid-virtual";
import { createMemo, For, type JSX, Show } from "solid-js";

import { cn } from "~/features/lib/utils";
import { Table, TableHead, TableHeader, TableRow } from "../components/table";

import { DataTableBody } from "./data-table-body";
import { DataTableLoadingOverlay } from "./data-table-states";
import { DataTableVirtualBody } from "./data-table-virtual-body";
import { getCommonPinningStyles } from "./get-common-pinning-styles";
import type { DensityState, SubGridConfig } from "./types";
import { DEFAULT_VIRTUAL_MAX_HEIGHT, DEFAULT_VIRTUAL_OVERSCAN, VIRTUAL_ROW_HEIGHTS } from "./utils";

// Firefox measures table border height incorrectly with measureElement
const shouldMeasure =
  typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1;

interface DataTableContentProps<TData, TValue> {
  table: TableType<TData>;
  columns: ColumnDef<TData, TValue>[];
  enableExpanding?: boolean;
  enableDragAndDrop?: boolean;
  enableRowEditable?: boolean;
  isFetching: boolean;
  isError: boolean;
  tableData: TData[];
  onRetry?: () => void;
  editingRowId: string | null;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  isSaving: boolean;
  renderSubComponent?: (props: { row: Row<TData> }) => JSX.Element;
  subGridConfig?: SubGridConfig<TData, unknown>;
  showDefaultRowActions?: boolean;
  hasActiveFilters?: boolean;
  fixedHeader?: boolean;
  maxHeight?: string;
  onDragEnd?: (fromIndex: number, toIndex: number) => void;
  // Virtual scrolling props
  enableVirtual?: boolean;
  virtualRowHeight?: number;
  virtualOverscan?: number;
  /** Callback to expose the scroll container ref to parent (for infinite scroll detection) */
  onScrollRef?: (el: HTMLDivElement) => void;
  /** Scroll event handler (for infinite scroll detection) */
  onScroll?: (e: Event) => void;
}

export function DataTableContent<TData, TValue>(props: DataTableContentProps<TData, TValue>) {
  let scrollRef!: HTMLDivElement;

  const showLoadingOverlay = () => props.isFetching && props.tableData.length > 0;

  // Density-aware row height for virtualizer
  const density = () => (props.table.options.meta?.density || "md") as DensityState;
  const estimatedRowHeight = () => props.virtualRowHeight ?? VIRTUAL_ROW_HEIGHTS[density()];

  // Virtualizer instance (only active when enableVirtual is true)
  const rowCount = createMemo(() =>
    props.enableVirtual ? props.table.getRowModel().rows.length : 0,
  );

  const virtualizer = createVirtualizer({
    get count() {
      return rowCount();
    },
    getScrollElement: () => scrollRef,
    estimateSize: () => estimatedRowHeight(),
    overscan: props.virtualOverscan ?? DEFAULT_VIRTUAL_OVERSCAN,
    measureElement: shouldMeasure
      ? (element) => element?.getBoundingClientRect().height
      : undefined,
  });

  // When virtual mode is on, force fixedHeader and ensure maxHeight
  const effectiveMaxHeight = () =>
    props.enableVirtual ? (props.maxHeight ?? DEFAULT_VIRTUAL_MAX_HEIGHT) : props.maxHeight;

  // Shared body props
  const bodyProps = () => ({
    table: props.table,
    columns: props.columns,
    tableData: props.tableData,
    enableExpanding: props.enableExpanding,
    enableDragAndDrop: props.enableDragAndDrop,
    enableRowEditable: props.enableRowEditable,
    isFetching: props.isFetching,
    isError: props.isError,
    onRetry: props.onRetry,
    editingRowId: props.editingRowId,
    handleSave: props.handleSave,
    handleCancel: props.handleCancel,
    isSaving: props.isSaving,
    renderSubComponent: props.renderSubComponent,
    subGridConfig: props.subGridConfig,
    showDefaultRowActions: props.showDefaultRowActions,
    hasActiveFilters: props.hasActiveFilters,
    onDragEnd: props.onDragEnd,
  });

  return (
    <div class="relative rounded-md border">
      <DataTableLoadingOverlay isVisible={showLoadingOverlay()} />

      <Show
        when={props.enableVirtual}
        fallback={
          /* ================================================================
           * STANDARD (non-virtual) rendering — unchanged from original
           * ================================================================ */
          <div
            ref={(el) => {
              scrollRef = el;
            }}
            class="overflow-auto"
            style={props.maxHeight ? { "max-height": props.maxHeight } : undefined}
          >
            <Table>
              <TableHeader
                class={props.fixedHeader ? "sticky top-0 z-10 bg-background" : undefined}
              >
                <For each={props.table.getHeaderGroups()}>
                  {(headerGroup) => (
                    <TableRow>
                      {props.enableExpanding && <TableHead class="w-12" />}
                      {props.enableDragAndDrop && <TableHead class="w-12" />}
                      <For each={headerGroup.headers}>
                        {(header) => (
                          <TableHead
                            colSpan={header.colSpan}
                            style={getCommonPinningStyles(header.column)}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        )}
                      </For>
                    </TableRow>
                  )}
                </For>
              </TableHeader>

              <DataTableBody {...bodyProps()} />
            </Table>
          </div>
        }
      >
        {/* ================================================================
         * VIRTUAL rendering — CSS Grid table with absolute-positioned rows
         * Skips the Table UI component (which has an unwanted overflow-auto wrapper)
         * ================================================================ */}
        <div
          ref={(el) => {
            scrollRef = el;
            props.onScrollRef?.(el);
          }}
          class="overflow-auto"
          style={{
            "max-height": effectiveMaxHeight()!,
            position: "relative",
          }}
          onScroll={props.onScroll}
        >
          <table
            class="w-full caption-bottom text-sm"
            style={{ display: "grid", "min-width": "100%" }}
          >
            {/* FIXED HEADER — stays pinned at top while body scrolls */}
            <thead
              class={cn("[&_tr]:border-b bg-background")}
              style={{
                display: "grid",
                position: "sticky",
                top: "0",
                "z-index": "1",
              }}
            >
              <For each={props.table.getHeaderGroups()}>
                {(headerGroup) => (
                  <tr
                    class="border-b transition-colors hover:bg-muted/50"
                    style={{ display: "flex", width: "100%" }}
                  >
                    {/* Expand column header */}
                    <Show when={props.enableExpanding}>
                      <th
                        class="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
                        style={{
                          display: "flex",
                          width: "48px",
                          "flex-shrink": "0",
                          "align-items": "center",
                        }}
                      />
                    </Show>

                    {/* Drag handle column header */}
                    <Show when={props.enableDragAndDrop}>
                      <th
                        class="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
                        style={{
                          display: "flex",
                          width: "48px",
                          "flex-shrink": "0",
                          "align-items": "center",
                        }}
                      />
                    </Show>

                    {/* Data column headers */}
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <th
                          colSpan={header.colSpan}
                          class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                          style={{
                            display: "flex",
                            width: `${header.getSize()}px`,
                            "flex-shrink": "0",
                            "align-items": "center",
                            ...getCommonPinningStyles(header.column),
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </thead>

            {/* SCROLLABLE BODY — absolute-positioned rows */}
            <DataTableVirtualBody {...bodyProps()} virtualizer={virtualizer} />
          </table>
        </div>
      </Show>
    </div>
  );
}
