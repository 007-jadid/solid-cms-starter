/**
 * DataTable Expand Toggle Component
 * Button to expand/collapse row details
 */

import type { Row } from "@tanstack/solid-table";
import { Show } from "solid-js";

import { Button } from "../components/button";

interface DataTableExpandToggleProps<TData> {
  row: Row<TData>;
}

export function DataTableExpandToggle<TData>(props: DataTableExpandToggleProps<TData>) {
  const canExpand = () => props.row.getCanExpand();
  const isExpanded = () => props.row.getIsExpanded();

  return (
    <Button
      variant="ghost"
      size="icon"
      class="h-7 w-7"
      onClick={props.row.getToggleExpandedHandler()}
      disabled={!canExpand()}
    >
      <Show when={canExpand()} fallback={<span class="h-4 w-4 text-muted-foreground">•</span>}>
        <svg
          class="h-4 w-4 dt-expand-icon"
          data-expanded={isExpanded() ? "true" : "false"}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
        >
          <path
            fill="currentColor"
            d="m181.66 133.66l-80 80a8 8 0 0 1-11.32-11.32L164.69 128L90.34 53.66a8 8 0 0 1 11.32-11.32l80 80a8 8 0 0 1 0 11.32"
          />
        </svg>
      </Show>
    </Button>
  );
}
