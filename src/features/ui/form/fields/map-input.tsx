import { createUniqueId, Show } from "solid-js";
import type { MapLocation } from "~/features/ui/components/map";
import { MapLocationSearch } from "~/features/ui/components/map";
import type { FieldConfig } from "../types";

export function MapInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: MapLocation | null;
  onChange: (value: MapLocation | null) => void;
  error?: string;
  disabled?: boolean;
}) {
  const mapConfig = () => props.field.mapConfig ?? {};
  const inputId = `form-map-search-${createUniqueId()}`;

  return (
    <div class="space-y-1.5">
      <label
        for={inputId}
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {props.field.label}
        <Show when={props.field.required}>
          <span class="ml-1 text-destructive">*</span>
        </Show>
      </label>

      <Show when={props.field.description}>
        <p class="text-[0.8rem] text-muted-foreground">{props.field.description}</p>
      </Show>

      <div
        class={
          props.error
            ? "rounded-md ring-1 ring-destructive"
            : props.disabled
              ? "pointer-events-none opacity-50"
              : undefined
        }
      >
        <MapLocationSearch
          inputId={inputId}
          provider={mapConfig().provider ?? { type: "leaflet" }}
          value={props.value}
          onLocationChange={props.onChange}
          height={mapConfig().height ?? "360px"}
          center={mapConfig().defaultCenter}
          zoom={mapConfig().defaultZoom}
          draggableMarker={mapConfig().draggableMarker !== false}
          showClear
          searchPlaceholder={
            mapConfig().searchPlaceholder ?? props.field.placeholder ?? "Search for a location…"
          }
        />
      </div>

      <Show when={props.error}>
        <p class="text-[0.8rem] text-destructive">{props.error}</p>
      </Show>
    </div>
  );
}
