import type { Accessor } from "solid-js";
import type { TerraDraw } from "terra-draw";
import type { DrawMode } from "../types";
import type { GoogleMarkerController, GoogleTerraResettableState } from "./google-provider.types";

interface ResetGoogleProviderStateParams {
  terraState: GoogleTerraResettableState;
  getTerraDraw: Accessor<TerraDraw | null>;
  setTerraDraw: (value: TerraDraw | null) => void;
  setActiveDrawMode: (value: DrawMode | null) => void;
  setSelectedShapeId: (value: string | null) => void;
  markerController: Pick<GoogleMarkerController, "clearMarker">;
  setMapInstance: (value: google.maps.Map | null) => void;
}

export function resetGoogleProviderState(params: ResetGoogleProviderStateParams) {
  params.terraState.reset();
  params.getTerraDraw()?.stop();
  params.setTerraDraw(null);
  params.setActiveDrawMode(null);
  params.setSelectedShapeId(null);
  params.markerController.clearMarker();
  params.setMapInstance(null);
}
