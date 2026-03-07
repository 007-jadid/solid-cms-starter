import type { ChartOptions } from "chart.js";
import { createMemo, createSignal } from "solid-js";
import { LineChart } from "~/features/ui/charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { BROWSER_VALUES, BROWSERS, DESKTOP, MOBILE, MONTHS, makeDailyData } from "../chart-data";
import { ChartGrid, ChartShowcaseCard, LineIcon } from "../chart-showcase-card";

// ════════════════════════════════════════════
// LINE CHARTS SECTION
// ════════════════════════════════════════════

export function LineChartsSection(props: { colors: string[] }) {
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
            <LineIcon />
            <span>Line Chart</span>
          </div>
        </div>
        <CardHeader class="flex-row items-start justify-between pt-0">
          <div>
            <CardTitle>Line Chart - Interactive</CardTitle>
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
          <LineChart
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
        {/* 1. Line Chart */}
        <ChartShowcaseCard
          icon={<LineIcon />}
          category="Line Chart"
          title="Line Chart"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <LineChart
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
                },
              ],
            }}
            height={200}
          />
        </ChartShowcaseCard>

        {/* 2. Line Chart - Linear */}
        <ChartShowcaseCard
          icon={<LineIcon />}
          category="Line Chart"
          title="Line Chart - Linear"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <LineChart
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
                },
              ],
            }}
            height={200}
            options={{ elements: { line: { tension: 0 } } }}
          />
        </ChartShowcaseCard>

        {/* 3. Line Chart - Step */}
        <ChartShowcaseCard
          icon={<LineIcon />}
          category="Line Chart"
          title="Line Chart - Step"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <LineChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  borderColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 0,
                  stepped: true,
                },
              ],
            }}
            height={200}
            options={{ elements: { line: { stepped: true } } }}
          />
        </ChartShowcaseCard>

        {/* 4. Line Chart - Multiple */}
        <ChartShowcaseCard
          icon={<LineIcon />}
          category="Line Chart"
          title="Line Chart - Multiple"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <LineChart
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
                },
                {
                  label: "Mobile",
                  data: MOBILE,
                  borderColor: c()[1],
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                },
              ],
            }}
            height={200}
          />
        </ChartShowcaseCard>

        {/* 5. Line Chart - Dots */}
        <ChartShowcaseCard
          icon={<LineIcon />}
          category="Line Chart"
          title="Line Chart - Dots"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <LineChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  borderColor: c()[0],
                  backgroundColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 4,
                  pointBackgroundColor: c()[0],
                  tension: 0.4,
                },
              ],
            }}
            height={200}
            options={{
              elements: {
                point: {
                  radius: 4,
                  hoverRadius: 6,
                },
              },
            }}
          />
        </ChartShowcaseCard>

        {/* 6. Line Chart - Custom Dots */}
        <ChartShowcaseCard
          icon={<LineIcon />}
          category="Line Chart"
          title="Line Chart - Custom Dots"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <LineChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  borderColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 6,
                  pointBackgroundColor: "#fff",
                  pointBorderColor: c()[0],
                  pointBorderWidth: 2,
                  tension: 0.4,
                },
              ],
            }}
            height={200}
            options={{
              elements: {
                point: {
                  radius: 6,
                  hoverRadius: 8,
                  hoverBorderWidth: 3,
                },
              },
            }}
          />
        </ChartShowcaseCard>

        {/* 7. Line Chart - Dots Colors */}
        <ChartShowcaseCard
          icon={<LineIcon />}
          category="Line Chart"
          title="Line Chart - Dots Colors"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <LineChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  borderColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 5,
                  pointBackgroundColor: [c()[0], c()[1], c()[2], c()[3], c()[4], c()[0]],
                  pointBorderColor: "#fff",
                  pointBorderWidth: 2,
                  tension: 0.4,
                },
              ],
            }}
            height={200}
            options={{
              elements: {
                point: { radius: 5, hoverRadius: 7 },
              },
            }}
          />
        </ChartShowcaseCard>

        {/* 8. Line Chart - Label */}
        <ChartShowcaseCard
          icon={<LineIcon />}
          category="Line Chart"
          title="Line Chart - Label"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <LineChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Desktop",
                  data: DESKTOP,
                  borderColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 3,
                  pointBackgroundColor: c()[0],
                  tension: 0.4,
                },
              ],
            }}
            height={200}
            options={{
              plugins: { datalabel: { display: true } } as ChartOptions<"line">["plugins"],
              elements: { point: { radius: 3 } },
            }}
          />
        </ChartShowcaseCard>

        {/* 9. Line Chart - Custom Label */}
        <ChartShowcaseCard
          icon={<LineIcon />}
          category="Line Chart"
          title="Line Chart - Custom Label"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <LineChart
            data={{
              labels: BROWSERS,
              datasets: [
                {
                  label: "Visitors",
                  data: BROWSER_VALUES,
                  borderColor: c()[0],
                  borderWidth: 2,
                  pointRadius: 5,
                  pointBackgroundColor: c().slice(0, 5),
                  pointBorderColor: "#fff",
                  pointBorderWidth: 2,
                  tension: 0.4,
                },
              ],
            }}
            height={200}
            options={{
              plugins: { legend: { display: false } },
              elements: { point: { radius: 5, hoverRadius: 7 } },
            }}
          />
        </ChartShowcaseCard>
      </ChartGrid>
    </div>
  );
}
