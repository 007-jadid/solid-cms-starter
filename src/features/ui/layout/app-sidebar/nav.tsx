import { For } from "solid-js";
import type { SidebarItem } from "../sidebar.types";
import { SidebarMenuItem } from "./menu-item";

interface SidebarNavProps {
  items: SidebarItem[];
  isMobile: boolean;
  isCollapsed: boolean;
  setNavRef: (el: HTMLElement) => void;
  setIndicatorRef: (el: HTMLDivElement) => void;
}

export function SidebarNav(props: SidebarNavProps) {
  return (
    <nav
      ref={(el) => props.setNavRef(el)}
      class="relative flex-1 space-y-0.5 overflow-y-auto p-2 scrollbar-none"
    >
      <div
        ref={(el) => props.setIndicatorRef(el)}
        class="pointer-events-none absolute left-1 z-10 w-0.75 rounded-full bg-primary opacity-0"
        style={{ height: "0px", top: "0px" }}
      />
      <For each={props.items}>
        {(item) => (
          <SidebarMenuItem item={item} collapsed={props.isMobile ? false : props.isCollapsed} />
        )}
      </For>
    </nav>
  );
}
