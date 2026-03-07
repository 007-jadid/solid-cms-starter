import { createFileRoute } from "@tanstack/solid-router";
import { For } from "solid-js";
import { useAuth } from "~/features/context/auth/auth.context";
import { useI18n } from "~/features/context/i18n";
import {
  countUp,
  fadeIn,
  hoverLift,
  scrollReveal,
  staggerChildren,
} from "~/features/lib/gsap-directives";
import {
  AreaChart,
  addAlpha,
  BarChart,
  DoughnutChart,
  reactiveChartColors,
} from "~/features/ui/charts";
import { ActivityTimeline } from "~/features/ui/components/activity-timeline";
import { AsyncStatusBanner } from "~/features/ui/components/async-status-banner";
import { BadgeDelta } from "~/features/ui/components/badge-delta";
import { Button } from "~/features/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/features/ui/components/card";
import { DemoBanner } from "~/features/ui/components/demo-banner";
import { PageLayout } from "~/features/ui/layout";

// Register directives
void countUp;
void fadeIn;
void hoverLift;
void scrollReveal;
void staggerChildren;

export const Route = createFileRoute("/_protected/dashboard")({
  component: DashboardPage,
});

const statsData = [
  {
    titleKey: "dashboard.stats.totalRevenue",
    value: "$45,231.89",
    badge: "+20.1%",
    subtextKey: "dashboard.fromLastMonth",
    positive: true,
  },
  {
    titleKey: "dashboard.stats.subscriptions",
    value: "+2,350",
    badge: "+180.1%",
    subtextKey: "dashboard.fromLastMonth",
    positive: true,
  },
  {
    titleKey: "dashboard.stats.sales",
    value: "+12,234",
    badge: "+19%",
    subtextKey: "dashboard.fromLastMonth",
    positive: true,
  },
  {
    titleKey: "dashboard.stats.activeNow",
    value: "+573",
    badge: "+201",
    subtextKey: "dashboard.stats.activeNowSub",
    positive: true,
  },
];

const activitiesData = [
  {
    user: "Alex Rivera",
    actionKey: "dashboard.activity.createdForm",
    timeKey: "dashboard.activity.twoHoursAgo",
    avatar: "AR",
  },
  {
    user: "Sarah Chen",
    actionKey: "dashboard.activity.updatedPermissions",
    timeKey: "dashboard.activity.fiveHoursAgo",
    avatar: "SC",
  },
  {
    user: "Mike Ross",
    actionKey: "dashboard.activity.deployedVersion",
    timeKey: "dashboard.activity.yesterday",
    avatar: "MR",
  },
];

