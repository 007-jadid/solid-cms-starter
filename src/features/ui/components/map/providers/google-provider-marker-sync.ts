import { createEffect, on } from "solid-js";
import type { MapLocation } from "../types";

interface MarkerController {
  placeOrMoveMarker: (lat: number, lng: number) => void;
  clearMarker: () => void;
}

interface UseGoogleMarkerSyncParams {
  marker: () => MapLocation | null | undefined;
  isMapsReady: () => boolean;
  getMapInstance: () => google.maps.Map | null;
  markerController: MarkerController;
}

export function useGoogleMarkerSync(params: UseGoogleMarkerSyncParams) {
  createEffect(
    on(
      params.marker,
      (marker) => {
        if (!params.isMapsReady() || !params.getMapInstance()) return;
        if (!marker) {
          params.markerController.clearMarker();
          return;
        }
        params.markerController.placeOrMoveMarker(marker.lat, marker.lng);
      },
      { defer: true },
    ),
  );
}
