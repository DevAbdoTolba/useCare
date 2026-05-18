> **⚠️ This issue has been DISSOLVED.** The layout work was split into the
> per-role issues so two devs never edit the same layout file:
>
> - `AdminLayout.jsx`   → issue **#4** (Admin A)
> - `DoctorLayout.jsx`  → issue **#9** (Doctor owner)
> - `PatientLayout.jsx` → issue **#12** (@DevAbdoTolba)
> - `AppHeader.jsx` (user menu / logout) → issue **#1** (@DevAbdoTolba)
>
> **Do NOT create a GitHub issue from this file.** The notes below stay
> here as a reference for what each layout needs to do.
>
> See `docs/issues/ASSIGNMENT.md` for the ownership map.

---

## Summary
Fill in the three per-role layout shells so every page renders with a
consistent header + side navigation. Layouts wrap their children via
`<Outlet />` from react-router.

## Wireframe
`docs/useCare.excalidraw` → the "Admin Dashboard" / "Doctor Calendar" /
"Patient Home" frames all show a left-side menu.

## Files
- `src/components/layout/AdminLayout.jsx`
- `src/components/layout/DoctorLayout.jsx`
- `src/components/layout/PatientLayout.jsx`
- `src/components/layout/AppHeader.jsx` (already has Login/Register — extend it to show user menu when logged in)

## Tasks
- [ ] Use MUI `Drawer variant="permanent"` for the sidebar on `>= md` screens
- [ ] Use `Drawer variant="temporary"` for `< md` screens (open via a hamburger `IconButton` in the header)
- [ ] Admin nav items: Dashboard, Users, Specialties, Appointments, Settings (link to `/admin`, `/admin/users`, …)
- [ ] Doctor nav items: Calendar, My day (link to `/doctor`, `/doctor/day/today`)
- [ ] Patient nav items: Find a doctor, My appointments (link to `/patient`, `/patient/appointments`)
- [ ] In `AppHeader`, when `useAuth().user` exists, show an `Avatar` + `Menu` with the user's name and a "Logout" item
- [ ] Logout: call `useAuth().logout()` and `useNavigate('/')`

## Acceptance criteria
- ✅ Visiting `/admin`, `/doctor`, `/patient` shows the right sidebar
- ✅ Clicking a sidebar item navigates without full page reload
- ✅ At 360px width, sidebar collapses to a drawer
- ✅ Pure MUI defaults — no `sx`, no `style` prop

## Size
M (≈ 1 day)
