/**
 * Chart Components
 * Modern, theme-compatible Chart.js components for SolidJS
 */

export { AreaChart } from "./area-chart";
export { BarChart } from "./bar-chart";
// Export utilities
export {
  addAlpha,
  createGradient,
  getChartColor,
  getChartColors,
  getDefaultChartOptions,
  getThemeColors,
  reactiveChartColors,
  themeVersion,
} from "./chart-theme";
export { DoughnutChart } from "./doughnut-chart";
export { LineChart } from "./line-chart";
export { PieChart } from "./pie-chart";
export { RadarChart } from "./radar-chart";
export { RadialChart } from "./radial-chart";

// Export types
export type {
  AreaChartProps,
  BarChartProps,
  BaseChartProps,
  DoughnutChartProps,
  LineChartProps,
  PieChartProps,
  RadarChartProps,
} from "./types";
