import { createContext, type ParentProps, useContext } from "solid-js";

export type RuntimeMapProvider = "leaflet" | "google";

export interface MapConfig {
  /**
   * ISO 3166-1 alpha-2 country code to restrict geocoding and search results.
   * e.g. "BD" (Bangladesh), "US" (United States), "GB" (United Kingdom)
   *
   * - Leaflet/Nominatim: adds `countrycodes=XX` to search queries
   * - Google Maps: adds `componentRestrictions: { country: "XX" }` to Places autocomplete
   */
  countryCode?: string;
  /**
   * Runtime provider allowlist.
   * - ["leaflet"] => only OpenStreet/Leaflet maps render
   * - ["google"] => only Google maps render
   * - ["leaflet", "google"] => both providers render
   * - [] => no map provider renders at runtime
   */
  enabledProviders?: readonly RuntimeMapProvider[];
}

const MapConfigContext = createContext<MapConfig>({});

/**
 * Provide global map configuration to all `<Map>` and `<MapLocationSearch>`
 * descendants. Place once near your app root.
 *
 * @example
 * // Restrict all map searches to Bangladesh
 * <MapConfigProvider config={{ countryCode: "BD" }}>
 *   <App />
 * </MapConfigProvider>
 */
export function MapConfigProvider(props: ParentProps<{ config?: MapConfig }>) {
  return (
    <MapConfigContext.Provider value={props.config ?? {}}>
      {props.children}
    </MapConfigContext.Provider>
  );
}

/** Read the nearest MapConfigProvider config. Returns `{}` if none is mounted. */
export function useMapConfig(): MapConfig {
  return useContext(MapConfigContext);
}
