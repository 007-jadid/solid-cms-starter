import type { Component, ComponentProps, JSXElement } from "solid-js";
import { Show, splitProps } from "solid-js";

import { cn } from "~/features/lib/utils";
import { Card, CardContent } from "./card";

export interface StatCardProps extends ComponentProps<"div"> {
  title: string;
  value: string | number;
  description?: string;
  icon?: JSXElement;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
}

const trendColors = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-red-600 dark:text-red-400",
  neutral: "text-muted-foreground",
} as const;

const trendIcons = {
  up: "M5 10l7-7m0 0l7 7m-7-7v18",
  down: "M19 14l-7 7m0 0l-7-7m7 7V3",
  neutral: "M5 12h14",
} as const;

const StatCard: Component<StatCardProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "title",
    "value",
    "description",
    "icon",
    "trend",
  ]);

  return (
    <Card class={cn("relative overflow-hidden", local.class)} {...others}>
      <CardContent class="p-6">
        <div class="flex items-start justify-between">
          <div class="space-y-2">
            <p class="text-sm font-medium text-muted-foreground">{local.title}</p>
            <p class="text-2xl font-bold tracking-tight">{local.value}</p>
            <Show when={local.trend}>
              {(trend) => (
                <div
                  class={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    trendColors[trend().direction],
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-3"
                  >
                    <path d={trendIcons[trend().direction]} />
                  </svg>
                  <span>{trend().value}</span>
                </div>
              )}
            </Show>
            <Show when={local.description}>
              <p class="text-xs text-muted-foreground">{local.description}</p>
            </Show>
          </div>
          <Show when={local.icon}>
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {local.icon}
            </div>
          </Show>
        </div>
      </CardContent>
    </Card>
  );
};

export { StatCard };
