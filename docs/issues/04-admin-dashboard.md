## Summary
Build the Admin Dashboard — a landing page for admins with quick stats
and shortcuts to the main admin actions.

## Wireframe
`docs/useCare.excalidraw` → "Admin Dashboard" frame (the small admin
panels at the top of the sketch).

## Files you own  (edit/create freely)
- `src/pages/admin/AdminDashboardPage.jsx`
- `src/components/layout/AdminLayout.jsx`  (fill in the sidebar nav: Dashboard / Users / Specialties / Appointments / Settings — use MUI `Drawer`. This was originally issue #3, folded into here.)

## Files you import from  (read-only — DO NOT EDIT)
- `src/api/users.js`           → `listUsers()`, `listPendingUsers()`
- `src/api/appointments.js`    → `listAppointments()`
- `src/api/specialties.js`     → `listSpecialties()`
- `src/components/common/LoadingSpinner.jsx`
- `src/components/common/EmptyState.jsx`

## Shared files — open a small SEPARATE PR first if you need to change them
- `src/schema/schema.js`        (only if adding a field)
- `src/api/*.js`                (only if adding a method)
- `src/routes/AppRoutes.jsx`    (only if adding a new admin route)

## DO NOT touch
- `src/pages/admin/UsersListPage.jsx`, `ApproveUserDialog.jsx` (owned by #5)
- `src/pages/admin/SpecialtiesPage.jsx` (owned by #6)
- `src/pages/admin/AppointmentsPage.jsx` (owned by #7)
- `src/pages/admin/SystemSettingsPage.jsx` (owned by #8)
- Any non-admin layout or page
- See `docs/issues/ASSIGNMENT.md` for the full ownership map.

## Tasks
- [ ] Fetch in parallel: `listUsers()`, `listPendingUsers()`, `listAppointments()`, `listSpecialties()`
- [ ] Render four MUI `Card variant="outlined"` "stat tiles":
  - Total users
  - Pending approvals (link to /admin/users)
  - Total appointments
  - Specialties
- [ ] Below the tiles, a "Recent pending approvals" `List` showing up to 5 users with a `Button` to /admin/users
- [ ] Loading state: use `src/components/common/LoadingSpinner.jsx`

## Acceptance criteria
- ✅ Page shows real counts from `src/api/users.js` etc.
- ✅ Empty states use `EmptyState` from `src/components/common/`
- ✅ Cards stack on mobile (`Stack direction={{ xs: 'column', md: 'row' }}`)
- ✅ Pure MUI defaults — no `sx`, no `style` prop

## Size
S (≈ half a day)
