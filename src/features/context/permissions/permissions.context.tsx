import {
  type Component,
  createContext,
  createMemo,
  createSignal,
  type JSX,
  Show,
  useContext,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { useAuth } from "~/features/context/auth/auth.context";
import type {
  MenuAction,
  MenuItem,
  PermissionedAction,
  PermissionGuardProps,
  PermissionsContextValue,
  RoutePermissionCheck,
  WithPermissionOptions,
} from "./permissions.types";
import { DEFAULT_CONFIG, ROLE_PERMISSIONS } from "./permissions.types";
import { filterActionsByPermission, normalizeUrl } from "./permissions.utils";

// Re-export types and utils for backward compatibility
export type {
  ApiLoginResponse,
  ApiMenuAction,
  ApiMenuItem,
  MenuAction,
  MenuItem,
  ParsedPermissions,
  PermissionConfig,
  PermissionedAction,
  PermissionGuardProps,
  PermissionsContextValue,
  RoutePermissionCheck,
  WithPermissionOptions,
} from "./permissions.types";
export { DEFAULT_CONFIG, ROLE_PERMISSIONS } from "./permissions.types";
export {
  filterActionsByPermission,
  normalizeUrl,
  parseLoginPermissions,
} from "./permissions.utils";

// ============================================================================
// Permissions Provider
// ============================================================================

const PermissionsContext = createContext<PermissionsContextValue>();

export function PermissionsProvider(props: { enabled?: boolean; children: JSX.Element }) {
  const auth = useAuth();
  const [actionPermissions, setActionPermissions] = createSignal<MenuAction[]>([]);
  const [pagePermissions, setPagePermissions] = createSignal<MenuItem[]>([]);
  const config = { ...DEFAULT_CONFIG, enabled: props.enabled ?? DEFAULT_CONFIG.enabled };

  const permissions = createMemo(() => {
    const user = auth.state.user;
    if (!user) return [];
    const rolePermissions = user.roles.flatMap((role) => ROLE_PERMISSIONS[role] ?? []);
    const actionNames = actionPermissions().map((action) => action.name);
    return Array.from(new Set([...rolePermissions, ...user.permissions, ...actionNames]));
  });

  const can = (permission?: string): boolean => {
    if (!permission) return true;
    if (!config.enabled || !config.actionPermissionEnabled) return true;
    const current = permissions();
    const hasAction = current.includes("*") || current.includes(permission);
    if (import.meta.env.DEV && config.debug) {
      console.log(`[Permission] Action check: "${permission}" = ${hasAction}`, current);
    }
    return hasAction || config.defaultBehavior === "allow";
  };

  const hasPermission = (action: string): boolean => can(action);

  const hasPermissions = (actions: string[], mode: "all" | "any" = "all"): boolean => {
    if (!actions.length) return true;
    if (mode === "all") return actions.every((action) => can(action));
    return actions.some((action) => can(action));
  };

  const hasPagePermission = (url?: string): boolean => {
    if (!url) return true;
    if (!config.enabled || !config.pagePermissionEnabled) return true;
    const normalized = normalizeUrl(url);
    const hasPage = pagePermissions().some((page) => normalizeUrl(page.url) === normalized);
    if (import.meta.env.DEV && config.debug) {
      console.log(`[Permission] Page check: "${url}" = ${hasPage}`);
    }
    return hasPage || config.defaultBehavior === "allow";
  };

  const setPermissions = (actions: MenuAction[], pages: MenuItem[]) => {
    setActionPermissions(actions);
    setPagePermissions(pages);
    if (import.meta.env.DEV && config.debug) {
      console.log("[Permission] Permissions loaded:", {
        actions: actions.length,
        pages: pages.length,
      });
    }
  };

  const getActionPermissions = () => actionPermissions();
  const getPagePermissions = () => pagePermissions();

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        can,
        hasPermission,
        hasPermissions,
        hasPagePermission,
        setPermissions,
        getActionPermissions,
        getPagePermissions,
        config,
      }}
    >
      {props.children}
    </PermissionsContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}

// ============================================================================
// Permission Guard Component
// ============================================================================

export function PermissionGuard(props: PermissionGuardProps) {
  const permissions = usePermissions();

  const hasAccess = createMemo(() => {
    if (props.action) {
      return permissions.can(props.action);
    }
    if (props.actions?.length) {
      return permissions.hasPermissions(props.actions, props.mode ?? "all");
    }
    return true;
  });

  return (
    <Show when={hasAccess()} fallback={props.fallback}>
      {props.children}
    </Show>
  );
}

export const PermissionGate = PermissionGuard;

// ============================================================================
// Higher-Order Component (HOC)
// ============================================================================

export function withPermission<P extends object>(
  WrappedComponent: Component<P>,
  options: WithPermissionOptions,
): Component<P> {
  return (props: P) => {
    const permissions = usePermissions();

    const hasAccess = createMemo(() => {
      if (options.action) {
        return permissions.can(options.action);
      }
      if (options.actions?.length) {
        return permissions.hasPermissions(options.actions, options.mode ?? "all");
      }
      return true;
    });

    return (
      <Show
        when={hasAccess()}
        fallback={
          options.FallbackComponent ? (
            <Dynamic
              component={options.FallbackComponent}
              {...(options.fallbackProps ?? {})}
              {...props}
            />
          ) : null
        }
      >
        <Dynamic component={WrappedComponent} {...props} />
      </Show>
    );
  };
}

// ============================================================================
// Route Protection Helper (for TanStack Router beforeLoad)
// ============================================================================

export function createRoutePermissionCheck(options: RoutePermissionCheck) {
  return ({
    context,
    location,
  }: {
    context: Record<string, unknown>;
    location: { pathname: string };
  }) => {
    const permissions = context?.permissions as PermissionsContextValue | undefined;

    if (!permissions) {
      if (import.meta.env.DEV) {
        console.warn("[Permission] No permissions context in route context");
      }
      return;
    }

    let hasAccess = true;

    if (options.url) {
      hasAccess = permissions.hasPagePermission(options.url);
    } else if (location?.pathname) {
      hasAccess = permissions.hasPagePermission(location.pathname);
    }

    if (hasAccess && options.action) {
      hasAccess = permissions.can(options.action);
    }

    if (hasAccess && options.actions?.length) {
      hasAccess = permissions.hasPermissions(options.actions, options.mode ?? "all");
    }

    if (!hasAccess) {
      throw new Error(`PERMISSION_DENIED:${options.redirectTo ?? "/403"}`);
    }
  };
}

// ============================================================================
// DataTable Permissioned Actions Hook
// ============================================================================

export function usePermissionedActions<TRow>(actions: PermissionedAction<TRow>[]) {
  const permissions = usePermissions();

  const getVisibleActions = createMemo(() => filterActionsByPermission(actions, permissions));

  return {
    getVisibleActions,
    permissions,
  };
}
