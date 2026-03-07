import { createEffect, on, onCleanup, onMount } from "solid-js";
import "leaflet/dist/leaflet.css";
import { useMapConfig } from "../map-config";
import type {
  DrawMode,
  DrawnShape,
  LeafletProviderConfig,
  MapControlRef,
  MapLocation,
  MapProps,
  SearchSuggestion,
} from "../types";

// Minimal Geoman types (avoids importing the full augmentation at module level)
interface LeafletPM {
  addControls(options: Record<string, unknown>): void;
  enableDraw(shape: string): void;
  disableDraw(): void;
}
interface PMCreateEvent {
  layer: import("leaflet").Layer;
  shape: string;
}
interface PMRemoveEvent {
  layer: import("leaflet").Layer;
}

// =====================================================================
// Nominatim (OSM) geocoding helpers
// =====================================================================

interface NominatimItem {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    postcode?: string;
  };
}

async function nominatimSearch(
  query: string,
  baseUrl: string,
  countryCode?: string,
): Promise<SearchSuggestion[]> {
  try {
    const cc = countryCode ? `&countrycodes=${countryCode.toLowerCase()}` : "";
    const url = `${baseUrl}/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1${cc}`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    if (!res.ok) return [];
    const data: NominatimItem[] = await res.json();
    return data.map((item) => {
      const parts = item.display_name.split(",");
      return {
        id: String(item.place_id),
        label: parts[0].trim(),
        sublabel: parts.slice(1, 3).join(",").trim(),
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
        city: item.address?.city || item.address?.town || item.address?.village,
        country: item.address?.country,
        postalCode: item.address?.postcode,
      };
    });
  } catch {
    return [];
  }
}

async function nominatimReverse(
  lat: number,
  lng: number,
  baseUrl: string,
): Promise<Partial<MapLocation>> {
  try {
    const url = `${baseUrl}/reverse?lat=${lat}&lon=${lng}&format=json`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    if (!res.ok) return {};
    const data = await res.json();
    return {
      address: data.display_name,
      displayName: data.display_name,
      city: data.address?.city || data.address?.town || data.address?.village,
      country: data.address?.country,
      postalCode: data.address?.postcode,
    };
  } catch {
    return {};
  }
}

// =====================================================================
// Custom SVG pin icon (avoids Vite/Leaflet default icon path issues)
// =====================================================================

