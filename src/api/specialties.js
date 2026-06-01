import { apiFetch } from './http.js';

/** Specialties — backed by the Django backend. List is public. */

export async function listSpecialties() {
  return apiFetch('/specialties/', { auth: false });
}

export async function getSpecialty(id) {
  return apiFetch(`/specialties/${id}/`, { auth: false });
}

/** Admin only. */
export async function createSpecialty(payload) {
  return apiFetch('/specialties/', { method: 'POST', body: payload });
}

export async function updateSpecialty(id, patch) {
  return apiFetch(`/specialties/${id}/`, { method: 'PATCH', body: patch });
}

export async function deleteSpecialty(id) {
  return apiFetch(`/specialties/${id}/`, { method: 'DELETE' });
}
