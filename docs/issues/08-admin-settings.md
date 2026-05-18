## Summary
System Settings page — placeholder for clinic-wide config the admin
controls (default appointment length, business hours, notifications, etc.).
Keep it minimal for now; this is mostly a UI skeleton.

## Wireframe
`docs/useCare.excalidraw` → admin "System settings" entry.

## Files you own  (edit/create freely)
- `src/pages/admin/SystemSettingsPage.jsx`

## Files you import from  (read-only — DO NOT EDIT)
- Nothing outside `@mui/material` for now. Local component state only.

## Shared files — open a small SEPARATE PR first if you need to change them
- (none expected for this issue — pure UI)

## DO NOT touch
- Any other admin page or `AdminLayout.jsx`
- Any non-admin layout or page
- See `docs/issues/ASSIGNMENT.md` for the full ownership map.

## Tasks
- [ ] Two `Card variant="outlined"` sections side by side (`Stack`):
  1. **Schedule defaults** — `TextField type="number"` "Default appointment minutes" (default 30), `TextField type="time"` "Open" + "Close"
  2. **Notifications** — `Switch` "Email patients on booking", `Switch` "Email doctors on booking"
- [ ] `Button` "Save changes" — for now just `console.log(form)` and show a `Snackbar` saying "Saved (mock)"
- [ ] State lives in component for now (no API endpoint yet)

## Acceptance criteria
- ✅ Form fields are controlled and reflect typed values
- ✅ Save shows a success Snackbar
- ✅ Stacks vertically on mobile
- ✅ Pure MUI defaults — no `sx`, no `style` prop

## Size
S (≈ half a day)
