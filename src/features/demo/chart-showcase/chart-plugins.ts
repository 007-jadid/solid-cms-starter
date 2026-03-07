import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  type Plugin,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { getThemeColors } from "~/features/ui/charts";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
);

// ── Data-label plugin (opt-in via plugins.datalabel.display) ──────────
const datalabelPlugin: Plugin = {
  id: "datalabel",
  afterDatasetsDraw(chart, _args, pluginOpts: Record<string, unknown>) {
    if (!pluginOpts?.display) return;
    const { ctx } = chart;
    const theme = getThemeColors();
    chart.data.datasets.forEach((_ds, di: number) => {
      const meta = chart.getDatasetMeta(di);
      if (meta.hidden) return;
      meta.data.forEach((el, idx: number) => {
        const val = chart.data.datasets[di].data[idx] as number;
        if (val == null) return;
        ctx.save();
        const configType = (chart.config as { type?: string }).type;
        const isPolar = configType === "pie" || configType === "doughnut";
        if (isPolar) {
          const pos = el.tooltipPosition(true);
          ctx.font = `bold ${(pluginOpts.fontSize as number) || 11}px sans-serif`;
          ctx.fillStyle = (pluginOpts.color as string) || "#fff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(val), pos.x ?? 0, pos.y ?? 0);
        } else {
          ctx.font = `bold ${(pluginOpts.fontSize as number) || 11}px sans-serif`;
          ctx.fillStyle = (pluginOpts.color as string) || theme.foreground;
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(String(val), el.x, el.y - 6);
        }
        ctx.restore();
      });
    });
  },
};
ChartJS.register(datalabelPlugin);
