import { createMemo, createSignal } from "solid-js";
import {
  addAlpha,
  DoughnutChart,
  getThemeColors,
  PieChart,
  themeVersion,
} from "~/features/ui/charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/features/ui/components/select";
import { BROWSER_VALUES, BROWSERS } from "../chart-data";
import { ChartGrid, ChartShowcaseCard, PieIcon } from "../chart-showcase-card";

// ════════════════════════════════════════════
// PIE CHARTS SECTION
// ════════════════════════════════════════════

export function PieChartsSection(props: { colors: string[] }) {
  const c = () => props.colors;
  const theme = () => {
    themeVersion();
    return getThemeColors();
  };

  return (
    <div class="space-y-6">
      <ChartGrid>
        {/* 1. Pie Chart */}
        <ChartShowcaseCard
          icon={<PieIcon />}
          category="Pie Chart"
          title="Pie Chart"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <PieChart
            data={{
              labels: BROWSERS,
              datasets: [
                {
                  data: BROWSER_VALUES,
                  backgroundColor: c().slice(0, 5),
                },
              ],
            }}
            height={200}
          />
        </ChartShowcaseCard>

        {/* 2. Pie Chart - Separator None */}
        <ChartShowcaseCard
          icon={<PieIcon />}
          category="Pie Chart"
          title="Pie Chart - Separator None"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <PieChart
            data={{
              labels: BROWSERS,
              datasets: [
                {
                  data: BROWSER_VALUES,
                  backgroundColor: c().slice(0, 5),
                  borderWidth: 0,
                },
              ],
            }}
            height={200}
            options={{
              elements: {
                arc: { borderWidth: 0, spacing: 0 },
              },
            }}
          />
        </ChartShowcaseCard>

        {/* 3. Pie Chart - Label */}
        <ChartShowcaseCard
          icon={<PieIcon />}
          category="Pie Chart"
          title="Pie Chart - Label"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <PieChart
            data={{
              labels: BROWSERS,
              datasets: [
                {
                  data: BROWSER_VALUES,
                  backgroundColor: c().slice(0, 5),
                },
              ],
            }}
            height={200}
            options={
              {
                plugins: {
                  datalabel: {
                    display: true,
                    color: theme().foreground,
                    fontSize: 12,
                  },
                  legend: { display: false },
                },
                // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
              } as any
            }
          />
        </ChartShowcaseCard>

        {/* 4. Pie Chart - Custom Label */}
        <ChartShowcaseCard
          icon={<PieIcon />}
          category="Pie Chart"
          title="Pie Chart - Custom Label"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <PieChart
            data={{
              labels: BROWSERS,
              datasets: [
                {
                  data: BROWSER_VALUES,
                  backgroundColor: c().slice(0, 5),
                },
              ],
            }}
            height={200}
            options={
              {
                plugins: {
                  datalabel: {
                    display: true,
                    color: "#fff",
                    fontSize: 10,
                  },
                  legend: { display: false },
                },
                // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
              } as any
            }
          />
        </ChartShowcaseCard>

        {/* 5. Pie Chart - Label List */}
        <ChartShowcaseCard
          icon={<PieIcon />}
          category="Pie Chart"
          title="Pie Chart - Label List"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <PieChart
            data={{
              labels: BROWSERS,
              datasets: [
                {
                  data: BROWSER_VALUES,
                  backgroundColor: c().slice(0, 5),
                },
              ],
            }}
            height={200}
            options={{
              plugins: {
                legend: {
                  position: "right" as const,
                  align: "center" as const,
                },
              },
            }}
          />
        </ChartShowcaseCard>

        {/* 6. Pie Chart - Legend */}
        <ChartShowcaseCard
          icon={<PieIcon />}
          category="Pie Chart"
          title="Pie Chart - Legend"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <PieChart
            data={{
              labels: BROWSERS,
              datasets: [
                {
                  data: BROWSER_VALUES,
                  backgroundColor: c().slice(0, 5),
                },
              ],
            }}
            height={200}
            options={{
              plugins: {
                legend: {
                  position: "bottom" as const,
                  labels: { padding: 16, usePointStyle: true, pointStyle: "rectRounded" },
                },
              },
            }}
          />
        </ChartShowcaseCard>

        {/* 7. Pie Chart - Donut */}
        <ChartShowcaseCard
          icon={<PieIcon />}
          category="Pie Chart"
          title="Pie Chart - Donut"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <DoughnutChart
            data={{
              labels: BROWSERS,
              datasets: [
                {
                  data: BROWSER_VALUES,
                  backgroundColor: c().slice(0, 5),
                },
              ],
            }}
            height={200}
          />
        </ChartShowcaseCard>

        {/* 8. Pie Chart - Donut Active */}
        <ChartShowcaseCard
          icon={<PieIcon />}
          category="Pie Chart"
          title="Pie Chart - Donut Active"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <DoughnutChart
            data={{
              labels: BROWSERS,
              datasets: [
                {
                  data: BROWSER_VALUES,
                  backgroundColor: c().slice(0, 5),
                  hoverOffset: 12,
                },
              ],
            }}
            height={200}
          />
        </ChartShowcaseCard>

        {/* 9. Pie Chart - Donut with Text */}
        <ChartShowcaseCard
          icon={<PieIcon />}
          category="Pie Chart"
          title="Pie Chart - Donut with Text"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <DoughnutChart
            data={{
              labels: BROWSERS,
              datasets: [
                {
                  data: BROWSER_VALUES,
                  backgroundColor: c().slice(0, 5),
                },
              ],
            }}
            height={200}
            centerText={BROWSER_VALUES.reduce((a, b) => a + b, 0).toLocaleString()}
            centerSubtext="Visitors"
          />
        </ChartShowcaseCard>

        {/* 10. Pie Chart - Stacked */}
        <ChartShowcaseCard
          icon={<PieIcon />}
          category="Pie Chart"
          title="Pie Chart - Stacked"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <DoughnutChart
            data={{
              labels: BROWSERS,
              datasets: [
                {
                  data: BROWSER_VALUES,
                  backgroundColor: c().slice(0, 5),
                },
                {
                  data: BROWSER_VALUES.map((v) => Math.round(v * 0.6)),
                  backgroundColor: c()
                    .slice(0, 5)
                    .map((col) => addAlpha(col, 0.5)),
                },
              ],
            }}
            height={200}
          />
        </ChartShowcaseCard>

        {/* 11. Pie Chart - Interactive */}
        <PieChartInteractive colors={c()} />
      </ChartGrid>
    </div>
  );
}

