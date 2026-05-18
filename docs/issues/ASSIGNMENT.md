# Team assignment — useCare

Four devs, each owns a full vertical slice (no shared files within the
core work). Layout components are split so each role-owner builds their
own layout — no one touches `AdminLayout.jsx` except the admin owner, etc.

| Dev | Flow | Layout component | Issues |
|-----|------|------------------|--------|
| **@DevAbdoTolba** | Patient + Auth + Landing | `PatientLayout` + `AppHeader` | #1, #2, #12, #13, #14 |
| **@muhameedhanyyy** (Mohamed Hany) | Admin (part 1) | `AdminLayout` | #4, #5 |
| **@AhmedSamirKhalaf** (Samir) | Admin (part 2) | — | #6, #7, #8 |
| **@AhmeedFatehy** (Fathi) | Doctor | `DoctorLayout` | #9, #10, #11 |

> Landing is already merged.

---

## Why this split

- **No two devs share a file in the core work.** Each layout is owned
  by its role-owner, so there are no merge conflicts on layouts.
- **Admin is the largest flow** (5 pages), so two devs share it. They
  split by pages so neither blocks the other:
  - Admin A owns the high-traffic stuff (Dashboard, Users + Approve).
  - Admin B owns the CRUD-heavy stuff (Specialties, Appointments, Settings).
- **Doctor and Patient flows are roughly 3–5 pages each** — one dev each.
- **Auth lives with Patient** because patients are the only role that
  registers themselves (doctors get approved by an admin, admins are
  seeded). So the auth-owner naturally cares about the patient flow.

## Issue #3 (shared layouts) is dissolved into the per-role work

The `03-shared-layouts.md` issue exists in the folder for reference, but
the tasks inside it are split out to each role-owner:

- `AdminLayout` → covered as part of issue #4 (Admin Dashboard) by Admin A
- `DoctorLayout` → covered as part of issue #9 (Doctor Calendar)
- `PatientLayout` → covered as part of issue #12 (Patient Home)
- `AppHeader` (user menu when logged in) → covered as part of issue #1 (Login)

So **do not create a separate GitHub issue for #3**. Or do, and assign
it to the team lead as "infrastructure tracking". Your call.

## Suggested order per dev

Each dev should build in this order so they can self-test end-to-end:

### @DevAbdoTolba (patient + auth)
1. #1 Login (also: AppHeader user menu + logout)
2. #2 Register
3. #12 Patient Home (also: PatientLayout)
4. #13 Patient Book Flow (week + slots + dialog)
5. #14 My Appointments

### @muhameedhanyyy (Mohamed Hany) — admin part 1
1. #4 Admin Dashboard (also: AdminLayout)
2. #5 Users + Approve dialog

### @AhmedSamirKhalaf (Samir) — admin part 2
1. #6 Specialties CRUD
2. #7 Appointments table
3. #8 System Settings

### @AhmeedFatehy (Fathi) — doctor
1. #9 Calendar + Set Available dialog (also: DoctorLayout)
2. #10 Day Schedule
3. #11 Appointment Detail dialog

## Cross-cutting things everyone touches

These files belong to no one specifically. If you need to add a field
or function, open a small PR:

- `src/schema/schema.js` — schema typedefs
- `src/schema/fixtures.js` — sample data
- `src/api/*.js` — mock API
- `src/components/common/*` — `ConfirmDialog`, `EmptyState`, `LoadingSpinner`
- `src/routes/AppRoutes.jsx` — route table (add new routes here)

## Workflow

1. Each dev creates a feature branch off `main`:
   `git checkout -b <role>/<issue-number>-<short-desc>` (e.g., `patient/12-pick-doctor`)
2. Implement, commit, push, open a PR titled `[#<issue>] <short summary>`
3. Tag the issue in the PR body with `Closes #<issue>` so it auto-closes on merge
4. Get a review from one other dev before merging

## Quick acceptance bar for any PR

- [ ] No `sx` and no `style` prop anywhere (CSS files for keyframes only)
- [ ] Works at 360px width (mobile DevTools)
- [ ] No console errors
- [ ] Wire to mock API in `src/api/*`, not direct fixture imports
- [ ] Linked issue in the PR description
