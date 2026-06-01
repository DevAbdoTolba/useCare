/**
 * Real backend bridge — talks to the RESTCareFul Django API over JWT.
 *
 * This is ADDITIVE on purpose: the rest of the app still runs on the mock
 * client in client.js. Point VITE_BACKEND_URL at the running Django server and
 * switch a screen over to these helpers when you're ready — nothing here
 * touches the existing fixtures flow.
 *
 *   Backend repo: https://github.com/DevAbdoTolba/RESTCareFul
 *   Default base: http://localhost:8000/api/v1
 */

const BASE = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8000/api/v1';

const ACCESS_KEY = 'uc_access';
const REFRESH_KEY = 'uc_refresh';

export function getAccess() {
  return localStorage.getItem(ACCESS_KEY);
}

function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

/**
 * Thin fetch wrapper: JSON in/out, Bearer token attached automatically, and a
 * thrown Error (with .status + .data) on any non-2xx so callers can try/catch.
 */
export async function apiFetch(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const opts = { method, headers: { 'Content-Type': 'application/json', ...headers } };
  const token = getAccess();
  if (auth && token) opts.headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(data?.detail || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function login(email, password) {
  const tokens = await apiFetch('/auth/login/', {
    method: 'POST',
    auth: false,
    body: { email, password },
  });
  setTokens(tokens);
  const user = await me();
  return { token: tokens.access, user };
}

export async function register(payload) {
  return apiFetch('/auth/register/', { method: 'POST', auth: false, body: payload });
}

export async function me() {
  return apiFetch('/auth/me/');
}

export async function refresh() {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  const tokens = await apiFetch('/auth/refresh/', {
    method: 'POST',
    auth: false,
    body: { refresh: refreshToken },
  });
  setTokens(tokens);
  return tokens;
}

export async function logout() {
  clearTokens();
}
