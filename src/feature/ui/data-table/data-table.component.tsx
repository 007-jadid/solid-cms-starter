import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/solid-table";
import {
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/solid-table";
import { createSignal, For } from "solid-js";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TextField, TextFieldInput } from "~/components/ui/text-field";
import { useDataTable } from "~/feature/context/data-table.hook";
import { ColumnView } from "./column-view.component";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export function DataTable() {
  const {
    tableStore: { columns, data },
  } = useDataTable();
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>(
    {}
  );
  const [rowSelection, setRowSelection] = createSignal({});

  /*
get data() {
      return props.data
    },
    get columns() {
      return props.columns
    },
*/

  const table = createSolidTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      get sorting() {
        return sorting();
      },
      get columnFilters() {
        return columnFilters();
      },
      get columnVisibility() {
        return columnVisibility();
      },
      get rowSelection() {
        return rowSelection();
      },
    },
  });

  return (
    <div class="w-full">
      <div class="flex items-center justify-between py-4">
        <TextField
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(value) => table.getColumn("email")?.setFilterValue(value)}
        >
          <TextFieldInput placeholder="Filter emails..." class="max-w-sm h-9" />
        </TextField>
        <ColumnView columns={table.getAllColumns()} />
      </div>
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <TableRow>
                  <For each={headerGroup.headers}>
                    {(header) => {
                      return (
                        <TableHead>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    }}
                  </For>
                </TableRow>
              )}
            </For>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow data-state={row.getIsSelected() && "selected"}>
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <TableCell>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )}
                  </For>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} class="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div class="flex items-center justify-end space-x-2 py-4">
        <div class="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div class="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
