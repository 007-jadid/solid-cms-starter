import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Radar } from "solid-chartjs";
import { type Component, mergeProps } from "solid-js";
import { addAlpha, getDefaultChartOptions, getThemeColors, themeVersion } from "./chart-theme";
import type { RadarChartProps } from "./types";

ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

export const RadarChart: Component<RadarChartProps> = (props) => {
  const merged = mergeProps({ height: 300 }, props);
  let chartRef: HTMLCanvasElement | undefined;

  const chartOptions = () => {
    themeVersion(); // reactive: re-run when theme changes
    const defaultOptions = getDefaultChartOptions();
    const theme = getThemeColors();
    return {
      ...defaultOptions,
      ...merged.options,
      scales: {
        r: {
          grid: {
            color: addAlpha(theme.mutedForeground, 0.15),
            circular: true,
          },
          angleLines: {
            color: addAlpha(theme.mutedForeground, 0.12),
          },
          pointLabels: {
            color: theme.mutedForeground,
            font: {
              size: 11,
              weight: "500" as const,
            },
          },
          ticks: {
            display: false,
          },
        },
      },
      elements: {
        line: {
          borderWidth: 2,
        },
        point: {
          radius: 2,
          hoverRadius: 5,
          hoverBorderWidth: 2,
          hoverBackgroundColor: "#fff",
        },
        ...merged.options?.elements,
      },
    };
  };

  return (
    <div class={`relative w-full ${merged.class || ""}`} style={{ height: `${merged.height}px` }}>
      <Radar ref={chartRef} data={merged.data} options={chartOptions()} />
    </div>
  );
};

export default RadarChart;
