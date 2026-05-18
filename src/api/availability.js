import { availabilities } from '../schema/fixtures.js';

// TODO: replace fixture reads with apiGet/apiPost/etc. once backend exists.

export async function listAvailabilityForDoctor(doctorId)       { return availabilities.filter((a) => a.doctor_id === Number(doctorId)); }
export async function listAvailabilityForDate(date)             { return availabilities.filter((a) => a.date === date); }
export async function setDayAvailable(doctorId, date, start = '09:00', end = '17:00') {
  return { id: Date.now(), doctor_id: doctorId, date, start_time: start, end_time: end, is_available: true };
}
export async function setDayUnavailable(doctorId, date)         { return { doctor_id: doctorId, date, is_available: false }; }
