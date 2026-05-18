## Summary
Build the Register page. New users pick a role (patient or doctor), fill
basic fields, submit, and get navigated to their dashboard. Doctors are
created with `status: 'pending'` so the admin approval flow has work.

## Wireframe
`docs/useCare.excalidraw` → "Login / Register" screen.

## Files you own  (edit/create freely)
- `src/pages/auth/RegisterPage.jsx`

## Files you import from  (read-only — DO NOT EDIT)
- `src/api/auth.js`           → `register()`
- `src/api/specialties.js`    → `listSpecialties()` (for the doctor specialty dropdown)
- `src/hooks/useAuth.js`      → `useAuth()`
- `src/schema/schema.js`      → `GENDERS` constant (read-only import)

## Shared files — open a small SEPARATE PR first if you need to change them
- `src/schema/schema.js`       (only if adding a User field)
- `src/api/auth.js`            (only if adding a method)

## DO NOT touch
- `src/pages/auth/LoginPage.jsx` (owned by #1)
- Anything in `src/pages/admin/`, `src/pages/doctor/`, or other layouts
- See `docs/issues/ASSIGNMENT.md` for the full ownership map.

## Tasks
- [ ] MUI `Container maxWidth="sm"` with the form
- [ ] Role picker: `ToggleButtonGroup` ("Patient" / "Doctor")
- [ ] Common fields: `name`, `email`, `password`, `phone_number`, `date_of_birth` (use `TextField type="date"`), `gender` (`Select`)
- [ ] If role = doctor: also show `specialty_id` (`Select`, load from `src/api/specialties.js → listSpecialties()`) and a multiline `description`
- [ ] Submit calls `register(payload)` from `src/api/auth.js`
- [ ] On success: `useAuth().login(user)`, then `useNavigate()` to the role's dashboard
- [ ] Link "Already have an account? Login" → /login

## Schema reference
See `src/schema/schema.js` for the full `User` typedef. Doctors set
`specialty_id`; patients leave it `null`.

## Acceptance criteria
- ✅ Submitting as a patient routes to /patient
- ✅ Submitting as a doctor routes to /doctor (and the dummy returned user has `status: 'pending'`)
- ✅ Specialty select shows the 4 specialties from `fixtures.js`
- ✅ Pure MUI defaults — no `sx`, no `style` prop

## Out of scope
- Email verification
- Password strength meter

## Size
M (≈ 1 day)
