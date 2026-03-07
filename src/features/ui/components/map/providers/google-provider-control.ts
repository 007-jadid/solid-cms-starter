/// <reference types="@types/google.maps" />

import type { DrawMode, DrawnShape, MapControlRef, MapProps } from "../types";
import { geocodePlaceId, googlePlacesSearch, reverseGeocode } from "./google-provider-services";

interface CreateGoogleMarkerControllerParams {
  getMapInstance: () => google.maps.Map | null;
  draggable: boolean;
  onMarkerChange?: MapProps["onMarkerChange"];
}

export function createGoogleMarkerController(params: CreateGoogleMarkerControllerParams) {
  let markerInstance: google.maps.Marker | null = null;

  const placeOrMoveMarker = (lat: number, lng: number) => {
    const mapInstance = params.getMapInstance();
    if (!mapInstance) return;

    if (markerInstance) {
      markerInstance.setPosition({ lat, lng });
      return;
    }

    markerInstance = new google.maps.Marker({
      position: { lat, lng },
      map: mapInstance,
      draggable: params.draggable,
      animation: google.maps.Animation.DROP,
    });

    if (params.draggable && params.onMarkerChange) {
      markerInstance.addListener("dragend", async () => {
        const currentMap = params.getMapInstance();
        if (!currentMap || !markerInstance) return;
        const pos = markerInstance.getPosition();
        if (!pos) return;

        const geo = await reverseGeocode(pos.lat(), pos.lng());
        params.onMarkerChange?.({
          lat: pos.lat(),
          lng: pos.lng(),
          zoom: currentMap.getZoom() ?? 13,
          ...geo,
        });
      });
    }
  };

  const clearMarker = () => {
    markerInstance?.setMap(null);
    markerInstance = null;
  };

  return {
    placeOrMoveMarker,
    clearMarker,
  };
}

interface CreateGoogleMapControlRefParams {
  getMapInstance: () => google.maps.Map | null;
  countryCode?: string;
  placeOrMoveMarker: (lat: number, lng: number) => void;
  clearMarker: () => void;
  setDrawMode: (mode: DrawMode | null) => void;
  getDrawnShapes: () => DrawnShape[];
  clearDrawnShapes: () => void;
  removeShape: (id: string) => void;
}

export function createGoogleMapControlRef(params: CreateGoogleMapControlRefParams): MapControlRef {
  return {
    setCenter(lat, lng, zoom) {
      const mapInstance = params.getMapInstance();
      mapInstance?.setCenter({ lat, lng });
      if (zoom !== undefined) mapInstance?.setZoom(zoom);
    },
    setMarker(location) {
      const mapInstance = params.getMapInstance();
      if (!mapInstance) return;
      if (!location) {
        params.clearMarker();
        return;
      }
      params.placeOrMoveMarker(location.lat, location.lng);
    },
    getCenter() {
      const mapInstance = params.getMapInstance();
      const c = mapInstance?.getCenter();
      return {
        lat: c?.lat() ?? 0,
        lng: c?.lng() ?? 0,
        zoom: mapInstance?.getZoom() ?? 0,
      };
    },
    async search(query) {
      return googlePlacesSearch(query, params.countryCode);
    },
    async geocodeSelection(suggestion) {
      if (!suggestion.placeId) return null;
      const geo = await geocodePlaceId(suggestion.placeId);
      return {
        lat: geo.lat ?? 0,
        lng: geo.lng ?? 0,
        placeId: suggestion.placeId,
        ...geo,
      };
    },
    setDrawMode(mode) {
      params.setDrawMode(mode);
    },
    getDrawnShapes: params.getDrawnShapes,
    clearDrawnShapes() {
      params.clearDrawnShapes();
    },
    removeShape(id) {
      params.removeShape(id);
    },
  };
}

interface CreateGoogleMapClickHandlerParams {
  getMapInstance: () => google.maps.Map | null;
  getTerraDraw: () => import("terra-draw").TerraDraw | null;
  isTerraReady: () => boolean;
  isTerraSelectModeActive: () => boolean;
  isTerraDrawingModeActive: () => boolean;
  getSelectedShapeId: () => string | null;
  setSelectedShapeId: (id: string | null) => void;
  setActiveDrawMode: (mode: DrawMode | null) => void;
  placeOrMoveMarker: (lat: number, lng: number) => void;
  onMarkerChange?: MapProps["onMarkerChange"];
}

