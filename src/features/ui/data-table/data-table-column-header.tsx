/**
 * DataTable Column Header Component
 * Sortable column header with dropdown menu for sorting, pinning, and hiding
 */

import type { Column } from "@tanstack/solid-table";
import { Show } from "solid-js";

import { cn } from "~/features/lib/utils";
import { Button } from "../components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  class?: string;
}

export function DataTableColumnHeader<TData, TValue>(
  props: DataTableColumnHeaderProps<TData, TValue>,
) {
  const canSort = () => props.column.getCanSort();
  const isSorted = () => props.column.getIsSorted();
  const canPin = () => props.column.getCanPin();
  const isPinned = () => props.column.getIsPinned();

  // If column can't sort, just render the title
  if (!canSort()) {
    return <div class={cn(props.class)}>{props.title}</div>;
  }

  return (
    <div class={cn("flex items-center space-x-2", props.class)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          as={(triggerProps: Record<string, unknown>) => (
            <Button
              {...triggerProps}
              variant="ghost"
              size="sm"
              class="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              <span>{props.title}</span>
              <Show
                when={isSorted() === "desc"}
                fallback={
                  <Show
                    when={isSorted() === "asc"}
                    fallback={
                      <svg
                        class="ml-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 256"
                      >
                        <path
                          fill="currentColor"
                          d="M181.66 170.34a8 8 0 0 1 0 11.32l-48 48a8 8 0 0 1-11.32 0l-48-48a8 8 0 0 1 11.32-11.32L128 212.69l42.34-42.35a8 8 0 0 1 11.32 0m-96-84.68L128 43.31l42.34 42.35a8 8 0 0 0 11.32-11.32l-48-48a8 8 0 0 0-11.32 0l-48 48a8 8 0 0 0 11.32 11.32"
                        />
                      </svg>
                    }
                  >
                    <svg
                      class="ml-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                    >
                      <path
                        fill="currentColor"
                        d="M213.66 141.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 204.69l74.34-74.35a8 8 0 0 1 11.32 11.32M53.66 125.66L128 51.31l74.34 74.35a8 8 0 0 0 11.32-11.32l-80-80a8 8 0 0 0-11.32 0l-80 80a8 8 0 0 0 11.32 11.32"
                      />
                    </svg>
                  </Show>
                }
              >
                <svg class="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                  <path
                    fill="currentColor"
                    d="M213.66 130.34a8 8 0 0 1 0 11.32l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 204.69l74.34-74.35a8 8 0 0 1 11.32 0"
                  />
                </svg>
              </Show>
            </Button>
          )}
        />
        <DropdownMenuContent class="min-w-28 p-1 text-xs">
          {/* Sort ascending */}
          <DropdownMenuItem
            class="px-2 py-1 text-xs gap-1.5"
            onClick={() => props.column.toggleSorting(false)}
          >
            <svg
              class="h-3 w-3 text-muted-foreground/70"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
            >
              <path
                fill="currentColor"
                d="M213.66 141.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 204.69l74.34-74.35a8 8 0 0 1 11.32 11.32M53.66 125.66L128 51.31l74.34 74.35a8 8 0 0 0 11.32-11.32l-80-80a8 8 0 0 0-11.32 0l-80 80a8 8 0 0 0 11.32 11.32"
              />
            </svg>
            Asc
          </DropdownMenuItem>

          {/* Sort descending */}
          <DropdownMenuItem
            class="px-2 py-1 text-xs gap-1.5"
            onClick={() => props.column.toggleSorting(true)}
          >
            <svg
              class="h-3 w-3 text-muted-foreground/70"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
            >
              <path
                fill="currentColor"
                d="M213.66 130.34a8 8 0 0 1 0 11.32l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 204.69l74.34-74.35a8 8 0 0 1 11.32 0"
              />
            </svg>
            Desc
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Column pinning */}
          <Show when={canPin()}>
            <DropdownMenuItem
              class="px-2 py-1 text-xs gap-1.5"
              onClick={() => props.column.pin("left")}
            >
              <svg
                class="h-3 w-3 text-muted-foreground/70"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
              >
                <path
                  fill="currentColor"
                  d="M235.33 104L152 20.69a16 16 0 0 0-22.63 0L100.69 49.4L91.3 40a16 16 0 0 0-22.62 0L40 68.69a16 16 0 0 0 0 22.62l9.39 9.39l-28.7 28.7a16 16 0 0 0 0 22.62L74.34 205.66a16 16 0 0 0 22.63 0l28.69-28.69l9.39 9.39a16 16 0 0 0 22.62 0l28.69-28.69a16 16 0 0 0 0-22.62l-9.4-9.39l28.69-28.69a16 16 0 0 0 0-22.63ZM176 113.37L142.63 80L176 46.63L209.37 80Z"
                />
              </svg>
              Pin Left
            </DropdownMenuItem>

            <DropdownMenuItem
              class="px-2 py-1 text-xs gap-1.5"
              onClick={() => props.column.pin("right")}
            >
              <svg
                class="h-3 w-3 rotate-90 text-muted-foreground/70"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
              >
                <path
                  fill="currentColor"
                  d="M235.33 104L152 20.69a16 16 0 0 0-22.63 0L100.69 49.4L91.3 40a16 16 0 0 0-22.62 0L40 68.69a16 16 0 0 0 0 22.62l9.39 9.39l-28.7 28.7a16 16 0 0 0 0 22.62L74.34 205.66a16 16 0 0 0 22.63 0l28.69-28.69l9.39 9.39a16 16 0 0 0 22.62 0l28.69-28.69a16 16 0 0 0 0-22.62l-9.4-9.39l28.69-28.69a16 16 0 0 0 0-22.63ZM176 113.37L142.63 80L176 46.63L209.37 80Z"
                />
              </svg>
              Pin Right
            </DropdownMenuItem>

            <Show when={isPinned()}>
              <DropdownMenuItem
                class="px-2 py-1 text-xs gap-1.5"
                onClick={() => props.column.pin(false)}
              >
                <svg
                  class="h-3 w-3 text-muted-foreground/70"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="m235.33 104l-28 28l-10.35-10.34a8 8 0 0 0-11.32 11.31l4.69 4.7l-28.69 28.69l-4.69-4.7a8 8 0 0 0-11.32 11.32l4.7 4.69L85.66 242.34a16 16 0 0 1-22.63 0l-64-64a16 16 0 0 1 0-22.63l64.69-64.68l4.69 4.7a8 8 0 0 0 11.31-11.32l-4.69-4.7L103.72 51l4.69 4.69a8 8 0 0 0 11.32-11.31L109.37 34l28-28a16 16 0 0 1 22.63 0l75.33 75.33a16 16 0 0 1 0 22.67"
                  />
                </svg>
                Unpin
              </DropdownMenuItem>
            </Show>

            <DropdownMenuSeparator />
          </Show>

          {/* Hide column */}
          <DropdownMenuItem
            class="px-2 py-1 text-xs gap-1.5"
            onClick={() => props.column.toggleVisibility(false)}
          >
            <svg
              class="h-3 w-3 text-muted-foreground/70"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
            >
              <path
                fill="currentColor"
                d="M53.92 34.62a8 8 0 1 0-11.84 10.76l19.24 21.17C25 88.84 9.38 123.2 8.69 124.76a8 8 0 0 0 0 6.5c.35.79 8.82 19.57 27.65 38.4C61.43 194.74 93.12 208 128 208a127.1 127.1 0 0 0 52.07-10.83l22 24.21a8 8 0 1 0 11.84-10.76Zm47.33 75.84l41.67 45.85a32 32 0 0 1-41.67-45.85M128 192c-30.78 0-57.67-11.19-79.93-33.25A133.2 133.2 0 0 1 25 128c4.69-8.79 19.66-33.39 47.35-49.38l18 19.75a48 48 0 0 0 63.66 70l14.73 16.2A112 112 0 0 1 128 192m6-95.43a8 8 0 0 1 3-15.72a48.16 48.16 0 0 1 38.77 42.64a8 8 0 0 1-7.22 8.71a6 6 0 0 1-.75 0a8 8 0 0 1-8-7.26A32.09 32.09 0 0 0 134 96.57m113.28 34.69c-.42.94-10.55 23.37-33.36 43.8a8 8 0 1 1-10.67-11.92a132.8 132.8 0 0 0 27.8-35.14a133.2 133.2 0 0 0-23.12-30.77C185.67 75.19 158.78 64 128 64a118.4 118.4 0 0 0-19.36 1.57A8 8 0 1 1 106 49.79A134 134 0 0 1 128 48c34.88 0 66.57 13.26 91.66 38.35c18.83 18.83 27.3 37.62 27.65 38.41a8 8 0 0 1-.03 6.5"
              />
            </svg>
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
