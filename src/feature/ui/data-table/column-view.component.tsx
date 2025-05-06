import { Checkbox } from "@kobalte/core/checkbox";
import type { Column } from "@tanstack/solid-table";
import { For } from "solid-js";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { UpDown } from "../icons";
import { CheckIcon } from "../icons/check-icon";

type Props<T = Record<string, unknown>> = {
  columns: Column<T, unknown>[];
};

export function ColumnView(props: Props) {
  return (
    <Popover>
      <PopoverTrigger size="sm" variant="outline" as={Button<"button">}>
        <span>Column</span>
        <UpDown />
      </PopoverTrigger>

      <PopoverContent class="p-0 border-none w-fit">
        <Command class="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="">
              <For each={props.columns.filter((column) => column.getCanHide())}>
                {(column) => {
                  return (
                    <CommandItem
                      class="gap-x-2 cursor-pointer"
                      onSelect={() => {
                        column.toggleVisibility(!column.getIsVisible());
                      }}
                    >
                      <Checkbox checked={column.getIsVisible()}>
                        <Checkbox.Input />
                        <Checkbox.Control>
                          <Checkbox.Indicator>
                            <CheckIcon />
                          </Checkbox.Indicator>
                        </Checkbox.Control>
                      </Checkbox>
                      <span class="capitalize text-[13px]">{column.id}</span>
                    </CommandItem>
                  );
                }}
              </For>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
