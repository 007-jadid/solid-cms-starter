// =====================================================================
// Map Component Types
// Plugin-based architecture: supports Leaflet (OSM) and Google Maps
// =====================================================================

/** A geographic location with optional address metadata */
export interface MapLocation {
  lat: number;
  lng: number;
  zoom?: number;
  address?: string;
  displayName?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  /** Google Places ID (only when using Google provider) */
  placeId?: string;
}

// =====================================================================
// Provider Configs (discriminated union)
// =====================================================================

export interface LeafletProviderConfig {
  type: "leaflet";
  /** Custom tile server URL. Default: OpenStreetMap */
  tileUrl?: string;
  /** Custom tile attribution. Default: OSM attribution */
  tileAttribution?: string;
  /** Override Nominatim geocoding base URL. Default: https://nominatim.openstreetmap.org */
  nominatimUrl?: string;
}

export interface GoogleProviderConfig {
  type: "google";
  /** Google Maps API key (required) */
  apiKey: string;
  /** Google Maps Map ID for custom map styles */
  mapId?: string;
}

export type MapProviderConfig = LeafletProviderConfig | GoogleProviderConfig;

// =====================================================================
// Autocomplete search suggestions
// =====================================================================

export interface SearchSuggestion {
  id: string;
  /** Primary display text (e.g. place name) */
  label: string;
  /** Secondary display text (e.g. city, country) */
  sublabel?: string;
  lat: number;
  lng: number;
  displayName?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  /** Google Places ID (Google provider only) */
  placeId?: string;
}

// =====================================================================
// Drawing types
// =====================================================================

export type DrawMode = "marker" | "polyline" | "polygon" | "rectangle" | "circle";

export type DrawnShapeData =
  | { type: "marker"; lat: number; lng: number }
  | { type: "polyline"; points: { lat: number; lng: number }[] }
  | { type: "polygon"; points: { lat: number; lng: number }[] }
  | {
      type: "rectangle";
      north: number;
      south: number;
      east: number;
      west: number;
    }
  | { type: "circle"; center: { lat: number; lng: number }; radius: number };

export interface DrawnShape {
  id: string;
  data: DrawnShapeData;
}

// =====================================================================
// Imperative map control API (exposed via onReady callback)
// =====================================================================

export interface MapControlRef {
  /** Pan & zoom the map to given coordinates */
  setCenter: (lat: number, lng: number, zoom?: number) => void;
  /** Add or move the single marker. Pass null to remove it */
  setMarker: (location: MapLocation | null) => void;
  /** Get the current map center and zoom */
  getCenter: () => { lat: number; lng: number; zoom: number };
  /** Search for location suggestions (provider-specific geocoding) */
  search: (query: string) => Promise<SearchSuggestion[]>;
  /** Resolve a suggestion to a full MapLocation with lat/lng */
  geocodeSelection: (suggestion: SearchSuggestion) => Promise<MapLocation | null>;

  // ── Drawing ────────────────────────────────────────────────────────
  /** Activate a drawing mode. Pass null to return to pan mode */
  setDrawMode: (mode: DrawMode | null) => void;
  /** Get all currently drawn shapes */
  getDrawnShapes: () => DrawnShape[];
  /** Remove all drawn shapes from the map */
  clearDrawnShapes: () => void;
  /** Remove a single shape by its id */
  removeShape: (id: string) => void;
}

// =====================================================================
// Core Map component props
// =====================================================================

export interface MapProps {
  provider: MapProviderConfig;
  class?: string;
  /** CSS height string. Default: "400px" */
  height?: string;
  /** Initial map center [lat, lng]. Default: [23.8103, 90.4125] (Dhaka) */
  center?: [number, number];
  /** Initial zoom level. Default: 13 */
  zoom?: number;
  /** Single location marker */
  marker?: MapLocation | null;
  /** Called when the marker position changes (click or drag) */
  onMarkerChange?: (location: MapLocation) => void;
  /** Whether the marker can be dragged. Default: true */
  draggableMarker?: boolean;
  /** Whether the map is pannable/zoomable. Default: true */
  interactive?: boolean;
  /** Show zoom control. Default: true */
  showZoomControl?: boolean;
  /** Show scale control. Default: true */
  showScaleControl?: boolean;
  /** Called with an imperative ref when the provider is ready */
  onReady?: (ref: MapControlRef) => void;

  // ── Drawing ────────────────────────────────────────────────────────
  /** Drawing tools to show in the toolbar. Omit or pass [] to disable drawing */
  drawingTools?: DrawMode[];
  /** Pre-load shapes onto the map */
  initialShapes?: DrawnShape[];
  /** Called when a new shape is finished */
  onShapeDrawn?: (shape: DrawnShape) => void;
  /** Called when any shape is added, edited, or removed */
  onShapesChange?: (shapes: DrawnShape[]) => void;
}

// =====================================================================
// MapLocationSearch component props
// =====================================================================

export interface MapLocationSearchProps extends Omit<MapProps, "onReady"> {
  /** Called when the selected location changes */
  onLocationChange?: (location: MapLocation | null) => void;
  /** Current selected location value */
  value?: MapLocation | null;
  /** Optional id for the underlying search input (for external label association) */
  inputId?: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Whether to show a "Clear" button when a location is selected */
  showClear?: boolean;
  /** Debounce delay in ms for search input. Default: 300 */
  debounceMs?: number;
}
