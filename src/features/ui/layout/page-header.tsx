import { type JSX, Show } from "solid-js";
import { cn } from "~/features/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  class?: string;
  children?: JSX.Element;
}

export function PageHeader(props: PageHeaderProps) {
  return (
    <div class={cn("flex items-start justify-between gap-4", props.class)}>
      <div class="space-y-1">
        <h1 class="text-lg font-semibold tracking-tight">{props.title}</h1>
        <Show when={props.description}>
          <p class="text-[13px] text-muted-foreground">{props.description}</p>
        </Show>
      </div>
      <Show when={props.children}>
        <div class="shrink-0">{props.children}</div>
      </Show>
    </div>
  );
}
