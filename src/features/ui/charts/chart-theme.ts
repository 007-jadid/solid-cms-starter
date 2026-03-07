/**
 * Chart Theme Utility
 * Extracts theme colors from CSS variables for Chart.js integration
 */

import type { Chart, ChartType, TooltipModel } from "chart.js";
import { createMemo, createSignal } from "solid-js";

// ── Shared reactive theme version ──────────────────────────────────────
// Bumps whenever <html> class changes (light ↔ dark, theme variant).
// Any accessor that reads `themeVersion()` will re-run on theme switch.
const [themeVersion, setThemeVersion] = createSignal(0);

// Color conversion cache — cleared on theme change
const colorCache = new Map<string, string>();

// Persistent hidden element for color probing (avoids create/remove per call)
let colorProbe: HTMLDivElement | null = null;
// Shared 1×1 canvas for oklch fallback conversion
let sharedCanvas: HTMLCanvasElement | null = null;
let sharedCtx: CanvasRenderingContext2D | null = null;

if (typeof window !== "undefined") {
  const observer = new MutationObserver(() => {
    colorCache.clear();
    setThemeVersion((v) => v + 1);
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

export { themeVersion };

// ── CSS helpers ────────────────────────────────────────────────────────

function getCSSVariable(variable: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

function oklchToRgb(color: string): string {
  if (typeof window === "undefined") return "rgb(0, 0, 0)";
  if (!color) return "rgb(0, 0, 0)";

  const cached = colorCache.get(color);
  if (cached) return cached;

  // Reuse a persistent hidden element instead of creating/removing per call
  if (!colorProbe) {
    colorProbe = document.createElement("div");
    colorProbe.style.cssText =
      "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
    document.body.appendChild(colorProbe);
  }
  colorProbe.style.color = color;
  const computed = getComputedStyle(colorProbe).color;

  let result: string;
  if (computed.startsWith("rgb")) {
    result = computed;
  } else {
    // Reuse a shared canvas for oklch fallback
    if (!sharedCanvas) {
      sharedCanvas = document.createElement("canvas");
      sharedCanvas.width = sharedCanvas.height = 1;
      sharedCtx = sharedCanvas.getContext("2d");
    }
    if (!sharedCtx) return "rgb(0, 0, 0)";
    sharedCtx.clearRect(0, 0, 1, 1);
    sharedCtx.fillStyle = computed;
    sharedCtx.fillRect(0, 0, 1, 1);
    const [r, g, b] = sharedCtx.getImageData(0, 0, 1, 1).data;
    result = `rgb(${r}, ${g}, ${b})`;
  }

  colorCache.set(color, result);
  return result;
}

export function addAlpha(rgb: string, alpha: number): string {
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return rgb;
  return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${alpha})`;
}

export function getChartColor(index: number, alpha: number = 1): string {
  const colorVar = `--chart-${index}`;
  const oklch = getCSSVariable(colorVar);
  const rgb = oklchToRgb(oklch);
  return alpha < 1 ? addAlpha(rgb, alpha) : rgb;
}

export function getChartColors(alpha: number = 1): string[] {
  return [1, 2, 3, 4, 5].map((i) => getChartColor(i, alpha));
}

/**
 * Reactive chart-color accessor (memoized).
 * Re-reads CSS vars only once per theme change, not per call site.
 */
export function reactiveChartColors(alpha: number = 1): () => string[] {
  return createMemo(() => {
    themeVersion(); // subscribe to theme changes
    return getChartColors(alpha);
  });
}

export function getThemeColors() {
  return {
    background: oklchToRgb(getCSSVariable("--background")),
    foreground: oklchToRgb(getCSSVariable("--foreground")),
    border: oklchToRgb(getCSSVariable("--border")),
    muted: oklchToRgb(getCSSVariable("--muted")),
    mutedForeground: oklchToRgb(getCSSVariable("--muted-foreground")),
    primary: oklchToRgb(getCSSVariable("--primary")),
  };
}

export function createGradient(
  ctx: CanvasRenderingContext2D,
  color: string,
  startAlpha: number = 0.35,
  endAlpha: number = 0.01,
): CanvasGradient {
  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gradient.addColorStop(0, addAlpha(color, startAlpha));
  gradient.addColorStop(0.6, addAlpha(color, startAlpha * 0.25));
  gradient.addColorStop(1, addAlpha(color, endAlpha));
  return gradient;
}

/**
 * Modern chart options with glassmorphic HTML tooltip
 */
export function getDefaultChartOptions() {
  const theme = getThemeColors();

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: "easeOutExpo" as const,
      delay: (context: { type: string; mode: string; dataIndex: number; datasetIndex: number }) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default") {
          delay = context.dataIndex * 50 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        align: "start" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            family: getCSSVariable("--font-sans"),
            size: 12,
            weight: "500" as const,
          },
          color: theme.mutedForeground,
          boxWidth: 6,
          boxHeight: 6,
        },
      },
      tooltip: {
        enabled: false,
        external: (context: { chart: Chart; tooltip: TooltipModel<ChartType> }) => {
          let tooltipEl = document.getElementById("chartjs-tooltip");

          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "chartjs-tooltip";
            tooltipEl.className =
              "glass-card p-3 rounded-lg text-sm flex flex-col gap-1.5 z-50 pointer-events-none transition-all duration-300 shadow-xl border border-border/40";
            document.body.appendChild(tooltipEl);
          }

          const tooltipModel = context.tooltip;
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = "0";
            return;
          }

          function getBody(bodyItem: { lines: string[] }) {
            return bodyItem.lines;
          }

          if (tooltipModel.body) {
            const titleLines = tooltipModel.title || [];
            const bodyLines = tooltipModel.body.map(getBody);

            let innerHtml = '<div class="tooltip-title">';
            titleLines.forEach((title: string) => {
              innerHtml += title;
            });
            innerHtml += '</div><div class="tooltip-body">';

            bodyLines.forEach((body: string[], i: number) => {
              const colors = tooltipModel.labelColors[i];
              const dotColor = colors.borderColor || colors.backgroundColor;
              const dot =
                '<span class="inline-block w-2.5 h-2.5 rounded-full shadow-sm" style="background:' +
                dotColor +
                '"></span>';

              const text = body[0];
              const colonIdx = text.indexOf(":");
              const label = colonIdx !== -1 ? text.substring(0, colonIdx).trim() : text;
              const value = colonIdx !== -1 ? text.substring(colonIdx + 1).trim() : "";

              innerHtml +=
                '<div class="flex items-center justify-between gap-4 font-medium">' +
                '<div class="flex items-center gap-2">' +
                dot +
                '<span class="text-muted-foreground">' +
                label +
                "</span></div>" +
                '<span class="text-foreground tracking-tight">' +
                value +
                "</span>" +
                "</div>";
            });
            innerHtml += "</div>";

            const root = tooltipEl.querySelector("div");
            if (root) root.innerHTML = innerHtml;
          }

          const position = context.chart.canvas.getBoundingClientRect();
          tooltipEl.style.opacity = "1";
          tooltipEl.style.position = "absolute";
          tooltipEl.style.left = `${position.left + window.scrollX + tooltipModel.caretX}px`;
          tooltipEl.style.top = `${position.top + window.scrollY + tooltipModel.caretY}px`;
          tooltipEl.style.transform = "translate(-50%, 0)";
          tooltipEl.style.pointerEvents = "none";
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          padding: 8,
          font: {
            size: 12,
            weight: "400" as const,
            family: getCSSVariable("--font-sans"),
          },
          color: addAlpha(theme.mutedForeground, 0.5),
        },
      },
      y: {
        grid: {
          display: true,
          color: addAlpha(theme.mutedForeground, 0.1),
          drawTicks: false,
          lineWidth: 1,
        },
        border: {
          display: false,
        },
        ticks: {
          padding: 12,
          font: {
            size: 12,
            weight: "400" as const,
            family: getCSSVariable("--font-sans"),
          },
          color: addAlpha(theme.mutedForeground, 0.5),
        },
      },
    },
  };
}
