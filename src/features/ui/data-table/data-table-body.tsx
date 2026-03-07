/**
 * DataTable Body Component
 * Renders table rows with support for drag-and-drop, loading, error, and empty states
 */

import type { ColumnDef, Row, Table as TableType } from "@tanstack/solid-table";
import { For, type JSX, Show } from "solid-js";

import { TableBody } from "../components/table";

import { DataTableRowComponent } from "./data-table-row";
import { DataTableEmptyRow, DataTableErrorRow, DataTableLoadingRow } from "./data-table-states";
import type { DensityState, SubGridConfig } from "./types";

interface DataTableBodyProps<TData, TValue> {
  table: TableType<TData>;
  columns: ColumnDef<TData, TValue>[];
  tableData: TData[];
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

export function DataTableBody<TData, TValue>(props: DataTableBodyProps<TData, TValue>) {
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

  // Render state row (loading, error, or empty)
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

  // Handle drag events for drag-and-drop
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

  return (
    <TableBody>
      <Show when={rows().length > 0} fallback={renderStateRow()}>
        <For each={rows()}>
          {(row, index) => (
            <DataTableRowComponent
              row={row}
              isSelected={row.getIsSelected()}
              isExpanded={row.getIsExpanded()}
              enableExpanding={props.enableExpanding}
              enableRowEditable={props.enableRowEditable}
              editingRowId={props.editingRowId}
              handleSave={props.handleSave}
              handleCancel={props.handleCancel}
              isSaving={props.isSaving}
              renderSubComponent={props.renderSubComponent}
              subGridConfig={props.subGridConfig}
              showDefaultRowActions={props.showDefaultRowActions}
              density={density()}
              draggable={props.enableDragAndDrop}
              onDragStart={props.enableDragAndDrop ? (e) => handleDragStart(e, index()) : undefined}
              onDragOver={props.enableDragAndDrop ? handleDragOver : undefined}
              onDrop={props.enableDragAndDrop ? (e) => handleDrop(e, index()) : undefined}
            />
          )}
        </For>
      </Show>
    </TableBody>
  );
}