const servicesData = [
  {
    nameKey: "dashboard.services.apiServices",
    statusKey: "dashboard.services.operational",
    uptime: "99.9%",
    color: "bg-emerald-500",
  },
  {
    nameKey: "dashboard.services.dataWarehouse",
    statusKey: "dashboard.services.operational",
    uptime: null,
    color: "bg-emerald-500",
  },
  {
    nameKey: "dashboard.services.cdnCache",
    statusKey: "dashboard.services.degraded",
    uptime: null,
    color: "bg-amber-500",
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const revenueValues = [4200, 5800, 4900, 6300, 7100, 8400, 7800, 9200, 8600, 10100, 9500, 11200];
const expenseValues = [3100, 3800, 3500, 4100, 4300, 4800, 4500, 5200, 4900, 5600, 5300, 6100];

const trafficSources = ["Organic", "Direct", "Referral", "Social", "Email"];
const trafficValues = [4200, 3100, 2400, 1800, 1200];

const deviceLabels = ["Desktop", "Mobile", "Tablet"];
const deviceValues = [58, 32, 10];

function DashboardPage() {
  const auth = useAuth();
  const { t } = useI18n();
  const colors = reactiveChartColors(1);

  const activityTimelineItems = activitiesData.map((activity, index) => ({
    id: `${activity.user}-${index}`,
    user: activity.user,
    action: t(activity.actionKey),
    time: t(activity.timeKey),
    avatar: activity.avatar,
  }));

  const hasDegradedService = servicesData.some(
    (service) => service.statusKey === "dashboard.services.degraded",
  );

  return (
    <PageLayout
      class="space-y-8 p-6 "
      title={t("dashboard.title")}
      description={t("dashboard.welcomeBack", {
        name: auth.state.user?.name ?? "Admin",
      })}
      actions={
        <div class="flex items-center space-x-2">
          <Button size="sm">{t("dashboard.downloadReport")}</Button>
        </div>
      }
      contentClass="space-y-8"
    >
      <DemoBanner />

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4" use:staggerChildren={{ stagger: 0.08 }}>
        <For each={statsData}>
          {(item) => (
            <div use:hoverLift>
              <Card>
                <CardHeader class="flex flex-row items-start justify-between pb-2">
                  <CardTitle class="text-sm font-medium min-w-0 pr-2">{t(item.titleKey)}</CardTitle>
                  <BadgeDelta class="shrink-0" deltaType={item.positive ? "increase" : "decrease"}>
                    {item.badge}
                  </BadgeDelta>
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold">
                    {(() => {
                      const match = item.value.match(/^([^0-9]*)([\d,.]+)(.*)$/);
                      if (!match) return item.value;
                      const prefix = match[1];
                      const numStr = match[2].replace(/,/g, "");
                      const suffix = match[3];
                      const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
                      const end = parseFloat(numStr);
                      return (
                        <span use:countUp={{ end, prefix, suffix, decimals }}>
                          {prefix}0{suffix}
                        </span>
                      );
                    })()}
                  </div>
                  <p class="text-xs text-muted-foreground">{t(item.subtextKey)}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </For>
      </div>

      {/* Revenue Overview Chart + Recent Activity */}
      <div
        class="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
        use:staggerChildren={{ delay: 0.3, stagger: 0.12 }}
      >
        <div class="md:col-span-4 lg:col-span-4">
          <Card class="h-full">
            <CardHeader>
              <CardTitle>{t("dashboard.revenueOverview")}</CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart
                height={280}
                data={{
                  labels: MONTHS,
                  datasets: [
                    {
                      label: "Revenue",
                      data: revenueValues,
                      borderColor: colors()[0],
                      backgroundColor: addAlpha(colors()[0], 0.15),
                      borderWidth: 2,
                      fill: true,
                      tension: 0.4,
                      pointRadius: 0,
                      pointHoverRadius: 5,
                    },
                    {
                      label: "Expenses",
                      data: expenseValues,
                      borderColor: colors()[3],
                      backgroundColor: addAlpha(colors()[3], 0.08),
                      borderWidth: 2,
                      fill: true,
                      tension: 0.4,
                      pointRadius: 0,
                      pointHoverRadius: 5,
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

        <div class="md:col-span-3 lg:col-span-3">
          <Card class="h-full">
            <CardHeader>
              <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline class="pt-1" items={activityTimelineItems} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Traffic + Device Charts */}
      <div class="grid gap-4 md:grid-cols-2" use:staggerChildren={{ delay: 0.2, stagger: 0.1 }}>
        <div use:hoverLift={{ y: -2 }}>
          <Card class="h-full">
            <CardHeader>
              <CardTitle>{t("dashboard.trafficBySource")}</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                height={250}
                data={{
                  labels: trafficSources,
                  datasets: [
                    {
                      label: "Visitors",
                      data: trafficValues,
                      backgroundColor: [
                        addAlpha(colors()[0], 0.8),
                        addAlpha(colors()[1], 0.8),
                        addAlpha(colors()[2], 0.8),
                        addAlpha(colors()[3], 0.8),
                        addAlpha(colors()[4] ?? colors()[0], 0.8),
                      ],
                      borderRadius: 6,
                      barThickness: 32,
                    },
                  ],
                }}
                options={{
                  indexAxis: "y" as const,
                  scales: { x: { beginAtZero: true } },
                  plugins: { legend: { display: false } },
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div use:hoverLift={{ y: -2 }}>
          <Card class="h-full">
            <CardHeader>
              <CardTitle>{t("dashboard.deviceBreakdown")}</CardTitle>
            </CardHeader>
            <CardContent class="flex items-center justify-center">
              <div class="w-64 h-64">
                <DoughnutChart
                  height={256}
                  data={{
                    labels: deviceLabels,
                    datasets: [
                      {
                        data: deviceValues,
                        backgroundColor: [
                          addAlpha(colors()[0], 0.85),
                          addAlpha(colors()[1], 0.85),
                          addAlpha(colors()[2], 0.85),
                        ],
                        borderWidth: 0,
                        spacing: 4,
                      },
                    ],
                  }}
                  centerText="58%"
                  centerSubtext="Desktop"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Availability */}
      <div use:scrollReveal>
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.serviceAvailability")}</CardTitle>
          </CardHeader>
          <CardContent>
            <For each={hasDegradedService ? [1] : []}>
              {() => (
                <AsyncStatusBanner
                  class="mb-4"
                  status="error"
                  title={t("dashboard.serviceAlert.title")}
                  message={t("dashboard.serviceAlert.description")}
                />
              )}
            </For>
            <div class="grid gap-4 md:grid-cols-3" use:staggerChildren={{ stagger: 0.06 }}>
              <For each={servicesData}>
                {(service) => (
                  <div
                    class="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    use:hoverLift={{ y: -2 }}
                  >
                    <div class="flex items-center gap-2">
                      <div class={`h-2 w-2 rounded-full ${service.color}`} />
                      <div class="text-sm font-medium text-muted-foreground">
                        {t(service.nameKey)}
                      </div>
                    </div>
                    <div class="mt-2 text-2xl font-semibold">
                      {service.uptime ?? t(service.statusKey)}
                    </div>
                  </div>
                )}
              </For>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
