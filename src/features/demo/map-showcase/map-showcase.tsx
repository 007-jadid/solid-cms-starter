import { createSignal, For, type JSX, Show } from "solid-js";
import { Badge } from "~/features/ui/components/badge";
import { Button } from "~/features/ui/components/button";
import type { DrawnShape, MapControlRef, MapLocation } from "~/features/ui/components/map";
import { MapLocationSearch, MapView } from "~/features/ui/components/map";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/features/ui/components/tabs";

// ─── Constants ───────────────────────────────────────────────────────────────

const DHAKA: [number, number] = [23.8103, 90.4125];
const SYLHET: [number, number] = [24.8949, 91.8687];
const CHITTAGONG: [number, number] = [22.3569, 91.7832];
const RAJSHAHI: [number, number] = [24.3745, 88.6042];

const TAB_TRIGGER =
  "relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-medium shadow-none transition-none data-selected:border-foreground data-selected:bg-transparent data-selected:text-foreground data-selected:shadow-none";

// ─── Demo Card wrapper ────────────────────────────────────────────────────────

function DemoCard(props: {
  title: string;
  description: string;
  children: JSX.Element;
  badge?: string;
}) {
  return (
    <div class="rounded-xl border bg-card p-6 space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div class="space-y-1">
          <h3 class="font-semibold text-base">{props.title}</h3>
          <p class="text-sm text-muted-foreground">{props.description}</p>
        </div>
        <Show when={props.badge}>
          <Badge variant="secondary" class="shrink-0 text-xs">
            {props.badge}
          </Badge>
        </Show>
      </div>
      {props.children}
    </div>
  );
}

// ─── Location display ─────────────────────────────────────────────────────────

function LocationCard(props: { location: MapLocation | null }) {
  return (
    <Show
      when={props.location}
      fallback={<p class="text-sm text-muted-foreground italic">No location selected yet.</p>}
    >
      {(loc) => (
        <div class="rounded-lg bg-muted/50 border p-3 text-sm space-y-1 font-mono">
          <div class="grid grid-cols-2 gap-x-4 gap-y-0.5">
            <span class="text-muted-foreground">lat</span>
            <span>{loc().lat.toFixed(6)}</span>
            <span class="text-muted-foreground">lng</span>
            <span>{loc().lng.toFixed(6)}</span>
            <Show when={loc().zoom}>
              <span class="text-muted-foreground">zoom</span>
              <span>{loc().zoom}</span>
            </Show>
            <Show when={loc().address}>
              <span class="text-muted-foreground">address</span>
              <span class="font-sans text-xs break-all">{loc().address}</span>
            </Show>
            <Show when={loc().city}>
              <span class="text-muted-foreground">city</span>
              <span class="font-sans">{loc().city}</span>
            </Show>
            <Show when={loc().country}>
              <span class="text-muted-foreground">country</span>
              <span class="font-sans">{loc().country}</span>
            </Show>
            <Show when={loc().postalCode}>
              <span class="text-muted-foreground">postalCode</span>
              <span class="font-sans">{loc().postalCode}</span>
            </Show>
          </div>
        </div>
      )}
    </Show>
  );
}

// ─── Tab: Basic Map ───────────────────────────────────────────────────────────

function BasicMapTab() {
  return (
    <div class="space-y-6">
      <DemoCard
        title="Read-only map"
        description="Static marker, no interaction. Uses Leaflet + OpenStreetMap (no API key needed)."
        badge="leaflet"
      >
        <MapView
          provider={{ type: "leaflet" }}
          height="300px"
          center={DHAKA}
          zoom={13}
          marker={{ lat: DHAKA[0], lng: DHAKA[1], displayName: "Dhaka, Bangladesh" }}
          interactive={false}
          draggableMarker={false}
        />
      </DemoCard>

      <DemoCard
        title="Non-interactive, no zoom controls"
        description="Like a thumbnail preview — disabled pan/zoom, no controls visible."
        badge="leaflet"
      >
        <MapView
          provider={{ type: "leaflet" }}
          height="200px"
          center={SYLHET}
          zoom={12}
          marker={{ lat: SYLHET[0], lng: SYLHET[1], displayName: "Sylhet" }}
          interactive={false}
          draggableMarker={false}
          showZoomControl={false}
          showScaleControl={false}
        />
      </DemoCard>

      <DemoCard
        title="Custom tile provider"
        description="Override the default OSM tile URL and attribution. Here using CartoDB Positron (light theme)."
        badge="custom tiles"
      >
        <MapView
          provider={{
            type: "leaflet",
            tileUrl: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            tileAttribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          }}
          height="280px"
          center={CHITTAGONG}
          zoom={13}
          marker={{ lat: CHITTAGONG[0], lng: CHITTAGONG[1] }}
        />
      </DemoCard>
    </div>
  );
}

