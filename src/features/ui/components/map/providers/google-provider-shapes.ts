import type { DrawnShape } from "../types";

export type TerraFeature = {
  id?: string | number;
  geometry?: {
    type?: string;
    coordinates?: unknown;
  };
  properties?: Record<string, unknown>;
};

function asLngLatPair(value: unknown): [number, number] | null {
  if (!Array.isArray(value) || value.length < 2) return null;
  const lng = value[0];
  const lat = value[1];
  if (typeof lng !== "number" || typeof lat !== "number") return null;
  return [lng, lat];
}

function closeLinearRing(points: Array<[number, number]>) {
  if (points.length < 2) return points;
  const [firstLng, firstLat] = points[0];
  const [lastLng, lastLat] = points[points.length - 1];
  if (firstLng === lastLng && firstLat === lastLat) return points;
  return [...points, [firstLng, firstLat] as [number, number]];
}

function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusMeters = 6_371_000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function buildCircleRing(
  center: { lat: number; lng: number },
  radiusMeters: number,
  steps = 64,
): Array<[number, number]> {
  const ring: Array<[number, number]> = [];
  const earthRadiusMeters = 6_378_137;
  const latRad = (center.lat * Math.PI) / 180;
  const lngRad = (center.lng * Math.PI) / 180;
  const angularDistance = radiusMeters / earthRadiusMeters;

  for (let i = 0; i < steps; i += 1) {
    const bearing = (2 * Math.PI * i) / steps;
    const sinLat =
      Math.sin(latRad) * Math.cos(angularDistance) +
      Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearing);
    const newLat = Math.asin(sinLat);
    const y = Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latRad);
    const x = Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(newLat);
    const newLng = lngRad + Math.atan2(y, x);
    ring.push([(newLng * 180) / Math.PI, (newLat * 180) / Math.PI] as [number, number]);
  }

  return closeLinearRing(ring);
}

function normalizeId(feature: TerraFeature) {
  if (feature.id === undefined || feature.id === null) return crypto.randomUUID();
  return String(feature.id);
}

function readNumericProperty(obj: Record<string, unknown> | undefined, key: string) {
  const value = obj?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function featureToDrawnShape(feature: TerraFeature): DrawnShape | null {
  const id = normalizeId(feature);
  const geometryType = feature.geometry?.type;
  const coordinates = feature.geometry?.coordinates;
  const mode = typeof feature.properties?.mode === "string" ? feature.properties.mode : "";

  if (geometryType === "Point") {
    const pair = asLngLatPair(coordinates);
    if (!pair) return null;
    const [lng, lat] = pair;
    return { id, data: { type: "marker", lat, lng } };
  }

  if (geometryType === "LineString") {
    if (!Array.isArray(coordinates)) return null;
    const points = coordinates
      .map((point) => asLngLatPair(point))
      .filter((point): point is [number, number] => point !== null)
      .map(([lng, lat]) => ({ lat, lng }));
    if (!points.length) return null;
    return { id, data: { type: "polyline", points } };
  }

  if (geometryType === "Polygon") {
    if (!Array.isArray(coordinates) || !Array.isArray(coordinates[0])) return null;
    const ring = (coordinates[0] as unknown[])
      .map((point) => asLngLatPair(point))
      .filter((point): point is [number, number] => point !== null);
    if (!ring.length) return null;

    const normalizedRing =
      ring.length > 1
        ? ring.filter(
            (point, index) =>
              index !== ring.length - 1 || point[0] !== ring[0][0] || point[1] !== ring[0][1],
          )
        : ring;

    if (mode === "rectangle") {
      const lats = normalizedRing.map((point) => point[1]);
      const lngs = normalizedRing.map((point) => point[0]);
      return {
        id,
        data: {
          type: "rectangle",
          north: Math.max(...lats),
          south: Math.min(...lats),
          east: Math.max(...lngs),
          west: Math.min(...lngs),
        },
      };
    }

    if (mode === "circle") {
      const lats = normalizedRing.map((point) => point[1]);
      const lngs = normalizedRing.map((point) => point[0]);
      const center = {
        lat: (Math.min(...lats) + Math.max(...lats)) / 2,
        lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
      };
      const radiusKilometers = readNumericProperty(feature.properties, "radiusKilometers");
      const radius =
        radiusKilometers !== null
          ? radiusKilometers * 1000
          : haversineMeters(center, {
              lat: normalizedRing[0][1],
              lng: normalizedRing[0][0],
            });

      return { id, data: { type: "circle", center, radius } };
    }

    return {
      id,
      data: {
        type: "polygon",
        points: normalizedRing.map(([lng, lat]) => ({ lat, lng })),
      },
    };
  }

  return null;
}

export function drawnShapeToFeature(shape: DrawnShape): TerraFeature {
  const d = shape.data;

  if (d.type === "marker") {
    return {
      id: shape.id,
      type: "Feature",
      geometry: { type: "Point", coordinates: [d.lng, d.lat] },
      properties: { mode: "marker" },
    } as TerraFeature;
  }

  if (d.type === "polyline") {
    return {
      id: shape.id,
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: d.points.map((point) => [point.lng, point.lat]),
      },
      properties: { mode: "linestring" },
    } as TerraFeature;
  }

  if (d.type === "polygon") {
    const ring = closeLinearRing(
      d.points.map((point) => [point.lng, point.lat] as [number, number]),
    );
    return {
      id: shape.id,
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [ring],
      },
      properties: { mode: "polygon" },
    } as TerraFeature;
  }

  if (d.type === "rectangle") {
    const ring = closeLinearRing([
      [d.west, d.south],
      [d.east, d.south],
      [d.east, d.north],
      [d.west, d.north],
    ]);
    return {
      id: shape.id,
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [ring],
      },
      properties: { mode: "rectangle" },
    } as TerraFeature;
  }

  const ring = buildCircleRing(d.center, d.radius);
  return {
    id: shape.id,
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [ring],
    },
    properties: {
      mode: "circle",
      radiusKilometers: d.radius / 1000,
    },
  } as TerraFeature;
}

export function snapshotToDrawnShapes(snapshot: TerraFeature[]): DrawnShape[] {
  const shapes: DrawnShape[] = [];
  for (const feature of snapshot) {
    const shape = featureToDrawnShape(feature);
    if (shape) shapes.push(shape);
  }
  return shapes;
}
