## Summary
My Appointments — patient sees their bookings, can cancel or (later)
reschedule.

## Wireframe
`docs/useCare.excalidraw` → patient "My appointments" frame.

## Files you own  (edit/create freely)
- `src/pages/patient/MyAppointmentsPage.jsx`

## Files you import from  (read-only — DO NOT EDIT)
- `src/api/appointments.js`    → `listAppointmentsForPatient()`, `cancelAppointment()`
- `src/api/users.js`           → `getUser()` (hydrate doctor name)
- `src/api/specialties.js`     → `listSpecialties()` (to label doctor specialty)
- `src/hooks/useAuth.js`       → `useAuth()` (for `currentUser.id`)
- `src/components/common/ConfirmDialog.jsx`
- `src/components/common/EmptyState.jsx`
- `src/components/common/LoadingSpinner.jsx`

## Shared files — open a small SEPARATE PR first if you need to change them
- `src/schema/schema.js`        (only if adding an Appointment field)
- `src/api/appointments.js`     (only if adding a method)

## DO NOT touch
- `src/pages/patient/PatientHomePage.jsx`, `src/components/layout/PatientLayout.jsx` (owned by #12)
- `src/pages/patient/WeekPickerPage.jsx`, `AvailableSlotsPage.jsx`, `BookAppointmentDialog.jsx` (owned by #13)
- Any non-patient layout or page
- See `docs/issues/ASSIGNMENT.md` for the full ownership map.

## Tasks
- [ ] Fetch `listAppointmentsForPatient(currentUser.id)` from `src/api/appointments.js`
- [ ] Hydrate doctor names via `getUser(doctor_id)` for each row
- [ ] Two `Tab`s: "Upcoming" (date >= today, status in [pending, confirmed]) and "Past" (everything else)
- [ ] `Table` columns: Date | Time | Doctor | Specialty | Status | Actions
- [ ] Actions:
  - Cancel — only for upcoming pending/confirmed; opens `ConfirmDialog` then calls `cancelAppointment(id)`
  - Reschedule — disabled `Button` for now (`Tooltip` "Coming soon")
- [ ] Empty state for each tab: `<EmptyState />`

## Acceptance criteria
- ✅ Upcoming tab only shows appointments with date >= today and active status
- ✅ Cancel updates the row's status and disables the button
- ✅ Pure MUI defaults — no `sx`, no `style` prop

## Size
M (≈ 1 day)
