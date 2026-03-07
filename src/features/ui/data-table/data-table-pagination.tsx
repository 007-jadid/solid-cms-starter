/**
 * DataTable Pagination Component
 * Full pagination controls with page size selection
 */

import type { Table } from "@tanstack/solid-table";
import { createEffect, on, Show } from "solid-js";
import { EASE_SMOOTH, gsap } from "~/features/lib/gsap";

import { Button } from "../components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";

import { PAGE_SIZE_OPTIONS } from "./utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalItems?: number;
  enableRowSelection?: boolean;
}

export function DataTablePagination<TData>(props: DataTablePaginationProps<TData>) {
  let pageInfoRef!: HTMLDivElement;
  let selectionRef!: HTMLSpanElement;

  // Slide + fade on page change
  createEffect(
    on(
      () => props.table.getState().pagination.pageIndex,
      (_curr, prev) => {
        if (!pageInfoRef) return;
        // Determine slide direction based on page navigation
        const dir = prev !== undefined && _curr > prev ? 1 : -1;
        gsap.fromTo(
          pageInfoRef,
          { opacity: 0, y: dir * 6 },
          { opacity: 1, y: 0, duration: 0.3, ease: EASE_SMOOTH, clearProps: "transform" },
        );
      },
      { defer: true },
    ),
  );

  // Bump the selection count when it changes
  createEffect(
    on(
      () => props.table.getFilteredSelectedRowModel().rows.length,
      () => {
        if (!selectionRef) return;
        selectionRef.classList.remove("dt-count-bump");
        // Force reflow to restart animation
        void selectionRef.offsetWidth;
        selectionRef.classList.add("dt-count-bump");
      },
      { defer: true },
    ),
  );

  const selectedRowCount = () => props.table.getFilteredSelectedRowModel().rows.length;
  const totalRowCount = () => props.totalItems ?? props.table.getFilteredRowModel().rows.length;
  const isAllSelected = () => props.table.getIsAllPageRowsSelected();
  const pageIndex = () => props.table.getState().pagination.pageIndex;
  const pageSize = () => props.table.getState().pagination.pageSize;
  const pageCount = () => props.table.getPageCount();
  const canPreviousPage = () => props.table.getCanPreviousPage();
  const canNextPage = () => props.table.getCanNextPage();

  return (
    <div class="flex items-center justify-between px-2">
      {/* Selection info */}
      <div class="flex-1 text-sm text-muted-foreground">
        <Show when={props.enableRowSelection}>
          <Show when={selectedRowCount() > 0} fallback={<span>No rows selected</span>}>
            <span ref={selectionRef}>
              {selectedRowCount()} of {totalRowCount()} row(s) selected
              <Show when={isAllSelected() && selectedRowCount() < totalRowCount()}>
                <span class="ml-1">(all on this page)</span>
              </Show>
            </span>
          </Show>
        </Show>
      </div>

      {/* Pagination controls */}
      <div class="flex items-center space-x-6 lg:space-x-8">
        {/* Rows per page */}
        <div class="flex items-center space-x-2">
          <p class="text-sm font-medium">Rows per page</p>
          <Select<string>
            value={String(pageSize())}
            onChange={(value) => {
              if (value) {
                props.table.setPageSize(Number(value));
              }
            }}
            options={PAGE_SIZE_OPTIONS.map(String)}
            itemComponent={(itemProps) => (
              <SelectItem item={itemProps.item}>{itemProps.item.rawValue}</SelectItem>
            )}
          >
            <SelectTrigger class="h-8 w-[70px]">
              <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>

        {/* Page info */}
        <div
          ref={pageInfoRef}
          class="flex w-[100px] items-center justify-center font-sans text-sm font-medium"
        >
          Page {pageIndex() + 1} of {pageCount()}
        </div>

        {/* Navigation buttons */}
        <div class="flex items-center space-x-2">
          {/* First page */}
          <Button
            variant="outline"
            class="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => props.table.setPageIndex(0)}
            disabled={!canPreviousPage()}
          >
            <span class="sr-only">Go to first page</span>
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
              <path
                fill="currentColor"
                d="m165.66 202.34l-72-72a8 8 0 0 1 0-11.31l72-72a8 8 0 0 1 11.31 11.31L110.63 125l66.34 66.34a8 8 0 0 1-11.31 11.32ZM48 48v160a8 8 0 0 0 16 0V48a8 8 0 0 0-16 0"
              />
            </svg>
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            class="h-8 w-8 p-0"
            onClick={() => props.table.previousPage()}
            disabled={!canPreviousPage()}
          >
            <span class="sr-only">Go to previous page</span>
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
              <path
                fill="currentColor"
                d="m165.66 202.34l-72-72a8 8 0 0 1 0-11.31l72-72a8 8 0 0 1 11.31 11.31L110.63 125l66.34 66.34a8 8 0 0 1-11.31 11.32Z"
              />
            </svg>
          </Button>

          {/* Next page */}
          <Button
            variant="outline"
            class="h-8 w-8 p-0"
            onClick={() => props.table.nextPage()}
            disabled={!canNextPage()}
          >
            <span class="sr-only">Go to next page</span>
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
              <path
                fill="currentColor"
                d="m181.66 133.66l-72 72a8 8 0 0 1-11.31-11.32L164.69 128L98.34 61.66a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32"
              />
            </svg>
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            class="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => props.table.setPageIndex(pageCount() - 1)}
            disabled={!canNextPage()}
          >
            <span class="sr-only">Go to last page</span>
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
              <path
                fill="currentColor"
                d="m141.66 133.66l-72 72a8 8 0 0 1-11.32-11.32L124.69 128L58.34 61.66a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32M192 48v160a8 8 0 0 0 16 0V48a8 8 0 0 0-16 0"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
