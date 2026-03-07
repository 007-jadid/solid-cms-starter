import type { JSX } from "solid-js";
import { untrack } from "solid-js";
import { CSS_EASE_OUT_EXPO } from "~/features/lib/gsap";
import { cn } from "~/features/lib/utils";

interface SidebarVisualState {
  isMobile: boolean;
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
}

export function getSidebarStyle(state: SidebarVisualState): JSX.CSSProperties {
  return {
    width: state.isMobile ? "14rem" : state.sidebarCollapsed ? "4rem" : "14rem",
    transition: state.isMobile ? "none" : `width 0.45s ${CSS_EASE_OUT_EXPO}`,
    "will-change": state.isMobile ? "transform" : "width",
    contain: "layout style",
    transform: untrack(() =>
      state.isMobile
        ? state.sidebarMobileOpen
          ? "translateX(0)"
          : "translateX(-100%)"
        : "translateX(0)",
    ),
  };
}

export function getSidebarClass(themeVariant: string, className?: string): string {
  return cn(
    "group/sidebar fixed left-0 top-14 z-40 flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden",
    "border-r border-border bg-background/80 backdrop-blur-xl",
    themeVariant === "claude" && "font-sidebar",
    className,
  );
}
