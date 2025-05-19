import type { Table } from "@tanstack/solid-table";
import { createMemo, For, Show } from "solid-js";
import { effect } from "solid-js/web";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Select } from "~/components/ui/select";
import { ArrowUpDown } from "../icons";

export const Sort = (props: { table: Table<unknown> }) => {
  const sorting = () => props.table.getState().sorting;
  const availableColumns = createMemo(() => {
    const sortIds = new Set(sorting()?.map((sort) => sort.id));
    const newColumns: { id: string; label: string }[] = [];

    for (const col of props.table.getAllColumns()) {
      if (!col.getCanSort()) continue;

      const label = col?.columnDef?.meta?.label ?? col.id;
      if (!sortIds?.has(col.id)) {
        newColumns.push({
          id: col.id,
          label,
        });
      }
    }

    return {
      columns: newColumns,
    };
  });

  console.log({
    col: availableColumns().columns,
  });

  effect(() => {
    console.log({
      sorting: sorting(),
    });
  });

  return (
    <Popover>
      <PopoverTrigger size="sm" variant="outline" as={Button<"button">}>
        <ArrowUpDown />
        <span>Sort</span>
      </PopoverTrigger>

      <PopoverContent>
        <Show when={!sorting()?.length}>
          <div class="flex flex-col gap-y-4">
            <div class="flex flex-col gap-y-1">
              <h6>No sorting applied</h6>
              <p class="text-sm text-gray-400">
                Add sorting to organize your rows
              </p>
            </div>

            <div>
              <Button
                size="sm"
                class="h-min py-1.5"
                type="button"
                onClick={() => {
                  props.table.setSorting([{ id: "status", desc: false }]);
                }}
              >
                Add sort
              </Button>
            </div>
          </div>
        </Show>
        <Show when={sorting()?.length}>
          <For each={availableColumns().columns}>
            {(item) => {
              return (
                <div>
                  <Select
                    value={item.id}
                    // onChange={setValue}
                    options={[
                      "Apple",
                      "Banana",
                      "Blueberry",
                      "Grapes",
                      "Pineapple",
                    ]}
                    //   placeholder="Select a fruit…"
                  >
                    {item.label}
                  </Select>
                </div>
              );
            }}
          </For>
        </Show>
      </PopoverContent>
    </Popover>
  );
};
