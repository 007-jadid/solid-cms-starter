type GlassPreset = "subtle" | "balanced" | "strong";

export function applyGlassPresetFromStorage() {
  if (typeof document === "undefined") return;
  const settingsRaw = localStorage.getItem("cms.settings.v2");
  let raw: string | null = null;

  if (settingsRaw) {
    try {
      const parsed = JSON.parse(settingsRaw) as { glassPreset?: string };
      raw = parsed.glassPreset ?? null;
    } catch {
      raw = null;
    }
  }

  if (!raw) {
    raw = localStorage.getItem("cms.glassPreset");
  }

  const preset: GlassPreset =
    raw === "subtle" || raw === "strong" || raw === "balanced" ? raw : "balanced";
  document.documentElement.setAttribute("data-glass", preset);
}

// Removed: setupTanstackDevWarningsSuppression
// The "computations created outside" warnings indicate real Solid reactivity issues
// in TanStack internals. Suppressing them hides potential bugs. If these warnings
// appear, investigate the root cause rather than silencing them.
