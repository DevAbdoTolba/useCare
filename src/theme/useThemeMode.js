import { useContext } from 'react';
import { ThemeModeContext } from './ThemeModeProvider.jsx';

export function useThemeMode() {
  return useContext(ThemeModeContext);
}
