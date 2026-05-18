## Summary
Global appointments table for admin oversight. Read-only — the admin sees
every appointment in the system, can filter by status/doctor/date, and
can cancel one in an emergency.

## Wireframe
`docs/useCare.excalidraw` → admin "Appointments" entry.

## Files you own  (edit/create freely)
- `src/pages/admin/AppointmentsPage.jsx`

## Files you import from  (read-only — DO NOT EDIT)
- `src/api/appointments.js`    → `listAppointments()`, `cancelAppointment()`
- `src/api/users.js`           → `listUsers()` (to hydrate patient + doctor names)
- `src/api/specialties.js`     → `listSpecialties()` (to label doctor specialty)
- `src/schema/schema.js`       → `APPOINTMENT_STATUSES`
- `src/components/common/ConfirmDialog.jsx`
- `src/components/common/LoadingSpinner.jsx`

## Shared files — open a small SEPARATE PR first if you need to change them
- `src/schema/schema.js`        (only if adding an Appointment field)
- `src/api/appointments.js`     (only if adding a method)

## DO NOT touch
- Any other admin page or `AdminLayout.jsx`
- Any non-admin layout or page
- See `docs/issues/ASSIGNMENT.md` for the full ownership map.

## Tasks
- [ ] Fetch via `listAppointments()` from `src/api/appointments.js`
- [ ] Hydrate doctor + patient names by cross-referencing `listUsers()`
- [ ] Table columns: Date | Time | Patient | Doctor | Specialty | Status | Actions
- [ ] Status `Chip` color: pending=warning, confirmed=success, cancelled=default, completed=info
- [ ] Filters row: date range (`TextField type="date"` x2), `Select` for status, `Autocomplete` for doctor
- [ ] Cancel action: pencil icon button → `ConfirmDialog` → call `cancelAppointment(id)`

## Acceptance criteria
- ✅ Filter combinations work additively (date AND status AND doctor)
- ✅ Table is paginated (`TablePagination`) — 10 per page
- ✅ Cancel updates the row's status to "cancelled"
- ✅ Pure MUI defaults — no `sx`, no `style` prop

## Size
M (≈ 1 day)
