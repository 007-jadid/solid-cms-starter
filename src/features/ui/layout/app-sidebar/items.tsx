import { Link } from "@tanstack/solid-router";
import { For, untrack } from "solid-js";
import { cn } from "~/features/lib/utils";
import {
  DropdownMenuItem as DropdownMenuEntry,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../../components/dropdown-menu";
import type { SidebarItem } from "../sidebar.types";

interface CollapsedSubMenuItemProps {
  item: SidebarItem;
  pathname: string;
  level?: number;
}

export function CollapsedSubMenuItem(props: CollapsedSubMenuItemProps) {
  const level = () => props.level ?? 0;
  const hasChildren = untrack(() => Boolean(props.item.children && props.item.children.length > 0));
  const isActive = () => props.item.href && props.pathname.startsWith(props.item.href);

  if (hasChildren) {
    return (
      <DropdownMenuSub gutter={6}>
        <DropdownMenuSubTrigger
          class={cn(
            "w-full rounded-lg px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors",
            "hover:bg-accent/50 focus:bg-accent/50",
            isActive() ? "text-primary" : "text-foreground",
          )}
        >
          <span>{props.item.title}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent class="min-w-48 max-h-72 overflow-y-auto p-1.5">
          <For each={props.item.children}>
            {(child) => (
              <CollapsedSubMenuItem item={child} pathname={props.pathname} level={level() + 1} />
            )}
          </For>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  }

  return (
    <DropdownMenuEntry
      as={Link}
      to={props.item.href ?? "/dashboard"}
      class={cn(
        "w-full rounded-lg px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors",
        "hover:bg-accent/50 focus:bg-accent/50",
        isActive() ? "text-primary" : "text-foreground",
      )}
      closeOnSelect
    >
      <span>{props.item.title}</span>
    </DropdownMenuEntry>
  );
}

export function hasActiveChild(item: SidebarItem, path: string): boolean {
  if (!item.children) return false;
  return item.children.some(
    (child) => (child.href && path.startsWith(child.href)) || hasActiveChild(child, path),
  );
}
