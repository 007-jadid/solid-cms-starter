import type { TerraDraw } from "terra-draw";
import {
  TerraDrawCircleMode,
  TerraDrawLineStringMode,
  TerraDrawMarkerMode,
  TerraDrawPolygonMode,
  TerraDrawRectangleMode,
  TerraDrawSelectMode,
} from "terra-draw";
import type { DrawMode } from "../types";

const EDITABLE_SELECT_FLAGS = {
  marker: {
    feature: {
      draggable: true,
      coordinates: {
        draggable: true,
        deletable: true,
      },
    },
  },
  linestring: {
    feature: {
      draggable: true,
      coordinates: {
        draggable: true,
        deletable: true,
        midpoints: { draggable: true },
      },
    },
  },
  polygon: {
    feature: {
      draggable: true,
      selfIntersectable: false,
      coordinates: {
        draggable: true,
        deletable: true,
        midpoints: { draggable: true },
      },
    },
  },
  rectangle: {
    feature: {
      draggable: true,
      coordinates: {
        draggable: true,
        midpoints: { draggable: true },
      },
    },
  },
  circle: {
    feature: {
      draggable: true,
      coordinates: {
        draggable: true,
        midpoints: { draggable: true },
      },
    },
  },
};

export function buildGoogleTerraModes(drawingTools: DrawMode[]) {
  const modes: ConstructorParameters<typeof TerraDraw>[0]["modes"] = [
    new TerraDrawSelectMode({
      flags: EDITABLE_SELECT_FLAGS,
    }),
  ];

  const enabledModes = new Set<string>(["select"]);

  if (drawingTools.includes("marker")) {
    modes.push(new TerraDrawMarkerMode());
    enabledModes.add("marker");
  }
  if (drawingTools.includes("polyline")) {
    modes.push(new TerraDrawLineStringMode());
    enabledModes.add("linestring");
  }
  if (drawingTools.includes("polygon")) {
    modes.push(new TerraDrawPolygonMode());
    enabledModes.add("polygon");
  }
  if (drawingTools.includes("rectangle")) {
    modes.push(new TerraDrawRectangleMode());
    enabledModes.add("rectangle");
  }
  if (drawingTools.includes("circle")) {
    modes.push(new TerraDrawCircleMode());
    enabledModes.add("circle");
  }

  return { modes, enabledModes };
}
