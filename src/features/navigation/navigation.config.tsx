import type { SidebarItem } from "~/features/ui/layout/sidebar.types";
import { HomeIcon, SettingsIcon, TableIcon, UsersIcon } from "./navigation.icons";

export interface NavItem extends SidebarItem {
  permission?: string;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: HomeIcon,
    href: "/dashboard",
    permission: "dashboard.view",
  },
  {
    id: "user-management",
    title: "User Management",
    icon: UsersIcon,
    children: [
      {
        id: "users-list",
        title: "Users List",
        href: "/users",
        permission: "users.view",
      },
      {
        id: "users-create",
        title: "Create User",
        href: "/users/create",
        permission: "users.create",
      },
    ],
  },
  {
    id: "demo",
    title: "Feature Showcase",
    icon: TableIcon,
    href: "/demo",
  },
  {
    id: "settings",
    title: "Settings",
    icon: SettingsIcon,
    href: "/settings",
    permission: "settings.view",
  },
];

export function filterNavItems(items: NavItem[], can: (permission?: string) => boolean): NavItem[] {
  return items
    .filter((item) => can(item.permission))
    .map((item) => ({
      ...item,
      children: item.children ? filterNavItems(item.children, can) : undefined,
    }))
    .filter((item) => (item.children ? item.children.length > 0 : true));
}

export function findBreadcrumbs(items: NavItem[], path: string): NavItem[] {
  for (const item of items) {
    if (item.href === path) return [item];
    if (item.children?.length) {
      const match = findBreadcrumbs(item.children, path);
      if (match.length) return [item, ...match];
    }
  }
  return [];
}
