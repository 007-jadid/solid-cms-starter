import type { ChartData, ChartOptions } from "chart.js";

/**
 * Common chart component props
 */
export interface BaseChartProps {
  /** Chart height in pixels */
  height?: number;
  /** Additional CSS classes */
  class?: string;
}

/**
 * Line chart specific props
 */
export interface LineChartProps extends BaseChartProps {
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
}

/**
 * Bar chart specific props
 */
export interface BarChartProps extends BaseChartProps {
  data: ChartData<"bar">;
  options?: ChartOptions<"bar">;
}

/**
 * Area chart specific props (uses line chart type with fill)
 */
export interface AreaChartProps extends BaseChartProps {
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
}

/**
 * Pie chart specific props
 */
export interface PieChartProps extends BaseChartProps {
  data: ChartData<"pie">;
  options?: ChartOptions<"pie">;
}

/**
 * Doughnut chart specific props
 */
export interface DoughnutChartProps extends BaseChartProps {
  data: ChartData<"doughnut">;
  options?: ChartOptions<"doughnut">;
  /** Center text to display */
  centerText?: string;
  /** Center subtext to display */
  centerSubtext?: string;
  /** Show polar grid lines behind the chart */
  showGrid?: boolean;
}

/**
 * Radar chart specific props
 */
export interface RadarChartProps extends BaseChartProps {
  data: ChartData<"radar">;
  options?: ChartOptions<"radar">;
}
