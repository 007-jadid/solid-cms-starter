import { TerraDraw } from "terra-draw";
import { TerraDrawGoogleMapsAdapter } from "terra-draw-google-maps-adapter";
import type { DrawMode, DrawnShape } from "../types";
import { createApplyGoogleDrawMode } from "./google-provider-draw-apply";
import { registerGoogleTerraDrawEvents } from "./google-provider-draw-events";
import { buildGoogleTerraModes } from "./google-provider-draw-modes";

export const GOOGLE_TERRA_MODE_MAP: Record<DrawMode, string> = {
  marker: "marker",
  polyline: "linestring",
  polygon: "polygon",
  rectangle: "rectangle",
  circle: "circle",
};

export function createGoogleTerraModes(drawingTools: DrawMode[]) {
  return buildGoogleTerraModes(drawingTools);
}

interface CreateGoogleApplyDrawModeParams {
  getTerraDraw: () => TerraDraw | null;
  isTerraReady: () => boolean;
  setPendingDrawMode: (mode: DrawMode | null) => void;
  setActiveDrawMode: (mode: DrawMode | null) => void;
  enabledModes: Set<string>;
}

export function createGoogleApplyDrawMode(params: CreateGoogleApplyDrawModeParams) {
  return createApplyGoogleDrawMode({
    ...params,
    toTerraMode: (mode) => GOOGLE_TERRA_MODE_MAP[mode],
  });
}

interface InitGoogleTerraOnProjectionParams {
  mapInstance: google.maps.Map;
  hasTerraDraw: () => boolean;
  initTerraDraw: () => void;
}

export function initGoogleTerraOnProjectionReady(params: InitGoogleTerraOnProjectionParams) {
  const guardedInit = () => {
    if (params.hasTerraDraw()) return;
    params.initTerraDraw();
  };

  if (params.mapInstance.getProjection()) {
    guardedInit();
    return;
  }

  google.maps.event.addListenerOnce(params.mapInstance, "projection_changed", () => {
    guardedInit();
  });
}

interface StartGoogleTerraDrawParams {
  mapInstance: google.maps.Map;
  modes: ConstructorParameters<typeof TerraDraw>[0]["modes"];
  initialShapes?: DrawnShape[];
  getAllShapes: () => DrawnShape[];
  applyDrawMode: (mode: DrawMode | null) => void;
  getPendingDrawMode: () => DrawMode | null;
  setTerraDrawReady: (ready: boolean) => void;
  getSelectedShapeId: () => string | null;
  setSelectedShapeId: (id: string | null) => void;
  setActiveDrawMode: (mode: DrawMode | null) => void;
  onShapeDrawn?: (shape: DrawnShape) => void;
  onShapesChange?: (shapes: DrawnShape[]) => void;
}

export function startGoogleTerraDraw(params: StartGoogleTerraDrawParams) {
  const terraDraw = new TerraDraw({
    adapter: new TerraDrawGoogleMapsAdapter({
      map: params.mapInstance,
      lib: google.maps,
      coordinatePrecision: 9,
    }),
    modes: params.modes,
  });

  terraDraw.start();

  registerGoogleTerraDrawEvents(terraDraw, params);

  return terraDraw;
}
