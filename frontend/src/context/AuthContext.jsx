import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "@/services/api/apiHandler";
import { TOKEN_STORAGE_KEY, ORG_STORAGE_KEY } from "@/utils/constants";

/**
 * AuthContext
 *
 * Provides: user, token, activeOrg, login, loginWithToken, logout, setActiveOrg, isLoading
 *
 * On mount: reads token from localStorage → calls GET /auth/me to hydrate user.
 * On 401: token is cleared by apiClient interceptor; user stays null.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [activeOrg, setActiveOrgState] = useState(() => {
    try {
      const stored = localStorage.getItem(ORG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  /** Hydrate user from stored token */
  const hydrateUser = useCallback(async (storedToken) => {
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    try {
      const me = await authApi.getMe();
      setUser(me);
    } catch {
      // Token is invalid/expired — clear it
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrateUser(token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** Store token + hydrate user after email/password login */
  const login = useCallback(async (accessToken, userData) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    setToken(accessToken);
    setUser(userData);
  }, []);

  /** Called from OAuth callback page — receives just a token, fetches user */
  const loginWithToken = useCallback(async (accessToken) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    setToken(accessToken);
    setIsLoading(true);
    try {
      const me = await authApi.getMe();
      setUser(me);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(ORG_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setActiveOrgState(null);
    window.location.href = "/login";
  }, []);

  const setActiveOrg = useCallback((org) => {
    setActiveOrgState(org);
    if (org) {
      localStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(org));
    } else {
      localStorage.removeItem(ORG_STORAGE_KEY);
    }
  }, []);

  const value = {
    user,
    token,
    activeOrg,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithToken,
    logout,
    setActiveOrg,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  }
  return ctx;
}

export default AuthContext;
