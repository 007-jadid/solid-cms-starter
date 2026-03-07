/**
 * DataTable Row Actions Component
 * Save/Cancel buttons for inline editing
 */

import { Show } from "solid-js";

import { cn } from "~/features/lib/utils";
import { Button } from "../components/button";

interface DataTableRowActionsProps {
  onSave: () => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
  class?: string;
}

export function DataTableRowActions(props: DataTableRowActionsProps) {
  return (
    <div class={cn("flex items-center gap-2", props.class)}>
      <Button
        title="Accept"
        size="icon"
        variant="ghost"
        class="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => props.onSave()}
        disabled={props.isSaving}
      >
        <Show
          when={props.isSaving}
          fallback={
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
              <path
                fill="currentColor"
                d="m229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69L218.34 66.34a8 8 0 0 1 11.32 11.32"
              />
            </svg>
          }
        >
          <svg
            class="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 176a72 72 0 1 1 72-72a72.08 72.08 0 0 1-72 72"
            />
          </svg>
        </Show>
      </Button>
      <Button
        title="Cancel"
        size="icon"
        variant="destructive"
        class="h-8 w-8"
        onClick={props.onCancel}
        disabled={props.isSaving}
      >
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
          <path
            fill="currentColor"
            d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"
          />
        </svg>
      </Button>
    </div>
  );
}
