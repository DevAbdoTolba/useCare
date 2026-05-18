## Summary
Patient Home — "Select a doctor from the table below" with search and a
specialty filter. Click a row to start the booking flow.

## Wireframe
`docs/useCare.excalidraw` → patient "Pick a doctor" frame.

## Files you own  (edit/create freely)
- `src/pages/patient/PatientHomePage.jsx`
- `src/components/layout/PatientLayout.jsx`  (fill in the sidebar nav: Find a doctor / My appointments — use MUI `Drawer`. This was originally issue #3, folded into here.)

## Files you import from  (read-only — DO NOT EDIT)
- `src/api/users.js`           → `listDoctors()`
- `src/api/specialties.js`     → `listSpecialties()`
- `src/components/common/EmptyState.jsx`
- `src/components/common/LoadingSpinner.jsx`

## Shared files — open a small SEPARATE PR first if you need to change them
- `src/schema/schema.js`        (only if adding a User field)
- `src/api/users.js`            (only if adding a method)
- `src/routes/AppRoutes.jsx`    (only if adding a new patient route)

## DO NOT touch
- `src/pages/patient/WeekPickerPage.jsx`, `AvailableSlotsPage.jsx`, `BookAppointmentDialog.jsx` (owned by #13)
- `src/pages/patient/MyAppointmentsPage.jsx` (owned by #14)
- Any non-patient layout or page
- See `docs/issues/ASSIGNMENT.md` for the full ownership map.

## Tasks
- [ ] Fetch `listDoctors()` from `src/api/users.js` AND `listSpecialties()` from `src/api/specialties.js` in parallel
- [ ] Top of the page: search `TextField` (filter by doctor name) + `Select` "Specialty" + "Clear" `Button`
- [ ] `Table` columns: Doctor | Specialty | Rating | Action
- [ ] Rating: hard-code a star count for now (e.g., `<Rating value={4.5} readOnly precision={0.5} />`) — real rating is out of scope
- [ ] Action: `Button` "View" → `useNavigate(\`/patient/doctor/\${doctor.id}/week\`)`
- [ ] Empty state if filters return nothing: `<EmptyState />`

## Acceptance criteria
- ✅ Only doctors with `status: 'approved'` appear (the API already filters)
- ✅ Search narrows by case-insensitive name match
- ✅ Specialty filter narrows the list
- ✅ View → /patient/doctor/:id/week
- ✅ Pure MUI defaults — no `sx`, no `style` prop

## Size
M (≈ 1 day)
