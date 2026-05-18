/**
 * useCare — data schema, derived from docs/useCare.drawio (the ER diagram).
 *
 * The ERD has three entities:
 *   - User       (with attributes incl. role)
 *   - Appointment
 *   - Specialty
 *
 * Relationships from the ERD:
 *   - User  --Book--   Appointment   (1:N — a patient books many appointments)
 *   - User  --Manage-- Appointment   (1:N — a doctor manages many appointments)
 *   - User  --Has--    Specialty     (N:1 — a doctor has one specialty)
 *
 * ADDITIONS not on the ERD but required by the wireframe
 * (clearly labelled below):
 *   - User.status        admin approval flow needs pending/approved/rejected
 *   - DoctorAvailability the "doctor sets a day as available" flow needs a
 *                        slot table; the ERD has no model for it
 *
 * Naming: the ERD uses prefixes like U_, A_, S_. JS conventions here use
 * snake_case fields without the prefix, since the table context is implicit.
 */

/** @typedef {'admin' | 'doctor' | 'patient'} UserRole */
/** @typedef {'pending' | 'approved' | 'rejected'} UserStatus */ // ADDITION
/** @typedef {'male' | 'female' | 'other'} Gender */
/** @typedef {'pending' | 'confirmed' | 'cancelled' | 'completed'} AppointmentStatus */

/**
 * @typedef {Object} User
 * @property {number}        id
 * @property {string}        name
 * @property {string}        email
 * @property {string}        password           never sent to client in real life — included for the mock
 * @property {string}        phone_number       ERD shows double-oval (multi-valued). Treated as single string for the mock.
 * @property {string}        [description]
 * @property {UserRole}      role
 * @property {Gender}        [gender]
 * @property {string}        [date_of_birth]    ISO date (YYYY-MM-DD)
 * @property {UserStatus}    status             // ADDITION: admin approval flow
 * @property {number | null} [specialty_id]     FK -> Specialty; doctors only
 */

/**
 * @typedef {Object} Specialty
 * @property {number} id
 * @property {string} name
 * @property {string} [description]
 */

/**
 * @typedef {Object} Appointment
 * @property {number}              id
 * @property {string}              date              ISO date (YYYY-MM-DD)
 * @property {string}              time              HH:MM (24h)
 * @property {AppointmentStatus}   status
 * @property {string}              [notes]           doctor's notes
 * @property {number}              patient_id        FK -> User (role=patient)
 * @property {number}              doctor_id         FK -> User (role=doctor)
 */

/**
 * @typedef {Object} DoctorAvailability   // ADDITION: not on ERD
 * @property {number}  id
 * @property {number}  doctor_id          FK -> User (role=doctor)
 * @property {string}  date               ISO date (YYYY-MM-DD)
 * @property {string}  start_time         HH:MM
 * @property {string}  end_time           HH:MM
 * @property {boolean} is_available       false = explicit unavailable
 */

// Re-export from one place so callers can do: import { } from '../schema/schema'.
export const ROLES = /** @type {const} */ (['admin', 'doctor', 'patient']);
export const USER_STATUSES = /** @type {const} */ (['pending', 'approved', 'rejected']);
export const APPOINTMENT_STATUSES = /** @type {const} */ ([
  'pending',
  'confirmed',
  'cancelled',
  'completed',
]);
export const GENDERS = /** @type {const} */ (['male', 'female', 'other']);
