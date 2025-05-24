import type { ColumnDef } from "@tanstack/solid-table";
import { createStore } from "solid-js/store";
import { DataTable } from "..";
import type { Payment } from "../../context/constants";
import {
  DataTableContext,
  type Col,
  type TDataTable,
} from "../../context/data-table.context";

type Props<C = Col> = {
  columns: ColumnDef<C>[];
};

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
];

export function DataTableProvider<C = Col>(props: Props<C>) {
  const [tableStore, setTableStore] = createStore<TDataTable<Col>>({
    columns: props.columns as TDataTable["columns"],
    data,
  });

  return (
    <DataTableContext.Provider
      value={{
        tableStore,
        setTableStore,
      }}
    >
      <DataTable />
    </DataTableContext.Provider>
  );
}
