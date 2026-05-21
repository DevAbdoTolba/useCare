/**
 * Standalone localStorage-backed auth store.
 *
 * This is intentionally self-contained so it can be DETACHED in one step once
 * a real backend is integrated — nothing here talks to the network. Sessions
 * and "registered" accounts live in localStorage. The store is seeded once from
 * the bundled demo data (src/schema/seed.json) so the known demo accounts (and
 * their ids) line up with the mock API used by the rest of the app.
 */
import seed from '../schema/seed.json';

const USERS_KEY = 'usecare_users';
const SESSION_KEY = 'usecare_session';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — ignore for the mock */
  }
}

/** Strip the password before a user object ever reaches React state. */
function withoutPassword(user) {
  if (!user) return user;
  const { password, ...safe } = user;
  return safe;
}

/** Seed the user store once from the bundled demo data. */
function ensureSeeded() {
  const existing = readJSON(USERS_KEY, null);
  if (Array.isArray(existing) && existing.length) return existing;
  const users = seed.users.map((u) => ({ ...u }));
  writeJSON(USERS_KEY, users);
  return users;
}

export function getLocalUsers() {
  return ensureSeeded();
}

export function getStoredSession() {
  return readJSON(SESSION_KEY, null);
}

export function saveSession(user) {
  writeJSON(SESSION_KEY, user);
}

export function logoutLocal() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/** Validate credentials against the local store. Throws on failure. */
export function loginLocal(email, password) {
  const users = ensureSeeded();
  const found = users.find(
    (u) => u.email?.toLowerCase() === String(email).toLowerCase(),
  );
  if (!found || found.password !== password) {
    throw new Error('Invalid email or password');
  }
  const safe = withoutPassword(found);
  saveSession(safe);
  return safe;
}

/** Create a new account in the local store. Throws if the email is taken. */
export function registerLocal(payload) {
  const users = ensureSeeded();
  const exists = users.some(
    (u) => u.email?.toLowerCase() === String(payload.email).toLowerCase(),
  );
  if (exists) {
    throw new Error('An account with this email already exists');
  }
  const nextId = users.reduce((max, u) => Math.max(max, u.id || 0), 0) + 1;
  const user = { id: nextId, ...payload };
  users.push(user);
  writeJSON(USERS_KEY, users);
  const safe = withoutPassword(user);
  saveSession(safe);
  return safe;
}

/** Patch a stored user (e.g. profile edit). Keeps the session in sync. */
export function updateLocalUser(id, patch) {
  const users = ensureSeeded();
  const next = users.map((u) => (u.id === id ? { ...u, ...patch } : u));
  writeJSON(USERS_KEY, next);
  const safe = withoutPassword(next.find((u) => u.id === id));
  const session = getStoredSession();
  if (session && session.id === id) saveSession(safe);
  return safe;
}