// ─── Tab: Interactive Map ─────────────────────────────────────────────────────

function InteractiveMapTab() {
  const [location, setLocation] = createSignal<MapLocation | null>(null);
  const [dragLoc, setDragLoc] = createSignal<MapLocation | null>({
    lat: RAJSHAHI[0],
    lng: RAJSHAHI[1],
    displayName: "Rajshahi",
  });

  return (
    <div class="space-y-6">
      <DemoCard
        title="Click to place marker"
        description="Click anywhere on the map to place a marker. The map reverse-geocodes the position via Nominatim automatically."
        badge="interactive"
      >
        <MapView
          provider={{ type: "leaflet" }}
          height="320px"
          center={DHAKA}
          zoom={12}
          marker={location()}
          onMarkerChange={setLocation}
          draggableMarker
        />
        <LocationCard location={location()} />
      </DemoCard>

      <DemoCard
        title="Draggable marker (pre-placed)"
        description="Marker starts at Rajshahi. Drag it to update the location."
        badge="draggable"
      >
        <MapView
          provider={{ type: "leaflet" }}
          height="280px"
          center={RAJSHAHI}
          zoom={13}
          marker={dragLoc()}
          onMarkerChange={setDragLoc}
          draggableMarker
        />
        <LocationCard location={dragLoc()} />
      </DemoCard>
    </div>
  );
}

// ─── Tab: Search ──────────────────────────────────────────────────────────────

function SearchTab() {
  const [location, setLocation] = createSignal<MapLocation | null>(null);
  const [fastLoc, setFastLoc] = createSignal<MapLocation | null>(null);

  return (
    <div class="space-y-6">
      <DemoCard
        title="MapLocationSearch — default (300ms debounce)"
        description="Type to search via Nominatim. Select a result to pan the map and drop a marker. Click on the map to reverse-geocode."
        badge="nominatim"
      >
        <MapLocationSearch
          provider={{ type: "leaflet" }}
          height="340px"
          center={DHAKA}
          zoom={12}
          value={location()}
          onLocationChange={setLocation}
          showClear
        />
        <LocationCard location={location()} />
      </DemoCard>

      <DemoCard
        title="Custom placeholder + fast debounce"
        description="debounceMs={150} for quicker suggestions. Custom searchPlaceholder."
        badge="debounce: 150ms"
      >
        <MapLocationSearch
          provider={{ type: "leaflet" }}
          height="280px"
          center={SYLHET}
          zoom={12}
          value={fastLoc()}
          onLocationChange={setFastLoc}
          searchPlaceholder="Find a city or address…"
          debounceMs={150}
          showClear
        />
        <LocationCard location={fastLoc()} />
      </DemoCard>
    </div>
  );
}

// ─── Tab: Programmatic Control ────────────────────────────────────────────────

