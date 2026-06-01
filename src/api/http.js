/**
 * Backend transport — talks to the RESTCareFul Django API over JWT.
 *
 * Every api/*.js module goes through apiFetch() here, so there is exactly one
 * place that knows the base URL, attaches the Bearer token, and turns a non-2xx
 * into a thrown Error (with .status + .data).
 *
 *   Backend repo: https://github.com/DevAbdoTolba/RESTCareFul
 *   Default base: http://localhost:8000/api/v1   (override with VITE_BACKEND_URL)
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
    const detail = data?.detail || data?.[Object.keys(data || {})[0]] || `Request failed (${res.status})`;
    const err = new Error(Array.isArray(detail) ? detail[0] : detail);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/** Add a single `name` field the React pages expect (backend stores first/last). */
export function normalizeUser(u) {
  if (!u) return u;
  const name = `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || u.email;
  return { ...u, name };
}

/** Split "Sarah Admin" -> { first_name: 'Sarah', last_name: 'Admin' }. */
export function splitName(fullName = '') {
  const parts = String(fullName).trim().split(/\s+/);
  return { first_name: parts.shift() ?? '', last_name: parts.join(' ') };
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

/** Raw register — returns the created user (no token). Callers log in after. */
export async function register(payload) {
  return apiFetch('/auth/register/', { method: 'POST', auth: false, body: payload });
}

/**
 * Full signup orchestration used by the register form.
 *
 * Backend keeps doctor-only fields on a separate DoctorProfile, so a doctor
 * signup is multi-step: create the user, log in, then upsert the profile (and
 * optionally propose a specialty). Returns { user } ready for the auth context.
 */
export async function signup(values) {
  const { first_name, last_name } = splitName(values.name);
  const isDoctor = values.role === 'doctor';

  await register({
    email: values.email,
    password: values.password,
    role: values.role,
    first_name,
    last_name,
    phone_number: values.phone_number || '',
    gender: values.gender || '',
    date_of_birth: values.date_of_birth || null,
    description: isDoctor ? values.description || '' : '',
  });

  const { user } = await login(values.email, values.password);

  if (isDoctor) {
    await apiFetch('/doctors/me/', {
      method: 'PUT',
      body: {
        specialty: values.specialty_id || null,
        hourly_rate: values.hourly_rate ?? null,
        resume_url: values.resume_url || '',
        license_url: values.license_url || '',
      },
    });
    if (values.suggested_specialty) {
      await apiFetch('/specialties/suggestions/', {
        method: 'POST',
        body: { name: values.suggested_specialty },
      });
    }
  }

  return { user };
}

export async function me() {
  return normalizeUser(await apiFetch('/auth/me/'));
}

export async function updateProfile(patch) {
  await apiFetch('/auth/me/profile/', { method: 'PATCH', body: patch });
  return me();
}

export async function changePassword(oldPassword, newPassword) {
  return apiFetch('/auth/me/password/', {
    method: 'POST',
    body: { old_password: oldPassword, new_password: newPassword },
  });
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

export function logout() {
  clearTokens();
}
