import { apiFetch, normalizeUser } from './http.js';

/**
 * Users / accounts data — backed by the Django backend.
 *
 *   admin list/detail  -> /api/v1/auth/admin/...
 *   approved doctors    -> /api/v1/doctors/  (DoctorProfile, pk == user id)
 *
 * Pages still expect a single `name` field, so responses are run through
 * normalizeUser() (first_name + last_name -> name).
 */

const ALL = '?page_size=1000';

/** Admin: every user (flattened across pagination). */
export async function listUsers() {
  const data = await apiFetch(`/auth/admin/users/${ALL}`);
  return (data.results ?? data).map(normalizeUser);
}

/** Admin: one user incl. doctor profile fields (resume/license/specialty/rate). */
export async function getUser(id) {
  return normalizeUser(await apiFetch(`/auth/admin/users/${id}/`));
}

/** Admin: pending doctor accounts awaiting approval. */
export async function listPendingUsers() {
  const data = await apiFetch(`/auth/admin/users/?status=pending&page_size=1000`);
  return (data.results ?? data).map(normalizeUser);
}

/** Approved doctors patients can browse — shaped like a user row for the cards. */
export async function listDoctors() {
  const data = await apiFetch(`/doctors/${ALL}`);
  return (data.results ?? data).map((d) => ({
    ...d,
    role: 'doctor',
    status: 'approved',
  }));
}

export async function approveUser(id) {
  return apiFetch(`/auth/admin/doctors/${id}/approve/`, { method: 'POST' });
}

export async function rejectUser(id) {
  return apiFetch(`/auth/admin/doctors/${id}/reject/`, { method: 'POST' });
}

/** Ban / unban any non-admin user (revokes login too). */
export async function banUser(id) {
  return apiFetch(`/auth/admin/users/${id}/ban/`, { method: 'POST' });
}

export async function unbanUser(id) {
  return apiFetch(`/auth/admin/users/${id}/unban/`, { method: 'POST' });
}

/** Self profile edit (the only user mutation the UI exposes). */
export async function updateUser(_id, patch) {
  return apiFetch('/auth/me/profile/', { method: 'PATCH', body: patch });
}

export async function deleteUser(id) {
  // No hard-delete endpoint; admins reject instead.
  return rejectUser(id);
}
