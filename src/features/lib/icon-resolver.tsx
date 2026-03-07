import type { JSX } from "solid-js";
import { ChartIcon, FormIcon, HomeIcon, SettingsIcon, TableIcon } from "~/features/navigation";

type IconName = "home" | "table" | "form" | "chart" | "settings";

const ICON_MAP: Record<IconName, () => JSX.Element> = {
  home: HomeIcon,
  table: TableIcon,
  form: FormIcon,
  chart: ChartIcon,
  settings: SettingsIcon,
};

export function resolveIcon(name?: string): (() => JSX.Element) | undefined {
  if (!name) return undefined;
  return ICON_MAP[name as IconName];
}
