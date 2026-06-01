import { apiFetch } from './http.js';

/**
 * Doctor availability — backed by the Django backend.
 *
 *   browse a doctor's open future slots -> GET /doctors/<id>/availability/
 *   a doctor opens one of their own      -> POST /doctors/me/availability/
 *
 * The public list only ever returns future, still-open windows, so a patient
 * can never see (or book) an outdated slot.
 */

export async function listAvailabilityForDoctor(doctorId) {
  const data = await apiFetch(`/doctors/${doctorId}/availability/?page_size=1000`);
  return data.results ?? data;
}

export async function listAvailabilityForDate(_date) {
  // Not used by the UI; date browsing goes per-doctor.
  return [];
}

/** The signed-in doctor opens a new window. doctorId is ignored (server uses /me/). */
export async function setDayAvailable(_doctorId, date, start = '09:00', end = '17:00') {
  return apiFetch('/doctors/me/availability/', {
    method: 'POST',
    body: { date, start_time: start, end_time: end },
  });
}

export async function setDayUnavailable(_doctorId, _date, slotId) {
  if (!slotId) return null;
  return apiFetch(`/doctors/me/availability/${slotId}/`, { method: 'DELETE' });
}
