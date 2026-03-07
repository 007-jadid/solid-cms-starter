import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from "chart.js";
import { Pie } from "solid-chartjs";
import { type Component, mergeProps } from "solid-js";
import { getDefaultChartOptions, getThemeColors, themeVersion } from "./chart-theme";
import type { PieChartProps } from "./types";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export const PieChart: Component<PieChartProps> = (props) => {
  const merged = mergeProps({ height: 300 }, props);
  let chartRef: HTMLCanvasElement | undefined;

  const chartOptions = () => {
    themeVersion(); // reactive: re-run when theme changes
    const defaultOptions = getDefaultChartOptions();
    const theme = getThemeColors();
    return {
      responsive: defaultOptions.responsive,
      maintainAspectRatio: defaultOptions.maintainAspectRatio,
      animation: defaultOptions.animation,
      scales: {},
      plugins: {
        ...defaultOptions.plugins,
        legend: {
          ...defaultOptions.plugins?.legend,
          position: "right" as const,
          align: "center" as const,
        },
        ...merged.options?.plugins,
      },
      elements: {
        arc: {
          borderWidth: 3,
          borderColor: theme.background,
          hoverBorderWidth: 3,
          hoverBorderColor: theme.background,
          spacing: 2,
          hoverOffset: 8,
        },
        ...merged.options?.elements,
      },
      ...merged.options,
    };
  };

  return (
    <div class={`relative w-full ${merged.class || ""}`} style={{ height: `${merged.height}px` }}>
      <Pie ref={chartRef} data={merged.data} options={chartOptions()} />
    </div>
  );
};

export default PieChart;
