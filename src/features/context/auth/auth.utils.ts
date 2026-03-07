import { tokenStorage } from "~/features/lib/token-storage";
import type { AuthState, AuthUser } from "./auth.types";

export const STORAGE_KEY = "cms.auth.v2";

// Check if we should use demo mode (no API URL configured)
export const USE_DEMO_MODE = true;

// Demo users for development/testing when API is not available
export const DEMO_USERS: AuthUser[] = [
  {
    id: "1",
    name: "Admin User",
    firstName: "Admin",
    lastName: "User",
    email: "admin@demo.com",
    avatar: null,
    role: "admin",
    roles: ["admin"],
    permissions: [
      "dashboard.view",
      "datatable.view",
      "datatable.edit",
      "form.view",
      "settings.view",
      "users.manage",
    ],
  },
  {
    id: "2",
    name: "Editor User",
    firstName: "Editor",
    lastName: "User",
    email: "editor@demo.com",
    avatar: null,
    role: "editor",
    roles: ["editor"],
    permissions: ["dashboard.view", "datatable.view", "form.view"],
  },
];

// Helper to parse user from API response
export function parseUser(data: Record<string, unknown>): AuthUser {
  return {
    id: String(data.id ?? ""),
    email: String(data.email ?? ""),
    name: String(data.name ?? `${data.firstName ?? ""} ${data.lastName ?? ""}`),
    firstName: String(data.firstName ?? ""),
    lastName: String(data.lastName ?? ""),
    avatar: data.avatar ? String(data.avatar) : null,
    role: String(data.role ?? "user"),
    roles: Array.isArray(data.roles) ? data.roles : [String(data.role ?? "user")],
    permissions: Array.isArray(data.permissions) ? data.permissions : [],
  };
}

export function loadAuthState(): AuthState {
  if (typeof window === "undefined") {
    return {
      user: null,
      tokens: { accessToken: null, refreshToken: null },
      status: "idle",
      initialized: false,
    };
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  const accessToken = tokenStorage.getAccessToken();
  const refreshToken = tokenStorage.getRefreshToken();
  if (!stored || !accessToken)
    return {
      user: null,
      tokens: { accessToken: null, refreshToken: null },
      status: "unauthenticated",
      initialized: true,
    };
  try {
    const parsed = JSON.parse(stored) as { user: AuthUser };
    return {
      user: parsed.user,
      tokens: { accessToken, refreshToken },
      status: "authenticated",
      initialized: false, // Wait for validation
    };
  } catch {
    return {
      user: null,
      tokens: { accessToken: null, refreshToken: null },
      status: "unauthenticated",
      initialized: true,
    };
  }
}
