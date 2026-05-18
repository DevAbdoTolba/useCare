/**
 * Sample data for the mock API. Shapes match src/schema/schema.js.
 * Edit freely while developing.
 */

/** @type {import('./schema.js').Specialty[]} */
export const specialties = [
  { id: 1, name: 'Cardiology',  description: 'Heart and vascular system' },
  { id: 2, name: 'Pediatrics',  description: 'Care for infants and children' },
  { id: 3, name: 'Dermatology', description: 'Skin, hair, nails' },
  { id: 4, name: 'Neurology',   description: 'Nervous system' },
];

/** @type {import('./schema.js').User[]} */
export const users = [
  // --- admin
  {
    id: 1, name: 'Sarah Admin', email: 'admin@usecare.test', password: 'admin123',
    phone_number: '+20-100-000-0001', role: 'admin', gender: 'female',
    date_of_birth: '1985-04-12', status: 'approved', specialty_id: null,
  },

  // --- doctors (mix of approved + pending so the admin approval flow has data)
  {
    id: 2, name: 'Dr. Ahmed Tolba', email: 'ahmed@usecare.test', password: 'doctor123',
    phone_number: '+20-100-000-0002', description: '8 yrs cardiology experience',
    role: 'doctor', gender: 'male', date_of_birth: '1986-09-03',
    status: 'approved', specialty_id: 1,
  },
  {
    id: 3, name: 'Dr. Samir Hassan', email: 'samir@usecare.test', password: 'doctor123',
    phone_number: '+20-100-000-0003', description: 'Pediatrician, fellowship at Cairo Univ.',
    role: 'doctor', gender: 'male', date_of_birth: '1990-01-22',
    status: 'pending', specialty_id: 2,
  },
  {
    id: 4, name: 'Dr. Mona El-Sayed', email: 'mona@usecare.test', password: 'doctor123',
    phone_number: '+20-100-000-0004', description: 'Dermatology specialist',
    role: 'doctor', gender: 'female', date_of_birth: '1988-07-15',
    status: 'approved', specialty_id: 3,
  },
  {
    id: 5, name: 'Dr. Karim Nasr', email: 'karim@usecare.test', password: 'doctor123',
    phone_number: '+20-100-000-0005', description: 'Neurology, stroke specialist',
    role: 'doctor', gender: 'male', date_of_birth: '1982-11-30',
    status: 'pending', specialty_id: 4,
  },

  // --- patients
  {
    id: 6, name: 'Yara Mostafa', email: 'yara@usecare.test', password: 'patient123',
    phone_number: '+20-100-000-0006', role: 'patient', gender: 'female',
    date_of_birth: '1995-03-08', status: 'approved', specialty_id: null,
  },
  {
    id: 7, name: 'Omar Hany', email: 'omar@usecare.test', password: 'patient123',
    phone_number: '+20-100-000-0007', role: 'patient', gender: 'male',
    date_of_birth: '1992-12-01', status: 'approved', specialty_id: null,
  },
  {
    id: 8, name: 'Nour Adel', email: 'nour@usecare.test', password: 'patient123',
    phone_number: '+20-100-000-0008', role: 'patient', gender: 'female',
    date_of_birth: '2001-05-19', status: 'approved', specialty_id: null,
  },
  {
    id: 9, name: 'Ali Mahmoud', email: 'ali@usecare.test', password: 'patient123',
    phone_number: '+20-100-000-0009', role: 'patient', gender: 'male',
    date_of_birth: '1978-08-25', status: 'approved', specialty_id: null,
  },
];

/** @type {import('./schema.js').Appointment[]} */
export const appointments = [
  // past
  { id: 1, date: '2026-05-10', time: '09:00', status: 'completed', notes: 'Routine check.',  patient_id: 6, doctor_id: 2 },
  { id: 2, date: '2026-05-12', time: '14:30', status: 'cancelled', notes: '',                patient_id: 7, doctor_id: 4 },

  // today / soon
  { id: 3, date: '2026-05-22', time: '16:30', status: 'confirmed', notes: '',                patient_id: 6, doctor_id: 2 },
  { id: 4, date: '2026-05-23', time: '10:00', status: 'confirmed', notes: '',                patient_id: 8, doctor_id: 4 },
  { id: 5, date: '2026-05-24', time: '13:00', status: 'pending',   notes: '',                patient_id: 9, doctor_id: 2 },

  // upcoming
  { id: 6, date: '2026-05-29', time: '11:00', status: 'pending',   notes: '',                patient_id: 7, doctor_id: 2 },
  { id: 7, date: '2026-06-02', time: '14:00', status: 'confirmed', notes: '',                patient_id: 6, doctor_id: 4 },
  { id: 8, date: '2026-06-05', time: '09:30', status: 'pending',   notes: '',                patient_id: 8, doctor_id: 2 },
];

/** @type {import('./schema.js').DoctorAvailability[]} */
export const availabilities = [
  // Dr. Ahmed Tolba — Mon/Wed/Fri this week
  { id: 1, doctor_id: 2, date: '2026-05-18', start_time: '09:00', end_time: '17:00', is_available: true },
  { id: 2, doctor_id: 2, date: '2026-05-20', start_time: '09:00', end_time: '17:00', is_available: true },
  { id: 3, doctor_id: 2, date: '2026-05-22', start_time: '09:00', end_time: '17:00', is_available: true },

  // Dr. Mona El-Sayed — Tue/Thu
  { id: 4, doctor_id: 4, date: '2026-05-19', start_time: '10:00', end_time: '15:00', is_available: true },
  { id: 5, doctor_id: 4, date: '2026-05-21', start_time: '10:00', end_time: '15:00', is_available: true },
];
