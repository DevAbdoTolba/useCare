/**
 * Doctor-proposed specialties — backed by the Django backend (specialties slice).
 *
 * A registering doctor proposes a missing specialty; it sits as "pending" until
 * an admin approves it (which creates a real Specialty) or rejects it. These
 * helpers are now async (network), unlike the old localStorage mock.
 */
import { apiFetch } from '../api/http.js';

export async function listSuggestions() {
  const data = await apiFetch('/specialties/suggestions/');
  return data.results ?? data;
}

export async function listPendingSuggestions() {
  return (await listSuggestions()).filter((s) => s.status === 'pending');
}

/** Record a new proposal (the signup flow does this directly via http.signup). */
export async function addSpecialtySuggestion(name) {
  return apiFetch('/specialties/suggestions/', { method: 'POST', body: { name } });
}

/** Approve ('approved') or reject ('rejected') a suggestion. */
export async function setSuggestionStatus(id, status) {
  const action = status === 'approved' ? 'approve' : 'reject';
  return apiFetch(`/specialties/suggestions/${id}/${action}/`, { method: 'POST' });
}
