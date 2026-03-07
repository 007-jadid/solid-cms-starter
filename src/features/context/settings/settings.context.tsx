import { createContext, createEffect, type JSX, on, onCleanup, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { loadGoogleFont } from "~/features/lib/google-font-loader";

export type ThemeMode = "light" | "dark" | "system";
export type ThemeVariant = "default" | "claude";
export type FontFamily = "jakarta" | "inter" | "system" | "geist" | "spectral" | "google";
export type DensityMode = "compact" | "comfortable" | "spacious";
export type GlassPreset = "subtle" | "balanced" | "strong";

export interface SettingsState {
  theme: ThemeMode;
  themeVariant: ThemeVariant;
  glassPreset: GlassPreset;
  fontFamily: FontFamily;
  customGoogleFont: string | null;
  sidebarFontFamily: FontFamily;
  density: DensityMode;
  sidebarCollapsed: boolean;
  table: {
    pageSize: number;
  };
  app: {
    name: string;
    version: string;
  };
}

interface SettingsContextValue {
  state: SettingsState;
  setTheme: (theme: ThemeMode) => void;
  setThemeVariant: (variant: ThemeVariant) => void;
  setGlassPreset: (preset: GlassPreset) => void;
  setFontFamily: (font: FontFamily) => void;
  setCustomGoogleFont: (font: string | null) => void;
  setSidebarFontFamily: (font: FontFamily) => void;
  setDensity: (density: DensityMode) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTablePageSize: (pageSize: number) => void;
  update: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  reset: () => void;
}

const STORAGE_KEY = "cms.settings.v2";

const DEFAULT_SETTINGS: SettingsState = {
  theme: "system",
  themeVariant: "default",
  glassPreset: "balanced",
  fontFamily: "jakarta",
  customGoogleFont: null,
  sidebarFontFamily: "jakarta",
  density: "comfortable",
  sidebarCollapsed: false,
  table: {
    pageSize: 10,
  },
  app: {
    name: "CMS Boilerplate",
    version: "v1.0.0",
  },
};

const SettingsContext = createContext<SettingsContextValue>();

const FONT_MAP: Record<Exclude<FontFamily, "google">, string> = {
  jakarta:
    "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  inter:
    "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  system:
    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  geist:
    "'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  spectral: "'Spectral', Georgia, serif",
};

function applyTheme(theme: ThemeMode) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;

  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.add(systemDark ? "dark" : "light");
  } else {
    root.classList.add(theme);
  }
}

function applySettingsToDOM(settings: SettingsState) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;

  // Suppress transitions on elements with Tailwind transition classes
  root.classList.add("disable-transitions");

  applyTheme(settings.theme);

  // Variant — use classList directly instead of regex className rewrite
  for (const cls of Array.from(root.classList)) {
    if (cls.startsWith("theme-")) root.classList.remove(cls);
  }
  if (settings.themeVariant !== "default") {
    root.classList.add(`theme-${settings.themeVariant}`);
  }

  root.setAttribute("data-glass", settings.glassPreset);

  // Font handling — built-in fonts use FONT_MAP, "google" builds a dynamic stack
  let fontSans: string;
  if (settings.fontFamily === "google" && settings.customGoogleFont) {
    fontSans = `'${settings.customGoogleFont}', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
    loadGoogleFont(settings.customGoogleFont);
  } else {
    const key = settings.fontFamily === "google" ? "jakarta" : settings.fontFamily;
    fontSans = FONT_MAP[key];
  }
  root.style.setProperty("--font-sans", fontSans);

  const sidebarKey =
    settings.sidebarFontFamily === "google" ? "jakarta" : settings.sidebarFontFamily;
  root.style.setProperty("--font-sidebar", FONT_MAP[sidebarKey]);

  // Re-enable transitions after browser paints the new theme
  requestAnimationFrame(() => {
    root.classList.remove("disable-transitions");
  });
}

function loadSettings(): SettingsState {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(stored) as Partial<SettingsState>;
    // Migrate removed theme variants from localStorage
    const rawVariant = parsed.themeVariant as string | undefined;
    if (rawVariant === "claude-dark") parsed.themeVariant = "claude";
    else if (rawVariant && !["default", "claude"].includes(rawVariant))
      parsed.themeVariant = "default";
    const rawGlass = parsed.glassPreset as string | undefined;
    if (rawGlass && !["subtle", "balanced", "strong"].includes(rawGlass)) {
      parsed.glassPreset = "balanced";
    }

    // Migration from older standalone storage key
    if (!parsed.glassPreset && typeof window !== "undefined") {
      const legacyGlass = localStorage.getItem("cms.glassPreset");
      if (legacyGlass === "subtle" || legacyGlass === "balanced" || legacyGlass === "strong") {
        parsed.glassPreset = legacyGlass;
      }
    }
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      table: {
        ...DEFAULT_SETTINGS.table,
        ...(parsed.table ?? {}),
      },
      app: {
        ...DEFAULT_SETTINGS.app,
        ...(parsed.app ?? {}),
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider(props: { children: JSX.Element }) {
  const [state, setState] = createStore<SettingsState>(loadSettings());

  const persist = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  // Apply DOM changes only when visual settings change
  createEffect(
    on(
      () =>
        [
          state.theme,
          state.themeVariant,
          state.glassPreset,
          state.fontFamily,
          state.customGoogleFont,
          state.sidebarFontFamily,
        ] as const,
      () => applySettingsToDOM(state),
    ),
  );

  // Persist all settings to localStorage on any change
  createEffect(() => {
    // Read the full state so any property change triggers persistence
    JSON.stringify(state);
    persist();
  });

  createEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (state.theme === "system") {
        applySettingsToDOM(state);
      }
    };
    media.addEventListener("change", handler);
    onCleanup(() => media.removeEventListener("change", handler));
  });

  const value: SettingsContextValue = {
    state,
    setTheme: (theme) => setState("theme", theme),
    setThemeVariant: (variant) => setState("themeVariant", variant),
    setGlassPreset: (preset) => {
      setState("glassPreset", preset);
      if (typeof window !== "undefined") {
        localStorage.setItem("cms.glassPreset", preset);
      }
    },
    setFontFamily: (font) => setState("fontFamily", font),
    setCustomGoogleFont: (font) => {
      setState("customGoogleFont", font);
      if (font) setState("fontFamily", "google");
    },
    setSidebarFontFamily: (font) => setState("sidebarFontFamily", font),
    setDensity: (density) => setState("density", density),
    setSidebarCollapsed: (collapsed) => setState("sidebarCollapsed", collapsed),
    setTablePageSize: (pageSize) => setState("table", "pageSize", pageSize),
    update: (key, value) => setState(key, value),
    reset: () => setState(DEFAULT_SETTINGS),
  };

  return <SettingsContext.Provider value={value}>{props.children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

export { applySettingsToDOM, applyTheme, DEFAULT_SETTINGS };
