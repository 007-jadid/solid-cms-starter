import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import type { MapLocation, SearchSuggestion } from "../types";

type GoogleMapsLoaderState = {
  optionsSet: boolean;
  initPromise: Promise<void> | null;
};

function getGoogleMapsLoaderState(): GoogleMapsLoaderState {
  const g = globalThis as typeof globalThis & {
    __cmsGoogleMapsLoaderState__?: GoogleMapsLoaderState;
  };
  if (!g.__cmsGoogleMapsLoaderState__) {
    g.__cmsGoogleMapsLoaderState__ = {
      optionsSet: false,
      initPromise: null,
    };
  }
  return g.__cmsGoogleMapsLoaderState__;
}

export async function initGoogleMaps(apiKey: string) {
  const loaderState = getGoogleMapsLoaderState();
  if (loaderState.initPromise) return loaderState.initPromise;

  if (!loaderState.optionsSet) {
    setOptions({ key: apiKey, v: "weekly" });
    loaderState.optionsSet = true;
  }

  loaderState.initPromise = Promise.all([
    importLibrary("maps"),
    importLibrary("places"),
    importLibrary("geocoding"),
    importLibrary("marker"),
  ]).then(() => {});
  return loaderState.initPromise;
}

export async function geocodePlaceId(placeId: string): Promise<Partial<MapLocation>> {
  try {
    const geocoder = new google.maps.Geocoder();
    const result = await geocoder.geocode({ placeId });
    const place = result.results[0];
    if (!place) return {};
    const loc = place.geometry.location;
    const get = (type: string) =>
      place.address_components?.find((c) => c.types.includes(type))?.long_name;
    return {
      lat: loc.lat(),
      lng: loc.lng(),
      address: place.formatted_address,
      displayName: place.formatted_address,
      city: get("locality") ?? get("administrative_area_level_2"),
      country: get("country"),
      postalCode: get("postal_code"),
    };
  } catch {
    return {};
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<Partial<MapLocation>> {
  try {
    const geocoder = new google.maps.Geocoder();
    const result = await geocoder.geocode({ location: { lat, lng } });
    const place = result.results[0];
    if (!place) return {};
    const get = (type: string) =>
      place.address_components?.find((c) => c.types.includes(type))?.long_name;
    return {
      address: place.formatted_address,
      displayName: place.formatted_address,
      city: get("locality") ?? get("administrative_area_level_2"),
      country: get("country"),
      postalCode: get("postal_code"),
    };
  } catch {
    return {};
  }
}

export async function googlePlacesSearch(
  query: string,
  countryCode?: string,
): Promise<SearchSuggestion[]> {
  try {
    const service = new google.maps.places.AutocompleteService();
    const request: google.maps.places.AutocompletionRequest = { input: query };
    if (countryCode) request.componentRestrictions = { country: countryCode };
    const result = await service.getPlacePredictions(request);
    return (result?.predictions ?? []).map((p) => ({
      id: p.place_id,
      label: p.structured_formatting.main_text,
      sublabel: p.structured_formatting.secondary_text,
      lat: 0,
      lng: 0,
      placeId: p.place_id,
      displayName: p.description,
    }));
  } catch {
    return [];
  }
}
