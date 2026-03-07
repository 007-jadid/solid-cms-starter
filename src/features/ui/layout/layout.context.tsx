import {
  batch,
  createContext,
  createEffect,
  type JSX,
  on,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useSettings } from "~/features/context/settings";

interface LayoutState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  isMobile: boolean;
  forceCollapsedSidebar: boolean;
}

interface LayoutContextValue {
  state: LayoutState;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleTheme: () => void;
}

const LayoutContext = createContext<LayoutContextValue>();

export function LayoutProvider(props: { children: JSX.Element; forceCollapsedSidebar?: boolean }) {
  const settings = useSettings();
  const [state, setState] = createStore<LayoutState>({
    sidebarCollapsed: props.forceCollapsedSidebar ?? settings.state.sidebarCollapsed,
    sidebarMobileOpen: false,
    isMobile: typeof window !== "undefined" ? window.innerWidth < 1024 : false,
    forceCollapsedSidebar: props.forceCollapsedSidebar ?? false,
  });

  // Handle window resize for mobile detection
  onMount(() => {
    const handleResize = () => {
      setState("isMobile", window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    onCleanup(() => window.removeEventListener("resize", handleResize));
  });

  // Sync sidebar state when prop or settings change.
  // Merged from two effects to avoid both writing sidebarCollapsed on the same tick.
  // defer:true — createStore already initialises from these values correctly.
  createEffect(
    on(
      [() => props.forceCollapsedSidebar ?? false, () => settings.state.sidebarCollapsed] as const,
      ([forceCollapsed, settingsCollapsed]) => {
        batch(() => {
          setState("forceCollapsedSidebar", forceCollapsed);
          setState("sidebarCollapsed", forceCollapsed ? true : settingsCollapsed);
        });
      },
      { defer: true },
    ),
  );

  const value: LayoutContextValue = {
    state,
    toggleSidebar: () => {
      if (state.isMobile) {
        setState("sidebarMobileOpen", (o) => !o);
        return;
      }
      // Don't allow toggling if forceCollapsedSidebar is true
      if (state.forceCollapsedSidebar) {
        return;
      }
      const newValue = !state.sidebarCollapsed;
      setState("sidebarCollapsed", newValue);
      settings.setSidebarCollapsed(newValue);
    },
    setSidebarCollapsed: (collapsed) => {
      setState("sidebarCollapsed", collapsed);
      settings.setSidebarCollapsed(collapsed);
    },
    toggleMobileSidebar: () => setState("sidebarMobileOpen", (o) => !o),
    setMobileSidebarOpen: (open) => setState("sidebarMobileOpen", open),
    toggleTheme: () => {
      const newTheme = settings.state.theme === "dark" ? "light" : "dark";
      settings.setTheme(newTheme);
    },
  };

  return <LayoutContext.Provider value={value}>{props.children}</LayoutContext.Provider>;
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
