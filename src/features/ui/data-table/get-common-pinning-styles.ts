/**
 * Column Pinning Styles
 * Returns CSS styles for pinned columns
 */

import type { Column } from "@tanstack/solid-table";
import type { JSX } from "solid-js";

export function getCommonPinningStyles<TData>(column: Column<TData, unknown>): JSX.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn = isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn = isPinned === "right" && column.getIsFirstColumn("right");

  return {
    "box-shadow": isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
        ? "4px 0 4px -4px gray inset"
        : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? "sticky" : "relative",
    width: `${column.getSize()}px`,
    "z-index": isPinned ? 1 : 0,
    "background-color": isPinned ? "hsl(var(--background))" : undefined,
  };
}
