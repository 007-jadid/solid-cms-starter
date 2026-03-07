import { For } from "solid-js";

import { cn } from "~/features/lib/utils";

export interface ActivityTimelineItem {
  id: string;
  user: string;
  action: string;
  time: string;
  avatar?: string;
  accentClass?: string;
}

export function ActivityTimeline(props: { items: ActivityTimelineItem[]; class?: string }) {
  return (
    <div class={cn("space-y-6", props.class)}>
      <For each={props.items}>
        {(item) => (
          <div class="relative flex items-start gap-3">
            <div class="absolute left-4 top-9 h-[calc(100%-1.5rem)] w-px bg-border/60" />

            <div
              class={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-[11px] font-medium",
                item.accentClass,
              )}
            >
              {item.avatar || item.user.slice(0, 2).toUpperCase()}
            </div>

            <div class="min-w-0 flex-1 pb-2">
              <div class="flex items-baseline justify-between gap-3">
                <p class="truncate text-sm font-medium leading-none">{item.user}</p>
                <p class="shrink-0 text-xs text-muted-foreground">{item.time}</p>
              </div>
              <p class="mt-1 text-sm text-muted-foreground">{item.action}</p>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
