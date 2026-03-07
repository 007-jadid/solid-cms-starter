/**
 * DataTable Sub Grid Component
 * Nested data table for expanded rows
 */

import type { Row } from "@tanstack/solid-table";
import { createMemo, Show } from "solid-js";

import { useGet } from "~/features/hooks/query";

import { Skeleton } from "../components/skeleton";

import { DataTable } from "./data-table";
import type { SubGridConfig } from "./types";
import { QUERY_KEYS } from "./utils";

interface DataTableSubGridProps<TData, TSubData> {
  row: Row<TData>;
  config: SubGridConfig<TData, TSubData>;
}

export function DataTableSubGrid<TData, TSubData>(props: DataTableSubGridProps<TData, TSubData>) {
  const hasUrl = () => !!props.config.getSubUrl;

  // Query for fetching sub-grid data
  const query = useGet<unknown>(
    () => props.config.getSubUrl?.(props.row.original) ?? "",
    () => ({
      queryKey: [QUERY_KEYS.SUB_GRID, props.config.getSubUrl?.(props.row.original)],
      enabled: hasUrl(),
    }),
  );

  // Map raw API response to TSubData[]
  const subData = createMemo(() => {
    const response = query.data;
    if (!response) return [];
    if (Array.isArray(response)) return response as TSubData[];
    const data = response as Record<string, unknown>;
    return (data.items || data.data || []) as TSubData[];
  });

  // Get data from either fetched or static source
  const data = createMemo(() => {
    if (props.config.getSubData) {
      return props.config.getSubData(props.row.original);
    }
    return subData();
  });

  const isLoading = () => query.isLoading;

  return (
    <div class="rounded-md border bg-muted/30 p-4">
      <Show when={!isLoading()} fallback={<Skeleton class="h-24 w-full" />}>
        <DataTable
          columns={props.config.columns as never}
          data={data() as never}
          enableRowSelection={props.config.enableRowSelection}
          enableDragAndDrop={props.config.enableDragAndDrop}
          enableColumnPinning={props.config.enableColumnPinning}
          enableRowEditable={props.config.enableRowEditable}
          enableExpanding={props.config.enableExpanding}
          showTab={false}
          {...((props.config.extraProps as Record<string, unknown>) ?? {})}
        />
        <Show when={props.config.renderAdditionalContent}>
          {props.config.renderAdditionalContent?.({ row: props.row })}
        </Show>
      </Show>
    </div>
  );
}
