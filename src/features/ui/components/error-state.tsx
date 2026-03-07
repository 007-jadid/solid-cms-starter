import type { Component, ComponentProps, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

import { cn } from "~/features/lib/utils";
import { Button } from "./button";

type ErrorStateProps = ComponentProps<"div"> & {
  icon?: JSX.Element;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  class?: string | undefined;
};

const ErrorState: Component<ErrorStateProps> = (props) => {
  const [local, others] = splitProps(props, [
    "icon",
    "title",
    "description",
    "onRetry",
    "retryLabel",
    "class",
  ]);

  const defaultIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-12 w-12"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );

  return (
    <div
      class={cn("flex flex-col items-center justify-center py-12 px-4 text-center", local.class)}
      {...others}
    >
      <div class="mb-4 text-destructive">{local.icon || defaultIcon}</div>

      <h3 class="text-lg font-semibold">{local.title || "Something went wrong"}</h3>

      <Show when={local.description}>
        <p class="mt-2 text-sm text-muted-foreground max-w-md">{local.description}</p>
      </Show>

      <Show when={local.onRetry}>
        <div class="mt-6">
          <Button onClick={local.onRetry} variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2 h-4 w-4"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            {local.retryLabel || "Try again"}
          </Button>
        </div>
      </Show>
    </div>
  );
};

export { ErrorState };
export type { ErrorStateProps };
