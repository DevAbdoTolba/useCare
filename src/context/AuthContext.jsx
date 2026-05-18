import { createContext, useState, useCallback } from 'react';

/**
 * Mock auth state. No real persistence yet.
 * - login(user)   stash user object
 * - logout()      clear user
 * - role          current user's role or null
 *
 * Devs: when the real backend is wired up, replace the body of login() to
 * call src/api/auth.js and store the token (localStorage / cookie).
 */

export const AuthContext = createContext({
  user: null,
  role: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((u) => setUser(u), []);
  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, role: user?.role ?? null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