function ProgrammaticTab() {
  let controlRef: MapControlRef | undefined;
  const [center, setCenter] = createSignal<{ lat: number; lng: number; zoom: number } | null>(null);
  const [marker, setMarker] = createSignal<MapLocation | null>(null);
  const [searchResults, setSearchResults] = createSignal<string[]>([]);

  const cities: { label: string; lat: number; lng: number; zoom: number }[] = [
    { label: "Dhaka", lat: DHAKA[0], lng: DHAKA[1], zoom: 13 },
    { label: "Sylhet", lat: SYLHET[0], lng: SYLHET[1], zoom: 13 },
    { label: "Chittagong", lat: CHITTAGONG[0], lng: CHITTAGONG[1], zoom: 13 },
    { label: "Rajshahi", lat: RAJSHAHI[0], lng: RAJSHAHI[1], zoom: 12 },
  ];

  function flyTo(lat: number, lng: number, zoom: number) {
    controlRef?.setCenter(lat, lng, zoom);
    // Read after a tick so the value reflects the new target (not mid-animation)
    setTimeout(() => setCenter(controlRef?.getCenter() ?? null), 50);
  }

  function placeMarker(lat: number, lng: number, zoom: number, label: string) {
    controlRef?.setMarker({ lat, lng, displayName: label });
    controlRef?.setCenter(lat, lng, zoom);
    setMarker({ lat, lng, displayName: label });
  }

  function clearMarker() {
    controlRef?.setMarker(null);
    setMarker(null);
  }

  async function runSearch() {
    const results = await controlRef?.search("hospital Dhaka");
    setSearchResults((results ?? []).slice(0, 5).map((r) => r.label));
  }

  return (
    <div class="space-y-6">
      <DemoCard
        title="MapControlRef API"
        description="Use onReady to get the MapControlRef handle. Demonstrates setCenter, setMarker, getCenter, and search."
        badge="imperative"
      >
        <MapView
          provider={{ type: "leaflet" }}
          height="300px"
          center={DHAKA}
          zoom={12}
          marker={marker()}
          onReady={(ref) => {
            controlRef = ref;
          }}
        />

        {/* setCenter */}
        <div class="space-y-2">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            setCenter( lat, lng, zoom )
          </p>
          <div class="flex flex-wrap gap-2">
            <For each={cities}>
              {(city) => (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => flyTo(city.lat, city.lng, city.zoom)}
                >
                  {city.label}
                </Button>
              )}
            </For>
          </div>
          <Show when={center()}>
            <p class="text-xs font-mono text-muted-foreground">
              center → {center()!.lat.toFixed(5)}, {center()!.lng.toFixed(5)} @ z{center()!.zoom}
            </p>
          </Show>
        </div>

        {/* setMarker / clearMarker */}
        <div class="space-y-2">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            setMarker( location | null )
          </p>
          <div class="flex flex-wrap gap-2">
            <For each={cities}>
              {(city) => (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => placeMarker(city.lat, city.lng, city.zoom, city.label)}
                >
                  Pin {city.label}
                </Button>
              )}
            </For>
            <Button size="sm" variant="destructive" onClick={clearMarker}>
              Clear marker
            </Button>
          </div>
          <Show when={marker()}>
            <p class="text-xs font-mono text-muted-foreground">
              marker → {marker()!.displayName} ({marker()!.lat.toFixed(5)},{" "}
              {marker()!.lng.toFixed(5)})
            </p>
          </Show>
        </div>

        {/* search */}
        <div class="space-y-2">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            search( query ) → SearchSuggestion[]
          </p>
          <Button size="sm" variant="outline" onClick={runSearch}>
            Run: search("hospital Dhaka")
          </Button>
          <Show when={searchResults().length > 0}>
            <ul class="space-y-0.5 text-xs font-mono text-muted-foreground">
              <For each={searchResults()}>{(r) => <li class="truncate">• {r}</li>}</For>
            </ul>
          </Show>
        </div>
      </DemoCard>
    </div>
  );
}

// ─── Tab: Props Reference ─────────────────────────────────────────────────────

type PropRow = { prop: string; type: string; default_: string; description: string };

const MAP_PROPS: PropRow[] = [
  {
    prop: "provider",
    type: "MapProviderConfig",
    default_: "—",
    description: 'Required. { type: "leaflet" } or { type: "google", apiKey }',
  },
  {
    prop: "height",
    type: "string",
    default_: '"400px"',
    description: "CSS height of the map container",
  },
  {
    prop: "center",
    type: "[number, number]",
    default_: "[23.81, 90.41]",
    description: "Initial [lat, lng] center",
  },
  { prop: "zoom", type: "number", default_: "13", description: "Initial zoom level" },
  {
    prop: "marker",
    type: "MapLocation | null",
    default_: "undefined",
    description: "Marker to display on the map",
  },
  {
    prop: "onMarkerChange",
    type: "(loc | null) => void",
    default_: "undefined",
    description: "Called on map click or marker drag",
  },
  {
    prop: "draggableMarker",
    type: "boolean",
    default_: "true",
    description: "Allow marker to be dragged",
  },
  { prop: "interactive", type: "boolean", default_: "true", description: "Enable pan & zoom" },
  {
    prop: "showZoomControl",
    type: "boolean",
    default_: "true",
    description: "Show +/- zoom buttons",
  },
  { prop: "showScaleControl", type: "boolean", default_: "true", description: "Show scale ruler" },
  {
    prop: "onReady",
    type: "(ref: MapControlRef) => void",
    default_: "undefined",
    description: "Fires when provider is initialized",
  },
  {
    prop: "class",
    type: "string",
    default_: "undefined",
    description: "Extra CSS class for the wrapper",
  },
];

