import { createSignal, For, Show } from "solid-js";
import { Button } from "~/features/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { type DrawnShape, type MapControlRef, MapView } from "~/features/ui/components/map";

const DHAKA: [number, number] = [23.8103, 90.4125];
const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY as string | undefined;

const ALL_TOOLS = ["marker", "polyline", "polygon", "rectangle", "circle"] as const;

function shapeLabel(shape: DrawnShape): string {
  const d = shape.data;
  if (d.type === "marker") return `${d.lat.toFixed(4)}, ${d.lng.toFixed(4)}`;
  if (d.type === "polyline") return `${d.points.length} points`;
  if (d.type === "polygon") return `${d.points.length} vertices`;
  if (d.type === "rectangle") return `N${d.north.toFixed(3)} → S${d.south.toFixed(3)}`;
  if (d.type === "circle") return `r = ${Math.round(d.radius)} m`;
  return shape.id;
}

const TYPE_COLOR: Record<string, string> = {
  marker: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  polyline: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  polygon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  rectangle: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  circle: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

function ShapeList(props: {
  shapes: DrawnShape[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  return (
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">
          {props.shapes.length} shape{props.shapes.length !== 1 ? "s" : ""}
        </span>
        <Button size="sm" variant="outline" class="ml-auto" onClick={props.onClear}>
          Clear all
        </Button>
      </div>

      <Show when={props.shapes.length > 0}>
        <div class="rounded-lg border divide-y">
          <For each={props.shapes}>
            {(shape) => (
              <div class="flex items-center gap-3 px-3 py-2">
                <span
                  class={`inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${TYPE_COLOR[shape.data.type] ?? ""}`}
                >
                  {shape.data.type}
                </span>
                <span class="flex-1 truncate text-xs text-muted-foreground">
                  {shapeLabel(shape)}
                </span>
                {/* eslint-disable-next-line custom/no-native-interactive-elements */}
                <button
                  type="button"
                  class="text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => props.onRemove(shape.id)}
                  aria-label="Remove"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            )}
          </For>
        </div>

        <details>
          <summary class="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors select-none">
            View DrawnShape[] JSON
          </summary>
          <pre class="mt-2 overflow-x-auto rounded-lg border bg-muted/40 p-3 text-xs font-mono leading-relaxed max-h-48">
            {JSON.stringify(props.shapes, null, 2)}
          </pre>
        </details>
      </Show>
    </div>
  );
}

export function MapDrawingDemo() {
  const [leafletShapes, setLeafletShapes] = createSignal<DrawnShape[]>([]);
  const [googleShapes, setGoogleShapes] = createSignal<DrawnShape[]>([]);
  let leafletRef: MapControlRef | undefined;
  let googleRef: MapControlRef | undefined;

  return (
    <div class="space-y-4">
      {/* Leaflet / Geoman */}
      <Card>
        <CardHeader>
          <CardTitle>Drawing tools — Leaflet (Geoman)</CardTitle>
          <CardDescription>
            Use the toolbar on the left edge of the map to draw markers, polylines, polygons,
            rectangles, and circles. Switch to the edit or delete tools to modify existing shapes.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="isolate overflow-hidden rounded-lg border">
            <MapView
              provider={{ type: "leaflet" }}
              height="380px"
              center={DHAKA}
              zoom={12}
              drawingTools={[...ALL_TOOLS]}
              onShapesChange={setLeafletShapes}
              onReady={(ref) => {
                leafletRef = ref;
              }}
            />
          </div>
          <ShapeList
            shapes={leafletShapes()}
            onRemove={(id) => leafletRef?.removeShape(id)}
            onClear={() => leafletRef?.clearDrawnShapes()}
          />
        </CardContent>
      </Card>

      {/* Google Maps / Terra Draw */}
      <Show
        when={GOOGLE_API_KEY}
        fallback={
          <Card class="border-dashed">
            <CardContent class="py-8 text-center text-sm text-muted-foreground">
              Set <code class="rounded bg-muted px-1 text-xs">VITE_APP_GOOGLE_MAP_API_KEY</code> in{" "}
              <code class="rounded bg-muted px-1 text-xs">.env</code> to enable the Google Maps
              drawing demo.
            </CardContent>
          </Card>
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>Drawing tools — Google Maps (Terra Draw)</CardTitle>
            <CardDescription>
              Google Maps drawing powered by Terra Draw. Use the in-map toolbar on the top-left to
              switch modes, then draw directly on the map. Shapes remain editable/selectable after
              creation.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="overflow-hidden rounded-lg border">
              <MapView
                provider={{ type: "google", apiKey: GOOGLE_API_KEY! }}
                height="380px"
                center={DHAKA}
                zoom={12}
                drawingTools={[...ALL_TOOLS]}
                onShapesChange={setGoogleShapes}
                onReady={(ref) => {
                  googleRef = ref;
                }}
              />
            </div>

            <ShapeList
              shapes={googleShapes()}
              onRemove={(id) => googleRef?.removeShape(id)}
              onClear={() => googleRef?.clearDrawnShapes()}
            />
          </CardContent>
        </Card>
      </Show>

      {/* Usage reference */}
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>
            All drawing props work with both providers. Combine freely with{" "}
            <code class="rounded bg-muted px-1 text-xs">marker</code>,{" "}
            <code class="rounded bg-muted px-1 text-xs">onMarkerChange</code>, search, etc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="rounded-lg border bg-muted/40 p-4 font-mono text-xs space-y-1 leading-relaxed">
            <p>{"<Map"}</p>
            <p class="pl-4">{'provider={{ type: "leaflet" }} // or "google"'}</p>
            <p class="pl-4">
              {'drawingTools={["marker","polyline","polygon","rectangle","circle"]}'}
            </p>
            <p class="pl-4">{"initialShapes={savedShapes}"}</p>
            <p class="pl-4">{"onShapeDrawn={(shape) => console.log(shape)}"}</p>
            <p class="pl-4">{"onShapesChange={(shapes) => setShapes(shapes)}"}</p>
            <p class="pl-4">{"onReady={(ref) => {"}</p>
            <p class="pl-8">{"ref.setDrawMode('polygon')"}</p>
            <p class="pl-8">{"ref.getDrawnShapes()"}</p>
            <p class="pl-8">{"ref.clearDrawnShapes()"}</p>
            <p class="pl-8">{"ref.removeShape(id)"}</p>
            <p class="pl-4">{"}"}</p>
            <p>{">"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
