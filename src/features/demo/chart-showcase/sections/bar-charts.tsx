import { createMemo, createSignal } from "solid-js";
import { addAlpha, BarChart } from "~/features/ui/charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { BROWSER_VALUES, BROWSERS, DESKTOP, MOBILE, MONTHS, makeDailyData } from "../chart-data";
import { BarIcon, ChartGrid, ChartShowcaseCard } from "../chart-showcase-card";

// ════════════════════════════════════════════
// BAR CHARTS SECTION
// ════════════════════════════════════════════

export function BarChartsSection(props: { colors: string[] }) {
  const c = () => props.colors;
  const [period] = createSignal("Last 3 months");
  const periodMonths = () =>
    period() === "Last 7 days" ? 0.25 : period() === "Last 30 days" ? 1 : 3;
  const daily = createMemo(() => makeDailyData(periodMonths()));
  const desktopTotal = createMemo(() => daily().desktop.reduce((a, b) => a + b, 0));
  const mobileTotal = createMemo(() => daily().mobile.reduce((a, b) => a + b, 0));

  return (
    <div class="space-y-6">
      {/* Interactive Hero */}
      <Card>
        <div class="flex items-center justify-between px-5 py-2.5">
          <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BarIcon />
            <span>Bar Chart</span>
          </div>
        </div>
        <CardHeader class="flex-row items-start justify-between pt-0">
          <div>
            <CardTitle>Bar Chart - Interactive</CardTitle>
            <CardDescription>Showing total visitors for the last 3 months</CardDescription>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <div class="text-xs text-muted-foreground">Desktop</div>
              <div class="text-2xl font-bold tracking-tight">{desktopTotal().toLocaleString()}</div>
            </div>
            <div class="text-right">
              <div class="text-xs text-muted-foreground">Mobile</div>
              <div class="text-2xl font-bold tracking-tight">{mobileTotal().toLocaleString()}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BarChart
            data={{
              labels: daily().labels,
              datasets: [
                {
                  label: "Desktop",
                  data: daily().desktop,
                  backgroundColor: c()[0],
                  borderRadius: 2,
                  barPercentage: 0.8,
                },
              ],
            }}
            height={300}
            options={{
              scales: {
                x: { ticks: { maxTicksLimit: 12 } },
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Variants Grid */}
      <ChartGrid>
        {/* 1. Bar Chart */}
        <ChartShowcaseCard
          icon={<BarIcon />}
          category="Bar Chart"
          title="Bar Chart"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <BarChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  backgroundColor: c()[0],
                  borderRadius: 4,
                },
              ],
            }}
            height={200}
          />
        </ChartShowcaseCard>

        {/* 2. Bar Chart - Horizontal */}
        <ChartShowcaseCard
          icon={<BarIcon />}
          category="Bar Chart"
          title="Bar Chart - Horizontal"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <BarChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  backgroundColor: c()[0],
                  borderRadius: 4,
                },
              ],
            }}
            height={200}
            options={{ indexAxis: "y" as const }}
          />
        </ChartShowcaseCard>

        {/* 3. Bar Chart - Multiple */}
        <ChartShowcaseCard
          icon={<BarIcon />}
          category="Bar Chart"
          title="Bar Chart - Multiple"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <BarChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  backgroundColor: c()[0],
                  borderRadius: 4,
                },
                {
                  label: "Mobile",
                  data: MOBILE,
                  backgroundColor: c()[1],
                  borderRadius: 4,
                },
              ],
            }}
            height={200}
          />
        </ChartShowcaseCard>

        {/* 4. Bar Chart - Stacked + Legend */}
        <ChartShowcaseCard
          icon={<BarIcon />}
          category="Bar Chart"
          title="Bar Chart - Stacked + Legend"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <BarChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  backgroundColor: c()[0],
                  borderRadius: 0,
                },
                {
                  label: "Mobile",
                  data: MOBILE,
                  backgroundColor: c()[1],
                  borderRadius: 0,
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

        {/* 5. Bar Chart - Label */}
        <ChartShowcaseCard
          icon={<BarIcon />}
          category="Bar Chart"
          title="Bar Chart - Label"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <BarChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  backgroundColor: c()[0],
                  borderRadius: 4,
                },
              ],
            }}
            height={200}
            // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
            options={{ plugins: { datalabel: { display: true } } } as any}
          />
        </ChartShowcaseCard>

        {/* 6. Bar Chart - Custom Label */}
        <ChartShowcaseCard
          icon={<BarIcon />}
          category="Bar Chart"
          title="Bar Chart - Custom Label"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <BarChart
            data={{
              labels: ["January", "February", "March", "April", "May", "June"],
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  backgroundColor: [c()[0], c()[1], c()[2], c()[3], c()[4], c()[0]],
                  borderRadius: 4,
                },
              ],
            }}
            height={200}
            options={
              {
                indexAxis: "y" as const,
                plugins: {
                  datalabel: { display: true },
                  legend: { display: false },
                },
                // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
              } as any
            }
          />
        </ChartShowcaseCard>

        {/* 7. Bar Chart - Mixed */}
        <ChartShowcaseCard
          icon={<BarIcon />}
          category="Bar Chart"
          title="Bar Chart - Mixed"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <BarChart
            data={{
              labels: BROWSERS,
              datasets: [
                {
                  label: "Visitors",
                  data: BROWSER_VALUES,
                  backgroundColor: c().slice(0, 5),
                  borderRadius: 4,
                },
              ],
            }}
            height={200}
            options={{
              indexAxis: "y" as const,
              plugins: { legend: { display: false } },
            }}
          />
        </ChartShowcaseCard>

        {/* 8. Bar Chart - Active */}
        <ChartShowcaseCard
          icon={<BarIcon />}
          category="Bar Chart"
          title="Bar Chart - Active"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <BarChart
            data={{
              labels: BROWSERS,
              datasets: [
                {
                  label: "Visitors",
                  data: BROWSER_VALUES,
                  backgroundColor: BROWSER_VALUES.map((_, i) =>
                    i === 0 ? c()[0] : addAlpha(c()[0], 0.3),
                  ),
                  borderRadius: 4,
                },
              ],
            }}
            height={200}
            options={{ plugins: { legend: { display: false } } }}
          />
        </ChartShowcaseCard>

        {/* 9. Bar Chart - Negative */}
        <ChartShowcaseCard
          icon={<BarIcon />}
          category="Bar Chart"
          title="Bar Chart - Negative"
          description="January - June 2024"
          trend={-2.1}
          trendLabel="Trending down by 2.1% this month"
          dateRange="Showing total visitors for the last 6 months"
        >
          <BarChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: [186, 305, -237, -73, 209, 214],
                  backgroundColor: [186, 305, -237, -73, 209, 214].map((v) =>
                    v >= 0 ? c()[0] : c()[3],
                  ),
                  borderRadius: 4,
                },
              ],
            }}
            height={200}
            options={{ plugins: { legend: { display: false } } }}
          />
        </ChartShowcaseCard>
      </ChartGrid>
    </div>
  );
}
