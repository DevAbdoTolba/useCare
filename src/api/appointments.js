import { apiFetch } from './http.js';

/**
 * Appointments — backed by the Django backend.
 *
 * GET /appointments/ returns the CALLER's appointments (patient or doctor) and
 * every row already carries patient_name / doctor_name / doctor_specialty /
 * my_rating, so pages render names + ratings without extra lookups. Admins get
 * all appointments from the same endpoint.
 */

async function myAppointments(params = '') {
  const data = await apiFetch(`/appointments/?page_size=1000${params}`);
  return data.results ?? data;
}

/** Admin: all appointments. Doctor/patient: their own (server-scoped). */
export async function listAppointments() {
  return myAppointments();
}

export async function listAppointmentsForPatient() {
  return myAppointments();
}

export async function listAppointmentsForDoctor() {
  return myAppointments();
}

export async function listAppointmentsForDoctorOnDate(_doctorId, date) {
  return (await myAppointments()).filter((a) => a.date === date);
}

export async function getAppointment(id) {
  return (await myAppointments()).find((a) => a.id === Number(id)) ?? null;
}

/** Book an open availability slot. payload: { availability, notes? }. */
export async function createAppointment(payload) {
  return apiFetch('/appointments/book/', { method: 'POST', body: payload });
}

/** Doctor moves an appointment along: { status, notes }. */
export async function updateAppointment(id, patch) {
  return apiFetch(`/appointments/${id}/manage/`, { method: 'POST', body: patch });
}

/** Patient cancels a still-pending appointment. */
export async function cancelAppointment(id) {
  return apiFetch(`/appointments/${id}/cancel/`, { method: 'POST' });
}

export async function deleteAppointment(id) {
  return cancelAppointment(id);
}
