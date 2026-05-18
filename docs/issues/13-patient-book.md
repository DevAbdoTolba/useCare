## Summary
Patient booking flow — pick a week → see available slots for that week →
click "Book" → confirm in a dialog → appointment created. Three files
because one dev should own the whole flow end-to-end.

## Wireframe
`docs/useCare.excalidraw` → patient "Week picker" + "Available
appointments" + booking confirmation.

## Files you own  (edit/create freely)
- `src/pages/patient/WeekPickerPage.jsx`
- `src/pages/patient/AvailableSlotsPage.jsx`
- `src/pages/patient/BookAppointmentDialog.jsx`

## Files you import from  (read-only — DO NOT EDIT)
- `src/api/availability.js`    → `listAvailabilityForDoctor()`
- `src/api/appointments.js`    → `listAppointmentsForDoctor()`, `createAppointment()`
- `src/api/users.js`           → `getUser()` (hydrate doctor name)
- `src/hooks/useAuth.js`       → `useAuth()` (for `currentUser.id`)
- `src/components/common/LoadingSpinner.jsx`

## NEW DEPENDENCY (coordinate with issue #9 — they need it too!)
Issue #9 will add `@mui/x-date-pickers` and `dayjs` first. Wait until
that PR is merged, then rebase your branch. Do NOT add the dep yourself.

## Shared files — open a small SEPARATE PR first if you need to change them
- `src/schema/schema.js`         (only if adding an Appointment field)
- `src/api/appointments.js`      (only if adding a method)
- `src/api/availability.js`      (only if adding a method)
- `src/routes/AppRoutes.jsx`     (only if adding a new patient route)

## DO NOT touch
- `src/pages/patient/PatientHomePage.jsx`, `src/components/layout/PatientLayout.jsx` (owned by #12)
- `src/pages/patient/MyAppointmentsPage.jsx` (owned by #14)
- Any non-patient layout or page
- See `docs/issues/ASSIGNMENT.md` for the full ownership map.

## Tasks

### WeekPickerPage
- [ ] Read `doctorId` from `useParams()`
- [ ] Render a MUI `DateCalendar` configured in week-picker style (reference: `https://mui.com/x/react-date-pickers/date-calendar/#week-picker`)
- [ ] When a week is picked, navigate to `/patient/doctor/:doctorId/slots?week=<startDate>`

### AvailableSlotsPage
- [ ] Read `doctorId` from `useParams()` and `week` from query string
- [ ] Fetch `listAvailabilityForDoctor(doctorId)` from `src/api/availability.js` AND `listAppointmentsForDoctor(doctorId)` from `src/api/appointments.js` in parallel
- [ ] Compute free slots in 30-min steps within the doctor's availability windows for the picked week, minus already-booked appointments
- [ ] Render a `Table`: Date | Time | Doctor | Action (`Book` button)
- [ ] Clicking Book → set `selectedSlot` state, open `BookAppointmentDialog`

### BookAppointmentDialog
- [ ] Props: `{ open, onClose, slot: { doctor_id, date, time }, onBooked }`
- [ ] Read-only fields: doctor name, date, time
- [ ] Multiline `TextField` "Reason for visit (optional)"
- [ ] `Book` button: call `createAppointment({ patient_id: currentUser.id, doctor_id, date, time, notes })`
- [ ] On success: close dialog, call `onBooked()` (parent refreshes slots), and show a `Snackbar`

## Acceptance criteria
- ✅ Picking a week navigates with the week start in the URL
- ✅ Free slots match the doctor's availability for the picked week
- ✅ Slots that are already booked are excluded
- ✅ Booking removes the slot from the list and creates an appointment
- ✅ Pure MUI defaults — no `sx`, no `style` prop

## Size
L (≈ 2 days)
