import { ArcElement, Chart as ChartJS, Legend, type Plugin, Title, Tooltip } from "chart.js";
import { Doughnut } from "solid-chartjs";
import { type Component, mergeProps } from "solid-js";
import { getDefaultChartOptions, getThemeColors, themeVersion } from "./chart-theme";
import type { DoughnutChartProps } from "./types";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const centerTextPlugin: Plugin<"doughnut"> = {
  id: "centerText",
  afterDraw: (chart, _args, options: Record<string, unknown>) => {
    if (!options.text) return;

    const { ctx, chartArea } = chart;
    const { height } = chartArea;

    // Use arc element positions for accurate center (handles semicircle layout)
    const meta = chart.getDatasetMeta(0);
    let centerX = (chartArea.left + chartArea.right) / 2;
    let centerY = (chartArea.top + chartArea.bottom) / 2;
    if (meta.data.length > 0) {
      const arcEl = meta.data[0] as ArcElement;
      centerX = arcEl.x;
      centerY = arcEl.y;
    }

    // Detect semicircle (gauge) shape
    const circumference = (chart.options.circumference as number | undefined) ?? 360;
    const isSemicircle = circumference <= 180;

    ctx.save();

    const theme = getThemeColors();
    const fontFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--font-sans") || "sans-serif";

    // Scale font size based on the cutout (inner hole) size
    const cutoutStr = String((chart.options.cutout as string | undefined) || "50%");
    const cutoutPercent = parseFloat(cutoutStr) / 100;
    const fontSize = Math.max(12, Math.floor((height * cutoutPercent) / 6));
    const subtextSize = Math.max(10, Math.floor(fontSize * 0.55));

    const text = options.text as string;
    const subtext = options.subtext as string | undefined;
    const color = options.color as string | undefined;

    ctx.fillStyle = color || theme.foreground;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (isSemicircle) {
      // For semicircle: position text inside the cutout, above the circle center
      ctx.font = `700 ${fontSize}px ${fontFamily}`;
      const gap = fontSize * 0.5;
      ctx.fillText(text, centerX, centerY - (subtext ? gap : 0));
      if (subtext) {
        ctx.font = `500 ${subtextSize}px ${fontFamily}`;
        ctx.fillStyle = theme.mutedForeground;
        ctx.fillText(subtext, centerX, centerY + gap);
      }
    } else {
      ctx.font = `700 ${fontSize}px ${fontFamily}`;
      ctx.fillText(text, centerX, centerY - (subtext ? fontSize * 0.45 : 0));
      if (subtext) {
        ctx.font = `500 ${subtextSize}px ${fontFamily}`;
        ctx.fillStyle = theme.mutedForeground;
        ctx.fillText(subtext, centerX, centerY + fontSize * 0.45);
      }
    }

    ctx.restore();
  },
};

ChartJS.register(centerTextPlugin);

export const DoughnutChart: Component<DoughnutChartProps> = (props) => {
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
      cutout: "72%",
      scales: {},
      plugins: {
        ...defaultOptions.plugins,
        legend: {
          ...defaultOptions.plugins?.legend,
          position: "right" as const,
          align: "center" as const,
        },
        centerText: {
          text: merged.centerText,
          subtext: merged.centerSubtext,
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
      <Doughnut ref={chartRef} data={merged.data} options={chartOptions()} />
    </div>
  );
};

export default DoughnutChart;
