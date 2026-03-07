import type { JSX } from "solid-js";

export interface SidebarItem {
  id: string;
  title: string;
  icon?: () => JSX.Element;
  href?: string;
  badge?: string | number;
  children?: SidebarItem[];
  permission?: string;
}

export interface SidebarConfig {
  items: SidebarItem[];
}
