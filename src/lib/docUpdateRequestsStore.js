/**
 * Doctor document-update requests — backed by the Django backend (doctors slice).
 *
 * A doctor can't silently swap their résumé/license; they file a change request
 * that an admin approves (which patches the profile server-side) or rejects.
 * These helpers are now async (network), unlike the old localStorage mock.
 */
import { apiFetch } from '../api/http.js';

/** Admin: the pending request queue. */
export async function listPendingRequests() {
  const data = await apiFetch('/doctors/update-requests/?status=pending');
  return data.results ?? data;
}

/** Doctor: their own current pending request, if any. */
export async function getPendingRequestForDoctor() {
  const data = await apiFetch('/doctors/me/update-requests/');
  const list = data.results ?? data;
  return list.find((r) => r.status === 'pending') ?? null;
}

/** Doctor: file a new résumé/license change request. */
export async function addDocUpdateRequest(_doctor, { resume_url, license_url }) {
  return apiFetch('/doctors/me/update-requests/', {
    method: 'POST',
    body: { resume_url: resume_url || '', license_url: license_url || '' },
  });
}

/** Admin: approve ('approved') or reject ('rejected') a request. */
export async function setDocRequestStatus(id, status) {
  const action = status === 'approved' ? 'approve' : 'reject';
  return apiFetch(`/doctors/update-requests/${id}/${action}/`, { method: 'POST' });
}
