/**
 * DataTable Virtual Body Component
 * Renders virtualized table rows using CSS Grid + absolute positioning.
 * Follows the official TanStack Table + Virtual integration pattern.
 */

import {
  type ColumnDef,
  flexRender,
  type Row,
  type Table as TableType,
} from "@tanstack/solid-table";
import type { Virtualizer } from "@tanstack/solid-virtual";
import { createEffect, For, type JSX, on, Show } from "solid-js";
import {
  animateEditEnd,
  animateEditStart,
  animateRowDeselect,
  animateRowSelect,
} from "~/features/lib/gsap-directives";
import { cn } from "~/features/lib/utils";
import { Button } from "../components/button";

import { DataTableExpandToggle } from "./data-table-expand-toggle";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableEmptyRow, DataTableErrorRow, DataTableLoadingRow } from "./data-table-states";
import { DataTableSubGrid } from "./data-table-sub-grid";
import { getCommonPinningStyles } from "./get-common-pinning-styles";
import type { DensityState, SubGridConfig } from "./types";
import { DENSITY_CLASSES } from "./utils";

// Drag handle icon (6 vertical dots)
const GripVerticalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
    <circle cx="9" cy="5" r="1.5" />
    <circle cx="15" cy="5" r="1.5" />
    <circle cx="9" cy="12" r="1.5" />
    <circle cx="15" cy="12" r="1.5" />
    <circle cx="9" cy="19" r="1.5" />
    <circle cx="15" cy="19" r="1.5" />
  </svg>
);

interface DataTableVirtualBodyProps<TData, TValue> {
  table: TableType<TData>;
  columns: ColumnDef<TData, TValue>[];
  tableData: TData[];
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  enableExpanding?: boolean;
  enableDragAndDrop?: boolean;
  enableRowEditable?: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry?: () => void;
  editingRowId: string | null;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  isSaving: boolean;
  renderSubComponent?: (props: { row: Row<TData> }) => JSX.Element;
  subGridConfig?: SubGridConfig<TData, unknown>;
  showDefaultRowActions?: boolean;
  hasActiveFilters?: boolean;
  onDragEnd?: (fromIndex: number, toIndex: number) => void;
}

function calculateColSpan<TData, TValue>(
  columns: ColumnDef<TData, TValue>[],
  enableExpanding: boolean,
  enableDragAndDrop: boolean,
  enableRowEditable: boolean,
): number {
  return (
    columns.length +
    (enableExpanding ? 1 : 0) +
    (enableDragAndDrop ? 1 : 0) +
    (enableRowEditable ? 1 : 0)
  );
}

// Firefox measures table border height incorrectly with measureElement
const shouldMeasure =
  typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1;

// ─── Virtual Row wrapper with micro-animations ──────────────
interface VirtualRowProps<TData, _TValue> {
  virtualIndex: number;
  virtualStart: number;
  row: Row<TData>;
  density: DensityState;
  editingRowId: string | null;
  enableExpanding?: boolean;
  enableDragAndDrop?: boolean;
  enableRowEditable?: boolean;
  showDefaultRowActions?: boolean;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  isSaving: boolean;
  subGridConfig?: SubGridConfig<TData, unknown>;
  renderSubComponent?: (props: { row: Row<TData> }) => JSX.Element;
  onDragStart?: (e: DragEvent) => void;
  onDragOver?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
  measureElement: ((node: Element) => void) | undefined;
}

