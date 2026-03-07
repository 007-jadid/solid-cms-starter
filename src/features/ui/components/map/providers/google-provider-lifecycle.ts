/// <reference types="@types/google.maps" />
import type { TerraDraw } from "terra-draw";
import type { DrawMode, MapProps } from "../types";
import type {
  GoogleDrawActions,
  GoogleMarkerController,
  GoogleTerraRuntimeState,
} from "./google-provider.types";
import {
  createGoogleBasicControlRef,
  createGoogleMapInstance,
  setupGoogleDrawingControl,
} from "./google-provider-bootstrap";
import { createGoogleMapClickHandler } from "./google-provider-control";
import { initGoogleMaps } from "./google-provider-services";

interface InitGoogleProviderOnMountParams {
  apiKey: string;
  mapId?: string;
  countryCode?: string;
  containerRef: HTMLDivElement;
  props: MapProps;
  markerController: GoogleMarkerController;
  getMapInstance: () => google.maps.Map | null;
  setMapInstance: (map: google.maps.Map) => void;
  getTerraDraw: () => TerraDraw | null;
  setTerraDraw: (terraDraw: TerraDraw) => void;
  terraState: GoogleTerraRuntimeState;
  getSelectedShapeId: () => string | null;
  setSelectedShapeId: (id: string | null) => void;
  setActiveDrawMode: (mode: DrawMode | null) => void;
  getDrawActions: () => Pick<GoogleDrawActions, "clearDrawnShapes" | "removeShapeById">;
  setMapsReady: (ready: boolean) => void;
}

export async function initGoogleProviderOnMount(params: InitGoogleProviderOnMountParams) {
  await initGoogleMaps(params.apiKey);
  params.setMapsReady(true);

  createGoogleMapInstance({
    containerRef: params.containerRef,
    props: params.props,
    mapId: params.mapId,
    markerController: params.markerController,
    onMapClick: createGoogleMapClickHandler({
      getMapInstance: params.getMapInstance,
      getTerraDraw: params.getTerraDraw,
      isTerraReady: params.terraState.isReady,
      isTerraSelectModeActive: params.terraState.isTerraSelectModeActive,
      isTerraDrawingModeActive: params.terraState.isTerraDrawingModeActive,
      getSelectedShapeId: params.getSelectedShapeId,
      setSelectedShapeId: params.setSelectedShapeId,
      setActiveDrawMode: params.setActiveDrawMode,
      placeOrMoveMarker: params.markerController.placeOrMoveMarker,
      onMarkerChange: params.props.onMarkerChange,
    }),
    setMapInstance: params.setMapInstance,
  });

  const mapInstance = params.getMapInstance();
  if (!mapInstance) return;

  const drawingControlRef = await setupGoogleDrawingControl({
    mapInstance,
    props: params.props,
    countryCode: params.countryCode,
    markerController: params.markerController,
    getTerraDraw: params.getTerraDraw,
    setTerraDraw: params.setTerraDraw,
    isTerraReady: params.terraState.isReady,
    setTerraReady: params.terraState.setReady,
    setPendingDrawMode: params.terraState.setPendingDrawMode,
    getPendingDrawMode: params.terraState.getPendingDrawMode,
    getAllShapes: params.terraState.getAllShapes,
    getSelectedShapeId: params.getSelectedShapeId,
    setSelectedShapeId: params.setSelectedShapeId,
    setActiveDrawMode: params.setActiveDrawMode,
    getDrawActions: params.getDrawActions,
  });

  if (drawingControlRef) {
    params.props.onReady?.(drawingControlRef);
    return;
  }

  params.props.onReady?.(
    createGoogleBasicControlRef({
      getMapInstance: params.getMapInstance,
      countryCode: params.countryCode,
      markerController: params.markerController,
      onShapesChange: params.props.onShapesChange,
    }),
  );
}
