import { type Component, Show } from "solid-js";
import { type ThemeMode, useSettings } from "~/features/context/settings";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-5"
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
    class="size-5"
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

interface ThemeToggleProps {
  showTooltip?: boolean;
}

export const ThemeToggle: Component<ThemeToggleProps> = (props) => {
  const { state, setTheme } = useSettings();

  const getCurrentIcon = () => {
    if (state.theme === "system") {
      // When system, show icon based on actual resolved theme
      const isDark =
        typeof window !== "undefined"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
          : false;
      return isDark ? <MoonIcon /> : <SunIcon />;
    }
    return state.theme === "dark" ? <MoonIcon /> : <SunIcon />;
  };

  const handleThemeChange = (theme: ThemeMode) => {
    setTheme(theme);
  };

  const TriggerButton = () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={Button}
        variant="ghost"
        size="icon"
        class="size-9 text-muted-foreground hover:text-foreground border border-border/40 bg-white dark:bg-card hover:bg-accent dark:hover:bg-accent"
      >
        {getCurrentIcon()}
        <span class="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          class="flex items-center justify-between gap-2"
          onSelect={() => handleThemeChange("light")}
        >
          <div class="flex items-center gap-2">
            <SunIcon />
            Light
          </div>
          <Show when={state.theme === "light"}>
            <CheckIcon />
          </Show>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex items-center justify-between gap-2"
          onSelect={() => handleThemeChange("dark")}
        >
          <div class="flex items-center gap-2">
            <MoonIcon />
            Dark
          </div>
          <Show when={state.theme === "dark"}>
            <CheckIcon />
          </Show>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex items-center justify-between gap-2"
          onSelect={() => handleThemeChange("system")}
        >
          <div class="flex items-center gap-2">
            <MonitorIcon />
            System
          </div>
          <Show when={state.theme === "system"}>
            <CheckIcon />
          </Show>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Show when={props.showTooltip !== false} fallback={<TriggerButton />}>
      <Tooltip>
        <TooltipTrigger as="div">
          <TriggerButton />
        </TooltipTrigger>
        <TooltipContent>Change theme</TooltipContent>
      </Tooltip>
    </Show>
  );
};

export default ThemeToggle;
