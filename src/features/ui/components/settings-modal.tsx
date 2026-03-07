import { type Component, createSignal, For, Show } from "solid-js";
import {
  type FontFamily,
  type ThemeMode,
  type ThemeVariant,
  useSettings,
} from "~/features/context/settings";
import {
  fadeIn,
  hoverLift,
  pressScale,
  selectionPulse,
  staggerChildren,
} from "~/features/lib/gsap-directives";
import { cn } from "~/features/lib/utils";
import { Button } from "./button";
import { Dialog, DialogContent } from "./dialog";
import { Label } from "./label";

void fadeIn;
void hoverLift;
void pressScale;
void selectionPulse;
void staggerChildren;

// Icons
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

const CheckIcon = () => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Theme mode options
const THEME_MODES: { value: ThemeMode; label: string; icon: Component }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
];

const GLASS_PRESETS = [
  { value: "subtle", label: "Subtle" },
  { value: "balanced", label: "Balanced" },
  { value: "strong", label: "Strong" },
] as const;

function GlassPresetChip(props: { preset: "subtle" | "balanced" | "strong" }) {
  const presetClass =
    props.preset === "subtle"
      ? "bg-background/90 backdrop-blur-sm"
      : props.preset === "strong"
        ? "bg-background/75 backdrop-blur-xl"
        : "bg-background/82 backdrop-blur-md";

  return (
    <span class="inline-flex h-4 w-7 items-center justify-center rounded-md border border-border/60">
      <span class={cn("h-2.5 w-5 rounded-sm border border-border/50", presetClass)} />
    </span>
  );
}

// Theme variant definitions
const THEME_VARIANTS: {
  id: ThemeVariant;
  name: string;
  description: string;
  colors: { bg: string; primary: string; text: string };
}[] = [
  {
    id: "default",
    name: "Default",
    description: "Clean and professional",
    colors: {
      bg: "bg-violet-50 dark:bg-violet-950",
      primary: "bg-violet-600",
      text: "text-violet-900 dark:text-violet-100",
    },
  },
  {
    id: "claude",
    name: "Claude",
    description: "Inspired by claude.ai",
    colors: {
      bg: "bg-orange-50 dark:bg-stone-950",
      primary: "bg-orange-700",
      text: "text-stone-900 dark:text-stone-200",
    },
  },
];

// Font family options
const FONT_FAMILIES: {
  id: FontFamily;
  name: string;
  preview: string;
  fontClass: string;
}[] = [
  {
    id: "jakarta",
    name: "Plus Jakarta Sans",
    preview: "The quick brown fox",
    fontClass: "font-['Plus_Jakarta_Sans']",
  },
  {
    id: "inter",
    name: "Inter",
    preview: "The quick brown fox",
    fontClass: "font-['Inter']",
  },
  {
    id: "geist",
    name: "Geist",
    preview: "The quick brown fox",
    fontClass: "font-['Geist']",
  },
  {
    id: "spectral",
    name: "Spectral",
    preview: "The quick brown fox",
    fontClass: "font-['Spectral']",
  },
  {
    id: "system",
    name: "System Default",
    preview: "The quick brown fox",
    fontClass: "font-['system-ui']",
  },
];

// Theme Card Component
const ThemeCard: Component<{
  variant: (typeof THEME_VARIANTS)[number];
  selected: boolean;
  onClick: () => void;
}> = (props) => {
  return (
    <Button
      variant="ghost"
      use:hoverLift={{ y: -2 }}
      use:selectionPulse={{ active: props.selected, scale: 1.01 }}
      class={cn(
        "relative flex h-auto flex-col items-start gap-1.5 rounded-lg border p-2.5 text-left transition-all hover:border-primary/50",
        props.selected ? "border-primary bg-primary/5" : "border-border",
      )}
      onClick={props.onClick}
    >
      <div class="flex w-full items-center justify-between">
        <span class="text-[13px] font-medium">{props.variant.name}</span>
        <Show when={props.selected}>
          <div class="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
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
          </div>
        </Show>
      </div>
      <span class="text-[11px] text-muted-foreground">{props.variant.description}</span>
      {/* Color preview */}
      <div class="mt-0.5 flex gap-1">
        <div class={cn("size-3 rounded-full border", props.variant.colors.bg)} />
        <div class={cn("size-3 rounded-full", props.variant.colors.primary)} />
      </div>
    </Button>
  );
};

