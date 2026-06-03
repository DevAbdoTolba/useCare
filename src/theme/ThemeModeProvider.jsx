import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { THEMES, DEFAULT_THEME_KEY } from './themes.js';
import { getSiteTheme } from '../api/settings.js';

const STORAGE_KEY = 'usecare_theme';

// How often to re-check the admin-chosen theme from the backend (ms). Cheap
// public GET; keeps every open tab in sync without WebSockets.
const POLL_MS = 3000;

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

  // Reconcile with the admin-chosen site theme from the backend on load AND
  // keep it in sync afterwards: poll every POLL_MS so an admin's theme change
  // propagates to every open tab on its own — no reload, no WebSocket, no
  // backend change (just the existing public GET /settings/). setMode is a
  // no-op when the value is unchanged, so a steady poll never causes a re-render.
  useEffect(() => {
    let active = true;

    const sync = () => {
      getSiteTheme()
        .then((serverMode) => {
          if (active && serverMode && THEMES[serverMode]) setMode(serverMode);
        })
        .catch(() => { /* offline / no backend -> keep the cached theme */ });
    };

    sync(); // immediate on mount

    // Only poll while the tab is visible; refresh the instant it regains focus
    // so a backgrounded tab catches up at once instead of waiting a full cycle.
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') sync();
    }, POLL_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') sync(); };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      active = false;
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
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