function PieChartInteractive(props: { colors: string[] }) {
  const c = () => props.colors;
  const monthData: Record<string, number[]> = {
    January: [186, 150, 120, 90, 50],
    February: [200, 180, 160, 140, 80],
    March: [275, 200, 187, 173, 90],
    April: [150, 120, 100, 80, 60],
    May: [220, 190, 170, 150, 100],
    June: [250, 210, 195, 180, 110],
  };
  const monthOptions = Object.keys(monthData);
  const [month, setMonth] = createSignal("January");
  const total = createMemo(() => monthData[month()]!.reduce((a, b) => a + b, 0));

  return (
    <ChartShowcaseCard
      icon={<PieIcon />}
      category="Pie Chart"
      title="Pie Chart - Interactive"
      description="January - June 2024"
      trend={5.2}
      dateRange="Showing total visitors for the last 6 months"
    >
      <div class="mb-3 flex justify-end">
        <Select
          value={month()}
          onChange={(v) => v && setMonth(v)}
          options={monthOptions}
          itemComponent={(p) => <SelectItem item={p.item}>{p.item.rawValue}</SelectItem>}
        >
          <SelectTrigger class="h-7 w-[130px] text-xs">
            <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
      </div>
      <DoughnutChart
        data={{
          labels: BROWSERS,
          datasets: [
            {
              data: monthData[month()]!,
              backgroundColor: c().slice(0, 5),
            },
          ],
        }}
        height={200}
        centerText={total().toLocaleString()}
        centerSubtext="Visitors"
      />
    </ChartShowcaseCard>
  );
}
