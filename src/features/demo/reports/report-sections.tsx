import { For } from "solid-js";
import { useI18n } from "~/features/context/i18n";
import {
  AreaChart,
  addAlpha,
  BarChart,
  DoughnutChart,
  LineChart,
  reactiveChartColors,
} from "~/features/ui/charts";
import { BadgeDelta } from "~/features/ui/components/badge-delta";
import { Card, CardContent, CardHeader, CardTitle } from "~/features/ui/components/card";
import {
  MONTHS,
  overviewMetrics,
  performanceData,
  performanceMetrics,
  revenueData,
  trafficData,
  trafficMetrics,
} from "./reports-data";

function MetricCards(props: { metrics: typeof overviewMetrics }) {
  const { t } = useI18n();
  return (
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <For each={props.metrics}>
        {(metric) => (
          <Card>
            <CardHeader class="flex flex-row items-start justify-between pb-2">
              <CardTitle class="text-sm font-medium">{t(metric.key)}</CardTitle>
              <BadgeDelta deltaType={metric.positive ? "increase" : "decrease"}>
                {metric.change}
              </BadgeDelta>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        )}
      </For>
    </div>
  );
}

export function OverviewReport() {
  const { t } = useI18n();
  const colors = reactiveChartColors(1);

  return (
    <div class="space-y-6">
      <MetricCards metrics={overviewMetrics} />

      <Card>
        <CardHeader>
          <CardTitle>{t("reports.metrics.totalRevenue")}</CardTitle>
        </CardHeader>
        <CardContent>
          <AreaChart
            height={300}
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Revenue",
                  data: revenueData.monthly,
                  borderColor: colors()[0],
                  backgroundColor: addAlpha(colors()[0], 0.15),
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 3,
                },
                {
                  label: "Costs",
                  data: revenueData.costs,
                  borderColor: colors()[3],
                  backgroundColor: addAlpha(colors()[3], 0.08),
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 3,
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { callback: (v) => `$${Number(v) / 1000}k` },
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function RevenueReport() {
  const colors = reactiveChartColors(1);

  return (
    <div class="space-y-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <For each={overviewMetrics}>
          {(metric) => (
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-sm font-medium">{metric.key.split(".").pop()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          )}
        </For>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue vs Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            height={300}
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Revenue",
                  data: revenueData.monthly,
                  backgroundColor: addAlpha(colors()[0], 0.8),
                  borderRadius: 4,
                },
                {
                  label: "Costs",
                  data: revenueData.costs,
                  backgroundColor: addAlpha(colors()[3], 0.6),
                  borderRadius: 4,
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { callback: (v) => `$${Number(v) / 1000}k` },
                },
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Profit Margin */}
      <Card>
        <CardHeader>
          <CardTitle>Profit Margin</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            height={250}
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Profit Margin %",
                  data: revenueData.monthly.map((rev, i) =>
                    Math.round(((rev - revenueData.costs[i]) / rev) * 100),
                  ),
                  borderColor: colors()[1],
                  borderWidth: 2,
                  tension: 0.4,
                  pointRadius: 4,
                  pointBackgroundColor: colors()[1],
                },
              ],
            }}
            options={{
              scales: {
                y: { min: 0, max: 60, ticks: { callback: (v) => `${v}%` } },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function TrafficReport() {
  const colors = reactiveChartColors(1);

  return (
    <div class="space-y-6">
      <MetricCards metrics={trafficMetrics} />

      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent class="flex items-center justify-center">
            <div class="w-64 h-64">
              <DoughnutChart
                height={256}
                data={{
                  labels: trafficData.sources,
                  datasets: [
                    {
                      data: trafficData.values,
                      backgroundColor: colors()
                        .slice(0, 6)
                        .map((c) => addAlpha(c, 0.85)),
                      borderWidth: 0,
                      spacing: 3,
                    },
                  ],
                }}
                centerText={`${trafficData.values[0]}%`}
                centerSubtext="Organic"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visitors by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              height={256}
              data={{
                labels: trafficData.sources,
                datasets: [
                  {
                    label: "Visitors",
                    data: trafficData.visitors,
                    backgroundColor: colors()
                      .slice(0, 6)
                      .map((c) => addAlpha(c, 0.7)),
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                indexAxis: "y" as const,
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true } },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function PerformanceReport() {
  const colors = reactiveChartColors(1);

  return (
    <div class="space-y-6">
      <MetricCards metrics={performanceMetrics} />

      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Page Load Time (seconds)</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              height={250}
              data={{
                labels: MONTHS,
                datasets: [
                  {
                    label: "Load Time",
                    data: performanceData.loadTimes,
                    borderColor: colors()[0],
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: colors()[0],
                  },
                ],
              }}
              options={{
                scales: {
                  y: { min: 0, max: 2, ticks: { callback: (v) => `${v}s` } },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Rate (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              height={250}
              data={{
                labels: MONTHS,
                datasets: [
                  {
                    label: "Error Rate",
                    data: performanceData.errorRates,
                    borderColor: colors()[2],
                    backgroundColor: addAlpha(colors()[2], 0.15),
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                  },
                ],
              }}
              options={{
                scales: {
                  y: { min: 0, max: 1, ticks: { callback: (v) => `${v}%` } },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uptime (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            height={200}
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: "Uptime",
                  data: performanceData.uptime,
                  borderColor: colors()[1],
                  borderWidth: 2,
                  tension: 0,
                  pointRadius: 4,
                  pointBackgroundColor: colors()[1],
                },
              ],
            }}
            options={{
              scales: {
                y: { min: 99.5, max: 100.1, ticks: { callback: (v) => `${v}%` } },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
