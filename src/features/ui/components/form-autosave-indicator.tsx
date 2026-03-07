import { Show } from "solid-js";

import { cn } from "~/features/lib/utils";

import { Button } from "./button";

export type FormAutosaveState = "idle" | "dirty" | "saving" | "saved" | "error";

export function FormAutosaveIndicator(props: {
  state: FormAutosaveState;
  lastSavedAt?: Date | null;
  class?: string;
  onRetry?: () => void;
}) {
  const label = () => {
    if (props.state === "dirty") return "Unsaved changes";
    if (props.state === "saving") return "Saving...";
    if (props.state === "saved") return "Saved";
    if (props.state === "error") return "Autosave failed";
    return "Autosave idle";
  };

  const tone = () => {
    if (props.state === "saved") return "text-emerald-600 dark:text-emerald-400";
    if (props.state === "error") return "text-destructive";
    if (props.state === "saving") return "text-primary";
    return "text-muted-foreground";
  };

  const timeLabel = () => {
    if (!props.lastSavedAt) return "";
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(props.lastSavedAt);
  };

  return (
    <div
      class={cn(
        "flex items-center justify-between gap-3 rounded-md border bg-card px-3 py-2",
        props.class,
      )}
    >
      <div class="flex min-w-0 items-center gap-2">
        <span
          class={cn(
            "size-2 rounded-full",
            props.state === "saved"
              ? "bg-emerald-500"
              : props.state === "error"
                ? "bg-destructive"
                : props.state === "saving"
                  ? "bg-primary animate-pulse"
                  : "bg-muted-foreground/40",
          )}
        />
        <span class={cn("text-xs font-medium", tone())}>{label()}</span>
        <Show when={props.state === "saved" && timeLabel()}>
          <span class="text-[11px] text-muted-foreground">at {timeLabel()}</span>
        </Show>
      </div>

      <Show when={props.state === "error" && props.onRetry}>
        <Button size="sm" variant="outline" onClick={props.onRetry}>
          Retry
        </Button>
      </Show>
    </div>
  );
}
