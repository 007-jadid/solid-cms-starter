import { lazy, Show, Suspense } from "solid-js";
import { MAP_BUILD_FLAGS } from "./map-build-config";
import { useMapConfig } from "./map-config";
import type { MapProps } from "./types";

// Lazy-load heavy provider implementations
const LeafletProvider = MAP_BUILD_FLAGS.leaflet
  ? lazy(() =>
      import("./providers/leaflet-provider.tsx").then((m) => ({
        default: m.LeafletProvider,
      })),
    )
  : null;

const GoogleProvider = MAP_BUILD_FLAGS.google
  ? lazy(() =>
      import("./providers/google-provider.tsx").then((m) => ({
        default: m.GoogleProvider,
      })),
    )
  : null;

const MapFallback = (props: { height?: string }) => (
  <div
    class="flex animate-pulse items-center justify-center rounded-md bg-muted"
    style={{ height: props.height ?? "400px", width: "100%" }}
  >
    <div class="flex flex-col items-center gap-2 text-muted-foreground">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </svg>
      <span class="text-sm">Loading map…</span>
    </div>
  </div>
);

/**
 * Core Map component with a plugin-based provider architecture.
 *
 * Supports:
 * - `provider.type = "leaflet"` — OpenStreetMap via Leaflet.js (no API key)
 * - `provider.type = "google"` — Google Maps (requires apiKey)
 *
 * Both providers are lazy-loaded so you only pay the bundle cost
 * for the provider you use.
 *
 * @example
 * // OpenStreetMap
 * <Map
 *   provider={{ type: "leaflet" }}
 *   center={[23.8103, 90.4125]}
 *   zoom={13}
 *   draggableMarker
 *   onMarkerChange={(loc) => console.log(loc)}
 * />
 *
 * @example
 * // Google Maps
 * <Map
 *   provider={{ type: "google", apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
 *   center={[51.505, -0.09]}
 *   zoom={13}
 *   draggableMarker
 *   onMarkerChange={(loc) => console.log(loc)}
 * />
 */
export function MapView(props: MapProps) {
  const mapConfig = useMapConfig();
  const enabledProviders = () => mapConfig.enabledProviders ?? ["leaflet", "google"];
  const canUseLeaflet =
    props.provider.type === "leaflet" &&
    MAP_BUILD_FLAGS.leaflet &&
    enabledProviders().includes("leaflet");
  const canUseGoogle =
    props.provider.type === "google" &&
    MAP_BUILD_FLAGS.google &&
    enabledProviders().includes("google");

  return (
    <Suspense fallback={<MapFallback height={props.height} />}>
      <Show when={canUseLeaflet && LeafletProvider}>
        {(Provider) => {
          const ResolvedProvider = Provider();
          return <ResolvedProvider {...props} />;
        }}
      </Show>
      <Show when={canUseGoogle && GoogleProvider}>
        {(Provider) => {
          const ResolvedProvider = Provider();
          return <ResolvedProvider {...props} />;
        }}
      </Show>
      <Show when={!canUseLeaflet && !canUseGoogle}>
        <div
          class="flex items-center justify-center rounded-md border border-dashed bg-muted/40 px-4 text-center text-sm text-muted-foreground"
          style={{ height: props.height ?? "400px", width: "100%" }}
        >
          This map provider is disabled. Enable it in `MapConfigProvider` and build mode.
        </div>
      </Show>
    </Suspense>
  );
}
