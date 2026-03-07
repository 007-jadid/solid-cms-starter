/**
 * DataTable Editable Cell Component
 * Inline editable cell that switches between display and edit mode
 * Double-click on cell to start editing
 */

import type { CellContext } from "@tanstack/solid-table";
import { createEffect, createMemo, Show } from "solid-js";

import { cn } from "~/features/lib/utils";
import { TextField, TextFieldInput } from "~/features/ui/components/text-field";
import { inputBase, inputInvalid, inputRing, inputSize } from "~/features/ui/styles/input";

interface EditableCellProps<TData, TValue> {
  cell: CellContext<TData, TValue>;
}

export function DataTableEditableCell<TData, TValue>(props: EditableCellProps<TData, TValue>) {
  const meta = () => props.cell.table.options.meta;
  const isEditable = () => props.cell.column.columnDef.meta?.editable ?? false;
  const rowId = () => props.cell.row.id;
  const columnId = () => props.cell.column.id;
  const value = () => props.cell.getValue();

  // Check if this row is currently being edited
  const isRowEditing = createMemo(() => {
    const tableMeta = meta();
    if (!tableMeta) return false;
    const editingRowId = (tableMeta.editingRowId as unknown as () => string | null)?.();
    return editingRowId === rowId();
  });

  // Check if this specific cell is in edit mode (row editing + cell is editable)
  const isCellEditing = createMemo(() => {
    return isRowEditing() && isEditable();
  });

  // Get the first editable column ID from the table (using visible column order)
  const getFirstEditableColumnId = () => {
    const columns = props.cell.table.getVisibleLeafColumns();
    for (const col of columns) {
      if (col.columnDef.meta?.editable) {
        return col.id;
      }
    }
    return null;
  };

  const editingValue = createMemo(() => {
    const tableMeta = meta() as { editingData?: Record<string, unknown> } | undefined;
    return tableMeta?.editingData?.[columnId()] ?? value();
  });

  const handleChange = (newValue: string) => {
    meta()?.updateData?.(rowId(), columnId(), newValue);
  };

  const handleDoubleClick = () => {
    const tableMeta = meta();
    if (tableMeta?.startEditing) {
      // If this cell is editable, pass its columnId so it gets focused
      // If not editable, don't pass columnId so the first editable column gets focused
      if (isEditable()) {
        tableMeta.startEditing(rowId(), columnId());
      } else {
        tableMeta.startEditing(rowId());
      }
    }
  };

  // Handle keyboard events (ESC to cancel)
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      const tableMeta = meta() as { handleCancel?: () => void } | undefined;
      tableMeta?.handleCancel?.();
    }
  };

  // Callback ref that focuses and selects when the input is mounted
  const handleInputRef = (el: HTMLInputElement) => {
    if (!el || !isCellEditing()) return;

    const tableMeta = meta() as
      | {
          editingColumnId?: () => string | null;
          clearEditingColumnId?: () => void;
        }
      | undefined;

    const targetColumnId = tableMeta?.editingColumnId?.();
    const firstEditableColId = getFirstEditableColumnId();

    // Determine if this cell should focus
    const shouldThisCellFocus = targetColumnId
      ? targetColumnId === columnId()
      : columnId() === firstEditableColId;

    if (shouldThisCellFocus) {
      requestAnimationFrame(() => {
        el.focus();
        el.select();
        // Clear the editing column ID after focusing
        tableMeta?.clearEditingColumnId?.();
      });
    }
  };

  return (
    <Show
      when={isCellEditing()}
      fallback={
        <div
          onDblClick={handleDoubleClick}
          class={isEditable() ? "cursor-pointer select-none" : "select-none"}
        >
          {String(value() ?? "")}
        </div>
      }
    >
      <input
        ref={handleInputRef}
        type="text"
        value={String(editingValue() ?? "")}
        onInput={(e) => handleChange(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        class={cn(inputBase, inputSize.sm, inputRing, inputInvalid, "dt-input-enter")}
      />
    </Show>
  );
}

/**
 * Default cell renderer that handles editable cells
 * Double-click on cell to start editing
 */
export function createEditableCell<TData, TValue>() {
  return (cellContext: CellContext<TData, TValue>) => {
    let inputRef: HTMLInputElement | undefined;

    const meta = cellContext.table.options.meta;
    const isEditable = cellContext.column.columnDef.meta?.editable ?? false;
    const rowId = cellContext.row.id;
    const columnId = cellContext.column.id;
    // Wrap in accessor — cellContext.getValue() must be called inside a
    // tracking scope so the display updates when underlying data changes.
    const value = () => cellContext.getValue();

    // Check if this row is currently being edited
    const isRowEditing = () => {
      if (!meta) return false;
      const editingRowId = (meta.editingRowId as unknown as () => string | null)?.();
      return editingRowId === rowId;
    };

    // Check if this specific cell is in edit mode (row editing + cell is editable)
    const isCellEditing = () => {
      return isRowEditing() && isEditable;
    };

    // Get the first editable column ID from the table (using visible column order)
    const getFirstEditableColumnId = () => {
      const columns = cellContext.table.getVisibleLeafColumns();
      for (const col of columns) {
        if (col.columnDef.meta?.editable) {
          return col.id;
        }
      }
      return null;
    };

    const editingValue = () => {
      const tableMeta = meta as { editingData?: Record<string, unknown> } | undefined;
      return tableMeta?.editingData?.[columnId] ?? value();
    };

    const handleDoubleClick = () => {
      if (meta?.startEditing) {
        // If this cell is editable, pass its columnId so it gets focused
        // If not editable, don't pass columnId so the first editable column gets focused
        if (isEditable) {
          meta.startEditing(rowId, columnId);
        } else {
          meta.startEditing(rowId);
        }
      }
    };

    // Handle keyboard events (ESC to cancel)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        const tableMeta = meta as { handleCancel?: () => void } | undefined;
        tableMeta?.handleCancel?.();
      }
    };

    // Focus input when editing starts and this is the target cell
    createEffect(() => {
      if (isCellEditing() && inputRef) {
        // Check focus inside effect to ensure we get the latest editingColumnId
        const tableMeta = meta as
          | {
              editingColumnId?: () => string | null;
              clearEditingColumnId?: () => void;
            }
          | undefined;

        const targetColumnId = tableMeta?.editingColumnId?.();
        const firstEditableColId = getFirstEditableColumnId();

        // Determine if this cell should focus
        const shouldThisCellFocus = targetColumnId
          ? targetColumnId === columnId
          : columnId === firstEditableColId;

        if (shouldThisCellFocus) {
          requestAnimationFrame(() => {
            inputRef?.focus();
            inputRef?.select();
            // Clear the editing column ID after focusing
            tableMeta?.clearEditingColumnId?.();
          });
        }
      }
    });

    return (
      <Show
        when={isCellEditing()}
        fallback={
          <div
            onDblClick={handleDoubleClick}
            class={isEditable ? "cursor-pointer select-none" : "select-none"}
          >
            {String(value() ?? "")}
          </div>
        }
      >
        <TextField class="w-full dt-input-enter">
          <TextFieldInput
            ref={inputRef}
            type="text"
            value={String(editingValue() ?? "")}
            onInput={(e: InputEvent & { currentTarget: HTMLInputElement }) =>
              meta?.updateData?.(rowId, columnId, e.currentTarget.value)
            }
            onKeyDown={handleKeyDown}
            class="h-8"
          />
        </TextField>
      </Show>
    );
  };
}
