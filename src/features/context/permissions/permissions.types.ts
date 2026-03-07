import type { Component, JSX } from "solid-js";

// ============================================================================
// Type Definitions (from API response structure)
// ============================================================================

export interface ApiMenuAction {
  id: number;
  name: string; // Permission key: "CUSTOMERS_EDIT", "CUSTOMERS_DELETE"
  displayName: string;
}

export interface ApiMenuItem {
  id: number;
  name: string;
  url: string | null;
  icon: string | null;
  displayName: string;
  hasSubMenus: boolean;
  isVisible: boolean;
  subMenus: ApiMenuItem[];
  menuActions: ApiMenuAction[];
}

export interface ApiLoginResponse {
  data: {
    token: string;
    refreshToken: string;
    user: { id: number; email: string; name: string };
    menu: ApiMenuItem[];
  };
}

export interface MenuAction {
  id: string;
  name: string;
  displayName?: string;
  menuId?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  url?: string | null;
  displayName?: string;
  icon?: string | null;
  isVisible?: boolean;
  parentId?: string | null;
  depth?: number;
}

export interface PermissionConfig {
  enabled: boolean;
  pagePermissionEnabled: boolean;
  actionPermissionEnabled: boolean;
  defaultBehavior: "deny" | "allow";
  debug: boolean;
}

export interface PermissionsContextValue {
  permissions: () => string[];
  can: (permission?: string) => boolean;
  hasPermission: (action: string) => boolean;
  hasPermissions: (actions: string[], mode?: "all" | "any") => boolean;
  hasPagePermission: (url?: string) => boolean;
  setPermissions: (actions: MenuAction[], pages: MenuItem[]) => void;
  getActionPermissions: () => MenuAction[];
  getPagePermissions: () => MenuItem[];
  config: PermissionConfig;
}

export interface ParsedPermissions {
  actions: MenuAction[];
  pages: MenuItem[];
  permissionMap: Map<string, MenuAction>;
  pagePermissionMap: Map<string, MenuItem>;
}

export interface PermissionGuardProps {
  /** Single permission to check */
  action?: string;
  /** Multiple permissions to check */
  actions?: string[];
  /** Mode for multiple permissions: "all" requires all, "any" requires at least one */
  mode?: "all" | "any";
  /** Fallback content when permission denied */
  fallback?: JSX.Element;
  /** Content to show when permission granted */
  children: JSX.Element;
}

export interface WithPermissionOptions {
  /** Single permission to check */
  action?: string;
  /** Multiple permissions to check */
  actions?: string[];
  /** Mode for multiple permissions */
  mode?: "all" | "any";
  /** Fallback component when permission denied */
  FallbackComponent?: Component<Record<string, unknown>>;
  /** Props to pass to fallback component */
  fallbackProps?: Record<string, unknown>;
}

export interface RoutePermissionCheck {
  /** Page URL to check */
  url?: string;
  /** Action permission to check */
  action?: string;
  /** Multiple actions to check */
  actions?: string[];
  /** Mode for multiple actions */
  mode?: "all" | "any";
  /** Redirect path when permission denied */
  redirectTo?: string;
}

export interface PermissionedAction<TRow> {
  /** Unique key for the action */
  key: string;
  /** Display label */
  label: string;
  /** Permission required to show this action */
  permission?: string;
  /** Multiple permissions required */
  permissions?: string[];
  /** Mode for multiple permissions */
  permissionMode?: "all" | "any";
  /** Icon component */
  icon?: () => JSX.Element;
  /** Click handler */
  onClick: (row: TRow) => void;
  /** Whether the action is destructive (for styling) */
  destructive?: boolean;
  /** Disable the action conditionally */
  disabled?: (row: TRow) => boolean;
}

// ============================================================================
// Constants
// ============================================================================

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ["*"],
  editor: ["dashboard.view", "datatable.view", "form.view"],
  viewer: ["dashboard.view"],
};

export const DEFAULT_CONFIG: PermissionConfig = {
  enabled: true,
  pagePermissionEnabled: false,
  actionPermissionEnabled: true,
  defaultBehavior: "deny",
  debug: import.meta.env.DEV,
};
