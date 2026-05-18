import { getDb, warnReadOnly } from './client.js';

export async function listAvailabilityForDoctor(doctorId)       { return (await getDb()).availabilities.filter((a) => a.doctor_id === Number(doctorId)); }
export async function listAvailabilityForDate(date)             { return (await getDb()).availabilities.filter((a) => a.date === date); }

// Read-only on npoint — mutations are local-only.
export async function setDayAvailable(doctorId, date, start = '09:00', end = '17:00') {
  warnReadOnly('setDayAvailable');
  return { id: Date.now(), doctor_id: doctorId, date, start_time: start, end_time: end, is_available: true };
}
export async function setDayUnavailable(doctorId, date)         { warnReadOnly('setDayUnavailable'); return { doctor_id: doctorId, date, is_available: false }; }
