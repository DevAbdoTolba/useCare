## Summary
Build the Users list page and the Approve User dialog. Admin can see all
users, filter by status (especially "pending"), and approve/reject a
pending user from a dialog.

## Wireframe
`docs/useCare.excalidraw` → admin "Users" table + "Approve" dialog.
- Table columns: Name | Role | Status
- `?` icon = pending approval; click row → opens approve dialog

## Files you own  (edit/create freely)
- `src/pages/admin/UsersListPage.jsx`
- `src/pages/admin/ApproveUserDialog.jsx`

## Files you import from  (read-only — DO NOT EDIT)
- `src/api/users.js`           → `listUsers()`, `approveUser()`, `rejectUser()`
- `src/api/specialties.js`     → `listSpecialties()` (to show specialty name in the dialog)
- `src/schema/schema.js`       → `USER_STATUSES`, `ROLES` constants
- `src/components/common/LoadingSpinner.jsx`

## Shared files — open a small SEPARATE PR first if you need to change them
- `src/schema/schema.js`        (only if adding a field)
- `src/api/users.js`            (only if adding a method)

## DO NOT touch
- `src/pages/admin/AdminDashboardPage.jsx`, `src/components/layout/AdminLayout.jsx` (owned by #4)
- `src/pages/admin/SpecialtiesPage.jsx`, `AppointmentsPage.jsx`, `SystemSettingsPage.jsx` (owned by #6/#7/#8)
- Any non-admin layout or page
- See `docs/issues/ASSIGNMENT.md` for the full ownership map.

## Tasks
### Users list page
- [ ] Fetch via `listUsers()` from `src/api/users.js`
- [ ] Render `Table` with sticky header. Columns: Name, Role, Status, Actions
- [ ] Status badge: `Chip` with color (pending=warning, approved=success, rejected=default)
- [ ] Filter row above the table: `ToggleButtonGroup` for "All / Pending / Approved / Rejected"
- [ ] Click a pending row → set selected user state → open dialog
- [ ] Approved/rejected rows: no click action (or open a read-only view if you have time)

### Approve dialog
- [ ] `Dialog` with title "Approve user"
- [ ] Show Name, Role, Email, Specialty (if doctor), Description in disabled `TextField`s
- [ ] Two action buttons: `Approve` (calls `approveUser(id)`) and `Reject` (calls `rejectUser(id)`)
- [ ] On success: close dialog, refresh the table

## Acceptance criteria
- ✅ Pending users are visually distinct (`Chip color="warning"`)
- ✅ Filter buttons narrow the list
- ✅ Approve/Reject closes the dialog and the row updates
- ✅ Pure MUI defaults — no `sx`, no `style` prop

## Size
M (≈ 1 day)
