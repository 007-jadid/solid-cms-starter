import { addAlpha, RadialChart } from "~/features/ui/charts";
import { ChartGrid, ChartShowcaseCard, RadialIcon } from "../chart-showcase-card";

// ════════════════════════════════════════════
// RADIAL CHARTS SECTION
// ════════════════════════════════════════════

// Browser data used across all concentric-ring radial charts
const RADIAL_BROWSERS = ["Chrome", "Safari", "Firefox", "Edge", "Other"];
const RADIAL_VALUES = [275, 200, 187, 173, 90];
const RADIAL_MAX = 275;

function makeRadialRing(label: string, value: number, max: number, color: string) {
  return {
    label,
    data: [value, max - value],
    backgroundColor: [color, addAlpha(color, 0.12)],
    borderWidth: 0,
    // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
    borderRadius: ((ctx: any) => (ctx.dataIndex === 0 ? 6 : 0)) as any,
    weight: 1,
  };
}

function makeRadialSpacer() {
  return {
    data: [1],
    backgroundColor: ["transparent" as const],
    borderWidth: 0,
    weight: 0.2,
  };
}

function makeConcentricDatasets(colors: string[]) {
  const datasets: ReturnType<typeof makeRadialRing | typeof makeRadialSpacer>[] = [];
  RADIAL_BROWSERS.forEach((browser, i) => {
    datasets.push(makeRadialRing(browser, RADIAL_VALUES[i], RADIAL_MAX, colors[i % colors.length]));
    if (i < RADIAL_BROWSERS.length - 1) datasets.push(makeRadialSpacer());
  });
  return datasets;
}

export function RadialChartsSection(props: { colors: string[] }) {
  const c = () => props.colors;

  // legend generateLabels that skips spacer datasets (those without a label)
  const concentricLegendLabels = {
    // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
    generateLabels(chart: any) {
      // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
      return (
        // biome-ignore lint/suspicious/noExplicitAny: Chart.js dataset types
        (chart.data.datasets as any[])
          // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
          .map((ds: any, i: number) => ({ ds, i }))
          .filter(({ ds }) => !!ds.label)
          .map(({ ds, i }) => ({
            text: ds.label as string,
            fillStyle: Array.isArray(ds.backgroundColor)
              ? ds.backgroundColor[0]
              : ds.backgroundColor,
            strokeStyle: "transparent",
            hidden: !chart.isDatasetVisible(i),
            datasetIndex: i,
            pointStyle: "circle" as const,
          }))
      );
    },
    usePointStyle: true,
    pointStyle: "circle" as const,
    padding: 8,
    font: { size: 11 },
  };

  return (
    <div class="space-y-6">
      <ChartGrid>
        {/* 1. Radial Chart – concentric rings, no labels */}
        <ChartShowcaseCard
          icon={<RadialIcon />}
          category="Radial Chart"
          title="Radial Chart"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <RadialChart
            data={{
              labels: RADIAL_BROWSERS,
              datasets: makeConcentricDatasets(c()),
            }}
            height={200}
            // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
            options={{ cutout: "35%" } as any}
          />
        </ChartShowcaseCard>

        {/* 2. Radial Chart - Label */}
        <ChartShowcaseCard
          icon={<RadialIcon />}
          category="Radial Chart"
          title="Radial Chart - Label"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <RadialChart
            data={{
              labels: RADIAL_BROWSERS,
              datasets: makeConcentricDatasets(c()),
            }}
            height={200}
            options={
              {
                cutout: "35%",
                plugins: {
                  legend: {
                    display: true,
                    position: "right",
                    labels: concentricLegendLabels,
                  },
                },
                // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
              } as any
            }
          />
        </ChartShowcaseCard>

        {/* 3. Radial Chart - Grid */}
        <ChartShowcaseCard
          icon={<RadialIcon />}
          category="Radial Chart"
          title="Radial Chart - Grid"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <RadialChart
            data={{
              labels: RADIAL_BROWSERS,
              datasets: makeConcentricDatasets(c()),
            }}
            height={200}
            showGrid
            // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
            options={{ cutout: "35%" } as any}
          />
        </ChartShowcaseCard>

        {/* 4. Radial Chart - Text */}
        <ChartShowcaseCard
          icon={<RadialIcon />}
          category="Radial Chart"
          title="Radial Chart - Text"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <RadialChart
            data={{
              labels: ["Visitors"],
              datasets: [
                {
                  data: [200, 75],
                  backgroundColor: [c()[0], addAlpha(c()[0], 0.1)],
                  borderWidth: 0,
                  borderRadius: 8,
                },
              ],
            }}
            height={200}
            centerText="200"
            centerSubtext="Visitors"
          />
        </ChartShowcaseCard>

        {/* 5. Radial Chart - Shape (half-circle / speedometer) */}
        <ChartShowcaseCard
          icon={<RadialIcon />}
          category="Radial Chart"
          title="Radial Chart - Shape"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <RadialChart
            data={{
              labels: ["Visitors"],
              datasets: [
                {
                  data: [1260, 365],
                  backgroundColor: [c()[0], addAlpha(c()[0], 0.1)],
                  borderWidth: 0,
                  borderRadius: 8,
                },
              ],
            }}
            height={200}
            centerText="1,260"
            centerSubtext="Visitors"
            options={
              {
                rotation: -90,
                circumference: 180,
                // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
              } as any
            }
          />
        </ChartShowcaseCard>

        {/* 6. Radial Chart - Stacked (concentric half-circles) */}
        <ChartShowcaseCard
          icon={<RadialIcon />}
          category="Radial Chart"
          title="Radial Chart - Stacked"
          description="January - June 2024"
          trend={5.2}
          dateRange="Showing total visitors for the last 6 months"
        >
          <RadialChart
            data={{
              labels: ["Chrome", "Safari", "Firefox"],
              datasets: [
                {
                  label: "Chrome",
                  data: [82, 18],
                  backgroundColor: [c()[0], addAlpha(c()[0], 0.1)],
                  borderWidth: 0,
                  borderRadius: 6,
                  weight: 1,
                },
                {
                  data: [1],
                  backgroundColor: ["transparent"],
                  borderWidth: 0,
                  weight: 0.2,
                },
                {
                  label: "Safari",
                  data: [65, 35],
                  backgroundColor: [c()[1], addAlpha(c()[1], 0.1)],
                  borderWidth: 0,
                  borderRadius: 6,
                  weight: 1,
                },
                {
                  data: [1],
                  backgroundColor: ["transparent"],
                  borderWidth: 0,
                  weight: 0.2,
                },
                {
                  label: "Firefox",
                  data: [48, 52],
                  backgroundColor: [c()[2], addAlpha(c()[2], 0.1)],
                  borderWidth: 0,
                  borderRadius: 6,
                  weight: 1,
                },
              ],
            }}
            height={200}
            centerText="1,830"
            centerSubtext="Visitors"
            options={
              {
                cutout: "40%",
                rotation: -90,
                circumference: 180,
                // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
              } as any
            }
          />
        </ChartShowcaseCard>
      </ChartGrid>
    </div>
  );
}
