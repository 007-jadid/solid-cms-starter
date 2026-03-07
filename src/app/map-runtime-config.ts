import type { MapConfig } from "~/features/ui/components/map";

const enabledProviders: NonNullable<MapConfig["enabledProviders"]> = [];

export const MAP_RUNTIME_CONFIG: MapConfig = {
  countryCode: "BD",
  enabledProviders,
};
