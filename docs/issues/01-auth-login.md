## Summary
Build the Login page. No real auth — submitting routes the user to the
right dashboard based on the role of the matched fixture user.

## Wireframe
`docs/useCare.excalidraw` → "Login / Register" screen.
- Email field, password field, [Login] button, link to /register.

## Files you own  (edit/create freely)
- `src/pages/auth/LoginPage.jsx`
- `src/components/layout/AppHeader.jsx`  (extend it: when `useAuth().user` exists, swap the Login/Register buttons for an `Avatar` + `Menu` with the user name and a Logout item)

## Files you import from  (read-only — DO NOT EDIT)
- `src/api/auth.js`           → `login()`
- `src/hooks/useAuth.js`      → `useAuth()`
- `src/schema/fixtures.js`    → demo credentials (read-only)

## Shared files — open a small SEPARATE PR first if you need to change them
- `src/schema/schema.js`       (only if adding a User field)
- `src/api/auth.js`            (only if adding a method)
- `src/routes/AppRoutes.jsx`   (only if adding a new route)
- `package.json`               (only if adding a dependency)

## DO NOT touch
- Any file in `src/pages/admin/`, `src/pages/doctor/`
- `src/components/layout/AdminLayout.jsx`, `DoctorLayout.jsx`, `PatientLayout.jsx`
- `src/pages/HomePage.jsx`
- See `docs/issues/ASSIGNMENT.md` for the full ownership map.

## Tasks
- [ ] Render a centered MUI `Container maxWidth="xs"` with the form
- [ ] `TextField` for email (`type="email"`, `required`)
- [ ] `TextField` for password (`type="password"`, `required`)
- [ ] Primary `Button variant="contained" disableElevation` "Login"
- [ ] Secondary text + `Button component={RouterLink} to="/register"` "Create an account"
- [ ] On submit, call `login(email, password)` from `src/api/auth.js`
- [ ] Pass the returned `user` to `useAuth().login(user)` so the role becomes available app-wide
- [ ] Navigate by role: `admin → /admin`, `doctor → /doctor`, `patient → /patient` (use `useNavigate`)
- [ ] Show an inline error if `api/auth.login` throws

## Demo accounts (from fixtures)
- `admin@usecare.test` / `admin123` → admin
- `ahmed@usecare.test` / `doctor123` → doctor
- `yara@usecare.test` / `patient123` → patient

## Acceptance criteria
- ✅ Each demo account routes to its correct dashboard
- ✅ Any other email/password creates a guest patient and routes to /patient
- ✅ Mobile-friendly (try in DevTools at 360px wide)
- ✅ Pure MUI defaults — no `sx`, no `style` prop

## Out of scope
- Real backend / JWT / persistence
- Forgot password
- Social login

## Size
S (≈ half a day)
