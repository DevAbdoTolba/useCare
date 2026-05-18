import { getDb, warnReadOnly } from './client.js';

export async function listAppointments()                          { return (await getDb()).appointments; }
export async function listAppointmentsForPatient(patientId)       { return (await getDb()).appointments.filter((a) => a.patient_id === Number(patientId)); }
export async function listAppointmentsForDoctor(doctorId)         { return (await getDb()).appointments.filter((a) => a.doctor_id === Number(doctorId)); }
export async function listAppointmentsForDoctorOnDate(doctorId, date) {
  return (await getDb()).appointments.filter((a) => a.doctor_id === Number(doctorId) && a.date === date);
}
export async function getAppointment(id)                          { return (await getDb()).appointments.find((a) => a.id === Number(id)); }

// Read-only on npoint — mutations are local-only.
export async function createAppointment(payload)                  { warnReadOnly('createAppointment'); return { id: Date.now(), status: 'pending', ...payload }; }
export async function updateAppointment(id, patch)                { warnReadOnly('updateAppointment'); return { id, ...patch }; }
export async function cancelAppointment(id)                       { warnReadOnly('cancelAppointment'); return { id, status: 'cancelled' }; }
export async function deleteAppointment(id)                       { warnReadOnly('deleteAppointment'); return { id, deleted: true }; }
