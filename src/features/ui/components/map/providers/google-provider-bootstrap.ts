/// <reference types="@types/google.maps" />
import type { TerraDraw } from "terra-draw";
import type { DrawMode, DrawnShape, MapControlRef, MapProps } from "../types";
import type { GoogleDrawActions, GoogleMarkerController } from "./google-provider.types";
import { createGoogleMapControlRef } from "./google-provider-control";

interface CreateGoogleMapInstanceParams {
  containerRef: HTMLDivElement;
  props: MapProps;
  mapId?: string;
  markerController: GoogleMarkerController;
  onMapClick: (e: google.maps.MapMouseEvent) => void | Promise<void>;
  setMapInstance: (map: google.maps.Map) => void;
}

export function createGoogleMapInstance(params: CreateGoogleMapInstanceParams) {
  const defaultCenter = params.props.center
    ? { lat: params.props.center[0], lng: params.props.center[1] }
    : { lat: 23.8103, lng: 90.4125 };

  const mapInstance = new google.maps.Map(params.containerRef, {
    center: defaultCenter,
    zoom: params.props.zoom ?? 13,
    mapId: params.mapId,
    disableDefaultUI: false,
    zoomControl: params.props.showZoomControl !== false,
    scaleControl: params.props.showScaleControl !== false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    gestureHandling: params.props.interactive !== false ? "auto" : "none",
  });

  params.setMapInstance(mapInstance);

  if (params.props.marker) {
    params.markerController.placeOrMoveMarker(params.props.marker.lat, params.props.marker.lng);
  }

  mapInstance.addListener("click", params.onMapClick);
}

interface CreateGoogleBasicControlRefParams {
  getMapInstance: () => google.maps.Map | null;
  countryCode?: string;
  markerController: GoogleMarkerController;
  onShapesChange?: (shapes: DrawnShape[]) => void;
}

export function createGoogleBasicControlRef(
  params: CreateGoogleBasicControlRefParams,
): MapControlRef {
  return createGoogleMapControlRef({
    getMapInstance: params.getMapInstance,
    countryCode: params.countryCode,
    placeOrMoveMarker: params.markerController.placeOrMoveMarker,
    clearMarker: params.markerController.clearMarker,
    setDrawMode(mode) {
      void mode;
    },
    getDrawnShapes: () => [],
    clearDrawnShapes() {
      params.onShapesChange?.([]);
    },
    removeShape(id) {
      void id;
    },
  });
}

interface SetupGoogleDrawingControlParams {
  mapInstance: google.maps.Map;
  props: MapProps;
  countryCode?: string;
  markerController: GoogleMarkerController;
  getTerraDraw: () => TerraDraw | null;
  setTerraDraw: (terraDraw: TerraDraw) => void;
  isTerraReady: () => boolean;
  setTerraReady: (ready: boolean) => void;
  setPendingDrawMode: (mode: DrawMode | null) => void;
  getPendingDrawMode: () => DrawMode | null;
  getAllShapes: () => DrawnShape[];
  getSelectedShapeId: () => string | null;
  setSelectedShapeId: (id: string | null) => void;
  setActiveDrawMode: (mode: DrawMode | null) => void;
  getDrawActions: () => Pick<GoogleDrawActions, "clearDrawnShapes" | "removeShapeById">;
}

export async function setupGoogleDrawingControl(
  params: SetupGoogleDrawingControlParams,
): Promise<MapControlRef | null> {
  if (!params.props.drawingTools?.length) return null;

  const {
    createGoogleApplyDrawMode,
    createGoogleTerraModes,
    initGoogleTerraOnProjectionReady,
    startGoogleTerraDraw,
  } = await import("./google-provider-draw");

  const { modes, enabledModes } = createGoogleTerraModes(params.props.drawingTools);

  const applyDrawMode = createGoogleApplyDrawMode({
    getTerraDraw: params.getTerraDraw,
    isTerraReady: params.isTerraReady,
    setPendingDrawMode: params.setPendingDrawMode,
    setActiveDrawMode: params.setActiveDrawMode,
    enabledModes,
  });

  const drawActions = params.getDrawActions();

  const controlRef = createGoogleMapControlRef({
    getMapInstance: () => params.mapInstance,
    countryCode: params.countryCode,
    placeOrMoveMarker: params.markerController.placeOrMoveMarker,
    clearMarker: params.markerController.clearMarker,
    setDrawMode(mode) {
      applyDrawMode(mode);
    },
    getDrawnShapes: params.getAllShapes,
    clearDrawnShapes: drawActions.clearDrawnShapes,
    removeShape: drawActions.removeShapeById,
  });

  const initTerraDraw = () => {
    const currentTerraDraw = params.getTerraDraw();
    if (currentTerraDraw) return;

    const terraDraw = startGoogleTerraDraw({
      mapInstance: params.mapInstance,
      modes,
      initialShapes: params.props.initialShapes,
      getAllShapes: params.getAllShapes,
      applyDrawMode,
      getPendingDrawMode: params.getPendingDrawMode,
      setTerraDrawReady: params.setTerraReady,
      getSelectedShapeId: params.getSelectedShapeId,
      setSelectedShapeId: params.setSelectedShapeId,
      setActiveDrawMode: params.setActiveDrawMode,
      onShapeDrawn: params.props.onShapeDrawn,
      onShapesChange: params.props.onShapesChange,
    });

    params.setTerraDraw(terraDraw);
  };

  initGoogleTerraOnProjectionReady({
    mapInstance: params.mapInstance,
    hasTerraDraw: () => params.getTerraDraw() !== null,
    initTerraDraw,
  });

  return controlRef;
}
