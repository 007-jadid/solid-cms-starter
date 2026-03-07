/**
 * DataTableColumnVisibility
 * Popover-based column visibility picker — same pattern as DataTableFacetedFilter
 * so keyboard navigation (↑ ↓ Enter Esc) works out of the box.
 */

import type { Table } from "@tanstack/solid-table";
import { createMemo, createSignal, For } from "solid-js";

import { cn } from "~/features/lib/utils";
import { Button } from "../components/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/command";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";

import { columnVisibilityStorage } from "./utils";

interface DataTableColumnVisibilityProps<TData> {
  table: Table<TData>;
  tableId?: string;
}

export function DataTableColumnVisibility<TData>(props: DataTableColumnVisibilityProps<TData>) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [search, setSearch] = createSignal("");

  const hidableColumns = createMemo(() =>
    props.table
      .getAllColumns()
      .filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide()),
  );

  const filteredColumns = createMemo(() => {
    const q = search().toLowerCase().trim();
    if (!q) return hidableColumns();
    return hidableColumns().filter((col) => col.id.toLowerCase().includes(q));
  });

  const visibleCount = createMemo(
    () => hidableColumns().filter((col) => col.getIsVisible()).length,
  );

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setSearch("");
  };

  const handleToggle = (columnId: string) => {
    const column = props.table.getColumn(columnId);
    if (!column) return;
    const next = !column.getIsVisible();
    column.toggleVisibility(next);
    const newVisibility = {
      ...props.table.getState().columnVisibility,
      [columnId]: next,
    };
    columnVisibilityStorage.set(newVisibility, props.tableId);
  };

  return (
    <Popover open={isOpen()} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        as={(triggerProps: Record<string, unknown>) => (
          <Button {...triggerProps} variant="outline" size="sm" class="h-8 border-dashed">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 256 256">
              <path
                fill="currentColor"
                d="M104 40H56a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h48a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 64H56V56h48zm96-64h-48a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h48a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 64h-48V56h48zm-96 32H56a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h48a16 16 0 0 0 16-16v-48a16 16 0 0 0-16-16m0 64H56v-48h48zm96-64h-48a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h48a16 16 0 0 0 16-16v-48a16 16 0 0 0-16-16m0 64h-48v-48h48z"
              />
            </svg>
            Columns
            <span class="ml-1.5 text-xs text-muted-foreground">
              {visibleCount()}/{hidableColumns().length}
            </span>
          </Button>
        )}
      />
      <PopoverContent class="w-full overflow-hidden p-0">
        <Command class="rounded-none bg-transparent backdrop-blur-0">
          <CommandInput
            class="h-9"
            placeholder="Search columns..."
            value={search()}
            onInput={(e) => setSearch(e.currentTarget.value)}
            onClear={() => setSearch("")}
          />
          <div class="max-h-48 overflow-y-auto overflow-x-hidden">
            <CommandList class="max-h-none! overflow-visible!">
              <CommandEmpty>No columns found.</CommandEmpty>
              <For each={filteredColumns()}>
                {(column) => {
                  const isVisible = () => column.getIsVisible();
                  return (
                    <CommandItem onSelect={() => handleToggle(column.id)}>
                      <div
                        class={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary",
                          isVisible()
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <svg
                          class="h-3.5 w-3.5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 256 256"
                        >
                          <path
                            fill="currentColor"
                            d="m229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69L218.34 66.34a8 8 0 0 1 11.32 11.32"
                          />
                        </svg>
                      </div>
                      <span class="capitalize">{column.id}</span>
                    </CommandItem>
                  );
                }}
              </For>
            </CommandList>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
