const TOKEN_KEY = "cms.access-token";
const REFRESH_KEY = "cms.refresh-token";

/**
 * Token storage using in-memory primary + sessionStorage fallback.
 *
 * - In-memory storage is preferred because it is not accessible via
 *   `document.cookie` / `localStorage` in an XSS scenario.
 * - sessionStorage is used as a fallback so tokens survive page reloads
 *   within the same tab, but do NOT persist across browser sessions
 *   or leak to other tabs (unlike localStorage).
 *
 * For maximum security, migrate to HttpOnly cookie-based auth on the backend.
 */
let memAccessToken: string | null = null;
let memRefreshToken: string | null = null;

export const tokenStorage = {
  setTokens(accessToken: string, refreshToken?: string | null) {
    memAccessToken = accessToken;
    sessionStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
      memRefreshToken = refreshToken;
      sessionStorage.setItem(REFRESH_KEY, refreshToken);
    }
  },
  getAccessToken() {
    return memAccessToken ?? sessionStorage.getItem(TOKEN_KEY);
  },
  getRefreshToken() {
    return memRefreshToken ?? sessionStorage.getItem(REFRESH_KEY);
  },
  clearTokens() {
    memAccessToken = null;
    memRefreshToken = null;
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
  },
  hasTokens() {
    return !!(memAccessToken ?? sessionStorage.getItem(TOKEN_KEY));
  },
};