// Font Card Component
const FontCard: Component<{
  font: (typeof FONT_FAMILIES)[number];
  selected: boolean;
  onClick: () => void;
}> = (props) => {
  return (
    <Button
      variant="ghost"
      use:hoverLift={{ y: -2 }}
      use:selectionPulse={{ active: props.selected, scale: 1.01 }}
      class={cn(
        "relative flex h-auto items-center justify-between gap-3 rounded-lg border p-2.5 text-left transition-all hover:border-primary/50",
        props.selected ? "border-primary bg-primary/5" : "border-border",
      )}
      onClick={props.onClick}
    >
      <div class="flex flex-col gap-0.5">
        <span class="text-[13px] font-medium">{props.font.name}</span>
        <span class={cn("text-xs text-muted-foreground", props.font.fontClass)}>
          {props.font.preview}
        </span>
      </div>
      <Show when={props.selected}>
        <div class="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
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
        </div>
      </Show>
    </Button>
  );
};

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Section Header
const SectionHeader: Component<{ title: string; subtitle?: string }> = (props) => (
  <div class="mb-5">
    <h3 class="text-sm font-semibold tracking-tight">{props.title}</h3>
    <Show when={props.subtitle}>
      <p class="text-xs text-muted-foreground mt-0.5">{props.subtitle}</p>
    </Show>
  </div>
);

