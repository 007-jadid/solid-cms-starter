import type { DrawMode } from "../types";
import type { GoogleDrawActions } from "./google-provider.types";

interface CreateGoogleToolbarHandlersParams {
  getDrawActions: () => Pick<
    GoogleDrawActions,
    "clearDrawnShapes" | "deleteSelectedShape" | "enterPanMode" | "selectDrawMode"
  >;
}

export function createGoogleToolbarHandlers(params: CreateGoogleToolbarHandlersParams) {
  const onPanClick = () => {
    params.getDrawActions().enterPanMode();
  };

  const onToolClick = (mode: DrawMode) => {
    params.getDrawActions().selectDrawMode(mode);
  };

  const onDeleteSelected = () => {
    params.getDrawActions().deleteSelectedShape();
  };

  const onClearAll = () => {
    params.getDrawActions().clearDrawnShapes();
  };

  return {
    onPanClick,
    onToolClick,
    onDeleteSelected,
    onClearAll,
  };
}
