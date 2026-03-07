export interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: string;
  roles: string[];
  permissions: string[];
}

export interface AuthState {
  user: AuthUser | null;
  tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  initialized: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthContextValue {
  state: AuthState;
  isAuthenticated: () => boolean;
  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => void;
  refresh: () => Promise<boolean>;
  init: () => Promise<void>;
}
