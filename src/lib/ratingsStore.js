/**
 * Ratings — backed by the Django backend (ratings slice).
 *
 * Doctor cards already arrive with `rating` + `rating_count` embedded, and
 * appointment rows carry `my_rating`, so most screens don't need these helpers
 * at all. They remain for the explicit "rate this visit" action and the
 * per-doctor summary. NOTE: these are now async (network), unlike the old
 * localStorage mock.
 */
import { apiFetch } from '../api/http.js';

/** Submit a rating for a completed appointment. */
export async function rateAppointment(appointment, stars, comment = '') {
  return apiFetch('/ratings/', {
    method: 'POST',
    body: { appointment: appointment.id, stars, comment: comment.trim() },
  });
}

/** Average stars + count for a doctor: { average, count }. */
export async function getDoctorRating(doctorId) {
  const data = await apiFetch(`/ratings/doctor/${doctorId}/`);
  return { average: data.average ?? 0, count: data.count ?? 0 };
}
