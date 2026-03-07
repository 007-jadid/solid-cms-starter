import type { Component, ComponentProps, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

import { cn } from "~/features/lib/utils";

type EmptyStateProps = ComponentProps<"div"> & {
  icon?: JSX.Element;
  title: string;
  description?: string;
  action?: JSX.Element;
  class?: string | undefined;
};

const EmptyState: Component<EmptyStateProps> = (props) => {
  const [local, others] = splitProps(props, ["icon", "title", "description", "action", "class"]);

  return (
    <div
      class={cn("flex flex-col items-center justify-center py-12 px-4 text-center", local.class)}
      {...others}
    >
      <Show when={local.icon}>
        <div class="mb-4 text-muted-foreground [&>svg]:h-12 [&>svg]:w-12">{local.icon}</div>
      </Show>

      <h3 class="text-lg font-semibold">{local.title}</h3>

      <Show when={local.description}>
        <p class="mt-2 text-sm text-muted-foreground max-w-md">{local.description}</p>
      </Show>

      <Show when={local.action}>
        <div class="mt-6">{local.action}</div>
      </Show>
    </div>
  );
};

export { EmptyState };
export type { EmptyStateProps };