const SEARCH_EXTRA_PROPS: PropRow[] = [
  {
    prop: "value",
    type: "MapLocation | null",
    default_: "undefined",
    description: "Controlled selected location",
  },
  {
    prop: "onLocationChange",
    type: "(loc | null) => void",
    default_: "undefined",
    description: "Called on suggestion select or map click",
  },
  {
    prop: "searchPlaceholder",
    type: "string",
    default_: '"Search for a location…"',
    description: "Input placeholder text",
  },
  {
    prop: "showClear",
    type: "boolean",
    default_: "undefined",
    description: "Show clear button when value is set",
  },
  {
    prop: "debounceMs",
    type: "number",
    default_: "300",
    description: "Search input debounce in ms",
  },
];

const CONTROL_REF_METHODS: PropRow[] = [
  {
    prop: "setCenter(lat, lng, zoom?)",
    type: "void",
    default_: "—",
    description: "Pan/zoom map programmatically",
  },
  {
    prop: "setMarker(location | null)",
    type: "void",
    default_: "—",
    description: "Place or remove the marker",
  },
  {
    prop: "getCenter()",
    type: "{ lat, lng, zoom }",
    default_: "—",
    description: "Read current map center & zoom",
  },
  {
    prop: "search(query)",
    type: "Promise<SearchSuggestion[]>",
    default_: "—",
    description: "Forward geocode search",
  },
  {
    prop: "geocodeSelection(suggestion)",
    type: "Promise<MapLocation | null>",
    default_: "—",
    description: "Resolve a suggestion to full MapLocation",
  },
];

