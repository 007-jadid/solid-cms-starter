import { For, type JSX, onMount } from "solid-js";
import { animateBulkActionsEnter } from "~/features/lib/gsap-directives";
import { Button } from "../components/button";

export interface BulkAction<TData> {
  label: string;
  icon?: () => JSX.Element;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  onClick: (selectedRows: TData[]) => void;
}

interface DataTableBulkActionsProps<TData> {
  selectedCount: number;
  selectedRows: () => TData[];
  actions: BulkAction<TData>[];
  onClearSelection: () => void;
}

export function DataTableBulkActions<TData>(props: DataTableBulkActionsProps<TData>) {
  let containerRef!: HTMLDivElement;

  onMount(() => {
    if (containerRef) {
      animateBulkActionsEnter(containerRef);
    }
  });

  return (
    <div
      ref={containerRef}
      class="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-2"
    >
      <span class="text-sm font-medium text-foreground dt-count-bump">
        {props.selectedCount} row{props.selectedCount !== 1 ? "s" : ""} selected
      </span>

      <div class="h-4 w-px bg-border" />

      <div class="flex items-center gap-2">
        <For each={props.actions}>
          {(action) => (
            <Button
              size="sm"
              variant={action.variant ?? "outline"}
              class="h-7"
              onClick={() => action.onClick(props.selectedRows())}
            >
              {action.icon && <span class="mr-1.5">{action.icon()}</span>}
              {action.label}
            </Button>
          )}
        </For>
      </div>

      <div class="ml-auto">
        <Button
          size="sm"
          variant="ghost"
          class="h-7 px-2 text-muted-foreground"
          onClick={props.onClearSelection}
        >
          Clear selection
          <svg class="ml-1.5 h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <path
              fill="currentColor"
              d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
