import "./chart-plugins";
import { createEffect, createSignal, on, onMount } from "solid-js";
import {
  animateChartHero,
  animateTabContent,
} from "~/features/lib/gsap-directives/chart-animations";
import { reactiveChartColors } from "~/features/ui/charts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/features/ui/components/tabs";
import {
  AreaChartsSection,
  BarChartsSection,
  LineChartsSection,
  PieChartsSection,
  RadarChartsSection,
  RadialChartsSection,
  TooltipsSection,
} from "./sections";

// ════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════

const TAB_TRIGGER =
  "relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-medium shadow-none transition-none data-selected:border-foreground data-selected:bg-transparent data-selected:text-foreground data-selected:shadow-none";

export function ChartsShowcase() {
  const colors = reactiveChartColors(1);
  let heroEl!: HTMLDivElement;
  let tabContentRef!: HTMLDivElement;
  const [activeTab, setActiveTab] = createSignal("area");

  onMount(() => {
    animateChartHero(heroEl);
  });

  // Animate tab content on tab switch (skip initial mount)
  createEffect(
    on(
      activeTab,
      () => {
        if (tabContentRef) animateTabContent(tabContentRef);
      },
      { defer: true },
    ),
  );

  return (
    <div class="space-y-8 p-6 pb-16">
      {/* Hero */}
      <div ref={heroEl} class="space-y-3 py-8 text-center">
        <p data-hero-subtitle class="text-xs font-medium text-muted-foreground">
          Chart.js Components
        </p>
        <h1 data-hero-title class="text-3xl font-bold tracking-tight sm:text-4xl">
          Beautiful Charts & Graphs
        </h1>
        <p data-hero-desc class="mx-auto max-w-lg text-sm text-muted-foreground">
          A collection of ready-to-use chart components built with Chart.js.
          <br />
          From basic charts to rich data displays, copy and paste into your apps.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="area" class="w-full" onChange={(v) => setActiveTab(v)}>
        <TabsList class="h-auto w-full justify-start gap-0 rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="area" class={TAB_TRIGGER}>
            Area Charts
          </TabsTrigger>
          <TabsTrigger value="bar" class={TAB_TRIGGER}>
            Bar Charts
          </TabsTrigger>
          <TabsTrigger value="line" class={TAB_TRIGGER}>
            Line Charts
          </TabsTrigger>
          <TabsTrigger value="pie" class={TAB_TRIGGER}>
            Pie Charts
          </TabsTrigger>
          <TabsTrigger value="radar" class={TAB_TRIGGER}>
            Radar Charts
          </TabsTrigger>
          <TabsTrigger value="radial" class={TAB_TRIGGER}>
            Radial Charts
          </TabsTrigger>
          <TabsTrigger value="tooltips" class={TAB_TRIGGER}>
            Tooltips
          </TabsTrigger>
        </TabsList>

        <div ref={tabContentRef}>
          <TabsContent value="area" class="mt-6">
            <AreaChartsSection colors={colors()} />
          </TabsContent>
          <TabsContent value="bar" class="mt-6">
            <BarChartsSection colors={colors()} />
          </TabsContent>
          <TabsContent value="line" class="mt-6">
            <LineChartsSection colors={colors()} />
          </TabsContent>
          <TabsContent value="pie" class="mt-6">
            <PieChartsSection colors={colors()} />
          </TabsContent>
          <TabsContent value="radar" class="mt-6">
            <RadarChartsSection colors={colors()} />
          </TabsContent>
          <TabsContent value="radial" class="mt-6">
            <RadialChartsSection colors={colors()} />
          </TabsContent>
          <TabsContent value="tooltips" class="mt-6">
            <TooltipsSection colors={colors()} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
