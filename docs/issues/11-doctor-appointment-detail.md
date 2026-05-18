## Summary
Appointment Detail dialog (doctor view) — opens when the doctor clicks an
occupied slot. Shows the appointment, lets the doctor change status and
write notes, save back via the mock API.

## Wireframe
`docs/useCare.excalidraw` → doctor "Appointment detail" frame.

## Files you own  (edit/create freely)
- `src/pages/doctor/AppointmentDetailDialog.jsx`

## Files you import from  (read-only — DO NOT EDIT)
- `src/api/appointments.js`    → `getAppointment()`, `updateAppointment()`
- `src/api/users.js`           → `getUser()` (hydrate patient + doctor info)
- `src/schema/schema.js`       → `APPOINTMENT_STATUSES`
- `src/components/common/LoadingSpinner.jsx`

## Shared files — open a small SEPARATE PR first if you need to change them
- `src/schema/schema.js`        (only if adding an Appointment field, e.g. `cancel_reason`)
- `src/api/appointments.js`     (only if adding a method)

## DO NOT touch
- `src/pages/doctor/DoctorCalendarPage.jsx`, `ConfirmAvailableDialog.jsx`, `DaySchedulePage.jsx`, `DoctorLayout.jsx`
- Any non-doctor layout or page
- See `docs/issues/ASSIGNMENT.md` for the full ownership map.

## Tasks
- [ ] Props: `{ open, onClose, appointmentId }`
- [ ] On open, fetch `getAppointment(appointmentId)`, then `getUser(appointment.patient_id)` and `getUser(appointment.doctor_id)`
- [ ] Dialog body sections (use `DialogContent` + `Stack spacing={2}`):
  - Date + time (read-only)
  - Status (`Select` of APPOINTMENT_STATUSES from `src/schema/schema.js`)
  - Patient info card: name, phone, age (derive from `date_of_birth`)
  - Doctor info card: name, specialty
  - Doctor's notes (`TextField multiline rows={4}`)
- [ ] `DialogActions`: `Cancel` and `Save`. Save calls `updateAppointment(id, { status, notes })`
- [ ] On save: close the dialog. Parent (DaySchedulePage) should refresh

## Acceptance criteria
- ✅ All fields populate from the fetched appointment
- ✅ Status change persists (mock call returns the new value)
- ✅ Notes persist
- ✅ Pure MUI defaults — no `sx`, no `style` prop

## Size
M (≈ 1 day)
