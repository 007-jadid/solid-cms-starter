/**
 * Row Editing Hook
 * Manages row editing state and operations for the DataTable
 */

import { type Accessor, createSignal } from "solid-js";
import { createStore, reconcile } from "solid-js/store";

import type { EditingHelpers } from "../types";

interface UseRowEditingOptions<TData> {
  enableRowEditable: boolean;
  rowEditAction?: (
    originalRow: TData,
    newRow: TData,
    helpers: EditingHelpers<TData>,
  ) => Promise<void> | void;
  shouldUseServer: Accessor<boolean>;
  refetch: () => void;
  setLocalData: (updater: TData[] | ((prev: TData[]) => TData[])) => void;
  getRowById?: (id: string) => TData | undefined;
}

interface UseRowEditingReturn<TData> {
  editingRowId: Accessor<string | null>;
  editingColumnId: Accessor<string | null>;
  editingData: Record<string, unknown>;
  isSaving: Accessor<boolean>;
  startEditing: (row: TData) => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  updateEditingData: (key: string, value: unknown) => void;
  meta: {
    editingRowId: Accessor<string | null>;
    editingColumnId: Accessor<string | null>;
    isSaving: Accessor<boolean>;
    startEditing: (rowId: string, columnId?: string) => void;
    updateData: (rowId: string, columnId: string, value: unknown) => void;
    handleSave: () => Promise<void>;
    handleCancel: () => void;
    clearEditingColumnId: () => void;
  };
}

export function useRowEditing<TData extends { id?: string | number }>(
  options: UseRowEditingOptions<TData>,
): UseRowEditingReturn<TData> {
  const [editingRowId, setEditingRowId] = createSignal<string | null>(null);
  const [editingColumnId, setEditingColumnId] = createSignal<string | null>(null);
  const [isSaving, setIsSaving] = createSignal(false);
  const [editingData, setEditingData] = createStore<Record<string, unknown>>({});

  // Store the original row for reverting
  let originalRow: TData | null = null;

  const startEditing = (row: TData, columnId?: string) => {
    if (!options.enableRowEditable) return;

    const rowId = String(row.id ?? "");
    originalRow = { ...row };
    setEditingRowId(rowId);
    setEditingColumnId(columnId ?? null);
    setEditingData(reconcile({ ...row }));
  };

  const handleCancel = () => {
    setEditingRowId(null);
    setEditingColumnId(null);
    setEditingData(reconcile({}));
    originalRow = null;
  };

  const handleSave = async () => {
    const currentEditingId = editingRowId();
    if (!currentEditingId || !originalRow) return;

    setIsSaving(true);

    try {
      const newRow = { ...editingData } as TData;

      if (options.rowEditAction) {
        const helpers: EditingHelpers<TData> = {
          updateRow: (updatedData: TData) => {
            if (!options.shouldUseServer()) {
              options.setLocalData((prev) =>
                prev.map((item) => (String(item.id) === currentEditingId ? updatedData : item)),
              );
            }
          },
          revert: () => {
            if (originalRow) {
              setEditingData(reconcile({ ...originalRow }));
            }
          },
          refetch: async () => {
            if (options.shouldUseServer()) {
              options.refetch();
            }
          },
        };

        await options.rowEditAction(originalRow, newRow, helpers);
      }

      // Auto-update local data if not using server
      if (!options.shouldUseServer()) {
        options.setLocalData((prev) =>
          prev.map((item) => (String(item.id) === currentEditingId ? newRow : item)),
        );
      }

      handleCancel();
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error saving row:", error);
      // Don't cancel on error - let the user fix and retry
    } finally {
      setIsSaving(false);
    }
  };

  const updateEditingData = (key: string, value: unknown) => {
    setEditingData(key, value);
  };

  // Meta object for table integration
  const meta = {
    editingRowId,
    editingColumnId,
    isSaving,
    startEditing: (rowId: string, columnId?: string) => {
      if (!options.enableRowEditable) return;

      // Get the row data using getRowById
      const row = options.getRowById?.(rowId);
      if (row) {
        originalRow = { ...row };
        setEditingRowId(rowId);
        setEditingColumnId(columnId ?? null);
        setEditingData(reconcile({ ...row }));
      } else {
        // Fallback: just set the ID (editing data won't be populated)
        setEditingRowId(rowId);
        setEditingColumnId(columnId ?? null);
      }
    },
    updateData: (rowId: string, columnId: string, value: unknown) => {
      if (rowId === editingRowId()) {
        updateEditingData(columnId, value);
      }
    },
    handleSave,
    handleCancel,
    clearEditingColumnId: () => {
      setEditingColumnId(null);
    },
  };

  return {
    editingRowId,
    editingColumnId,
    editingData,
    isSaving,
    startEditing,
    handleSave,
    handleCancel,
    updateEditingData,
    meta,
  };
}
