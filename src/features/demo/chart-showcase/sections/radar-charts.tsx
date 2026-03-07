import type { ChartOptions } from "chart.js";
import { Radar } from "solid-chartjs";
import {
  addAlpha,
  getDefaultChartOptions,
  getThemeColors,
  themeVersion,
} from "~/features/ui/charts";
import { DESKTOP, MOBILE, MONTHS } from "../chart-data";
import { ChartGrid, ChartShowcaseCard, ChartWrap, RadarIcon } from "../chart-showcase-card";

// ════════════════════════════════════════════
// RADAR CHARTS SECTION
// ════════════════════════════════════════════

export function RadarChartsSection(props: { colors: string[] }) {
  const c = () => props.colors;

  function radarOpts(overrides?: Record<string, unknown>) {
    themeVersion(); // reactive: re-derive on theme change
    const theme = getThemeColors();
    const baseOpts = getDefaultChartOptions();
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: baseOpts.animation,
      plugins: {
        legend: { display: false },
        tooltip: baseOpts.plugins?.tooltip,
        datalabel: { display: false },
      },
      scales: {
        r: {
          grid: {
            color: addAlpha(theme.mutedForeground, 0.15),
            circular: false,
          },
          angleLines: {
            color: addAlpha(theme.mutedForeground, 0.12),
          },
          pointLabels: {
            color: theme.mutedForeground,
            font: { size: 11, weight: "500" },
          },
          ticks: { display: false },
        },
      },
      ...overrides,
    } as unknown as ChartOptions<"radar">;
  }

  const radarData = (fill = true, dots = false, extra?: Record<string, unknown>) => ({
    labels: MONTHS,
    datasets: [
      {
        label: "Desktop",
        data: DESKTOP,
        borderColor: c()[0],
        backgroundColor: fill ? addAlpha(c()[0], 0.15) : "transparent",
        borderWidth: 2,
        pointRadius: dots ? 3 : 0,
        pointBackgroundColor: c()[0],
        fill,
        ...extra,
      },
    ],
  });

  return (
    <div class="space-y-6">
      <ChartGrid>
        {/* 1. Radar Chart */}
        <ChartShowcaseCard
          icon={<RadarIcon />}
          category="Radar Chart"
          title="Radar Chart"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <ChartWrap height={220}>
            <Radar data={radarData()} options={radarOpts()} />
          </ChartWrap>
        </ChartShowcaseCard>

        {/* 2. Radar Chart - Dots */}
        <ChartShowcaseCard
          icon={<RadarIcon />}
          category="Radar Chart"
          title="Radar Chart - Dots"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <ChartWrap height={220}>
            <Radar data={radarData(true, true)} options={radarOpts()} />
          </ChartWrap>
        </ChartShowcaseCard>

        {/* 3. Radar Chart - Lines Only */}
        <ChartShowcaseCard
          icon={<RadarIcon />}
          category="Radar Chart"
          title="Radar Chart - Lines Only"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <ChartWrap height={220}>
            <Radar data={radarData(false, false)} options={radarOpts()} />
          </ChartWrap>
        </ChartShowcaseCard>

        {/* 4. Radar Chart - Custom Label */}
        <ChartShowcaseCard
          icon={<RadarIcon />}
          category="Radar Chart"
          title="Radar Chart - Custom Label"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <ChartWrap height={220}>
            <Radar
              data={{
                labels: MONTHS,
                datasets: [
                  {
                    label: "Desktop",
                    data: DESKTOP,
                    borderColor: c()[0],
                    backgroundColor: addAlpha(c()[0], 0.15),
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: c()[0],
                    fill: true,
                  },
                ],
              }}
              options={radarOpts({
                plugins: {
                  ...radarOpts().plugins,
                  datalabel: {
                    display: true,
                    color: getThemeColors().foreground,
                    fontSize: 10,
                  },
                },
              })}
            />
          </ChartWrap>
        </ChartShowcaseCard>

        {/* 5. Radar Chart - Grid Custom */}
        <ChartShowcaseCard
          icon={<RadarIcon />}
          category="Radar Chart"
          title="Radar Chart - Grid Custom"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <ChartWrap height={220}>
            <Radar
              data={radarData()}
              options={radarOpts({
                scales: {
                  r: {
                    ...radarOpts().scales!.r,
                    grid: {
                      color: addAlpha(c()[0], 0.15),
                      circular: false,
                    },
                    angleLines: {
                      color: addAlpha(c()[0], 0.1),
                    },
                  },
                },
              })}
            />
          </ChartWrap>
        </ChartShowcaseCard>

        {/* 6. Radar Chart - Grid None */}
        <ChartShowcaseCard
          icon={<RadarIcon />}
          category="Radar Chart"
          title="Radar Chart - Grid None"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <ChartWrap height={220}>
            <Radar
              data={radarData()}
              options={radarOpts({
                scales: {
                  r: {
                    ...radarOpts().scales!.r,
                    grid: { display: false },
                    angleLines: { display: false },
                  },
                },
              })}
            />
          </ChartWrap>
        </ChartShowcaseCard>

        {/* 7. Radar Chart - Grid Circle */}
        <ChartShowcaseCard
          icon={<RadarIcon />}
          category="Radar Chart"
          title="Radar Chart - Grid Circle"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <ChartWrap height={220}>
            <Radar
              data={radarData()}
              options={radarOpts({
                scales: {
                  r: {
                    ...radarOpts().scales!.r,
                    grid: {
                      color: addAlpha(getThemeColors().mutedForeground, 0.15),
                      circular: true,
                    },
                  },
                },
              })}
            />
          </ChartWrap>
        </ChartShowcaseCard>

        {/* 8. Radar Chart - Grid Circle Filled */}
        <ChartShowcaseCard
          icon={<RadarIcon />}
          category="Radar Chart"
          title="Radar Chart - Grid Circle Filled"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <ChartWrap height={220}>
            <Radar
              data={{
                labels: MONTHS,
                datasets: [
                  {
                    label: "Desktop",
                    data: DESKTOP,
                    borderColor: c()[0],
                    backgroundColor: addAlpha(c()[0], 0.35),
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                  },
                ],
              }}
              options={radarOpts({
                scales: {
                  r: {
                    ...radarOpts().scales!.r,
                    grid: {
                      color: addAlpha(getThemeColors().mutedForeground, 0.15),
                      circular: true,
                    },
                  },
                },
              })}
            />
          </ChartWrap>
        </ChartShowcaseCard>

        {/* 9. Radar Chart - Grid Filled */}
        <ChartShowcaseCard
          icon={<RadarIcon />}
          category="Radar Chart"
          title="Radar Chart - Grid Filled"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <ChartWrap height={220}>
            <Radar
              data={{
                labels: MONTHS,
                datasets: [
                  {
                    label: "Desktop",
                    data: DESKTOP,
                    borderColor: c()[0],
                    backgroundColor: addAlpha(c()[0], 0.35),
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                  },
                ],
              }}
              options={radarOpts()}
            />
          </ChartWrap>
        </ChartShowcaseCard>

        {/* 10. Radar Chart - Multiple */}
        <ChartShowcaseCard
          icon={<RadarIcon />}
          category="Radar Chart"
          title="Radar Chart - Multiple"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <ChartWrap height={220}>
            <Radar
              data={{
                labels: MONTHS,
                datasets: [
                  {
                    label: "Desktop",
                    data: DESKTOP,
                    borderColor: c()[0],
                    backgroundColor: addAlpha(c()[0], 0.15),
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                  },
                  {
                    label: "Mobile",
                    data: MOBILE,
                    borderColor: c()[1],
                    backgroundColor: addAlpha(c()[1], 0.15),
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                  },
                ],
              }}
              options={radarOpts()}
            />
          </ChartWrap>
        </ChartShowcaseCard>

        {/* 11. Radar Chart - Legend */}
        <ChartShowcaseCard
          icon={<RadarIcon />}
          category="Radar Chart"
          title="Radar Chart - Legend"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <ChartWrap height={220}>
            <Radar
              data={{
                labels: MONTHS,
                datasets: [
                  {
                    label: "Desktop",
                    data: DESKTOP,
                    borderColor: c()[0],
                    backgroundColor: addAlpha(c()[0], 0.15),
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                  },
                  {
                    label: "Mobile",
                    data: MOBILE,
                    borderColor: c()[1],
                    backgroundColor: addAlpha(c()[1], 0.15),
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                  },
                ],
              }}
              options={radarOpts({
                plugins: {
                  ...radarOpts().plugins,
                  legend: {
                    display: true,
                    position: "bottom" as const,
                    labels: {
                      usePointStyle: true,
                      pointStyle: "rectRounded",
                      padding: 16,
                      color: getThemeColors().mutedForeground,
                      boxWidth: 8,
                      boxHeight: 8,
                    },
                  },
                },
              })}
            />
          </ChartWrap>
        </ChartShowcaseCard>

        {/* 12. Radar Chart - Grid Circle No Lines */}
        <ChartShowcaseCard
          icon={<RadarIcon />}
          category="Radar Chart"
          title="Radar Chart - Grid Circle - No lines"
          description="Showing total visitors for the last 6 months"
          trend={5.2}
        >
          <ChartWrap height={220}>
            <Radar
              data={radarData()}
              options={radarOpts({
                scales: {
                  r: {
                    ...radarOpts().scales!.r,
                    grid: {
                      color: addAlpha(getThemeColors().mutedForeground, 0.15),
                      circular: true,
                    },
                    angleLines: { display: false },
                  },
                },
              })}
            />
          </ChartWrap>
        </ChartShowcaseCard>
      </ChartGrid>
    </div>
  );
}
