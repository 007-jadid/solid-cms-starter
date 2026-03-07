import type {
  ApiMenuItem,
  MenuAction,
  MenuItem,
  ParsedPermissions,
  PermissionedAction,
  PermissionsContextValue,
} from "./permissions.types";

// ============================================================================
// URL Normalization Helper
// ============================================================================

export function normalizeUrl(url?: string | null): string {
  if (!url) return "";
  return url
    .replace(/\/$/, "") // Remove trailing slash
    .replace(/^\/+/, "/") // Normalize leading slashes
    .toLowerCase();
}

// ============================================================================
// Login Response Parser
// ============================================================================

export function parseLoginPermissions(menu: ApiMenuItem[]): ParsedPermissions {
  const permissionMap = new Map<string, MenuAction>();
  const pagePermissionMap = new Map<string, MenuItem>();

  const processMenu = (items: ApiMenuItem[], parentId: string | null = null, depth = 0) => {
    items.forEach((item) => {
      // Add page permission
      if (item.url) {
        const menuItem: MenuItem = {
          id: String(item.id),
          name: item.name,
          url: item.url,
          displayName: item.displayName,
          icon: item.icon,
          isVisible: item.isVisible,
          parentId,
          depth,
        };
        pagePermissionMap.set(normalizeUrl(item.url), menuItem);
      }

      // Add action permissions
      if (item.menuActions?.length) {
        item.menuActions.forEach((action) => {
          permissionMap.set(action.name, {
            id: String(action.id),
            name: action.name,
            displayName: action.displayName,
            menuId: String(item.id),
          });
        });
      }

      // Process children recursively
      if (item.subMenus?.length) {
        processMenu(item.subMenus, String(item.id), depth + 1);
      }
    });
  };

  processMenu(menu ?? []);

  return {
    actions: Array.from(permissionMap.values()),
    pages: Array.from(pagePermissionMap.values()),
    permissionMap,
    pagePermissionMap,
  };
}

// ============================================================================
// DataTable Actions Filter
// ============================================================================

export function filterActionsByPermission<TRow>(
  actions: PermissionedAction<TRow>[],
  permissions: PermissionsContextValue,
): PermissionedAction<TRow>[] {
  return actions.filter((action) => {
    if (action.permission) {
      return permissions.can(action.permission);
    }
    if (action.permissions?.length) {
      return permissions.hasPermissions(action.permissions, action.permissionMode ?? "all");
    }
    return true;
  });
}
