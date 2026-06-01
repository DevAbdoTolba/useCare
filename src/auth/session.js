/**
 * Tiny session cache.
 *
 * The signed-in user object (no password) is mirrored into localStorage so a
 * page refresh restores the session synchronously, without waiting on a /me
 * round-trip. The JWT itself lives in api/http.js (uc_access / uc_refresh).
 *
 * This replaces the old localStorage *auth* store — there is no client-side
 * password checking anymore; the Django backend is the source of truth.
 */
const SESSION_KEY = 'usecare_session';

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(user) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    /* storage unavailable — ignore */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function updateStoredUser(patch) {
  const current = getStoredSession();
  if (!current) return null;
  const next = { ...current, ...patch };
  saveSession(next);
  return next;
}
