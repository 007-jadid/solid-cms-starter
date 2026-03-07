/// <reference types="@types/google.maps" />
import type { TerraDraw } from "terra-draw";

interface CreateGoogleProviderBindingsParams {
  getMapInstance: () => google.maps.Map | null;
  setMapInstance: (value: google.maps.Map | null) => void;
  getTerraDraw: () => TerraDraw | null;
  setTerraDraw: (value: TerraDraw | null) => void;
  setMapsReady: (ready: boolean) => void;
}

export function createGoogleProviderBindings(params: CreateGoogleProviderBindingsParams) {
  return {
    getMapInstance: params.getMapInstance,
    setMapInstance: (map: google.maps.Map) => {
      params.setMapInstance(map);
    },
    clearMapInstance: () => {
      params.setMapInstance(null);
    },
    getTerraDraw: params.getTerraDraw,
    setTerraDraw: (terraDraw: TerraDraw) => {
      params.setTerraDraw(terraDraw);
    },
    clearTerraDraw: () => {
      params.setTerraDraw(null);
    },
    setMapsReady: params.setMapsReady,
  };
}
