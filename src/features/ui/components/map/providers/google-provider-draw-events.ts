import type { TerraDraw } from "terra-draw";
import type { DrawMode, DrawnShape } from "../types";
import { drawnShapeToFeature } from "./google-provider-shapes";

interface RegisterGoogleTerraDrawEventsParams {
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

export function registerGoogleTerraDrawEvents(
  terraDraw: TerraDraw,
  params: RegisterGoogleTerraDrawEventsParams,
) {
  terraDraw.on("ready", () => {
    params.setTerraDrawReady(true);
    terraDraw.setMode("select");
    params.setActiveDrawMode(null);

    if (params.initialShapes?.length) {
      const features = params.initialShapes.map((shape) => drawnShapeToFeature(shape));
      terraDraw.addFeatures(features as never[]);
    }

    const pending = params.getPendingDrawMode();
    if (pending !== null) {
      params.applyDrawMode(pending);
    }
  });

  terraDraw.on("change", () => {
    const currentSelected = params.getSelectedShapeId();
    if (currentSelected && !terraDraw.hasFeature(currentSelected)) {
      params.setSelectedShapeId(null);
      params.setActiveDrawMode(null);
    }
    params.onShapesChange?.(params.getAllShapes());
  });

  terraDraw.on("select", (id) => {
    const selectedId = String(id);
    params.setSelectedShapeId(selectedId);
    const selectedShape = params.getAllShapes().find((item) => item.id === selectedId);
    if (selectedShape) {
      params.setActiveDrawMode(selectedShape.data.type);
    }
  });

  terraDraw.on("deselect", (id) => {
    if (params.getSelectedShapeId() === String(id)) {
      params.setSelectedShapeId(null);
      params.setActiveDrawMode(null);
    }
  });

  terraDraw.on("finish", (id) => {
    const featureId = String(id);
    const shape = params.getAllShapes().find((item) => item.id === featureId);
    if (shape) params.onShapeDrawn?.(shape);

    if (terraDraw.hasFeature(featureId)) {
      terraDraw.setMode("select");
      terraDraw.selectFeature(featureId);
      if (shape) {
        params.setActiveDrawMode(shape.data.type);
      }
      params.setSelectedShapeId(featureId);
    }
  });
}
