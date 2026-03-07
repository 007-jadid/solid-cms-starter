/// <reference types="@types/google.maps" />
import { createSignal, onCleanup, onMount } from "solid-js";
import type { TerraDraw } from "terra-draw";
import { useMapConfig } from "../map-config";
import type { DrawMode, GoogleProviderConfig, MapProps } from "../types";
import { createGoogleProviderBindings } from "./google-provider-bindings";
import { resetGoogleProviderState } from "./google-provider-cleanup";
import { createGoogleMarkerController } from "./google-provider-control";
import { createGoogleDrawActionsFactory } from "./google-provider-draw-actions";
import { GoogleProviderDrawToolbar } from "./google-provider-draw-toolbar";
import { initGoogleProviderOnMount } from "./google-provider-lifecycle";
import { useGoogleMarkerSync } from "./google-provider-marker-sync";
import { createGoogleTerraState } from "./google-provider-state";
import { createGoogleToolbarHandlers } from "./google-provider-toolbar";

export function GoogleProvider(props: MapProps) {
  const mapConfig = useMapConfig();
  const [activeDrawMode, setActiveDrawMode] = createSignal<DrawMode | null>(null);
  const [selectedShapeId, setSelectedShapeId] = createSignal<string | null>(null);

  let containerRef!: HTMLDivElement;
  let mapInstance: google.maps.Map | null = null;
  let terraDraw: TerraDraw | null = null;
  const terraState = createGoogleTerraState(() => terraDraw);
  let mapsReady = false;

  const config = props.provider as GoogleProviderConfig;

  const bindings = createGoogleProviderBindings({
    getMapInstance: () => mapInstance,
    setMapInstance: (value) => {
      mapInstance = value;
    },
    getTerraDraw: () => terraDraw,
    setTerraDraw: (value) => {
      terraDraw = value;
    },
    setMapsReady: (ready) => {
      mapsReady = ready;
    },
  });

  const markerController = createGoogleMarkerController({
    getMapInstance: () => mapInstance,
    draggable: props.draggableMarker !== false,
    onMarkerChange: props.onMarkerChange,
  });

  const getDrawActions = createGoogleDrawActionsFactory({
    getTerraDraw: bindings.getTerraDraw,
    getAllShapes: terraState.getAllShapes,
    getSelectedShapeId: selectedShapeId,
    setSelectedShapeId,
    setActiveDrawMode,
    onShapesChange: props.onShapesChange,
  });

  const toolbarHandlers = createGoogleToolbarHandlers({ getDrawActions });

  onMount(() => {
    void initGoogleProviderOnMount({
      apiKey: config.apiKey,
      mapId: config.mapId,
      countryCode: mapConfig.countryCode,
      containerRef,
      props,
      markerController,
      getMapInstance: bindings.getMapInstance,
      setMapInstance: bindings.setMapInstance,
      getTerraDraw: bindings.getTerraDraw,
      setTerraDraw: bindings.setTerraDraw,
      terraState,
      getSelectedShapeId: selectedShapeId,
      setSelectedShapeId,
      setActiveDrawMode,
      getDrawActions,
      setMapsReady: bindings.setMapsReady,
    });
  });

  useGoogleMarkerSync({
    marker: () => props.marker,
    isMapsReady: () => mapsReady,
    getMapInstance: bindings.getMapInstance,
    markerController,
  });

  onCleanup(() => {
    resetGoogleProviderState({
      terraState,
      getTerraDraw: bindings.getTerraDraw,
      setTerraDraw: () => {
        bindings.clearTerraDraw();
      },
      setActiveDrawMode,
      setSelectedShapeId,
      markerController,
      setMapInstance: () => {
        bindings.clearMapInstance();
      },
    });
  });

  return (
    <div class="relative" style={{ height: props.height ?? "400px", width: "100%" }}>
      <div ref={containerRef} class={props.class} style={{ height: "100%", width: "100%" }} />

      <GoogleProviderDrawToolbar
        drawingTools={props.drawingTools}
        activeDrawMode={activeDrawMode()}
        selectedShapeId={selectedShapeId()}
        onPanClick={toolbarHandlers.onPanClick}
        onToolClick={toolbarHandlers.onToolClick}
        onDeleteSelected={toolbarHandlers.onDeleteSelected}
        onClearAll={toolbarHandlers.onClearAll}
      />
    </div>
  );
}
