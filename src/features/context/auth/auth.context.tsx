import {
  createContext,
  createEffect,
  createMemo,
  type JSX,
  on,
  onMount,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { apiClient } from "~/features/lib/api-client";
import { tokenStorage } from "~/features/lib/token-storage";
import type { AuthContextValue, AuthUser, LoginPayload } from "./auth.types";
import { DEMO_USERS, loadAuthState, parseUser, STORAGE_KEY, USE_DEMO_MODE } from "./auth.utils";

// Re-export types for backward compatibility
export type { AuthContextValue, AuthState, AuthUser, LoginPayload } from "./auth.types";

const AuthContext = createContext<AuthContextValue>();

// Module-level accessor — set synchronously in AuthProvider body so it is
// available before RouterProvider (and therefore beforeLoad) runs.
let _authCtx: AuthContextValue | null = null;
export function getAuthContext(): AuthContextValue | null {
  return _authCtx;
}

export function AuthProvider(props: { children: JSX.Element }) {
  const [state, setState] = createStore(loadAuthState());

  const persist = () => {
    if (typeof window === "undefined") return;
    if (state.user && state.tokens.accessToken) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user }));
      tokenStorage.setTokens(state.tokens.accessToken, state.tokens.refreshToken);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      tokenStorage.clearTokens();
    }
  };

  createEffect(
    on(
      () => [state.user, state.tokens.accessToken, state.tokens.refreshToken] as const,
      () => persist(),
      { defer: true }, // only persist on actual changes, not on initial mount
    ),
  );

  const isAuthenticated = createMemo(() => !!state.user && !!state.tokens.accessToken);

  // Initialize auth state - validate existing tokens with /auth/me
  const init = async (): Promise<void> => {
    try {
      const token = tokenStorage.getAccessToken();
      if (!token) {
        setState("status", "unauthenticated");
        return;
      }

      setState("status", "loading");

      // In demo mode, just restore from local storage
      if (USE_DEMO_MODE) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as { user: AuthUser };
            setState({
              user: parsed.user,
              tokens: {
                accessToken: token,
                refreshToken: tokenStorage.getRefreshToken(),
              },
              status: "authenticated",
            });
            return;
          } catch {
            // Fall through to unauthenticated
          }
        }
        setState({
          user: null,
          tokens: { accessToken: null, refreshToken: null },
          status: "unauthenticated",
        });
        return;
      }

      // Real API mode: validate token with /auth/me
      try {
        const response = await apiClient.get<{ data: Record<string, unknown> }>("/auth/me");
        const user = parseUser(response.data);
        setState({
          user,
          tokens: {
            accessToken: token,
            refreshToken: tokenStorage.getRefreshToken(),
          },
          status: "authenticated",
        });
      } catch {
        // Token invalid - clear and set unauthenticated
        tokenStorage.clearTokens();
        localStorage.removeItem(STORAGE_KEY);
        setState({
          user: null,
          tokens: { accessToken: null, refreshToken: null },
          status: "unauthenticated",
        });
      }
    } finally {
      setState("initialized", true);
    }
  };

  const login = async (payload: LoginPayload): Promise<boolean> => {
    setState("status", "loading");

    // Demo mode login
    if (USE_DEMO_MODE) {
      const user = DEMO_USERS.find((item) => item.email === payload.email);
      if (!user || payload.password.length < 4) {
        setState({
          user: null,
          tokens: { accessToken: null, refreshToken: null },
          status: "unauthenticated",
        });
        return false;
      }
      setState({
        user,
        tokens: {
          accessToken: `demo-token-${user.id}`,
          refreshToken: `demo-refresh-${user.id}`,
        },
        status: "authenticated",
      });
      return true;
    }

    // Real API login
    try {
      interface LoginResponse {
        data: {
          token: string;
          refreshToken: string;
          user: Record<string, unknown>;
          menu?: unknown[];
        };
      }
      const response = await apiClient.post<LoginResponse>("/auth/login", payload);
      const { token, refreshToken, user } = response.data;

      tokenStorage.setTokens(token, refreshToken);

      setState({
        user: parseUser(user),
        tokens: { accessToken: token, refreshToken },
        status: "authenticated",
      });

      return true;
    } catch {
      setState({
        user: null,
        tokens: { accessToken: null, refreshToken: null },
        status: "unauthenticated",
      });
      return false;
    }
  };

  const logout = (): void => {
    tokenStorage.clearTokens();
    localStorage.removeItem(STORAGE_KEY);
    setState({
      user: null,
      tokens: { accessToken: null, refreshToken: null },
      status: "unauthenticated",
    });
  };

  const refresh = async (): Promise<boolean> => {
    const refreshToken = state.tokens.refreshToken;
    if (!refreshToken) return false;

    // Demo mode refresh
    if (USE_DEMO_MODE) {
      setState("status", "loading");
      await new Promise((resolve) => setTimeout(resolve, 200));
      setState("tokens", "accessToken", `demo-token-${state.user?.id ?? "1"}`);
      setState("status", "authenticated");
      return true;
    }

    // Real API refresh
    try {
      setState("status", "loading");
      interface RefreshResponse {
        token: string;
        refreshToken: string;
      }
      const response = await apiClient.post<RefreshResponse>("/auth/refresh", {
        refreshToken,
      });
      const { token, refreshToken: newRefreshToken } = response;

      tokenStorage.setTokens(token, newRefreshToken);
      setState("tokens", { accessToken: token, refreshToken: newRefreshToken });
      setState("status", "authenticated");
      return true;
    } catch {
      logout();
      return false;
    }
  };

  // Initialize auth on mount - validate existing tokens with the server
  onMount(() => {
    if (tokenStorage.hasTokens()) {
      init();
    } else {
      setState("initialized", true);
    }
  });

  const value: AuthContextValue = {
    state,
    isAuthenticated,
    login,
    logout,
    refresh,
    init,
  };

  // Set before returning JSX so the accessor is ready when RouterProvider mounts.
  _authCtx = value;

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