function PropsTable(props: { rows: PropRow[]; showDefault?: boolean }) {
  return (
    <div class="overflow-x-auto rounded-lg border">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="px-4 py-2 text-left font-medium text-muted-foreground">Prop / Method</th>
            <th class="px-4 py-2 text-left font-medium text-muted-foreground">Type</th>
            <Show when={props.showDefault !== false}>
              <th class="px-4 py-2 text-left font-medium text-muted-foreground">Default</th>
            </Show>
            <th class="px-4 py-2 text-left font-medium text-muted-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.rows}>
            {(row, i) => (
              <tr class={i() % 2 === 0 ? "bg-transparent" : "bg-muted/20"}>
                <td class="px-4 py-2 font-mono text-xs font-semibold text-foreground whitespace-nowrap">
                  {row.prop}
                </td>
                <td class="px-4 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {row.type}
                </td>
                <Show when={props.showDefault !== false}>
                  <td class="px-4 py-2 font-mono text-xs text-muted-foreground">{row.default_}</td>
                </Show>
                <td class="px-4 py-2 text-xs text-muted-foreground">{row.description}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}

// ─── Tab: Drawing ─────────────────────────────────────────────────────────────

function shapeLabel(shape: DrawnShape): string {
  const d = shape.data;
  if (d.type === "marker") return `Marker  ${d.lat.toFixed(4)}, ${d.lng.toFixed(4)}`;
  if (d.type === "polyline") return `Polyline  ${d.points.length} pts`;
  if (d.type === "polygon") return `Polygon  ${d.points.length} pts`;
  if (d.type === "rectangle") return `Rectangle  N${d.north.toFixed(3)} S${d.south.toFixed(3)}`;
  if (d.type === "circle") return `Circle  r=${Math.round(d.radius)} m`;
  return shape.id;
}

function DrawingTab() {
  const [shapes, setShapes] = createSignal<DrawnShape[]>([]);
  let controlRef: MapControlRef | undefined;

  return (
    <div class="space-y-6">
      <DemoCard
        title="Drawing tools — Leaflet (Geoman)"
        description="Use the toolbar on the left to draw markers, polylines, polygons, rectangles, and circles. Edit or delete existing shapes using the edit/trash tools. All shapes are tracked in real time."
        badge="geoman"
      >
        <div class="isolate overflow-hidden rounded-lg border">
          <MapView
            provider={{ type: "leaflet" }}
            height="420px"
            center={DHAKA}
            zoom={12}
            drawingTools={["marker", "polyline", "polygon", "rectangle", "circle"]}
            onShapesChange={setShapes}
            onReady={(ref) => {
              controlRef = ref;
            }}
          />
        </div>

        {/* Controls */}
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-sm text-muted-foreground">
            {shapes().length} shape{shapes().length !== 1 ? "s" : ""} drawn
          </span>
          <Button
            size="sm"
            variant="outline"
            class="ml-auto"
            onClick={() => controlRef?.clearDrawnShapes()}
          >
            Clear all
          </Button>
        </div>

        {/* Shape list */}
        <Show when={shapes().length > 0}>
          <div class="rounded-lg border divide-y text-sm">
            <For each={shapes()}>
              {(shape) => (
                <div class="flex items-center gap-3 px-3 py-2">
                  <span class="font-mono text-xs text-muted-foreground uppercase w-16 shrink-0">
                    {shape.data.type}
                  </span>
                  <span class="flex-1 truncate text-xs">{shapeLabel(shape)}</span>
                  {/* eslint-disable-next-line custom/no-native-interactive-elements */}
                  <button
                    type="button"
                    class="text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() => controlRef?.removeShape(shape.id)}
                    aria-label="Remove shape"
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
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </For>
          </div>
        </Show>

        {/* Raw JSON */}
        <Show when={shapes().length > 0}>
          <details class="group">
            <summary class="cursor-pointer text-xs text-muted-foreground select-none hover:text-foreground transition-colors">
              View raw JSON
            </summary>
            <pre class="mt-2 overflow-x-auto rounded-lg border bg-muted/40 p-3 text-xs font-mono leading-relaxed">
              {JSON.stringify(shapes(), null, 2)}
            </pre>
          </details>
        </Show>
      </DemoCard>

      {/* Props reference for drawing */}
      <DemoCard
        title="Drawing props & control methods"
        description="Props added to <MapView> and methods added to MapControlRef for drawing support."
      >
        <div class="space-y-4">
          <div class="rounded-lg border bg-muted/40 p-4 font-mono text-xs space-y-1">
            <p class="text-muted-foreground">{"// Enable specific tools (any subset):"}</p>
            <p>{'drawingTools={["marker", "polyline", "polygon", "rectangle", "circle"]}'}</p>
            <p class="mt-2 text-muted-foreground">{"// Pre-load shapes:"}</p>
            <p>{"initialShapes={shapes}"}</p>
            <p class="mt-2 text-muted-foreground">{"// React to changes:"}</p>
            <p>{"onShapeDrawn={(shape) => ...}    // single new shape"}</p>
            <p>{"onShapesChange={(shapes) => ...} // full list after any change"}</p>
          </div>
          <div class="rounded-lg border bg-muted/40 p-4 font-mono text-xs space-y-1">
            <p class="text-muted-foreground">{"// Via MapControlRef (onReady callback):"}</p>
            <p>{"ref.setDrawMode('polygon')  // activate a tool"}</p>
            <p>{"ref.setDrawMode(null)       // back to pan mode"}</p>
            <p>{"ref.getDrawnShapes()        // DrawnShape[]"}</p>
            <p>{"ref.clearDrawnShapes()      // remove all"}</p>
            <p>{"ref.removeShape(id)         // remove one"}</p>
          </div>
          <div class="rounded-lg border bg-muted/40 p-4 font-mono text-xs space-y-1.5">
            <p class="text-muted-foreground">{"// DrawnShape data union:"}</p>
            <p>{'{ type: "marker";    lat; lng }'}</p>
            <p>{'{ type: "polyline";  points: {lat,lng}[] }'}</p>
            <p>{'{ type: "polygon";   points: {lat,lng}[] }'}</p>
            <p>{'{ type: "rectangle"; north; south; east; west }'}</p>
            <p>{'{ type: "circle";    center: {lat,lng}; radius (m) }'}</p>
          </div>
        </div>
      </DemoCard>
    </div>
  );
}

function PropsReferenceTab() {
  return (
    <div class="space-y-8">
      <div class="space-y-3">
        <h3 class="font-semibold">Provider config</h3>
        <div class="rounded-lg border bg-muted/40 p-4 font-mono text-xs space-y-1">
          <p class="text-muted-foreground">{"// Leaflet (no key)"}</p>
          <p>{'provider={{ type: "leaflet", tileUrl?, tileAttribution?, nominatimUrl? }}'}</p>
          <p class="mt-2 text-muted-foreground">{"// Google Maps (requires apiKey)"}</p>
          <p>{'provider={{ type: "google", apiKey: "AIza…", mapId? }}'}</p>
        </div>
      </div>

      <div class="space-y-3">
        <h3 class="font-semibold">
          {"<MapView />"}
          <span class="ml-2 font-mono text-xs font-normal text-muted-foreground">
            src/features/ui/components/map/map.tsx
          </span>
        </h3>
        <PropsTable rows={MAP_PROPS} />
      </div>

      <div class="space-y-3">
        <h3 class="font-semibold">
          {"<MapLocationSearch />"}
          <span class="ml-2 font-mono text-xs font-normal text-muted-foreground">
            Extends all MapProps + adds:
          </span>
        </h3>
        <PropsTable rows={SEARCH_EXTRA_PROPS} />
      </div>

      <div class="space-y-3">
        <h3 class="font-semibold">
          MapControlRef
          <span class="ml-2 font-mono text-xs font-normal text-muted-foreground">
            via onReady callback
          </span>
        </h3>
        <PropsTable rows={CONTROL_REF_METHODS} showDefault={false} />
      </div>

      <div class="space-y-3">
        <h3 class="font-semibold">MapLocation type</h3>
        <div class="rounded-lg border bg-muted/40 p-4 font-mono text-xs space-y-0.5">
          <p>{"interface MapLocation {"}</p>
          <p class="ml-4">{"lat: number"}</p>
          <p class="ml-4">{"lng: number"}</p>
          <p class="ml-4">{"zoom?: number"}</p>
          <p class="ml-4">{"address?: string       // full display address"}</p>
          <p class="ml-4">{"displayName?: string   // short place name"}</p>
          <p class="ml-4">{"city?: string"}</p>
          <p class="ml-4">{"country?: string"}</p>
          <p class="ml-4">{"postalCode?: string"}</p>
          <p class="ml-4">{"placeId?: string       // Google provider only"}</p>
          <p>{"}"}</p>
        </div>
      </div>

      <div class="space-y-3">
        <h3 class="font-semibold">Form field usage</h3>
        <div class="rounded-lg border bg-muted/40 p-4 font-mono text-xs space-y-0.5">
          <p class="text-muted-foreground">{"// In createForm() config:"}</p>
          <p>{"{"}</p>
          <p class="ml-4">{'type: "map",'}</p>
          <p class="ml-4">{'name: "location",'}</p>
          <p class="ml-4">{'label: "Pick location",'}</p>
          <p class="ml-4">{"mapConfig: {"}</p>
          <p class="ml-6">{'provider: { type: "leaflet" },'}</p>
          <p class="ml-6">{'height: "360px",'}</p>
          <p class="ml-6">{"draggableMarker: true,"}</p>
          <p class="ml-4">{"}"}</p>
          <p>{"}"}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function MapShowcase() {
  return (
    <div class="space-y-8 p-6 pb-16">
      {/* Hero */}
      <div class="space-y-3 py-8 text-center">
        <p class="text-xs font-medium text-muted-foreground">Map Components</p>
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Map Feature Showcase</h1>
        <p class="mx-auto max-w-xl text-sm text-muted-foreground">
          Plugin-based map system with Leaflet (OSM, no key) and Google Maps support.
          <br />
          Lazy-loaded providers, reverse geocoding, search autocomplete, and a full{" "}
          <span class="font-mono">MapControlRef</span> imperative API.
        </p>
      </div>

      <Tabs defaultValue="basic" class="w-full">
        <TabsList class="h-auto w-full justify-start gap-0 rounded-none border-b bg-transparent p-0 overflow-x-auto">
          <TabsTrigger value="basic" class={TAB_TRIGGER}>
            Basic Map
          </TabsTrigger>
          <TabsTrigger value="interactive" class={TAB_TRIGGER}>
            Interactive
          </TabsTrigger>
          <TabsTrigger value="search" class={TAB_TRIGGER}>
            Location Search
          </TabsTrigger>
          <TabsTrigger value="programmatic" class={TAB_TRIGGER}>
            Programmatic Control
          </TabsTrigger>
          <TabsTrigger value="drawing" class={TAB_TRIGGER}>
            Drawing
          </TabsTrigger>
          <TabsTrigger value="props" class={TAB_TRIGGER}>
            Props Reference
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" class="mt-6">
          <BasicMapTab />
        </TabsContent>
        <TabsContent value="interactive" class="mt-6">
          <InteractiveMapTab />
        </TabsContent>
        <TabsContent value="search" class="mt-6">
          <SearchTab />
        </TabsContent>
        <TabsContent value="programmatic" class="mt-6">
          <ProgrammaticTab />
        </TabsContent>
        <TabsContent value="drawing" class="mt-6">
          <DrawingTab />
        </TabsContent>
        <TabsContent value="props" class="mt-6">
          <PropsReferenceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
