export type MapBuildMode = "none" | "leaflet" | "google" | "both";

const rawBuildMode = __CMS_MAP_BUILD_MODE__;

export const MAP_BUILD_MODE: MapBuildMode =
  rawBuildMode === "none" ||
  rawBuildMode === "leaflet" ||
  rawBuildMode === "google" ||
  rawBuildMode === "both"
    ? rawBuildMode
    : "both";

export const MAP_BUILD_FLAGS = {
  none: MAP_BUILD_MODE === "none",
  leaflet: MAP_BUILD_MODE === "leaflet" || MAP_BUILD_MODE === "both",
  google: MAP_BUILD_MODE === "google" || MAP_BUILD_MODE === "both",
} as const;
