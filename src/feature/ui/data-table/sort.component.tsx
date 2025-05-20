import type { ColumnSort, Table } from "@tanstack/solid-table";
import { createMemo, For, Show } from "solid-js";
import { effect } from "solid-js/web";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { ArrowUpDown, Trash } from "../icons";

let index = 1;

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
  const allColumns = () => props?.table?.getAllColumns();
  const onSortingChange = props.table.setSorting;

  effect(() => {
    console.log({
      sorting: sorting(),
      column: availableColumns().columns,
    });
  });

  const onSortUpdate = (sort: { id: string; updates: Partial<ColumnSort> }) => {
    onSortingChange((prevSort) => {
      if (!prevSort) return prevSort;
      return prevSort?.map((prev) =>
        prev.id === sort.id
          ? {
              ...prev,
              ...sort.updates,
            }
          : prev
      );
    });
  };

  // @TODO: NEED TO REAFACTOR THIS
  const onSortAdd = () => {
    if (availableColumns()?.columns?.length) {
      if (!sorting().length) {
        const item = availableColumns().columns.find(
          (item) => item.label === "status"
        );

        props.table.setSorting([
          {
            id: item?.id || "",
            desc: item?.label === "desc" ? true : false,
          },
        ]);
      } else {
        const item = availableColumns().columns.find(
          (item) => item.id === "email"
        );
        props.table.setSorting([
          ...sorting(),
          {
            desc: item?.label === "desc" ? true : false,
            id: item?.id || "",
          },
        ]);
      }
    } else {
      console.error("Nothing to add");
    }
  };

  const onSortDelete = (id: string) => {
    onSortingChange((sortValues) => {
      if (!sortValues) return sortValues;
      return sortValues?.filter((sort) => sort?.id !== id);
    });
  };

  return (
    <Popover>
      <PopoverTrigger size="sm" variant="outline" as={Button<"button">}>
        <ArrowUpDown />
        <span>Sort</span>
      </PopoverTrigger>

      <PopoverContent class="min-w-[300px] w-min">
        <Show when={!sorting()?.length}>
          <div class="flex flex-col gap-y-4">
            <div class="flex flex-col gap-y-1">
              <h6>No sorting applied</h6>
              <p class="text-sm text-gray-400">
                Add sorting to organize your rows
              </p>
            </div>
          </div>
        </Show>
        <Show when={sorting()?.length}>
          <For each={sorting()}>
            {(item) => {
              console.log({ item });

              return (
                <div class="flex items-center gap-x-2 mb-2">
                  <Select
                    value={item.id}
                    options={availableColumns().columns?.map(
                      (col) => col.label
                    )}
                    itemComponent={(props) => {
                      return (
                        <SelectItem item={props.item} class="capitalize">
                          {props.item.rawValue}
                        </SelectItem>
                      );
                    }}
                    onChange={(value) => {
                      console.log({ value });
                    }}
                  >
                    <SelectTrigger
                      aria-label={item.id}
                      class="w-[180px] capitalize h-[35px]"
                    >
                      {item.id}
                    </SelectTrigger>

                    <SelectContent />
                  </Select>
                  <Select
                    value={item.desc === true ? "desc" : "asc"}
                    options={["asc", "desc"]}
                    itemComponent={(props) => {
                      return (
                        <SelectItem item={props.item} class="capitalize">
                          {props.item.rawValue}
                        </SelectItem>
                      );
                    }}
                    onChange={(value) => {
                      onSortUpdate({
                        id: item.id,
                        updates: {
                          desc: value === "desc" ? true : false,
                          id: item.id,
                        },
                      });
                    }}
                  >
                    <SelectTrigger
                      aria-label={item.id}
                      class="w-[70px] capitalize h-[35px]"
                    >
                      {item.desc === true ? "dsc" : "asc"}
                    </SelectTrigger>

                    <SelectContent />
                  </Select>

                  <div>
                    <Button
                      title="delete"
                      class="h-[35px]"
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        onSortDelete(item.id);
                      }}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              );
            }}
          </For>
        </Show>

        <div class="mt-2">
          <Button
            size="sm"
            class="h-min py-1.5"
            type="button"
            onClick={onSortAdd}
          >
            Add sort
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
