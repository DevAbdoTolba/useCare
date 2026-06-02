import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { THEMES, DEFAULT_THEME_KEY } from './themes.js';
import { getSiteTheme } from '../api/settings.js';

const STORAGE_KEY = 'usecare_theme';

export const ThemeModeContext = createContext({
  mode: DEFAULT_THEME_KEY,
  setMode: () => {},
});

function readStoredMode() {
  try {
    const m = localStorage.getItem(STORAGE_KEY);
    return m && THEMES[m] ? m : DEFAULT_THEME_KEY;
  } catch {
    return DEFAULT_THEME_KEY;
  }
}

/**
 * Site-wide theme switch. The admin's choice lives in the backend (a DB row),
 * so EVERY user gets it on every session. We paint immediately from the cached
 * localStorage key to avoid a flash, then reconcile with the server theme on
 * mount. Changing the mode re-skins the entire UI from the theme config alone.
 */
export function ThemeModeProvider({ children }) {
  const [mode, setModeState] = useState(readStoredMode);

  const setMode = useCallback((next) => {
    if (!THEMES[next]) return;
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
    setModeState(next);
  }, []);

  // Reconcile with the admin-chosen site theme from the backend on load.
  useEffect(() => {
    let active = true;
    getSiteTheme()
      .then((serverMode) => {
        if (active && serverMode && THEMES[serverMode]) setMode(serverMode);
      })
      .catch(() => { /* offline / no backend -> keep the cached theme */ });
    return () => { active = false; };
  }, [setMode]);

  const theme = useMemo(() => THEMES[mode] ?? THEMES[DEFAULT_THEME_KEY], [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
