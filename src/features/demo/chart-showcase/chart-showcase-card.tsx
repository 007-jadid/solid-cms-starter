import { type JSX, onMount, Show } from "solid-js";
import {
  animateChartWipe,
  animateGridCards,
  animateTrendPulse,
  attachCardSpotlight,
} from "~/features/lib/gsap-directives/chart-animations";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";

// ════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════
const ico = "size-3.5";
const icoProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round" as const,
  "stroke-linejoin": "round" as const,
};

export function AreaIcon() {
  return (
    <svg class={ico} {...icoProps}>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 16c.5-2 1.5-7 4-7 2.5 0 3.5 5 6 5h4" />
    </svg>
  );
}
export function BarIcon() {
  return (
    <svg class={ico} {...icoProps}>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 16V8" />
      <path d="M12 16V4" />
      <path d="M17 16v-5" />
    </svg>
  );
}
export function LineIcon() {
  return (
    <svg class={ico} {...icoProps}>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="m7 12 4-4 4 4 6-6" />
    </svg>
  );
}
export function PieIcon() {
  return (
    <svg class={ico} {...icoProps}>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}
export function RadarIcon() {
  return (
    <svg class={ico} {...icoProps}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 2 15.09 9.26 22.18 10.46 17.09 15.54 18.18 22.64 12 19.37 5.82 22.64 6.91 15.54 1.82 10.46 8.91 9.26" />
    </svg>
  );
}
export function RadialIcon() {
  return (
    <svg class={ico} {...icoProps}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
export function TooltipTabIcon() {
  return (
    <svg class={ico} {...icoProps}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
export function TrendUp() {
  return (
    <svg
      class="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
export function TrendDown() {
  return (
    <svg
      class="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  );
}

// ════════════════════════════════════════════
// UTILITY COMPONENTS
// ════════════════════════════════════════════

export function ChartShowcaseCard(props: {
  icon: JSX.Element;
  category: string;
  title: string;
  description: string;
  trend?: number;
  trendLabel?: string;
  dateRange?: string;
  children: JSX.Element;
  class?: string;
}) {
  let cardEl!: HTMLDivElement;
  let chartAreaEl!: HTMLDivElement;
  let trendEl: HTMLDivElement | undefined;

  onMount(() => {
    attachCardSpotlight(cardEl);
    animateChartWipe(chartAreaEl);
    if (trendEl) animateTrendPulse(trendEl);
  });

  return (
    <Card ref={cardEl} class={props.class}>
      <div class="flex items-center justify-between px-5 py-2.5">
        <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
          {props.icon}
          <span>{props.category}</span>
        </div>
      </div>
      <CardHeader class="pt-0">
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={chartAreaEl}>{props.children}</div>
      </CardContent>
      <Show when={props.trend !== undefined}>
        <CardFooter
          ref={trendEl}
          class="flex-col items-start gap-1 text-sm"
          {...{ "data-trend": true }}
        >
          <div class="flex items-center gap-1 font-medium leading-none">
            {props.trendLabel ?? `Trending up by ${Math.abs(props.trend!)}% this month`}{" "}
            {(props.trend ?? 0) >= 0 ? <TrendUp /> : <TrendDown />}
          </div>
          <div class="text-xs leading-none text-muted-foreground">
            {props.dateRange ?? "January - June 2024"}
          </div>
        </CardFooter>
      </Show>
    </Card>
  );
}

export function ChartGrid(props: { children: JSX.Element }) {
  let gridEl!: HTMLDivElement;

  onMount(() => {
    animateGridCards(gridEl);
  });

  return (
    <div ref={gridEl} class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {props.children}
    </div>
  );
}

export function ChartWrap(props: { height?: number; children: JSX.Element }) {
  return (
    <div class="relative w-full" style={{ height: `${props.height ?? 200}px` }}>
      {props.children}
    </div>
  );
}
