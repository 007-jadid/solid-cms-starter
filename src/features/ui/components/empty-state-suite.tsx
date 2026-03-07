import type { JSX } from "solid-js";
import { Show } from "solid-js";

import { cn } from "~/features/lib/utils";

import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";

export type EmptyStateSuiteMode = "loading" | "empty" | "error";

export function EmptyStateSuite(props: {
  mode: EmptyStateSuiteMode;
  title?: string;
  description?: string;
  onRetry?: () => void;
  action?: JSX.Element;
  class?: string;
}) {
  return (
    <div class={cn("rounded-lg border bg-card", props.class)}>
      <Show when={props.mode === "loading"}>
        <div class="flex flex-col items-center justify-center gap-3 px-4 py-12">
          <div class="size-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <p class="text-sm font-medium">{props.title || "Loading"}</p>
          <p class="text-xs text-muted-foreground">
            {props.description || "Please wait while data is loading."}
          </p>
        </div>
      </Show>

      <Show when={props.mode === "empty"}>
        <EmptyState
          title={props.title || "No results found"}
          description={
            props.description || "Try changing filters or search terms to find matching data."
          }
          action={props.action}
        />
      </Show>

      <Show when={props.mode === "error"}>
        <ErrorState
          title={props.title || "Unable to load data"}
          description={
            props.description || "There was an issue while loading this section. Please try again."
          }
          onRetry={props.onRetry}
        />
      </Show>
    </div>
  );
}
