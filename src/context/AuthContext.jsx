import { createContext, useState, useCallback } from 'react';
import {
  getStoredSession,
  saveSession,
  clearSession,
  updateStoredUser,
} from '../auth/session.js';
import { clearTokens } from '../api/http.js';

/**
 * Auth state backed by the JWT session cache (src/auth/session.js). The user is
 * restored from localStorage on load (so a refresh keeps you signed in), while
 * the actual credentials live on the Django backend.
 *
 * - login(user)            persist + set the current user (call AFTER api login)
 * - logout()               clear the session AND the JWT tokens
 * - updateCurrentUser(p)   patch the signed-in user (e.g. profile edit)
 */
export const AuthContext = createContext({
  user: null,
  role: null,
  login: () => {},
  logout: () => {},
  updateCurrentUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredSession());

  const login = useCallback((u) => {
    saveSession(u);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    clearTokens();
    setUser(null);
  }, []);

  const updateCurrentUser = useCallback((patch) => {
    setUser((prev) => (prev ? updateStoredUser(patch) : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role: user?.role ?? null, login, logout, updateCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
