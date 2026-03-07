/**
 * DataTable Row Component
 * Individual table row with support for selection, editing, and expansion
 */

import { flexRender, type Row } from "@tanstack/solid-table";
import { createEffect, For, type JSX, on, Show } from "solid-js";
import {
  animateEditEnd,
  animateEditStart,
  animateRowDeselect,
  animateRowSelect,
} from "~/features/lib/gsap-directives";
import { cn } from "~/features/lib/utils";
import { Button } from "../components/button";
import { TableCell, TableRow } from "../components/table";

import { DataTableExpandToggle } from "./data-table-expand-toggle";
import { DataTableRowActions } from "./data-table-row-actions";
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

interface DataTableRowComponentProps<TData> {
  row: Row<TData>;
  isSelected: boolean;
  isExpanded: boolean;
  enableExpanding?: boolean;
  enableRowEditable?: boolean;
  editingRowId: string | null;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  isSaving: boolean;
  renderSubComponent?: (props: { row: Row<TData> }) => JSX.Element;
  subGridConfig?: SubGridConfig<TData, unknown>;
  showDefaultRowActions?: boolean;
  density: DensityState;
  // Drag and drop props
  draggable?: boolean;
  onDragStart?: (e: DragEvent) => void;
  onDragOver?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
}

export function DataTableRowComponent<TData>(props: DataTableRowComponentProps<TData>) {
  let rowRef!: HTMLTableRowElement;
  const isEditing = () => props.editingRowId === props.row.id;
  const densityClass = () => DENSITY_CLASSES[props.density];

  // Animate selection change
  createEffect(
    on(
      () => props.isSelected,
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

  // Animate editing state change
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
      <TableRow
        ref={rowRef}
        data-state={props.isSelected && "selected"}
        class={cn(
          "dt-row-hoverable",
          isEditing() && "bg-muted/50 dt-row-editing",
          props.isSelected &&
            "bg-primary/5 dark:bg-primary/10 shadow-[inset_4px_0_0_0_hsl(var(--primary))]",
        )}
        draggable={props.draggable}
        onDragStart={props.onDragStart}
        onDragOver={props.onDragOver}
        onDrop={props.onDrop}
      >
        {/* Expand toggle cell */}
        <Show when={props.enableExpanding}>
          <TableCell class={cn("w-12", densityClass())}>
            <DataTableExpandToggle row={props.row} />
          </TableCell>
        </Show>

        {/* Drag handle cell */}
        <Show when={props.draggable}>
          <TableCell class={cn("w-12", densityClass())}>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 cursor-move"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <GripVerticalIcon />
            </Button>
          </TableCell>
        </Show>

        {/* Data cells */}
        <For each={props.row.getVisibleCells()}>
          {(cell) => (
            <TableCell style={getCommonPinningStyles(cell.column)} class={densityClass()}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          )}
        </For>

        {/* Row actions cell (for editing) */}
        <Show
          when={props.enableRowEditable && (props.showDefaultRowActions ?? true) && isEditing()}
        >
          <TableCell
            class={cn(
              "sticky right-0 z-20 w-30 bg-background shadow-[-5px_0px_5px_-5px_rgb(0_0_0/0.1)]",
              densityClass(),
            )}
          >
            <DataTableRowActions
              onSave={props.handleSave}
              onCancel={props.handleCancel}
              isSaving={props.isSaving}
            />
          </TableCell>
        </Show>
      </TableRow>

      {/* Expanded content */}
      <Show when={props.isExpanded && (props.subGridConfig || props.renderSubComponent)}>
        <TableRow class="dt-expand-content-enter">
          <TableCell
            colSpan={
              props.row.getVisibleCells().length +
              (props.enableExpanding ? 1 : 0) +
              (props.draggable ? 1 : 0) +
              (props.enableRowEditable ? 1 : 0)
            }
          >
            <Show
              when={props.subGridConfig}
              fallback={props.renderSubComponent?.({ row: props.row })}
            >
              <DataTableSubGrid row={props.row} config={props.subGridConfig!} />
            </Show>
          </TableCell>
        </TableRow>
      </Show>
    </>
  );
}
