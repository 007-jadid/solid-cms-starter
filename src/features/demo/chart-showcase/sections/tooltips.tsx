import { Bar } from "solid-chartjs";
import { For } from "solid-js";
import { getDefaultChartOptions } from "~/features/ui/charts";
import { DAYS, RUNNING, SWIMMING } from "../chart-data";
import { ChartGrid, ChartShowcaseCard, ChartWrap, TooltipTabIcon } from "../chart-showcase-card";

// ════════════════════════════════════════════
// TOOLTIPS SECTION
// ════════════════════════════════════════════

export function makeTooltipExternal(config: {
  indicator?: "dot" | "line" | "none";
  showLabel?: boolean;
  labelFormatter?: (title: string) => string;
  valueFormatter?: (value: string) => string;
  showTotal?: boolean;
}) {
  // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
  return (context: any) => {
    let tooltipEl = document.getElementById("chartjs-tooltip");
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.id = "chartjs-tooltip";
      tooltipEl.innerHTML = "<div></div>";
      document.body.appendChild(tooltipEl);
    }
    const model = context.tooltip;
    if (model.opacity === 0) {
      tooltipEl.style.opacity = "0";
      return;
    }
    if (model.body) {
      const titleLines = model.title || [];
      // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
      const bodyLines = model.body.map((b: any) => b.lines);
      let html = "";

      if (config.showLabel !== false && titleLines.length > 0) {
        const title = config.labelFormatter ? config.labelFormatter(titleLines[0]) : titleLines[0];
        html += `<div class="tooltip-title">${title}</div>`;
      }

      html += '<div class="tooltip-body">';
      let total = 0;
      // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
      bodyLines.forEach((body: any, i: number) => {
        const colors = model.labelColors[i];
        const dotColor = colors.borderColor || colors.backgroundColor;
        let indicator = "";
        if (config.indicator === "line") {
          indicator = `<span style="width:8px;height:2px;background:${dotColor};display:inline-block;border-radius:1px;flex-shrink:0"></span>`;
        } else if (config.indicator !== "none") {
          indicator = `<span class="tooltip-dot" style="background:${dotColor}"></span>`;
        }
        const text = body[0];
        const colonIdx = text.indexOf(":");
        const label = colonIdx !== -1 ? text.substring(0, colonIdx).trim() : text;
        let value = colonIdx !== -1 ? text.substring(colonIdx + 1).trim() : "";
        if (config.valueFormatter) value = config.valueFormatter(value);
        total += parseFloat(value.replace(/[^0-9.-]/g, "")) || 0;
        html += `<div class="tooltip-item">${indicator}<span class="tooltip-label">${label}</span><span class="tooltip-value">${value}</span></div>`;
      });
      if (config.showTotal) {
        html += `<div style="border-top:1px solid var(--border);margin-top:4px;padding-top:4px" class="tooltip-item"><span class="tooltip-dot" style="background:transparent"></span><span class="tooltip-label">Total</span><span class="tooltip-value">${Math.round(total)}</span></div>`;
      }
      html += "</div>";
      const root = tooltipEl.querySelector("div");
      if (root) root.innerHTML = html;
    }
    const pos = context.chart.canvas.getBoundingClientRect();
    tooltipEl.style.opacity = "1";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.left = `${pos.left + window.scrollX + model.caretX}px`;
    tooltipEl.style.top = `${pos.top + window.scrollY + model.caretY}px`;
    tooltipEl.style.pointerEvents = "none";
  };
}

export function TooltipsSection(props: { colors: string[] }) {
  const c = () => props.colors;
  const baseOpts = getDefaultChartOptions();

  function tooltipBarData() {
    return {
      labels: DAYS,
      datasets: [
        {
          label: "Running",
          data: RUNNING,
          backgroundColor: c()[0],
          borderRadius: 4,
          barPercentage: 0.6,
        },
        {
          label: "Swimming",
          data: SWIMMING,
          backgroundColor: c()[1],
          borderRadius: 4,
          barPercentage: 0.6,
        },
      ],
    };
  }

  // biome-ignore lint/suspicious/noExplicitAny: Chart.js config types are loosely typed
  function tooltipOpts(external: any) {
    return {
      ...baseOpts,
      plugins: {
        ...baseOpts.plugins,
        tooltip: { enabled: false, external },
        datalabel: { display: false },
      },
      scales: {
        x: {
          ...baseOpts.scales?.x,
          stacked: true,
        },
        y: {
          ...baseOpts.scales?.y,
          stacked: true,
        },
      },
    };
  }

  const tooltipConfigs = [
    {
      title: "Tooltip - Default",
      desc: "Default tooltip with ChartTooltipContent.",
      ext: makeTooltipExternal({ indicator: "dot" }),
    },
    {
      title: "Tooltip - Line Indicator",
      desc: "Tooltip with line indicator.",
      ext: makeTooltipExternal({ indicator: "line" }),
    },
    {
      title: "Tooltip - No Indicator",
      desc: "Tooltip with no indicator.",
      ext: makeTooltipExternal({ indicator: "none" }),
    },
    {
      title: "Tooltip - Custom label",
      desc: "Tooltip with custom label from chartConfig.",
      ext: makeTooltipExternal({
        indicator: "dot",
        labelFormatter: () => "Activities",
      }),
    },
    {
      title: "Tooltip - Label Formatter",
      desc: "Tooltip with label formatter.",
      ext: makeTooltipExternal({
        indicator: "dot",
        labelFormatter: () => "July 16, 2024",
      }),
    },
    {
      title: "Tooltip - No Label",
      desc: "Tooltip with no label.",
      ext: makeTooltipExternal({ indicator: "dot", showLabel: false }),
    },
    {
      title: "Tooltip - Formatter",
      desc: "Tooltip with custom formatter.",
      ext: makeTooltipExternal({
        indicator: "dot",
        valueFormatter: (v: string) => `${v.trim()} kcal`,
      }),
    },
    {
      title: "Tooltip - Icons",
      desc: "Tooltip with icons.",
      ext: makeTooltipExternal({ indicator: "dot" }),
    },
    {
      title: "Tooltip - Advanced",
      desc: "Tooltip with custom formatter and total.",
      ext: makeTooltipExternal({ indicator: "dot", showTotal: true }),
    },
  ];

  return (
    <div class="space-y-6">
      <ChartGrid>
        <For each={tooltipConfigs}>
          {(cfg) => (
            <ChartShowcaseCard
              icon={<TooltipTabIcon />}
              category="Tooltip"
              title={cfg.title}
              description={cfg.desc}
            >
              <ChartWrap height={220}>
                <Bar data={tooltipBarData()} options={tooltipOpts(cfg.ext)} />
              </ChartWrap>
            </ChartShowcaseCard>
          )}
        </For>
      </ChartGrid>
    </div>
  );
}