export const SettingsModal: Component<SettingsModalProps> = (props) => {
  const {
    state,
    setTheme,
    setThemeVariant,
    setGlassPreset,
    setFontFamily,
    setCustomGoogleFont,
    setSidebarFontFamily,
    reset,
  } = useSettings();

  const [activeTab, setActiveTab] = createSignal<"theme" | "fonts" | "sidebar">("theme");

  const sidebarItems = [
    { id: "theme" as const, label: "Theme", icon: SunIcon },
    { id: "fonts" as const, label: "Typography", icon: MonitorIcon },
    { id: "sidebar" as const, label: "Sidebar", icon: CheckIcon },
  ];

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent class="max-w-2xl overflow-hidden p-0 glass-card">
        <div class="flex h-105 w-full">
          {/* Modal Sidebar */}
          <aside
            class={cn(
              "w-40 border-r bg-muted/30 p-3 transition-all",
              state.themeVariant === "claude" && "font-spectral border-primary/20",
            )}
          >
            <div class="mb-5 px-2">
              <h2 class="text-sm font-semibold tracking-tight text-primary">Settings</h2>
            </div>
            <nav class="flex w-full flex-col space-y-0.5">
              <For each={sidebarItems}>
                {(item) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab(item.id)}
                    use:pressScale={{ scale: 0.97 }}
                    use:selectionPulse={{ active: activeTab() === item.id }}
                    class={cn(
                      "w-full justify-start gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200",
                      activeTab() === item.id
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                    )}
                  >
                    <item.icon />
                    {item.label}
                  </Button>
                )}
              </For>
            </nav>

            <div class="absolute bottom-3 left-3">
              <Button
                variant="ghost"
                size="sm"
                class="text-[10px] opacity-50 hover:opacity-100"
                use:pressScale
                onClick={() => reset()}
              >
                Reset
              </Button>
            </div>
          </aside>

          {/* Modal Content */}
          <main
            class="flex-1 overflow-y-auto p-5 scrollbar-none"
            use:fadeIn={{ y: 8, duration: 0.22 }}
          >
            <Show when={activeTab() === "theme"}>
              <SectionHeader title="Appearance" subtitle="Customize the overall look and feel." />
              <div class="space-y-5" use:staggerChildren={{ stagger: 0.05, y: 8, duration: 0.22 }}>
                <div class="space-y-2">
                  <Label class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Mode
                  </Label>
                  <div class="flex gap-1.5">
                    <For each={THEME_MODES}>
                      {(mode) => (
                        <Button
                          variant={state.theme === mode.value ? "default" : "outline"}
                          size="sm"
                          class="flex-1 gap-1.5 rounded-lg"
                          use:pressScale={{ scale: 0.97 }}
                          use:selectionPulse={{
                            active: state.theme === mode.value,
                          }}
                          onClick={() => setTheme(mode.value)}
                        >
                          <mode.icon />
                          {mode.label}
                        </Button>
                      )}
                    </For>
                  </div>
                </div>

                <div class="space-y-2">
                  <Label class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Theme Style
                  </Label>
                  <div class="grid grid-cols-3 gap-2">
                    <For each={THEME_VARIANTS}>
                      {(variant) => (
                        <ThemeCard
                          variant={variant}
                          selected={state.themeVariant === variant.id}
                          onClick={() => setThemeVariant(variant.id)}
                        />
                      )}
                    </For>
                  </div>
                </div>

                <div class="space-y-2">
                  <Label class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Glass Effect
                  </Label>
                  <div class="grid grid-cols-3 gap-2">
                    <For each={GLASS_PRESETS}>
                      {(preset) => (
                        <Button
                          variant={state.glassPreset === preset.value ? "default" : "outline"}
                          size="sm"
                          class="rounded-lg justify-between"
                          use:pressScale={{ scale: 0.97 }}
                          use:selectionPulse={{
                            active: state.glassPreset === preset.value,
                          }}
                          onClick={() => setGlassPreset(preset.value)}
                        >
                          <span>{preset.label}</span>
                          <GlassPresetChip preset={preset.value} />
                        </Button>
                      )}
                    </For>
                  </div>
                </div>
              </div>
            </Show>

            <Show when={activeTab() === "fonts"}>
              <SectionHeader title="Typography" subtitle="Choose your preferred font family." />
              <div class="space-y-2" use:staggerChildren={{ stagger: 0.05, y: 8, duration: 0.22 }}>
                <Show when={state.fontFamily === "google" && state.customGoogleFont}>
                  <div class="rounded-lg border border-primary/30 bg-primary/5 p-2.5 flex items-center justify-between">
                    <div class="flex flex-col gap-0.5">
                      <span class="text-[13px] font-medium">{state.customGoogleFont}</span>
                      <span class="text-[11px] text-muted-foreground">Google Font</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <CheckIcon />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        class="h-6 px-2 text-[10px]"
                        use:pressScale={{ scale: 0.97 }}
                        onClick={() => {
                          setCustomGoogleFont(null);
                          setFontFamily("jakarta");
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </Show>
                <Label class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  App Font
                </Label>
                <div class="grid gap-1.5">
                  <For each={FONT_FAMILIES}>
                    {(font) => (
                      <FontCard
                        font={font}
                        selected={state.fontFamily === font.id}
                        onClick={() => {
                          setFontFamily(font.id);
                          setCustomGoogleFont(null);
                        }}
                      />
                    )}
                  </For>
                </div>
              </div>
            </Show>

            <Show when={activeTab() === "sidebar"}>
              <SectionHeader title="Sidebar Settings" subtitle="Configure navigation sidebar." />
              <div class="space-y-4" use:staggerChildren={{ stagger: 0.05, y: 8, duration: 0.22 }}>
                <div class="space-y-2">
                  <Label class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Sidebar Font
                  </Label>
                  <div class="grid gap-1.5">
                    <For each={FONT_FAMILIES}>
                      {(font) => (
                        <FontCard
                          font={font}
                          selected={state.sidebarFontFamily === font.id}
                          onClick={() => setSidebarFontFamily(font.id)}
                        />
                      )}
                    </For>
                  </div>
                </div>

                <div class="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p class="text-[13px] font-medium">Collapsed State</p>
                    <p class="text-[11px] text-muted-foreground">Minimize sidebar to icons only.</p>
                  </div>
                  <Button
                    variant={state.sidebarCollapsed ? "default" : "outline"}
                    size="sm"
                    use:pressScale={{ scale: 0.97 }}
                    use:selectionPulse={{ active: state.sidebarCollapsed }}
                    onClick={() =>
                      useSettings().update("sidebarCollapsed", !state.sidebarCollapsed)
                    }
                  >
                    {state.sidebarCollapsed ? "Expanded" : "Collapsed"}
                  </Button>
                </div>
              </div>
            </Show>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Hook for using settings modal
export function createSettingsModal() {
  const [open, setOpen] = createSignal(false);

  return {
    open,
    setOpen,
    toggle: () => setOpen((v) => !v),
    SettingsModal: () => <SettingsModal open={open()} onOpenChange={setOpen} />,
  };
}

export default SettingsModal;
