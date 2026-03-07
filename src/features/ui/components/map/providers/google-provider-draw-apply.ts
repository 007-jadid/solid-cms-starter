import type { TerraDraw } from "terra-draw";
import type { DrawMode } from "../types";

interface CreateApplyGoogleDrawModeParams {
  getTerraDraw: () => TerraDraw | null;
  isTerraReady: () => boolean;
  setPendingDrawMode: (mode: DrawMode | null) => void;
  setActiveDrawMode: (mode: DrawMode | null) => void;
  enabledModes: Set<string>;
  toTerraMode: (mode: DrawMode) => string;
}

export function createApplyGoogleDrawMode(params: CreateApplyGoogleDrawModeParams) {
  return (mode: DrawMode | null) => {
    const terraDraw = params.getTerraDraw();
    if (!terraDraw) return;

    if (!params.isTerraReady()) {
      params.setPendingDrawMode(mode);
      params.setActiveDrawMode(mode);
      return;
    }

    if (!mode) {
      params.setPendingDrawMode(null);
      terraDraw.setMode("select");
      params.setActiveDrawMode(null);
      return;
    }

    const terraMode = params.toTerraMode(mode);
    if (params.enabledModes.has(terraMode)) {
      params.setPendingDrawMode(null);
      terraDraw.setMode(terraMode);
      params.setActiveDrawMode(mode);
    }
  };
}
