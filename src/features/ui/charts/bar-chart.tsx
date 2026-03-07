import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "solid-chartjs";
import { type Component, mergeProps } from "solid-js";
import { addAlpha, getDefaultChartOptions, getThemeColors, themeVersion } from "./chart-theme";
import type { BarChartProps } from "./types";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export const BarChart: Component<BarChartProps> = (props) => {
  const merged = mergeProps({ height: 300 }, props);
  let chartRef: HTMLCanvasElement | undefined;

  const chartOptions = () => {
    themeVersion(); // reactive: re-run when theme changes
    const defaultOptions = getDefaultChartOptions();
    return {
      ...defaultOptions,
      ...merged.options,
      elements: {
        bar: {
          borderRadius: 8,
          borderSkipped: false,
          borderWidth: 0,
          hoverBorderColor: addAlpha(getThemeColors().foreground, 0.1),
          hoverBorderWidth: 1,
        },
        ...merged.options?.elements,
      },
      scales: {
        ...defaultOptions.scales,
        x: {
          ...defaultOptions.scales?.x,
          grid: {
            ...defaultOptions.scales?.x?.grid,
            display: false,
          },
          ...merged.options?.scales?.x,
        },
        y: {
          ...defaultOptions.scales?.y,
          ...merged.options?.scales?.y,
        },
      },
    };
  };

  return (
    <div class={`relative w-full ${merged.class || ""}`} style={{ height: `${merged.height}px` }}>
      <Bar ref={chartRef} data={merged.data} options={chartOptions()} />
    </div>
  );
};

export default BarChart;
