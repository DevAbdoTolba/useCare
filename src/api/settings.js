import { apiFetch } from './http.js';

/**
 * Site-wide settings — backed by the Django backend (a singleton row).
 *
 * The theme is a DB value, not a per-device localStorage flag: the admin picks
 * it once and every user gets it on every new session.
 */

/** Public — the active theme key the admin chose for everyone. */
export async function getSiteTheme() {
  const data = await apiFetch('/settings/', { auth: false });
  return data?.theme ?? null;
}

/** Admin only — set the site-wide theme. Returns the saved key. */
export async function setSiteTheme(theme) {
  const data = await apiFetch('/settings/', { method: 'PUT', body: { theme } });
  return data?.theme ?? theme;
}
