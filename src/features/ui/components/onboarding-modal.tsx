import { batch, type Component, createMemo, createSignal, For, onMount, Show } from "solid-js";
import { type LocaleKey, useI18n } from "~/features/context/i18n";
import { type FontFamily, type ThemeMode, useSettings } from "~/features/context/settings";
import { loadGoogleFont } from "~/features/lib/google-font-loader";
import { FONT_CATEGORIES, type FontCategory, GOOGLE_FONTS } from "~/features/lib/google-fonts";
import {
  fadeIn,
  pressScale,
  selectionPulse,
  staggerChildren,
} from "~/features/lib/gsap-directives";
import { cn } from "~/features/lib/utils";
import { Button } from "./button";
import { Dialog, DialogContent } from "./dialog";
import { Input } from "./input";

void fadeIn;
void pressScale;
void selectionPulse;
void staggerChildren;

const ONBOARDING_KEY = "cms.onboarding.completed";

// Built-in font options (matches settings-modal.tsx)
const BUILT_IN_FONTS: {
  id: Exclude<FontFamily, "google">;
  name: string;
  fontClass: string;
}[] = [
  {
    id: "jakarta",
    name: "Plus Jakarta Sans",
    fontClass: "font-['Plus_Jakarta_Sans']",
  },
  { id: "inter", name: "Inter", fontClass: "font-['Inter']" },
  { id: "geist", name: "Geist", fontClass: "font-['Geist']" },
  { id: "spectral", name: "Spectral", fontClass: "font-['Spectral']" },
  { id: "system", name: "System Default", fontClass: "font-['system-ui']" },
];

// --- Icons ---

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-4"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-4"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MonitorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-4"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-3.5"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-2.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// --- Sub-components ---

const SectionLabel: Component<{ label: string; description?: string }> = (props) => (
  <div class="mb-3">
    <h3 class="text-sm font-semibold tracking-tight">{props.label}</h3>
    <Show when={props.description}>
      <p class="text-xs text-muted-foreground mt-0.5">{props.description}</p>
    </Show>
  </div>
);

const SelectedBadge = () => (
  <div class="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
    <CheckIcon />
  </div>
);

// --- Main Component ---

