import {
  ArcElement,
  type Chart,
  Chart as ChartJS,
  type ChartOptions,
  DoughnutController,
  Legend,
  type Plugin,
  Tooltip,
} from "chart.js";
import { Doughnut } from "solid-chartjs";
import { type Component, mergeProps } from "solid-js";
import { getDefaultChartOptions, getThemeColors, themeVersion } from "./chart-theme";
import type { DoughnutChartProps } from "./types";

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

// ── Center text plugin ─────────────────────────────────────────────────
const centerTextPlugin: Plugin<"doughnut"> = {
  id: "centerText",
  afterDraw(chart: Chart<"doughnut">, _args, options: Record<string, unknown>) {
    if (!options?.text) return;
    const {
      ctx,
      chartArea: { left, top, right, bottom },
    } = chart;
    const cx = (left + right) / 2;
    const cy = (top + bottom) / 2;
    const text = String(options.text);
    const color = String(options.color || "#fff");
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (options.subtext) {
      ctx.font = "bold 26px sans-serif";
      ctx.fillStyle = color;
      ctx.globalAlpha = 1;
      ctx.fillText(text, cx, cy - 10);
      ctx.font = "12px sans-serif";
      ctx.globalAlpha = 0.6;
      ctx.fillText(String(options.subtext), cx, cy + 14);
    } else {
      ctx.font = "bold 22px sans-serif";
      ctx.fillStyle = color;
      ctx.fillText(text, cx, cy);
    }
    ctx.restore();
  },
};
ChartJS.register(centerTextPlugin);

// ── Polar grid plugin ──────────────────────────────────────────────────
const polarGridPlugin: Plugin<"doughnut"> = {
  id: "polarGrid",
  beforeDatasetsDraw(chart: Chart<"doughnut">, _args, options: Record<string, unknown>) {
    if (!options?.display) return;
    const {
      ctx,
      chartArea: { left, top, right, bottom },
    } = chart;
    const cx = (left + right) / 2;
    const cy = (top + bottom) / 2;
    const maxR = Math.min((right - left) / 2, (bottom - top) / 2);
    ctx.save();
    ctx.strokeStyle = "rgba(128,128,128,0.15)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (maxR * i) / 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
      ctx.stroke();
    }
    ctx.restore();
  },
};
ChartJS.register(polarGridPlugin);

export const RadialChart: Component<DoughnutChartProps> = (props) => {
  const merged = mergeProps(
    { height: 300, centerText: "", centerSubtext: "", showGrid: false },
    props,
  );
  let chartRef: HTMLCanvasElement | undefined;

  const chartOptions = () => {
    themeVersion(); // reactive: re-run when theme changes
    const theme = getThemeColors();
    const defaultOptions = getDefaultChartOptions();
    const extra = (merged.options || {}) as ChartOptions<"doughnut">;
    return {
      responsive: defaultOptions.responsive,
      maintainAspectRatio: defaultOptions.maintainAspectRatio,
      animation: defaultOptions.animation,
      cutout: "78%",
      scales: {},
      ...extra,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        centerText: {
          text: merged.centerText,
          subtext: merged.centerSubtext,
          color: theme.foreground,
        },
        polarGrid: { display: merged.showGrid },
        ...(extra.plugins || {}),
      },
    };
  };

  return (
    <div class={`relative w-full ${merged.class || ""}`} style={{ height: `${merged.height}px` }}>
      <Doughnut ref={chartRef} data={merged.data} options={chartOptions()} />
    </div>
  );
};
