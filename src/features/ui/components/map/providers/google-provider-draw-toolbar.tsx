import { For, Show } from "solid-js";
import type { DrawMode } from "../types";

const DRAWING_TOOL_META: Array<{ mode: DrawMode; label: string }> = [
  { mode: "marker", label: "Marker" },
  { mode: "polyline", label: "Line" },
  { mode: "polygon", label: "Polygon" },
  { mode: "rectangle", label: "Rect" },
  { mode: "circle", label: "Circle" },
];

interface GoogleProviderDrawToolbarProps {
  drawingTools?: DrawMode[];
  activeDrawMode: DrawMode | null;
  selectedShapeId: string | null;
  onPanClick: () => void;
  onToolClick: (mode: DrawMode) => void;
  onDeleteSelected: () => void;
  onClearAll: () => void;
}

export function GoogleProviderDrawToolbar(props: GoogleProviderDrawToolbarProps) {
  return (
    <Show when={props.drawingTools?.length}>
      <div class="pointer-events-none absolute left-3 top-3 z-900">
        <div class="pointer-events-auto rounded-md border bg-background/95 p-1 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80">
          <div class="mb-1 flex flex-col gap-1">
            <button
              type="button"
              class={`rounded border px-2 py-1 text-xs font-medium transition-colors ${
                props.activeDrawMode === null
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted"
              }`}
              onClick={props.onPanClick}
            >
              Pan
            </button>

            <For each={DRAWING_TOOL_META.filter((item) => props.drawingTools?.includes(item.mode))}>
              {(tool) => (
                <button
                  type="button"
                  class={`rounded border px-2 py-1 text-xs font-medium transition-colors ${
                    props.activeDrawMode === tool.mode
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                  onClick={() => props.onToolClick(tool.mode)}
                >
                  {tool.label}
                </button>
              )}
            </For>
          </div>

          <div class="my-1 h-px bg-border" />

          <div class="mt-1 flex items-center justify-center gap-1">
            <button
              type="button"
              title="Delete selected shape"
              aria-label="Delete selected shape"
              class="inline-flex size-8 items-center justify-center rounded border border-border bg-background transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!props.selectedShapeId}
              onClick={props.onDeleteSelected}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </button>

            <div class="h-5 w-px bg-border" />

            <button
              type="button"
              title="Clear all shapes"
              aria-label="Clear all shapes"
              class="inline-flex size-8 items-center justify-center rounded border border-border bg-background transition-colors hover:bg-muted"
              onClick={props.onClearAll}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h14" />
                <path d="M7 6v12h10l4-8V6" />
                <path d="M7 10h14" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
