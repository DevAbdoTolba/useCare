import { createContext, useCallback, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { THEMES, DEFAULT_THEME_KEY } from './themes.js';

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
 * Site-wide theme switch. The chosen theme key is persisted in localStorage so
 * it sticks across reloads. Wraps the app in the matching MUI ThemeProvider —
 * changing the mode re-skins the entire UI from the theme config alone.
 */
export function ThemeModeProvider({ children }) {
  const [mode, setModeState] = useState(readStoredMode);

  const setMode = useCallback((next) => {
    if (!THEMES[next]) return;
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
    setModeState(next);
  }, []);

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
