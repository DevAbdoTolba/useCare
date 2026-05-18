## Summary
Day Schedule — the hour-by-hour view (00H → 24H) for a single day, showing
the doctor's slots and bookings. Clicking a slot opens the Appointment
Detail dialog.

## Wireframe
`docs/useCare.excalidraw` → doctor "Day schedule" frame.

## Files you own  (edit/create freely)
- `src/pages/doctor/DaySchedulePage.jsx`

## Files you import from  (read-only — DO NOT EDIT)
- `src/api/appointments.js`    → `listAppointmentsForDoctorOnDate()`
- `src/api/users.js`           → `getUser()` (hydrate patient name)
- `src/api/availability.js`    → `listAvailabilityForDoctor()` (for the slot window)
- `src/schema/schema.js`       → `APPOINTMENT_STATUSES`
- `src/pages/doctor/AppointmentDetailDialog.jsx` (use it as a component — coordinate with #11)
- `src/components/common/LoadingSpinner.jsx`

## Shared files — open a small SEPARATE PR first if you need to change them
- `src/schema/schema.js`        (only if adding a field)
- `src/api/appointments.js`     (only if adding a method)

## DO NOT touch
- `src/pages/doctor/DoctorCalendarPage.jsx`, `ConfirmAvailableDialog.jsx`, `src/components/layout/DoctorLayout.jsx` (owned by #9)
- `src/pages/doctor/AppointmentDetailDialog.jsx` (owned by #11 — you just consume it)
- Any non-doctor layout or page
- See `docs/issues/ASSIGNMENT.md` for the full ownership map.

## Tasks
- [ ] Read `date` from `useParams()`
- [ ] Fetch `listAppointmentsForDoctorOnDate(doctorId, date)` from `src/api/appointments.js`
- [ ] Render a `Table` with columns: Time | Patient | Status | Actions
- [ ] One row per slot (use the doctor's availability window for that day; default 09:00→17:00 in 30-min steps if no availability set)
- [ ] If a slot has an appointment: show patient name (hydrate from `getUser(patient_id)`) + status `Chip`
- [ ] If a slot is empty: show "free" + a small "Block" `Button` (no-op for now)
- [ ] Click an occupied row → set `selectedAppointmentId` and open `AppointmentDetailDialog` (issue #11)
- [ ] Top of the page: a `ToggleButtonGroup` "Day | Week | Month" — only "Day" works for now; the others link to `/doctor` (Month)

## Acceptance criteria
- ✅ Slots align with `availability.start_time → availability.end_time`
- ✅ Occupied slots show patient name + status
- ✅ Clicking an occupied row opens the detail dialog
- ✅ Pure MUI defaults — no `sx`, no `style` prop

## Size
M (≈ 1 day)
