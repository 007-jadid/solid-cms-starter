import { Show } from "solid-js";

import { cn } from "~/features/lib/utils";

import { Button } from "./button";

export type AsyncStatusType = "running" | "success" | "error";

export function AsyncStatusBanner(props: {
  status: AsyncStatusType;
  title: string;
  message?: string;
  progress?: number;
  onRetry?: () => void;
  onDismiss?: () => void;
  class?: string;
}) {
  const bannerTone = () => {
    if (props.status === "success") {
      return "border-emerald-500/30 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300";
    }
    if (props.status === "error") {
      return "border-destructive/40 bg-destructive/10 text-destructive";
    }
    return "border-primary/30 bg-primary/8 text-primary";
  };

  const clampedProgress = () => {
    if (props.progress === undefined) return undefined;
    return Math.max(0, Math.min(100, props.progress));
  };

  return (
    <div
      class={cn(
        "rounded-lg border px-3 py-2",
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        bannerTone(),
        props.class,
      )}
      aria-live="polite"
    >
      <div class="min-w-0">
        <p class="text-sm font-medium truncate">{props.title}</p>
        <Show when={props.message}>
          <p class="text-xs/5 opacity-90">{props.message}</p>
        </Show>
        <Show when={clampedProgress() !== undefined}>
          <div class="mt-1.5 h-1.5 w-full rounded-full bg-background/60">
            <div
              class="h-1.5 rounded-full bg-current transition-[width] duration-300"
              style={{ width: `${clampedProgress()}%` }}
            />
          </div>
        </Show>
      </div>

      <div class="flex items-center gap-2">
        <Show when={props.onRetry && props.status === "error"}>
          <Button size="sm" variant="outline" onClick={props.onRetry}>
            Retry
          </Button>
        </Show>
        <Show when={props.onDismiss && props.status !== "running"}>
          <Button size="sm" variant="ghost" onClick={props.onDismiss}>
            Dismiss
          </Button>
        </Show>
      </div>
    </div>
  );
}
