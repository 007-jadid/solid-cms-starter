import type { ColumnDef } from "@tanstack/solid-table";
import { createContext } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";

export type Col = unknown;

export type TDataTable<C = Col> = {
  columns: ColumnDef<C>[];
  data?: Col[];
};

type TDataTableContext<C = Col> = {
  tableStore: TDataTable<C>;
  setTableStore?: SetStoreFunction<TDataTable<C>>;
};

export const DataTableContext = createContext<TDataTableContext>({
  tableStore: {
    columns: [],
  },
});
