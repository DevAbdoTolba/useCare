## Summary
Doctor Calendar — month view where each day cell shows the number of
appointments for that day. The doctor can mark a day as available by
clicking a "+" on an empty day, which opens a confirm dialog.

## Wireframe
`docs/useCare.excalidraw` → doctor "Calendar" frame.

Per the sketch annotation: the day cell shows **the appointment count for
that day**, replacing the clock icon.

## Files you own  (edit/create freely)
- `src/pages/doctor/DoctorCalendarPage.jsx`
- `src/pages/doctor/ConfirmAvailableDialog.jsx`
- `src/components/layout/DoctorLayout.jsx`  (fill in the sidebar nav: Calendar / My day — use MUI `Drawer`. This was originally issue #3, folded into here.)

## Files you import from  (read-only — DO NOT EDIT)
- `src/api/appointments.js`    → `listAppointmentsForDoctor()`
- `src/api/availability.js`    → `setDayAvailable()`
- `src/components/common/ConfirmDialog.jsx`

## NEW DEPENDENCY (coordinate with issue #13 — they need it too!)
This issue adds `@mui/x-date-pickers` and `dayjs` to the project. Open
this as a SEPARATE first PR so #13's branch can rebase and use the same
versions:

```bash
npm install @mui/x-date-pickers dayjs
```

## Shared files — open a small SEPARATE PR first if you need to change them
- `package.json`               (THE date-pickers install above)
- `src/schema/schema.js`       (only if adding an Availability field)
- `src/api/availability.js`    (only if adding a method)
- `src/main.jsx`               (you'll need to wrap App in `LocalizationProvider` from `@mui/x-date-pickers` — coordinate with #13!)

## DO NOT touch
- `src/pages/doctor/DaySchedulePage.jsx` (owned by #10)
- `src/pages/doctor/AppointmentDetailDialog.jsx` (owned by #11)
- Any non-doctor layout or page
- See `docs/issues/ASSIGNMENT.md` for the full ownership map.

## Tasks
- [ ] Use MUI `DateCalendar` from `@mui/x-date-pickers` (you'll need to install it — `@mui/x-date-pickers` and a date library: `dayjs`)
  - Reference the wireframe note: `https://mui.com/x/react-date-pickers/date-calendar/#dynamic-data`
- [ ] Customize `slots.day` so each day cell renders the appointment count for that day OR a "+" button if there are 0 appointments
- [ ] Use `listAppointmentsForDoctor(doctorId)` to compute counts per day (the demo doctorId is 2 — Dr. Ahmed Tolba)
- [ ] Clicking a day with appointments → `useNavigate(\`/doctor/day/\${date}\`)`
- [ ] Clicking "+" on an empty day → open `ConfirmAvailableDialog`
- [ ] ConfirmAvailableDialog already exists as a stub; wire the `onConfirm` to `setDayAvailable(doctorId, date)` from `src/api/availability.js` then close

## Acceptance criteria
- ✅ Days with appointments show the count
- ✅ Empty days show a "+" affordance
- ✅ "+" → confirm → API call → calendar refreshes
- ✅ Clicking a busy day navigates to /doctor/day/:date
- ✅ Pure MUI defaults — no `sx`, no `style` prop

## Out of scope
- Drag/drop to move appointments
- Repeating availability patterns

## Size
L (≈ 2 days — date library setup + slot customization)
