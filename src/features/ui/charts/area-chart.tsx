import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "solid-chartjs";
import { type Component, mergeProps } from "solid-js";
import {
  createGradient,
  getDefaultChartOptions,
  getThemeColors,
  themeVersion,
} from "./chart-theme";
import type { AreaChartProps } from "./types";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
);

export const AreaChart: Component<AreaChartProps> = (props) => {
  const merged = mergeProps({ height: 300 }, props);
  let chartRef: HTMLCanvasElement | undefined;

  const enhancedData = () => {
    themeVersion(); // reactive: re-run when theme changes
    const data = { ...merged.data };

    if (data.datasets && chartRef) {
      const ctx = chartRef.getContext("2d");
      if (ctx) {
        data.datasets = data.datasets.map((dataset) => {
          const borderColor = (dataset.borderColor as string) || "";
          return {
            ...dataset,
            fill: true,
            backgroundColor: createGradient(ctx, borderColor, 0.25, 0.01),
          };
        });
      }
    }

    return data;
  };

  const chartOptions = () => {
    themeVersion(); // reactive: re-run when theme changes
    const defaultOptions = getDefaultChartOptions();
    return {
      ...defaultOptions,
      ...merged.options,
      elements: {
        line: {
          tension: 0.4,
          borderWidth: 2,
          borderCapStyle: "round" as const,
          borderJoinStyle: "round" as const,
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 6,
          hoverBorderWidth: 3,
          hoverBackgroundColor: getThemeColors().background,
        },
        ...merged.options?.elements,
      },
    };
  };

  return (
    <div class={`relative w-full ${merged.class || ""}`} style={{ height: `${merged.height}px` }}>
      <Line ref={chartRef} data={enhancedData()} options={chartOptions()} />
    </div>
  );
};

export default AreaChart;
