import { createMemo, createSignal } from "solid-js";
import { AreaChart, addAlpha } from "~/features/ui/charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/features/ui/components/select";
import { DESKTOP, MOBILE, MONTHS, makeDailyData } from "../chart-data";
import { AreaIcon, ChartGrid, ChartShowcaseCard } from "../chart-showcase-card";

// ════════════════════════════════════════════
// AREA CHARTS SECTION
// ════════════════════════════════════════════

export function AreaChartsSection(props: { colors: string[] }) {
  const c = () => props.colors;

  // Interactive chart
  const periods = ["Last 3 months", "Last 30 days", "Last 7 days"];
  const [period, setPeriod] = createSignal(periods[0]);
  const periodMonths = () =>
    period() === "Last 7 days" ? 0.25 : period() === "Last 30 days" ? 1 : 3;
  const daily = createMemo(() => makeDailyData(periodMonths()));

  return (
    <div class="space-y-6">
      {/* Interactive Hero */}
      <Card>
        <div class="flex items-center justify-between px-5 py-2.5">
          <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
            <AreaIcon />
            <span>Area Chart</span>
          </div>
        </div>
        <CardHeader class="flex-row items-start justify-between pt-0">
          <div>
            <CardTitle>Area Chart - Interactive</CardTitle>
            <CardDescription>Showing total visitors for the last 3 months</CardDescription>
          </div>
          <Select
            value={period()}
            onChange={(v) => v && setPeriod(v)}
            options={periods}
            itemComponent={(p) => <SelectItem item={p.item}>{p.item.rawValue}</SelectItem>}
          >
            <SelectTrigger class="h-8 w-[160px] text-xs">
              <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </CardHeader>
        <CardContent>
          <AreaChart
            data={{
              labels: daily().labels,
              datasets: [
                {
                  label: "Desktop",
                  data: daily().desktop,
                  borderColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 0,
                  pointHoverRadius: 4,
                  tension: 0.4,
                  fill: true,
                },
                {
                  label: "Mobile",
                  data: daily().mobile,
                  borderColor: c()[1],
                  borderWidth: 2,
                  pointRadius: 0,
                  pointHoverRadius: 4,
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
            height={300}
            options={{
              scales: {
                x: {
                  ticks: { maxTicksLimit: 12 },
                },
              },
            }}
          />
        </CardContent>
        <CardFooter class="gap-4 text-xs text-muted-foreground">
          <span class="flex items-center gap-1.5">
            <span class="size-2 rounded-full" style={{ background: c()[0] }} />
            Mobile
          </span>
          <span class="flex items-center gap-1.5">
            <span class="size-2 rounded-full" style={{ background: c()[1] }} />
            Desktop
          </span>
        </CardFooter>
      </Card>

      {/* Variants Grid */}
      <ChartGrid>
        {/* 1. Area Chart */}
        <ChartShowcaseCard
          icon={<AreaIcon />}
          category="Area Chart"
          title="Area Chart"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <AreaChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  borderColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
            height={200}
          />
        </ChartShowcaseCard>

        {/* 2. Area Chart - Linear */}
        <ChartShowcaseCard
          icon={<AreaIcon />}
          category="Area Chart"
          title="Area Chart - Linear"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <AreaChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  borderColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0,
                  fill: true,
                },
              ],
            }}
            height={200}
            options={{ elements: { line: { tension: 0 } } }}
          />
        </ChartShowcaseCard>

        {/* 3. Area Chart - Step */}
        <ChartShowcaseCard
          icon={<AreaIcon />}
          category="Area Chart"
          title="Area Chart - Step"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <AreaChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  borderColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 0,
                  // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
                  stepped: true as any,
                  fill: true,
                },
              ],
            }}
            height={200}
            // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
            options={{ elements: { line: { stepped: true } as any } }}
          />
        </ChartShowcaseCard>

        {/* 4. Area Chart - Legend */}
        <ChartShowcaseCard
          icon={<AreaIcon />}
          category="Area Chart"
          title="Area Chart - Legend"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <AreaChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Mobile",
                  data: MOBILE,
                  borderColor: c()[1],
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                  fill: true,
                },
                {
                  label: "Desktop",
                  data: DESKTOP,
                  borderColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
            height={200}
          />
        </ChartShowcaseCard>

        {/* 5. Area Chart - Stacked */}
        <ChartShowcaseCard
          icon={<AreaIcon />}
          category="Area Chart"
          title="Area Chart - Stacked"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <AreaChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Mobile",
                  data: MOBILE,
                  borderColor: c()[1],
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                  fill: true,
                },
                {
                  label: "Desktop",
                  data: DESKTOP,
                  borderColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
            height={200}
            options={{
              scales: {
                x: { stacked: true },
                y: { stacked: true },
              },
            }}
          />
        </ChartShowcaseCard>

        {/* 6. Area Chart - Stacked Expanded */}
        <ChartShowcaseCard
          icon={<AreaIcon />}
          category="Area Chart"
          title="Area Chart - Stacked Expanded"
          description="Showing total visitors for the last 6months"
          trend={5.2}
        >
          <AreaChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Mobile",
                  data: MOBILE.map((m, i) => Math.round((m / (m + DESKTOP[i])) * 100)),
                  borderColor: c()[1],
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                  fill: true,
                },
                {
                  label: "Desktop",
                  data: DESKTOP.map((d, i) => Math.round((d / (d + MOBILE[i])) * 100)),
                  borderColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
            height={200}
            options={{
              scales: {
                x: { stacked: true },
                y: {
                  stacked: true,
                  max: 100,
                  // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
                  ticks: { callback: (v: any) => `${v}%` },
                },
              },
            }}
          />
        </ChartShowcaseCard>

        {/* 7. Area Chart - Icons */}
        <ChartShowcaseCard
          icon={<AreaIcon />}
          category="Area Chart"
          title="Area Chart - Icons"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <AreaChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Mobile",
                  data: MOBILE,
                  borderColor: c()[1],
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                  borderDash: [5, 5],
                  fill: true,
                },
                {
                  label: "Desktop",
                  data: DESKTOP,
                  borderColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
            height={200}
          />
        </ChartShowcaseCard>

        {/* 8. Area Chart - Gradient */}
        <ChartShowcaseCard
          icon={<AreaIcon />}
          category="Area Chart"
          title="Area Chart - Gradient"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <AreaChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  borderColor: c()[0],
                  // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
                  backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const area = context.chart.chartArea;
                    if (!area) return "transparent";
                    const g = ctx.createLinearGradient(0, area.top, 0, area.bottom);
                    g.addColorStop(0, addAlpha(c()[0], 0.5));
                    g.addColorStop(0.5, addAlpha(c()[0], 0.15));
                    g.addColorStop(1, addAlpha(c()[0], 0.01));
                    return g;
                  },
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                  fill: true,
                },
                {
                  label: "Mobile",
                  data: MOBILE,
                  borderColor: c()[1],
                  // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
                  backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const area = context.chart.chartArea;
                    if (!area) return "transparent";
                    const g = ctx.createLinearGradient(0, area.top, 0, area.bottom);
                    g.addColorStop(0, addAlpha(c()[1], 0.5));
                    g.addColorStop(0.5, addAlpha(c()[1], 0.15));
                    g.addColorStop(1, addAlpha(c()[1], 0.01));
                    return g;
                  },
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
            height={200}
          />
        </ChartShowcaseCard>

        {/* 9. Area Chart - Axes */}
        <ChartShowcaseCard
          icon={<AreaIcon />}
          category="Area Chart"
          title="Area Chart - Axes"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <AreaChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  borderColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
            height={200}
            options={{
              scales: {
                x: {
                  grid: { display: true },
                  border: { display: true },
                },
                y: {
                  grid: { display: true },
                  border: { display: true },
                  ticks: { display: true },
                },
              },
            }}
          />
        </ChartShowcaseCard>
      </ChartGrid>
    </div>
  );
}
