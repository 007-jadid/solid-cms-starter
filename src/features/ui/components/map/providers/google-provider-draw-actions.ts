import type { Accessor } from "solid-js";
import type { TerraDraw } from "terra-draw";
import type { DrawMode, DrawnShape, MapProps } from "../types";
import { createGoogleDrawActions } from "./google-provider-control";

const GOOGLE_TERRA_MODE_MAP: Record<DrawMode, string> = {
  marker: "marker",
  polyline: "linestring",
  polygon: "polygon",
  rectangle: "rectangle",
  circle: "circle",
};

interface CreateGoogleDrawActionsFactoryParams {
  getTerraDraw: () => TerraDraw | null;
  getAllShapes: () => DrawnShape[];
  getSelectedShapeId: Accessor<string | null>;
  setSelectedShapeId: (id: string | null) => void;
  setActiveDrawMode: (mode: DrawMode | null) => void;
  onShapesChange?: MapProps["onShapesChange"];
}

export function createGoogleDrawActionsFactory(params: CreateGoogleDrawActionsFactoryParams) {
  return () =>
    createGoogleDrawActions({
      getTerraDraw: params.getTerraDraw,
      getAllShapes: params.getAllShapes,
      getSelectedShapeId: params.getSelectedShapeId,
      setSelectedShapeId: params.setSelectedShapeId,
      setActiveDrawMode: params.setActiveDrawMode,
      toTerraMode: (mode) => GOOGLE_TERRA_MODE_MAP[mode],
      onShapesChange: params.onShapesChange,
    });
}
