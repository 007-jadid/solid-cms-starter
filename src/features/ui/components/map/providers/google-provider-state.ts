import type { TerraDraw } from "terra-draw";
import type { DrawMode, DrawnShape } from "../types";
import { snapshotToDrawnShapes, type TerraFeature } from "./google-provider-shapes";

interface TerraStateData {
  ready: boolean;
  pendingDrawMode: DrawMode | null;
}

export function createGoogleTerraState(getTerraDraw: () => TerraDraw | null) {
  const state: TerraStateData = {
    ready: false,
    pendingDrawMode: null,
  };

  const getAllShapes = (): DrawnShape[] => {
    const terraDraw = getTerraDraw();
    if (!terraDraw) return [];
    const snapshot = terraDraw.getSnapshot() as unknown as TerraFeature[];
    return snapshotToDrawnShapes(snapshot);
  };

  const isTerraDrawingModeActive = () => {
    const terraDraw = getTerraDraw();
    if (!terraDraw) return false;
    if (!state.ready) return state.pendingDrawMode !== null;
    const mode = terraDraw.getMode();
    return mode !== "select" && mode !== "static";
  };

  const isTerraSelectModeActive = () => {
    const terraDraw = getTerraDraw();
    if (!terraDraw || !state.ready) return false;
    return terraDraw.getMode() === "select";
  };

  return {
    state,
    getAllShapes,
    isTerraDrawingModeActive,
    isTerraSelectModeActive,
    isReady: () => state.ready,
    setReady: (ready: boolean) => {
      state.ready = ready;
    },
    setPendingDrawMode: (mode: DrawMode | null) => {
      state.pendingDrawMode = mode;
    },
    getPendingDrawMode: () => state.pendingDrawMode,
    reset: () => {
      state.ready = false;
      state.pendingDrawMode = null;
    },
  };
}
