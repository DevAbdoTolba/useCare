# useCare — team issues

Each file in this folder is the body of a GitHub issue. They were created by
running `gh issue create --body-file <file>`. Edit a file before running
`gh issue edit N --body-file <file>` if the requirement changes.

## Conventions every issue assumes

- **MUI defaults only.** Don't use `sx`, don't use the `style` prop. Use
  MUI component props (`variant`, `color`, `size`, etc.) for everything.
- **Mock API**: import from `src/api/*` — those modules already return
  fixture data, so no real network call.
- **Schema**: shapes live in `src/schema/schema.js`. Fixtures (sample data
  the mock API serves) live in `src/schema/fixtures.js`.
- **Wireframe**: `docs/useCare.excalidraw` — open with the Excalidraw
  VS Code extension or excalidraw.com.
- **Routing**: react-router v7 (`createBrowserRouter` style). Routes are
  declared in `src/routes/AppRoutes.jsx`.
- **Auth**: mocked in `src/context/AuthContext.jsx`. `useAuth()` exposes
  `{ user, role, login, logout }`. No real backend.

## Team split

See `ASSIGNMENT.md` for the full ownership map (who owns what flow).
The short version:

- **@DevAbdoTolba** — Patient flow + Login/Register (landing is already done)
- **Admin flow** — split across 2 devs (TBD)
- **Doctor flow** — 1 dev (TBD)
