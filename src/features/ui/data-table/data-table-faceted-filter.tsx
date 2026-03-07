/**
 * DataTable Faceted Filter Component
 * Multi-select dropdown filter with async loading support
 */

import type { Column } from "@tanstack/solid-table";
import { batch, createEffect, createMemo, createSignal, For, onCleanup, Show } from "solid-js";

import { cn } from "~/features/lib/utils";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../components/command";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";
import { Separator } from "../components/separator";

import { useAsyncOptions } from "./hooks/use-async-options";
import type {
  AsyncOptionsConfig,
  AsyncOptionsFetchParams,
  AsyncOptionsResponse,
  FilterOption,
  OptionMapper,
} from "./types";

interface DataTableFacetedFilterProps<TData, TValue> {
  filterKey: string;
  column?: Column<TData, TValue>;
  title?: string;
  options?: FilterOption[];
  fetchOptions?: (params: AsyncOptionsFetchParams) => Promise<AsyncOptionsResponse>;
  fetchOptionsSimple?: () => Promise<FilterOption[]>;
  fetchSelectedOptions?: (values: string[]) => Promise<FilterOption[]>;
  optionMapper?: OptionMapper;
  asyncConfig?: AsyncOptionsConfig;
  value?: string[] | null;
  onChange?: (value: string[] | null) => void;
  multiSelect?: boolean;
}

