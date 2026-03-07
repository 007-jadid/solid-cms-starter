/**
 * DataTable Settings Component
 * Density control (column visibility moved to DataTableColumnVisibility)
 */

import type { Table } from "@tanstack/solid-table";
import { createMemo, For, onMount } from "solid-js";

import { Button } from "../components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";

import type { DensityState } from "./types";
import { columnVisibilityStorage, DENSITY_OPTIONS } from "./utils";

interface DataTableSettingsProps<TData> {
  table: Table<TData>;
  tableId?: string;
}

export function DataTableSettings<TData>(props: DataTableSettingsProps<TData>) {
  const density = () => (props.table.options.meta?.density ?? "md") as DensityState;
  const setDensity = props.table.options.meta?.setDensity;

  // Initialize column visibility from localStorage on mount
  onMount(() => {
    const savedVisibility = columnVisibilityStorage.get(props.tableId);
    if (savedVisibility) {
      props.table.setColumnVisibility(savedVisibility);
    }
  });

  const currentDensityLabel = createMemo(
    () => DENSITY_OPTIONS.find((opt) => opt.value === density())?.label ?? "Standard",
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={(triggerProps: Record<string, unknown>) => (
          <Button
            {...triggerProps}
            variant="outline"
            size="sm"
            class="flex h-8 items-center justify-center"
            title="Settings"
          >
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
              <path
                fill="currentColor"
                d="M128 80a48 48 0 1 0 48 48a48.05 48.05 0 0 0-48-48m0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32m88-29.84q.06-2.16 0-4.32l14.92-18.64a8 8 0 0 0 1.48-7.06a107.2 107.2 0 0 0-10.88-26.25a8 8 0 0 0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186 40.54a8 8 0 0 0-3.94-6a107.7 107.7 0 0 0-26.25-10.87a8 8 0 0 0-7.06 1.49L130.16 40h-4.32L107.2 25.11a8 8 0 0 0-7.06-1.48a107.6 107.6 0 0 0-26.25 10.88a8 8 0 0 0-3.93 6l-2.64 23.76q-1.56 1.49-3 3L40.54 70a8 8 0 0 0-6 3.94a107.7 107.7 0 0 0-10.87 26.25a8 8 0 0 0 1.49 7.06L40 125.84v4.32L25.11 148.8a8 8 0 0 0-1.48 7.06a107.2 107.2 0 0 0 10.88 26.25a8 8 0 0 0 6 3.93l23.72 2.64q1.49 1.56 3 3L70 215.46a8 8 0 0 0 3.94 6a107.7 107.7 0 0 0 26.25 10.87a8 8 0 0 0 7.06-1.49L125.84 216q2.16.06 4.32 0l18.64 14.92a8 8 0 0 0 7.06 1.48a107.2 107.2 0 0 0 26.25-10.88a8 8 0 0 0 3.93-6l2.64-23.72q1.56-1.48 3-3l23.78 2.8a8 8 0 0 0 6-3.94a107.7 107.7 0 0 0 10.87-26.25a8 8 0 0 0-1.49-7.06Zm-16.1-6.5a73 73 0 0 1 0 8.68a8 8 0 0 0 1.74 5.48l14.19 17.73a91.6 91.6 0 0 1-6.23 15l-22.6-2.66a8 8 0 0 0-5.61 1.63a75 75 0 0 1-6.14 6.14a8 8 0 0 0-1.62 5.6l2.66 22.6a91.3 91.3 0 0 1-15 6.23l-17.74-14.19a8 8 0 0 0-5-1.75h-.48a73 73 0 0 1-8.68 0a8 8 0 0 0-5.48 1.74l-17.78 14.2a91.6 91.6 0 0 1-15-6.23l2.66-22.6a8 8 0 0 0-1.62-5.61a75 75 0 0 1-6.14-6.14a8 8 0 0 0-5.6-1.62l-22.6 2.66a91.3 91.3 0 0 1-6.23-15l14.19-17.74a8 8 0 0 0 1.74-5.48a73 73 0 0 1 0-8.68a8 8 0 0 0-1.74-5.48L39.25 100.8a91.6 91.6 0 0 1 6.23-15l22.6 2.66a8 8 0 0 0 5.61-1.63a75 75 0 0 1 6.14-6.14a8 8 0 0 0 1.62-5.6l-2.66-22.6a91.3 91.3 0 0 1 15-6.23l17.74 14.19a8 8 0 0 0 5.48 1.74a73 73 0 0 1 8.68 0a8 8 0 0 0 5.48-1.74l17.73-14.19a91.6 91.6 0 0 1 15 6.23l-2.66 22.6a8 8 0 0 0 1.62 5.61a75 75 0 0 1 6.14 6.14a8 8 0 0 0 5.6 1.62l22.6-2.66a91.3 91.3 0 0 1 6.23 15l-14.19 17.74a8 8 0 0 0-1.74 5.53Z"
              />
            </svg>
          </Button>
        )}
      />
      <DropdownMenuContent class="w-48">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
              <path
                fill="currentColor"
                d="M128 96a32 32 0 1 0 32 32a32 32 0 0 0-32-32m0 48a16 16 0 1 1 16-16a16 16 0 0 1-16 16m-80-32a32 32 0 1 0 32 32a32 32 0 0 0-32-32m0 48a16 16 0 1 1 16-16a16 16 0 0 1-16 16m160-48a32 32 0 1 0 32 32a32 32 0 0 0-32-32m0 48a16 16 0 1 1 16-16a16 16 0 0 1-16 16"
              />
            </svg>
            <span>Density</span>
            <span class="ml-auto text-xs text-muted-foreground">{currentDensityLabel()}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuLabel>Row Density</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={density()}
              onChange={(value) => setDensity?.(value as DensityState)}
            >
              <For each={DENSITY_OPTIONS}>
                {(option) => (
                  <DropdownMenuRadioItem value={option.value}>{option.label}</DropdownMenuRadioItem>
                )}
              </For>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