export const OnboardingModal: Component = () => {
  const [open, setOpen] = createSignal(false);
  const settings = useSettings();
  const { t, locale, setLocale } = useI18n();

  // Google Fonts picker state
  const [fontTab, setFontTab] = createSignal<"builtin" | "google">("builtin");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [categoryFilter, setCategoryFilter] = createSignal<"all" | FontCategory>("all");

  // Check on mount if this is the first visit
  onMount(() => {
    if (typeof window === "undefined") return;
    const alreadyCompleted = localStorage.getItem(ONBOARDING_KEY);
    if (!alreadyCompleted) {
      setOpen(true);
    }
  });

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setOpen(false);
  };

  // Filtered Google Fonts
  const filteredFonts = createMemo(() => {
    let fonts = GOOGLE_FONTS;
    const query = searchQuery().toLowerCase().trim();
    if (query) {
      fonts = fonts.filter((f) => f.family.toLowerCase().includes(query));
    }
    const cat = categoryFilter();
    if (cat !== "all") {
      fonts = fonts.filter((f) => f.category === cat);
    }
    return fonts;
  });

  // Preload first batch of Google Fonts when tab opens
  const preloadGoogleFonts = () => {
    const first8 = GOOGLE_FONTS.slice(0, 8);
    Promise.allSettled(first8.map((f) => loadGoogleFont(f.family)));
  };

  const handleGoogleFontSelect = (family: string) => {
    loadGoogleFont(family).then(() => {
      settings.setCustomGoogleFont(family);
    });
  };

  const handleBuiltInFontSelect = (fontId: Exclude<FontFamily, "google">) => {
    settings.setFontFamily(fontId);
    settings.setCustomGoogleFont(null);
  };

  const handleSkip = () => {
    batch(() => {
      settings.setTheme("system");
      setLocale("en");
      settings.setFontFamily("jakarta");
      settings.setCustomGoogleFont(null);
    });
    completeOnboarding();
  };

  const handleGetStarted = () => {
    completeOnboarding();
  };

  // Determine active selections for UI
  const isBuiltInFont = () => settings.state.fontFamily !== "google";
  const activeGoogleFont = () =>
    settings.state.fontFamily === "google" ? settings.state.customGoogleFont : null;

  // Theme mode config
  const themeModes: {
    value: ThemeMode;
    label: () => string;
    icon: Component;
  }[] = [
    { value: "light", label: () => t("onboarding.light"), icon: SunIcon },
    { value: "dark", label: () => t("onboarding.dark"), icon: MoonIcon },
    { value: "system", label: () => t("onboarding.system"), icon: MonitorIcon },
  ];

  // Language config
  const languages: { value: LocaleKey; label: () => string; native: string }[] = [
    { value: "en", label: () => t("onboarding.english"), native: "EN" },
    { value: "bn", label: () => t("onboarding.bengali"), native: "বাং" },
  ];

  return (
    <Dialog
      open={open()}
      onOpenChange={(v) => {
        if (!v) handleSkip();
      }}
    >
      <DialogContent class="max-w-xl overflow-hidden p-0" hideCloseButton>
        {/* Header */}
        <div class="border-b px-6 pt-6 pb-4" use:fadeIn={{ y: 8, duration: 0.22 }}>
          <h2 class="text-lg font-semibold tracking-tight">{t("onboarding.title")}</h2>
          <p class="text-sm text-muted-foreground mt-1">{t("onboarding.subtitle")}</p>
        </div>

        {/* Scrollable content */}
        <div
          class="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-6 scrollbar-none"
          use:staggerChildren={{ stagger: 0.05, y: 8, duration: 0.22 }}
        >
          {/* --- Theme Section --- */}
          <div>
            <SectionLabel
              label={t("onboarding.themeLabel")}
              description={t("onboarding.themeDescription")}
            />
            <div class="flex gap-2">
              <For each={themeModes}>
                {(mode) => (
                  <Button
                    variant={settings.state.theme === mode.value ? "default" : "outline"}
                    size="sm"
                    class="flex-1 gap-1.5 rounded-lg"
                    use:pressScale={{ scale: 0.97 }}
                    use:selectionPulse={{
                      active: settings.state.theme === mode.value,
                    }}
                    onClick={() => settings.setTheme(mode.value)}
                  >
                    <mode.icon />
                    {mode.label()}
                  </Button>
                )}
              </For>
            </div>
          </div>

          {/* --- Language Section --- */}
          <div>
            <SectionLabel
              label={t("onboarding.languageLabel")}
              description={t("onboarding.languageDescription")}
            />
            <div class="flex gap-2">
              <For each={languages}>
                {(lang) => (
                  <Button
                    variant={locale() === lang.value ? "default" : "outline"}
                    size="sm"
                    class="flex-1 gap-2 rounded-lg"
                    use:pressScale={{ scale: 0.97 }}
                    use:selectionPulse={{ active: locale() === lang.value }}
                    onClick={() => setLocale(lang.value)}
                  >
                    <span class="text-xs font-bold opacity-60">{lang.native}</span>
                    {lang.label()}
                  </Button>
                )}
              </For>
            </div>
          </div>

          {/* --- Font Section --- */}
          <div>
            <SectionLabel
              label={t("onboarding.fontLabel")}
              description={t("onboarding.fontDescription")}
            />

            {/* Tab toggle: Built-in / Google Fonts */}
            <div class="flex gap-1 rounded-lg border p-1 mb-3">
              <Button
                variant="ghost"
                size="sm"
                class={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-xs font-medium",
                  fontTab() === "builtin"
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground",
                )}
                use:pressScale={{ scale: 0.97 }}
                use:selectionPulse={{ active: fontTab() === "builtin" }}
                onClick={() => setFontTab("builtin")}
              >
                {t("onboarding.fontBuiltIn")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-xs font-medium",
                  fontTab() === "google"
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground",
                )}
                use:pressScale={{ scale: 0.97 }}
                use:selectionPulse={{ active: fontTab() === "google" }}
                onClick={() => {
                  setFontTab("google");
                  preloadGoogleFonts();
                }}
              >
                {t("onboarding.fontGoogleFonts")}
              </Button>
            </div>

            {/* Built-in Fonts */}
            <Show when={fontTab() === "builtin"}>
              <div class="grid gap-1.5">
                <For each={BUILT_IN_FONTS}>
                  {(font) => (
                    <Button
                      variant="ghost"
                      class={cn(
                        "relative flex h-auto items-center justify-between gap-3 rounded-lg border p-2.5 text-left transition-all hover:border-primary/50",
                        isBuiltInFont() && settings.state.fontFamily === font.id
                          ? "border-primary bg-primary/5"
                          : "border-border",
                      )}
                      use:pressScale={{ scale: 0.98 }}
                      use:selectionPulse={{
                        active: isBuiltInFont() && settings.state.fontFamily === font.id,
                      }}
                      onClick={() => handleBuiltInFontSelect(font.id)}
                    >
                      <div class="flex flex-col gap-0.5">
                        <span class="text-[13px] font-medium">{font.name}</span>
                        <span class={cn("text-xs text-muted-foreground", font.fontClass)}>
                          The quick brown fox jumps over the lazy dog
                        </span>
                      </div>
                      <Show when={isBuiltInFont() && settings.state.fontFamily === font.id}>
                        <SelectedBadge />
                      </Show>
                    </Button>
                  )}
                </For>
              </div>
            </Show>

            {/* Google Fonts */}
            <Show when={fontTab() === "google"}>
              <div class="space-y-3">
                {/* Search */}
                <div class="relative">
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <SearchIcon />
                  </div>
                  <Input
                    type="text"
                    placeholder={t("onboarding.fontSearchPlaceholder")}
                    value={searchQuery()}
                    onInput={(e) => setSearchQuery(e.currentTarget.value)}
                    class="pl-9"
                  />
                </div>

                {/* Category pills */}
                <div class="flex flex-wrap gap-1.5">
                  <For each={FONT_CATEGORIES}>
                    {(cat) => (
                      <Button
                        variant="ghost"
                        size="sm"
                        class={cn(
                          "h-auto rounded-full px-3 py-1 text-[11px] font-medium",
                          categoryFilter() === cat.value
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted text-muted-foreground hover:bg-muted/80",
                        )}
                        use:pressScale={{ scale: 0.97 }}
                        use:selectionPulse={{
                          active: categoryFilter() === cat.value,
                        }}
                        onClick={() => setCategoryFilter(cat.value)}
                      >
                        {cat.label}
                      </Button>
                    )}
                  </For>
                </div>

                {/* Font list */}
                <div class="max-h-48 overflow-y-auto rounded-lg border scrollbar-none">
                  <div class="grid gap-0">
                    <For
                      each={filteredFonts()}
                      fallback={
                        <div class="py-8 text-center text-xs text-muted-foreground">
                          No fonts found
                        </div>
                      }
                    >
                      {(font) => {
                        const isSelected = () => activeGoogleFont() === font.family;
                        return (
                          <Button
                            variant="ghost"
                            class={cn(
                              "flex h-auto w-full items-center justify-between gap-3 rounded-none border-b last:border-b-0 px-3 py-2.5 text-left hover:bg-muted/50",
                              isSelected() && "bg-primary/5",
                            )}
                            use:pressScale={{ scale: 0.985 }}
                            use:selectionPulse={{ active: isSelected() }}
                            onClick={() => handleGoogleFontSelect(font.family)}
                          >
                            <div class="flex flex-col gap-0.5 min-w-0">
                              <span class="text-[13px] font-medium truncate">{font.family}</span>
                              <span
                                class="text-xs text-muted-foreground truncate"
                                style={{
                                  "font-family": `'${font.family}', ${font.category}`,
                                }}
                              >
                                The quick brown fox jumps over the lazy dog
                              </span>
                            </div>
                            <Show when={isSelected()}>
                              <SelectedBadge />
                            </Show>
                          </Button>
                        );
                      }}
                    </For>
                  </div>
                </div>
              </div>
            </Show>
          </div>
        </div>

        {/* Footer */}
        <div class="flex items-center justify-between border-t px-6 py-4">
          <Button variant="ghost" size="sm" use:pressScale={{ scale: 0.97 }} onClick={handleSkip}>
            {t("onboarding.skip")}
          </Button>
          <Button size="sm" use:pressScale={{ scale: 0.97 }} onClick={handleGetStarted}>
            {t("onboarding.getStarted")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