function buildSvgIcon(L: typeof import("leaflet")) {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40" width="28" height="40">
      <path
        fill="hsl(var(--primary, 220 90% 50%))"
        stroke="white"
        stroke-width="1.5"
        d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 26 14 26S28 23.333 28 14C28 6.268 21.732 0 14 0z"
      />
      <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
    </svg>`,
    className: "cms-map-marker",
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -42],
  });
}

// =====================================================================
// Drawing helpers
// =====================================================================

/** Convert a Leaflet layer + Geoman shape name → DrawnShape */
function leafletLayerToShape(
  layer: import("leaflet").Layer,
  geomanShape: string,
  existingId?: string,
): DrawnShape | null {
  const id = existingId ?? crypto.randomUUID();

  if (geomanShape === "Marker") {
    const ll = (layer as import("leaflet").Marker).getLatLng();
    return { id, data: { type: "marker", lat: ll.lat, lng: ll.lng } };
  }
  if (geomanShape === "Line") {
    const lls = (layer as import("leaflet").Polyline).getLatLngs() as import("leaflet").LatLng[];
    return { id, data: { type: "polyline", points: lls.map((l) => ({ lat: l.lat, lng: l.lng })) } };
  }
  if (geomanShape === "Polygon") {
    const outer = (
      layer as import("leaflet").Polygon
    ).getLatLngs()[0] as import("leaflet").LatLng[];
    return {
      id,
      data: { type: "polygon", points: outer.map((l) => ({ lat: l.lat, lng: l.lng })) },
    };
  }
  if (geomanShape === "Rectangle") {
    const bounds = (layer as import("leaflet").Rectangle).getBounds();
    return {
      id,
      data: {
        type: "rectangle",
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      },
    };
  }
  if (geomanShape === "Circle") {
    const c = layer as import("leaflet").Circle;
    const center = c.getLatLng();
    return {
      id,
      data: { type: "circle", center: { lat: center.lat, lng: center.lng }, radius: c.getRadius() },
    };
  }
  return null;
}

/** Restore a DrawnShape onto the map as a Leaflet layer */
function restoreLeafletShape(
  map: import("leaflet").Map,
  L: typeof import("leaflet"),
  shape: DrawnShape,
  store: Map<string, { layer: import("leaflet").Layer; geomanShape: string; shape: DrawnShape }>,
) {
  const d = shape.data;
  let layer: import("leaflet").Layer | null = null;
  let geomanShape = "";

  if (d.type === "marker") {
    geomanShape = "Marker";
    layer = L.marker([d.lat, d.lng], { draggable: true });
  } else if (d.type === "polyline") {
    geomanShape = "Line";
    layer = L.polyline(d.points.map((p) => [p.lat, p.lng] as [number, number]));
  } else if (d.type === "polygon") {
    geomanShape = "Polygon";
    layer = L.polygon(d.points.map((p) => [p.lat, p.lng] as [number, number]));
  } else if (d.type === "rectangle") {
    geomanShape = "Rectangle";
    layer = L.rectangle([
      [d.south, d.west],
      [d.north, d.east],
    ] as [[number, number], [number, number]]);
  } else if (d.type === "circle") {
    geomanShape = "Circle";
    layer = L.circle([d.center.lat, d.center.lng], { radius: d.radius });
  }

  if (layer) {
    layer.addTo(map);
    store.set(shape.id, { layer, geomanShape, shape });
  }
}

// =====================================================================
// LeafletProvider Component
// =====================================================================

export function LeafletProvider(props: MapProps) {
  const mapConfig = useMapConfig();

  let containerRef!: HTMLDivElement;
  let mapInstance: import("leaflet").Map | null = null;
  let markerInstance: import("leaflet").Marker | null = null;
  let L: typeof import("leaflet") | null = null;

  // drawn shapes: id → { layer, geomanShape name, shape data }
  const drawnLayers = new Map<
    string,
    { layer: import("leaflet").Layer; geomanShape: string; shape: DrawnShape }
  >();

  const getAllShapes = (): DrawnShape[] => [...drawnLayers.values()].map((v) => v.shape);

  const nominatimUrl = () =>
    (props.provider as LeafletProviderConfig).nominatimUrl || "https://nominatim.openstreetmap.org";

  const attachMarkerDragHandler = (marker: import("leaflet").Marker) => {
    marker.on("dragend", async () => {
      if (!mapInstance) return;
      const pos = marker.getLatLng();
      const geo = await nominatimReverse(pos.lat, pos.lng, nominatimUrl());
      props.onMarkerChange?.({
        lat: pos.lat,
        lng: pos.lng,
        zoom: mapInstance.getZoom(),
        ...geo,
      });
    });
  };

  onMount(async () => {
    L = (await import("leaflet")).default;

    // ── Geoman must be imported BEFORE map creation ───────────────────
    // Geoman uses L.Map.addInitHook — the hook only fires for maps
    // created after the import, so this MUST come before L.map().
    if (props.drawingTools?.length) {
      await import("@geoman-io/leaflet-geoman-free");
      await import("@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css");
    }

    const config = props.provider as LeafletProviderConfig;
    const defaultCenter: [number, number] = props.center ?? [23.8103, 90.4125];
    const defaultZoom = props.zoom ?? 13;

    // ── Create map ──────────────────────────────────────────────────
    mapInstance = L.map(containerRef, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: props.showZoomControl !== false,
      dragging: props.interactive !== false,
      scrollWheelZoom: props.interactive !== false,
      doubleClickZoom: props.interactive !== false,
      touchZoom: props.interactive !== false,
      keyboard: props.interactive !== false,
    });

    // ── Tile layer ───────────────────────────────────────────────────
    L.tileLayer(config.tileUrl || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        config.tileAttribution ||
        '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxZoom: 20,
    }).addTo(mapInstance);

    // ── Scale control ────────────────────────────────────────────────
    if (props.showScaleControl !== false) {
      L.control.scale({ imperial: false }).addTo(mapInstance!);
    }

    // ── Initial marker ───────────────────────────────────────────────
    if (props.marker) {
      const icon = buildSvgIcon(L);
      markerInstance = L.marker([props.marker.lat, props.marker.lng], {
        draggable: props.draggableMarker !== false,
        icon,
      }).addTo(mapInstance);
      attachMarkerDragHandler(markerInstance);
    }

    // ── Click to place / move marker ─────────────────────────────────
    mapInstance.on("click", async (e) => {
      if (!props.onMarkerChange || !L || !mapInstance) return;
      const { lat, lng } = e.latlng;

      if (markerInstance) {
        markerInstance.setLatLng([lat, lng]);
      } else {
        const icon = buildSvgIcon(L);
        markerInstance = L.marker([lat, lng], {
          draggable: props.draggableMarker !== false,
          icon,
        }).addTo(mapInstance);
        attachMarkerDragHandler(markerInstance);
      }

      const geo = await nominatimReverse(lat, lng, nominatimUrl());
      props.onMarkerChange?.({
        lat,
        lng,
        zoom: mapInstance.getZoom(),
        ...geo,
      });
    });

    // ── Drawing (Geoman) ─────────────────────────────────────────────
    if (props.drawingTools?.length) {
      const pm = (mapInstance as unknown as { pm: LeafletPM }).pm;
      const tools = props.drawingTools;

      pm.addControls({
        position: "topleft",
        drawMarker: tools.includes("marker"),
        drawPolyline: tools.includes("polyline"),
        drawPolygon: tools.includes("polygon"),
        drawRectangle: tools.includes("rectangle"),
        drawCircle: tools.includes("circle"),
        drawCircleMarker: false,
        editMode: true,
        dragMode: true,
        removalMode: true,
        cutPolygon: false,
        rotateMode: false,
      });

      // Restore initial shapes
      for (const s of props.initialShapes ?? []) {
        restoreLeafletShape(mapInstance!, L!, s, drawnLayers);
      }

      // New shape drawn
      mapInstance.on("pm:create", (e) => {
        const { layer, shape: geomanShape } = e as unknown as PMCreateEvent;
        const drawnShape = leafletLayerToShape(layer, geomanShape);
        if (!drawnShape) return;
        drawnLayers.set(drawnShape.id, { layer, geomanShape, shape: drawnShape });

        // Edit updates
        layer.on("pm:edit", () => {
          const updated = leafletLayerToShape(layer, geomanShape, drawnShape.id);
          if (!updated) return;
          drawnLayers.set(drawnShape.id, { layer, geomanShape, shape: updated });
          props.onShapesChange?.(getAllShapes());
        });

        // Drag updates (marker / circle center)
        layer.on("pm:dragend", () => {
          const updated = leafletLayerToShape(layer, geomanShape, drawnShape.id);
          if (!updated) return;
          drawnLayers.set(drawnShape.id, { layer, geomanShape, shape: updated });
          props.onShapesChange?.(getAllShapes());
        });

        props.onShapeDrawn?.(drawnShape);
        props.onShapesChange?.(getAllShapes());
      });

      // Shape removed via Geoman toolbar
      mapInstance.on("pm:remove", (e) => {
        const { layer: removedLayer } = e as unknown as PMRemoveEvent;
        for (const [id, entry] of drawnLayers.entries()) {
          if (entry.layer === removedLayer) {
            drawnLayers.delete(id);
            break;
          }
        }
        props.onShapesChange?.(getAllShapes());
      });
    }

    // ── Expose imperative API ─────────────────────────────────────────
    const controlRef: MapControlRef = {
      setCenter(lat, lng, zoom) {
        mapInstance?.setView([lat, lng], zoom ?? mapInstance.getZoom(), {
          animate: true,
        });
      },
      setMarker(location) {
        if (!L || !mapInstance) return;
        if (!location) {
          markerInstance?.remove();
          markerInstance = null;
          return;
        }
        if (markerInstance) {
          markerInstance.setLatLng([location.lat, location.lng]);
        } else {
          const icon = buildSvgIcon(L);
          markerInstance = L.marker([location.lat, location.lng], {
            draggable: props.draggableMarker !== false,
            icon,
          }).addTo(mapInstance);
          attachMarkerDragHandler(markerInstance);
        }
      },
      getCenter() {
        const c = mapInstance?.getCenter() ?? { lat: 0, lng: 0 };
        return { lat: c.lat, lng: c.lng, zoom: mapInstance?.getZoom() ?? 0 };
      },
      async search(query) {
        return nominatimSearch(query, nominatimUrl(), mapConfig.countryCode);
      },
      async geocodeSelection(suggestion) {
        return {
          lat: suggestion.lat,
          lng: suggestion.lng,
          displayName: suggestion.displayName,
          address: suggestion.displayName,
          city: suggestion.city,
          country: suggestion.country,
          postalCode: suggestion.postalCode,
        };
      },

      // ── Drawing methods ──────────────────────────────────────────
      setDrawMode(mode) {
        if (!mapInstance) return;
        const pm = (mapInstance as unknown as { pm: LeafletPM }).pm;
        if (!mode) {
          pm.disableDraw();
          return;
        }
        const modeMap: Record<DrawMode, string> = {
          marker: "Marker",
          polyline: "Line",
          polygon: "Polygon",
          rectangle: "Rectangle",
          circle: "Circle",
        };
        pm.enableDraw(modeMap[mode]);
      },
      getDrawnShapes: getAllShapes,
      clearDrawnShapes() {
        for (const { layer } of drawnLayers.values()) {
          (layer as import("leaflet").Layer).remove();
        }
        drawnLayers.clear();
        props.onShapesChange?.([]);
      },
      removeShape(id) {
        const entry = drawnLayers.get(id);
        if (!entry) return;
        (entry.layer as import("leaflet").Layer).remove();
        drawnLayers.delete(id);
        props.onShapesChange?.(getAllShapes());
      },
    };

    props.onReady?.(controlRef);
  });

  // ── Sync external marker prop changes ────────────────────────────────
  createEffect(
    on(
      () => props.marker,
      (marker) => {
        if (!L || !mapInstance) return;
        if (!marker) {
          markerInstance?.remove();
          markerInstance = null;
          return;
        }
        if (markerInstance) {
          markerInstance.setLatLng([marker.lat, marker.lng]);
        } else {
          const icon = buildSvgIcon(L);
          markerInstance = L.marker([marker.lat, marker.lng], {
            draggable: props.draggableMarker !== false,
            icon,
          }).addTo(mapInstance);
          attachMarkerDragHandler(markerInstance);
        }
      },
      { defer: true },
    ),
  );

  onCleanup(() => {
    markerInstance?.remove();
    mapInstance?.remove();
    mapInstance = null;
    markerInstance = null;
  });

  return (
    <div
      ref={containerRef}
      class={props.class}
      style={{ height: props.height ?? "400px", width: "100%" }}
    />
  );
}