function VirtualRow<TData, TValue>(props: VirtualRowProps<TData, TValue>) {
  let rowRef!: HTMLTableRowElement;
  const isEditing = () => props.editingRowId === props.row.id;
  const densityClass = () => DENSITY_CLASSES[props.density];

  // Selection micro-animation
  createEffect(
    on(
      () => props.row.getIsSelected(),
      (selected) => {
        if (!rowRef) return;
        if (selected) {
          animateRowSelect(rowRef);
        } else {
          animateRowDeselect(rowRef);
        }
      },
      { defer: true },
    ),
  );

  // Editing micro-animation
  createEffect(
    on(
      () => isEditing(),
      (editing) => {
        if (!rowRef) return;
        if (editing) {
          animateEditStart(rowRef);
        } else {
          animateEditEnd(rowRef);
        }
      },
      { defer: true },
    ),
  );

  return (
    <>
      {/* Main data row — absolute positioned */}
      <tr
        ref={(node) => {
          rowRef = node;
          if (shouldMeasure && props.measureElement) {
            queueMicrotask(() => props.measureElement!(node));
          }
        }}
        data-index={props.virtualIndex}
        data-state={props.row.getIsSelected() ? "selected" : undefined}
        class={cn(
          "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dt-virtual-row-fade dt-row-hoverable",
          isEditing() && "bg-muted/50 dt-row-editing",
          props.row.getIsSelected() &&
            "bg-primary/5 dark:bg-primary/10 shadow-[inset_4px_0_0_0_hsl(var(--primary))]",
        )}
        style={{
          display: "flex",
          position: "absolute",
          transform: `translateY(${props.virtualStart}px)`,
          width: "100%",
        }}
        draggable={props.enableDragAndDrop}
        onDragStart={props.onDragStart}
        onDragOver={props.onDragOver}
        onDrop={props.onDrop}
      >
        {/* Expand toggle cell */}
        <Show when={props.enableExpanding}>
          <td
            class={cn("p-2 align-middle", densityClass())}
            style={{ display: "flex", width: "48px", "flex-shrink": "0" }}
          >
            <DataTableExpandToggle row={props.row} />
          </td>
        </Show>

        {/* Drag handle cell */}
        <Show when={props.enableDragAndDrop}>
          <td
            class={cn("p-2 align-middle", densityClass())}
            style={{ display: "flex", width: "48px", "flex-shrink": "0" }}
          >
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 cursor-move"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <GripVerticalIcon />
            </Button>
          </td>
        </Show>

        {/* Data cells with explicit widths */}
        <For each={props.row.getVisibleCells()}>
          {(cell) => (
            <td
              class={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0", densityClass())}
              style={{
                display: "flex",
                width: `${cell.column.getSize()}px`,
                "flex-shrink": "0",
                "align-items": "center",
                ...getCommonPinningStyles(cell.column),
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          )}
        </For>

        {/* Row actions cell (for editing) */}
        <Show
          when={props.enableRowEditable && (props.showDefaultRowActions ?? true) && isEditing()}
        >
          <td
            class={cn(
              "p-2 align-middle sticky right-0 z-20 w-30 bg-background shadow-[-5px_0px_5px_-5px_rgb(0_0_0/0.1)]",
              densityClass(),
            )}
            style={{ display: "flex", "flex-shrink": "0" }}
          >
            <DataTableRowActions
              onSave={props.handleSave}
              onCancel={props.handleCancel}
              isSaving={props.isSaving}
            />
          </td>
        </Show>
      </tr>

      {/* Expanded content — rendered outside the absolute flow */}
      <Show when={props.row.getIsExpanded() && (props.subGridConfig || props.renderSubComponent)}>
        <tr
          class="border-b dt-expand-content-enter"
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <td style={{ display: "flex", width: "100%", flex: "1" }} class="p-2">
            <Show
              when={props.subGridConfig}
              fallback={props.renderSubComponent?.({ row: props.row })}
            >
              <DataTableSubGrid row={props.row} config={props.subGridConfig!} />
            </Show>
          </td>
        </tr>
      </Show>
    </>
  );
}

export function DataTableVirtualBody<TData, TValue>(
  props: DataTableVirtualBodyProps<TData, TValue>,
) {
  const colSpan = () =>
    calculateColSpan(
      props.columns,
      props.enableExpanding ?? false,
      props.enableDragAndDrop ?? false,
      props.enableRowEditable ?? false,
    );

  const hasData = () => props.tableData.length > 0;
  const density = () => (props.table.options.meta?.density || "md") as DensityState;
  const rows = () => props.table.getRowModel().rows;

  // Render state row (loading, error, or empty) — uses standard table layout
  const renderStateRow = () => {
    if (props.isError) {
      return <DataTableErrorRow colSpan={colSpan()} onRetry={props.onRetry} />;
    }

    if (props.isFetching && !hasData()) {
      return <DataTableLoadingRow colSpan={colSpan()} />;
    }

    return (
      <DataTableEmptyRow colSpan={colSpan()} hasActiveFilters={props.hasActiveFilters ?? false} />
    );
  };

  // Drag-and-drop handlers
  const handleDragStart = (e: DragEvent, index: number) => {
    e.dataTransfer?.setData("text/plain", String(index));
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = Number(e.dataTransfer?.getData("text/plain") ?? 0);
    props.onDragEnd?.(fromIndex, toIndex);
  };

  const measureFn = shouldMeasure
    ? (node: Element) => props.virtualizer.measureElement(node)
    : undefined;

  return (
    <tbody
      style={
        rows().length > 0
          ? {
              display: "grid",
              height: `${props.virtualizer.getTotalSize()}px`,
              position: "relative",
            }
          : undefined
      }
      class={cn("[&_tr:last-child]:border-0")}
    >
      <Show when={rows().length > 0} fallback={renderStateRow()}>
        <For each={props.virtualizer.getVirtualItems()}>
          {(virtualRow) => {
            const row = () => rows()[virtualRow.index];

            return (
              <Show when={row()}>
                <VirtualRow
                  virtualIndex={virtualRow.index}
                  virtualStart={virtualRow.start}
                  row={row()}
                  density={density()}
                  editingRowId={props.editingRowId}
                  enableExpanding={props.enableExpanding}
                  enableDragAndDrop={props.enableDragAndDrop}
                  enableRowEditable={props.enableRowEditable}
                  showDefaultRowActions={props.showDefaultRowActions}
                  handleSave={props.handleSave}
                  handleCancel={props.handleCancel}
                  isSaving={props.isSaving}
                  subGridConfig={props.subGridConfig}
                  renderSubComponent={props.renderSubComponent}
                  measureElement={measureFn}
                  onDragStart={
                    props.enableDragAndDrop
                      ? (e) => handleDragStart(e, virtualRow.index)
                      : undefined
                  }
                  onDragOver={props.enableDragAndDrop ? handleDragOver : undefined}
                  onDrop={
                    props.enableDragAndDrop ? (e) => handleDrop(e, virtualRow.index) : undefined
                  }
                />
              </Show>
            );
          }}
        </For>
      </Show>
    </tbody>
  );
}
