## Summary
Specialties CRUD page for admins. List, add, edit, delete medical
specialties (Cardiology, Pediatrics, etc.).

## Wireframe
`docs/useCare.excalidraw` → admin "Specialties" entry in side menu.

## Files you own  (edit/create freely)
- `src/pages/admin/SpecialtiesPage.jsx`

## Files you import from  (read-only — DO NOT EDIT)
- `src/api/specialties.js`     → `listSpecialties()`, `createSpecialty()`, `updateSpecialty()`, `deleteSpecialty()`
- `src/components/common/ConfirmDialog.jsx`
- `src/components/common/LoadingSpinner.jsx`
- `src/components/common/EmptyState.jsx`

## Shared files — open a small SEPARATE PR first if you need to change them
- `src/schema/schema.js`        (only if adding a Specialty field)
- `src/api/specialties.js`      (only if adding a method)

## DO NOT touch
- Any other admin page or `AdminLayout.jsx`
- Any non-admin layout or page
- See `docs/issues/ASSIGNMENT.md` for the full ownership map.

## Tasks
- [ ] Fetch via `listSpecialties()` from `src/api/specialties.js`
- [ ] Table: Name | Description | Actions (Edit / Delete)
- [ ] "Add specialty" `Button` above the table opens an inline `Dialog` with `name` + `description` fields
- [ ] Edit: click pencil icon → same dialog prefilled
- [ ] Delete: confirm via `src/components/common/ConfirmDialog.jsx`
- [ ] Save calls `createSpecialty / updateSpecialty / deleteSpecialty`
- [ ] Refresh the table after each successful action

## Schema reference
`Specialty { id, name, description? }` — see `src/schema/schema.js`

## Acceptance criteria
- ✅ Add → row appears immediately (optimistic OR re-fetch)
- ✅ Edit pre-populates the form
- ✅ Delete shows ConfirmDialog before removing
- ✅ Pure MUI defaults — no `sx`, no `style` prop

## Size
M (≈ 1 day)
