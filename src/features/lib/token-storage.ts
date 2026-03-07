const TOKEN_KEY = "cms.access-token";
const REFRESH_KEY = "cms.refresh-token";

export const tokenStorage = {
  setTokens(accessToken: string, refreshToken?: string | null) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_KEY, refreshToken);
    }
  },
  getAccessToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  getRefreshToken() {
    return localStorage.getItem(REFRESH_KEY);
  },
  clearTokens() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
  hasTokens() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
