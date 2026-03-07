import axios, { type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "~/features/lib/token-storage";

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
  for (const prom of failedQueue) {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  }
  failedQueue = [];
}

async function refreshTokenFromApi(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<{ token: string; refreshToken: string }>(
      `${import.meta.env.VITE_API_URL ?? ""}/auth/refresh`,
      { refreshToken },
    );

    tokenStorage.setTokens(response.data.token, response.data.refreshToken);
    return response.data.token;
  } catch {
    return null;
  }
}

function handleUnauthorized() {
  if (typeof window !== "undefined") {
    const isLoginPage = window.location.pathname === "/auth/login";
    if (!isLoginPage) {
      tokenStorage.clearTokens();
      window.location.href = "/auth/login";
    }
  }
}

interface RequestOptions {
  signal?: AbortSignal;
  params?: Record<string, unknown>;
}

interface ApiClient {
  get: <T>(url: string, options?: RequestOptions) => Promise<T>;
  post: <T>(url: string, body?: unknown, options?: RequestOptions) => Promise<T>;
  put: <T>(url: string, body?: unknown, options?: RequestOptions) => Promise<T>;
  patch: <T>(url: string, body?: unknown, options?: RequestOptions) => Promise<T>;
  delete: <T>(url: string, options?: RequestOptions) => Promise<T>;
}

function createApiClient(): ApiClient {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "",
    headers: { "Content-Type": "application/json" },
  });

  // Request interceptor — attach token
  instance.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor — handle 401 + token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshTokenFromApi();

        if (newToken) {
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        }

        processQueue(error, null);
        handleUnauthorized();
        return Promise.reject(error);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleUnauthorized();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );

  // Unwrap response.data so consumers get T directly (same API as the old fetch wrapper)
  return {
    get: <T>(url: string, options?: RequestOptions) =>
      instance
        .get<T>(url, { signal: options?.signal, params: options?.params })
        .then((r) => r.data),
    post: <T>(url: string, body?: unknown, options?: RequestOptions) =>
      instance
        .post<T>(url, body, { signal: options?.signal, params: options?.params })
        .then((r) => r.data),
    put: <T>(url: string, body?: unknown, options?: RequestOptions) =>
      instance
        .put<T>(url, body, { signal: options?.signal, params: options?.params })
        .then((r) => r.data),
    patch: <T>(url: string, body?: unknown, options?: RequestOptions) =>
      instance
        .patch<T>(url, body, { signal: options?.signal, params: options?.params })
        .then((r) => r.data),
    delete: <T>(url: string, options?: RequestOptions) =>
      instance
        .delete<T>(url, { signal: options?.signal, params: options?.params })
        .then((r) => r.data),
  };
}

export const apiClient = createApiClient();
