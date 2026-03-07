import { createSignal, Show } from "solid-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { type MapLocation, MapLocationSearch } from "~/features/ui/components/map";
import { createForm } from "~/features/ui/form/form-factory";

const DHAKA: [number, number] = [23.8103, 90.4125];
const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY as string | undefined;

function LocationOutput(props: { location: MapLocation | null }) {
  return (
    <Show when={props.location}>
      {(loc) => (
        <div class="rounded-md border bg-muted/50 p-3 font-mono text-xs space-y-0.5">
          <p>
            <span class="text-muted-foreground">address: </span>
            {loc().displayName}
          </p>
          <p>
            <span class="text-muted-foreground">lat/lng: </span>
            {loc().lat.toFixed(6)}, {loc().lng.toFixed(6)}
          </p>
        </div>
      )}
    </Show>
  );
}

export function MapLocationDemo() {
  const [leafletLocation, setLeafletLocation] = createSignal<MapLocation | null>(null);
  const [googleLocation, setGoogleLocation] = createSignal<MapLocation | null>(null);

  const form = createForm({
    defaultValues: { location: null as MapLocation | null },
    fields: [
      {
        name: "location" as const,
        label: "Delivery Address",
        type: "map" as const,
        description: "Search or click on the map to select an address.",
        mapConfig: {
          provider: { type: "leaflet" as const },
          height: "320px",
          draggableMarker: true,
          searchPlaceholder: "Search for a delivery address…",
        },
      },
    ],
    onSubmit: (values) => {
      const loc = values.location as MapLocation | null;
      alert(
        loc
          ? `Submitted!\nAddress: ${loc.displayName ?? "—"}\nLat: ${loc.lat.toFixed(5)}, Lng: ${loc.lng.toFixed(5)}`
          : "No location selected.",
      );
    },
    submitLabel: "Confirm Address",
  });

  return (
    <div class="space-y-4">
      {/* Leaflet / OSM */}
      <Card>
        <CardHeader>
          <CardTitle>MapLocationSearch — Leaflet (OSM)</CardTitle>
          <CardDescription>
            Nominatim geocoding, no API key required. Country restricted via{" "}
            <code class="rounded bg-muted px-1 text-xs">MapConfigProvider</code> in{" "}
            <code class="rounded bg-muted px-1 text-xs">main.tsx</code>.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <MapLocationSearch
            provider={{ type: "leaflet" }}
            height="300px"
            center={DHAKA}
            zoom={12}
            value={leafletLocation()}
            onLocationChange={setLeafletLocation}
            showClear
          />
          <LocationOutput location={leafletLocation()} />
        </CardContent>
      </Card>

      {/* Google Maps */}
      <Show
        when={GOOGLE_API_KEY}
        fallback={
          <Card class="border-dashed">
            <CardContent class="py-8 text-center text-sm text-muted-foreground">
              Set <code class="rounded bg-muted px-1 text-xs">VITE_APP_GOOGLE_MAP_API_KEY</code> in{" "}
              <code class="rounded bg-muted px-1 text-xs">.env</code> to enable the Google Maps
              demo.
            </CardContent>
          </Card>
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>MapLocationSearch — Google Maps</CardTitle>
            <CardDescription>
              Google Places autocomplete + Geocoding API. Supports{" "}
              <code class="rounded bg-muted px-1 text-xs">componentRestrictions</code> from{" "}
              <code class="rounded bg-muted px-1 text-xs">MapConfigProvider</code>.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <MapLocationSearch
              provider={{ type: "google", apiKey: GOOGLE_API_KEY! }}
              height="300px"
              center={DHAKA}
              zoom={12}
              value={googleLocation()}
              onLocationChange={setGoogleLocation}
              showClear
            />
            <LocationOutput location={googleLocation()} />
          </CardContent>
        </Card>
      </Show>

      {/* Inside createForm */}
      <Card>
        <CardHeader>
          <CardTitle>Map inside createForm()</CardTitle>
          <CardDescription>
            Use <code class="rounded bg-muted px-1 text-xs">type: "map"</code> in the field config.
            Pass provider, height, and other options via{" "}
            <code class="rounded bg-muted px-1 text-xs">mapConfig</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.Form />
        </CardContent>
      </Card>
    </div>
  );
}