export function createGoogleMapClickHandler(params: CreateGoogleMapClickHandlerParams) {
  return async (e: google.maps.MapMouseEvent) => {
    const mapInstance = params.getMapInstance();
    const terraDraw = params.getTerraDraw();
    if (!mapInstance || !e.latLng) return;

    if (terraDraw && params.isTerraReady() && params.isTerraSelectModeActive()) {
      const selected = terraDraw.getFeaturesAtLngLat(
        { lat: e.latLng.lat(), lng: e.latLng.lng() },
        {
          ignoreCoordinatePoints: true,
          ignoreSelectFeatures: true,
          ignoreCurrentlyDrawing: true,
          ignoreClosingPoints: true,
          ignoreSnappingPoints: true,
        },
      );
      const topFeature = selected.at(-1);

      if (topFeature?.id !== undefined) {
        const nextId = String(topFeature.id);
        const prevId = params.getSelectedShapeId();
        if (prevId && prevId !== nextId && terraDraw.hasFeature(prevId)) {
          terraDraw.deselectFeature(prevId);
        }
        if (terraDraw.hasFeature(nextId)) {
          terraDraw.selectFeature(nextId);
          params.setSelectedShapeId(nextId);
        }
        return;
      }

      const prevId = params.getSelectedShapeId();
      if (prevId && terraDraw.hasFeature(prevId)) {
        terraDraw.deselectFeature(prevId);
      }
      params.setSelectedShapeId(null);
      params.setActiveDrawMode(null);
    }

    if (!params.onMarkerChange) return;
    if (params.isTerraDrawingModeActive()) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    params.placeOrMoveMarker(lat, lng);
    const geo = await reverseGeocode(lat, lng);
    params.onMarkerChange?.({
      lat,
      lng,
      zoom: mapInstance.getZoom() ?? 13,
      ...geo,
    });
  };
}

interface CreateGoogleDrawActionsParams {
  getTerraDraw: () => import("terra-draw").TerraDraw | null;
  getAllShapes: () => DrawnShape[];
  getSelectedShapeId: () => string | null;
  setSelectedShapeId: (id: string | null) => void;
  setActiveDrawMode: (mode: DrawMode | null) => void;
  toTerraMode: (mode: DrawMode) => string;
  onShapesChange?: MapProps["onShapesChange"];
}

export function createGoogleDrawActions(params: CreateGoogleDrawActionsParams) {
  const clearDrawnShapes = () => {
    const terraDraw = params.getTerraDraw();
    if (!terraDraw) return;
    terraDraw.clear();
    params.setActiveDrawMode(null);
    params.setSelectedShapeId(null);
    params.onShapesChange?.([]);
  };

  const removeShapeById = (id: string) => {
    const terraDraw = params.getTerraDraw();
    if (!terraDraw) return;
    terraDraw.removeFeatures([id]);
    if (params.getSelectedShapeId() === id) {
      params.setSelectedShapeId(null);
    }
    params.onShapesChange?.(params.getAllShapes());
  };

  const deleteSelectedShape = () => {
    const selectedId = params.getSelectedShapeId();
    if (!selectedId) return;
    removeShapeById(selectedId);
  };

  const enterPanMode = () => {
    const terraDraw = params.getTerraDraw();
    if (!terraDraw) return;
    terraDraw.setMode("select");
    params.setActiveDrawMode(null);
  };

  const selectDrawMode = (mode: DrawMode) => {
    const terraDraw = params.getTerraDraw();
    if (!terraDraw) return;
    terraDraw.setMode(params.toTerraMode(mode));
    params.setSelectedShapeId(null);
    params.setActiveDrawMode(mode);
  };

  return {
    clearDrawnShapes,
    removeShapeById,
    deleteSelectedShape,
    enterPanMode,
    selectDrawMode,
  };
}
