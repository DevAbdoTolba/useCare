import { createContext, useState, useCallback } from 'react';
import {
  getStoredSession,
  saveSession,
  logoutLocal,
  updateLocalUser,
} from '../auth/localAuthStore.js';

/**
 * Auth state backed by the standalone localStorage store
 * (src/auth/localAuthStore.js). The session is restored on load, so a refresh
 * keeps you signed in. Detach the store import to swap in a real backend.
 *
 * - login(user)            persist + set the current user
 * - logout()               clear the session
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
    logoutLocal();
    setUser(null);
  }, []);

  const updateCurrentUser = useCallback((patch) => {
    setUser((prev) => (prev ? updateLocalUser(prev.id, patch) : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role: user?.role ?? null, login, logout, updateCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
