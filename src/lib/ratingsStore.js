/**
 * Standalone localStorage-backed ratings store (mock).
 *
 * The npoint mock DB is read-only, so patient ratings live in localStorage —
 * exactly like the doctor's availability store. Self-contained so it can be
 * swapped for real API calls once a backend exists. Seeded once from the
 * bundled demo data (src/schema/seed.json) so doctor averages aren't empty.
 */
import seed from '../schema/seed.json';

const KEY = 'usecare_ratings';

/** Read the whole { [appointmentId]: Rating } map, seeding on first use. */
function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    return {};
  }
  const seeded = {};
  (seed.ratings ?? []).forEach((r) => { seeded[r.appointment_id] = r; });
  try { localStorage.setItem(KEY, JSON.stringify(seeded)); } catch { /* ignore */ }
  return seeded;
}

/** The rating left for one appointment, or null. */
export function getRatingForAppointment(appointmentId) {
  return readAll()[appointmentId] ?? null;
}

/** Save (or overwrite) the rating for a completed appointment. */
export function rateAppointment(appointment, stars, comment = '') {
  const all = readAll();
  all[appointment.id] = {
    appointment_id: appointment.id,
    doctor_id: appointment.doctor_id,
    patient_id: appointment.patient_id,
    stars,
    comment: comment.trim(),
  };
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* ignore */ }
  return all[appointment.id];
}

/** Average stars + how many ratings a doctor has. */
export function getDoctorRating(doctorId) {
  const list = Object.values(readAll()).filter((r) => r.doctor_id === Number(doctorId));
  if (!list.length) return { average: 0, count: 0 };
  const sum = list.reduce((acc, r) => acc + (Number(r.stars) || 0), 0);
  return { average: sum / list.length, count: list.length };
}
