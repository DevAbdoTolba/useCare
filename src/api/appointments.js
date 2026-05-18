import { appointments } from '../schema/fixtures.js';

// TODO: replace fixture reads with apiGet/apiPost/etc. once backend exists.

export async function listAppointments()                          { return appointments; }
export async function listAppointmentsForPatient(patientId)       { return appointments.filter((a) => a.patient_id === Number(patientId)); }
export async function listAppointmentsForDoctor(doctorId)         { return appointments.filter((a) => a.doctor_id === Number(doctorId)); }
export async function listAppointmentsForDoctorOnDate(doctorId, date) {
  return appointments.filter((a) => a.doctor_id === Number(doctorId) && a.date === date);
}
export async function getAppointment(id)                          { return appointments.find((a) => a.id === Number(id)); }
export async function createAppointment(payload)                  { return { id: Date.now(), status: 'pending', ...payload }; }
export async function updateAppointment(id, patch)                { return { id, ...patch }; }
export async function cancelAppointment(id)                       { return { id, status: 'cancelled' }; }
export async function deleteAppointment(id)                       { return { id, deleted: true }; }