export function DataTableFacetedFilter<TData, TValue>(
  props: DataTableFacetedFilterProps<TData, TValue>,
) {
  const [isOpen, setIsOpen] = createSignal(false);
  let scrollContainerRef: HTMLDivElement | undefined;

  // Use URL-synced value if provided, otherwise fall back to column filter
  const columnFilterValue = () => props.column?.getFilterValue() as string[] | undefined;

  const selectedValuesArray = createMemo(() => props.value ?? columnFilterValue() ?? []);

  const selectedValues = createMemo(() => new Set(selectedValuesArray()));

  const multiSelect = () => props.multiSelect ?? true;

  // Use async options hook
  const {
    options,
    filteredOptions,
    isLoading,
    isLoadingSelected,
    isFetchingNextPage,
    hasNextPage,
    totalItems,
    searchValue,
    setSearchValue,
    loadNextPage,
    reset,
    cacheOption,
    getOptionLabel,
  } = useAsyncOptions({
    filterKey: props.filterKey,
    staticOptions: props.options,
    fetchOptions: props.fetchOptions,
    legacyFetchOptions: props.fetchOptionsSimple,
    fetchSelectedOptions: props.fetchSelectedOptions ?? props.asyncConfig?.fetchSelectedOptions,
    optionMapper: props.optionMapper ?? props.asyncConfig?.optionMapper,
    selectedValues: selectedValuesArray(),
    config: props.asyncConfig,
    isOpen: isOpen(),
  });

  // Handle popover open/close
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  // Handle option selection — batch() prevents intermediate re-renders
  // between cacheOption (signal write) and onChange/setFilterValue (signal write)
  const handleSelect = (optionValue: string) => {
    batch(() => {
      const isSelected = selectedValues().has(optionValue);
      let newValues: string[];

      if (multiSelect()) {
        const newSelectedValues = new Set(selectedValues());
        if (isSelected) {
          newSelectedValues.delete(optionValue);
        } else {
          newSelectedValues.add(optionValue);
          const option = options().find((o) => o.value === optionValue);
          if (option) {
            cacheOption(option);
          }
        }
        newValues = Array.from(newSelectedValues);
      } else {
        if (isSelected) {
          newValues = [];
        } else {
          newValues = [optionValue];
          const option = options().find((o) => o.value === optionValue);
          if (option) {
            cacheOption(option);
          }
        }
      }

      if (props.onChange) {
        props.onChange(newValues.length ? newValues : null);
      } else {
        props.column?.setFilterValue(newValues.length ? newValues : undefined);
      }
    });
  };

  // Handle clear
  const handleClear = () => {
    setSearchValue("");
    if (props.onChange) {
      props.onChange(null);
    } else {
      props.column?.setFilterValue(undefined);
    }
  };

  // Pagination type from config
  const paginationType = () => props.asyncConfig?.paginationType ?? "scroll";

  // Scroll handler for infinite scroll
  createEffect(() => {
    if (!scrollContainerRef || paginationType() !== "scroll") return;

    const handleScroll = () => {
      if (!scrollContainerRef) return;

      const scrollPosition = scrollContainerRef.scrollTop + scrollContainerRef.clientHeight;
      const scrollHeight = scrollContainerRef.scrollHeight;
      const threshold = scrollHeight * 0.8;

      if (hasNextPage() && !isFetchingNextPage() && scrollPosition >= threshold) {
        loadNextPage();
      }
    };

    scrollContainerRef.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    onCleanup(() => scrollContainerRef?.removeEventListener("scroll", handleScroll));
  });

  // Facet counts from column
  const facets = () => props.column?.getFacetedUniqueValues();

  return (
    <Popover open={isOpen()} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        as={(triggerProps: Record<string, unknown>) => (
          <Button {...triggerProps} variant="outline" size="sm" class="h-8 border-dashed">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
            {props.title}
            <Show when={selectedValues().size > 0}>
              <Separator orientation="vertical" class="mx-2 h-4" />
              <Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues().size}
              </Badge>
              <div class="hidden space-x-1 lg:flex">
                <Show
                  when={selectedValues().size <= 2}
                  fallback={
                    <Badge variant="secondary" class="rounded-sm px-1 font-normal">
                      {selectedValues().size} selected
                    </Badge>
                  }
                >
                  <For each={Array.from(selectedValues())}>
                    {(value) => (
                      <Badge variant="secondary" class="rounded-sm px-1 font-normal">
                        {isLoadingSelected() ? "..." : (getOptionLabel(value) ?? value)}
                      </Badge>
                    )}
                  </For>
                </Show>
              </div>
            </Show>
          </Button>
        )}
      />
      <PopoverContent class="w-56 overflow-hidden p-0">
        <Command class="rounded-none bg-transparent backdrop-blur-0">
          <CommandInput
            class="h-9"
            placeholder={props.title}
            value={searchValue()}
            onInput={(e) => setSearchValue(e.currentTarget.value)}
            onClear={() => setSearchValue("")}
          />
          <div ref={scrollContainerRef} class="max-h-52 overflow-y-auto">
            <CommandList class="max-h-none! overflow-visible!">
              <Show
                when={!isLoading()}
                fallback={
                  <div class="flex items-center justify-center py-6">
                    <svg
                      class="h-4 w-4 animate-spin text-muted-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                    >
                      <path
                        fill="currentColor"
                        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 176a72 72 0 1 1 72-72a72.08 72.08 0 0 1-72 72"
                      />
                    </svg>
                    <span class="ml-2 text-sm text-muted-foreground">Loading...</span>
                  </div>
                }
              >
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  <For each={filteredOptions()}>
                    {(option) => {
                      const isSelected = () => selectedValues().has(option.value);
                      return (
                        <CommandItem onSelect={() => handleSelect(option.value)}>
                          <div
                            class={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center border border-primary",
                              multiSelect() ? "rounded-sm" : "rounded-full",
                              isSelected()
                                ? "bg-primary text-primary-foreground"
                                : "[&_svg]:invisible",
                            )}
                          >
                            <svg
                              class="h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 256 256"
                            >
                              <path
                                fill="currentColor"
                                d="m229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69L218.34 66.34a8 8 0 0 1 11.32 11.32"
                              />
                            </svg>
                          </div>
                          <span>{option.label}</span>
                          <Show when={facets()?.get(option.value)}>
                            <span class="ml-auto flex h-4 w-4 items-center justify-center font-sans text-xs">
                              {facets()?.get(option.value)}
                            </span>
                          </Show>
                        </CommandItem>
                      );
                    }}
                  </For>

                  {/* Loading more indicator */}
                  <Show when={isFetchingNextPage()}>
                    <div class="flex items-center justify-center py-2">
                      <svg
                        class="h-3 w-3 animate-spin text-muted-foreground"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 256"
                      >
                        <path
                          fill="currentColor"
                          d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 176a72 72 0 1 1 72-72a72.08 72.08 0 0 1-72 72"
                        />
                      </svg>
                      <span class="ml-2 text-xs text-muted-foreground">Loading more...</span>
                    </div>
                  </Show>

                  {/* Load more button */}
                  <Show
                    when={paginationType() === "click" && hasNextPage() && !isFetchingNextPage()}
                  >
                    <CommandItem
                      onSelect={loadNextPage}
                      class="justify-center text-center text-muted-foreground"
                    >
                      Load more
                      <Show when={totalItems()}>
                        <span class="ml-1 text-xs">
                          ({filteredOptions().length} of {totalItems()})
                        </span>
                      </Show>
                    </CommandItem>
                  </Show>
                </CommandGroup>
              </Show>

              {/* Clear selection */}
              <Show when={selectedValues().size > 0}>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={handleClear} class="justify-center text-center">
                    Clear {multiSelect() ? "filters" : "selection"}
                  </CommandItem>
                </CommandGroup>
              </Show>
            </CommandList>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
