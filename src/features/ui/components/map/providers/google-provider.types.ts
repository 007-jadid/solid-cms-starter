import type { DrawMode, DrawnShape } from "../types";

export interface GoogleMarkerController {
  placeOrMoveMarker: (lat: number, lng: number) => void;
  clearMarker: () => void;
}

export interface GoogleDrawActions {
  clearDrawnShapes: () => void;
  removeShapeById: (id: string) => void;
  deleteSelectedShape: () => void;
  enterPanMode: () => void;
  selectDrawMode: (mode: DrawMode) => void;
}

export interface GoogleTerraRuntimeState {
  isReady: () => boolean;
  isTerraSelectModeActive: () => boolean;
  isTerraDrawingModeActive: () => boolean;
  setReady: (ready: boolean) => void;
  setPendingDrawMode: (mode: DrawMode | null) => void;
  getPendingDrawMode: () => DrawMode | null;
  getAllShapes: () => DrawnShape[];
}

export interface GoogleTerraResettableState {
  reset: () => void;
}
