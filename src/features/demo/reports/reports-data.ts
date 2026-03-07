export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const revenueData = {
  monthly: [12400, 15800, 14200, 18600, 21100, 19400, 22800, 25200, 23600, 27100, 25500, 31200],
  costs: [8200, 9800, 9100, 11100, 12300, 11800, 13500, 14200, 13900, 15600, 14800, 17100],
};

export const trafficData = {
  sources: ["Organic Search", "Direct", "Referral", "Social Media", "Email", "Paid Ads"],
  values: [42, 21, 15, 12, 6, 4],
  visitors: [18200, 9100, 6500, 5200, 2600, 1700],
};

export const performanceData = {
  loadTimes: [1.2, 1.1, 1.3, 0.9, 1.0, 1.1, 0.8, 0.9, 1.0, 0.7, 0.8, 0.6],
  errorRates: [0.5, 0.4, 0.6, 0.3, 0.4, 0.3, 0.2, 0.3, 0.2, 0.2, 0.1, 0.1],
  uptime: [99.9, 99.8, 99.9, 100, 99.9, 99.7, 99.9, 100, 99.9, 100, 99.9, 100],
};

export const overviewMetrics = [
  { key: "reports.metrics.totalRevenue", value: "$266,400", change: "+23.1%", positive: true },
  { key: "reports.metrics.monthlyGrowth", value: "18.4%", change: "+2.3%", positive: true },
  { key: "reports.metrics.avgOrderValue", value: "$142", change: "+5.7%", positive: true },
  { key: "reports.metrics.conversionRate", value: "3.2%", change: "-0.4%", positive: false },
];

export const trafficMetrics = [
  { key: "reports.metrics.totalVisitors", value: "43,300", change: "+12.5%", positive: true },
  { key: "reports.metrics.pageViews", value: "128,900", change: "+8.2%", positive: true },
  { key: "reports.metrics.bounceRate", value: "34.2%", change: "-2.1%", positive: true },
  { key: "reports.metrics.avgSessionDuration", value: "4m 32s", change: "+18s", positive: true },
];

export const performanceMetrics = [
  { key: "reports.metrics.loadTime", value: "0.6s", change: "-50%", positive: true },
  { key: "reports.metrics.errorRate", value: "0.1%", change: "-80%", positive: true },
  { key: "reports.metrics.uptime", value: "99.97%", change: "+0.07%", positive: true },
  { key: "reports.metrics.responseTime", value: "142ms", change: "-23ms", positive: true },
];
