# E2E Testing with Playwright

This document describes the end-to-end (e2e) testing setup for Todos Admin using [Playwright](https://playwright.dev/).

## Overview

- **Framework:** Playwright (`@playwright/test`)
- **Test directory:** `e2e/`
- **Config:** `playwright.config.ts` at the project root
- **Scope:** Route rendering, navigation, and key UI elements for the current app routes

E2E tests run in a real browser (Chromium by default) against the running application to verify that routes load, headings and forms are visible, and navigation works.

## Prerequisites

- **Application server:** The app must be reachable at `http://localhost:3000` when running e2e tests. Playwright is configured to reuse an existing dev server if one is already running; otherwise it will start one via `pnpm run dev`.
- **Database:** A working PostgreSQL connection is required. Routes that load data (e.g. `/todos`, `/todos/:id/edit`) query the database; if the DB is unavailable, those pages will hang and tests will timeout. Before running e2e tests locally, ensure:
  1. `DATABASE_URL` (or `DB_*` vars) is set in `.env` or `.env.local`
  2. Postgres is running
  3. Schema is applied: `pnpm db:push`
  Tests are written to tolerate **empty vs populated** data (e.g. "No todos found" vs a list), but the database must be reachable.

## Commands

| Command                | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `pnpm run test:e2e`    | Run all e2e tests (headless). Starts dev server if needed. |
| `pnpm run test:e2e:ui` | Run Playwright UI mode for debugging and watching tests.   |

## Configuration

- **Config file:** `playwright.config.ts`
- **Base URL:** `http://localhost:3000`
- **Test directory:** `e2e/`
- **Browser:** Chromium (Desktop Chrome)
- **Web server:** `pnpm run dev`; `reuseExistingServer: true` so an already-running dev server is reused
- **Viewport:** 1280×720 (consistent across runs)

## Test Structure

Tests are grouped by route or behavior:

| File                    | Coverage                                                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `e2e/home.spec.ts`      | Home (`/`): branding, feature info, page title                                                                                         |
| `e2e/todos.spec.ts`     | Todos list (`/todos`): heading, list/empty/loading/error states; navigation from home via sidebar                                      |
| `e2e/add-todo.spec.ts`  | Add Todo (`/todos/add`): heading, form (title field, placeholder); navigation via sidebar                                              |
| `e2e/edit-todo.spec.ts` | Edit Todo (`/todos/:id/edit`): heading when todo exists; "Todo not found" or "Failed to load todos" for invalid id; edit button from list navigates to edit page |
| `e2e/theme.spec.ts`     | Theme selector: visibility in header; all options (Light, Dark, System, Sunshine); selecting themes applies correct class on `html`    |

Shared helpers live in `e2e/fixtures.ts`:

- **`openNav(page)`** – Opens the sidebar (hamburger menu) and waits for the "Navigation" heading so nav links are available.
- **`clickNavLink(page, name)`** – After opening the nav, finds the link by accessible name, asserts it is visible, then navigates via its `href` (avoids viewport issues with the fixed overlay).

## Writing New E2E Tests

1. **Prefer role and label:** Use `getByRole`, `getByLabel`, `getByPlaceholder` so tests align with accessibility and are resilient to class/ID changes.
2. **Route-first:** Add or extend a `*.spec.ts` file under `e2e/` that matches the route or feature (e.g. `e2e/todos.spec.ts` for `/todos`).
3. **Sidebar navigation:** When testing navigation from the sidebar, use `openNav(page)` then `clickNavLink(page, 'Link Name')` so the fixed overlay does not cause "element outside viewport" failures.
4. **Data-independent:** Where possible, assert on both populated and empty/loading states (e.g. "Todos" page shows either a list, "No todos found", or "Pending...") so tests pass regardless of DB state.
5. **Wait before data-dependent assertions:** For routes that load data (e.g. `/todos`), wait for the page to settle (one of: "Pending...", "No todos found", list, or "Error!") before querying elements that may not exist when empty (e.g. `getByRole('list')`, "Edit todo" button). Avoid waiting on elements that never appear in the empty state—this causes timeouts.
6. **Avoid hard-coded IDs:** For edit route, either derive the id from the list (e.g. click "Edit" on first todo) or test the "Todo not found" path with a known invalid id (e.g. `99999`).

## CI Considerations

- In CI, set `CI=true` (or ensure no server is running on the configured URL). Playwright will start the web server via `webServer.command` and wait for `webServer.url` before running tests.
- Ensure the database is available and schema is applied before running tests (e.g. `pnpm db:push` in the workflow). The CI workflow sets `DATABASE_URL` and runs `db:push` before `test:e2e`. Tests tolerate empty or populated data but require a reachable database.
- To run only Chromium and avoid installing all browsers, the config already uses a single project; for faster CI you can restrict with `--project=chromium` (default in this project).

## Related Documentation

- **Architecture:** `docs/technical/architecture.md` – Testability and layer boundaries; e2e tests sit at the presentation layer (routes and UI).
- **Forms:** `docs/ux/forms-react-hook-form-shadcn.md` – Form patterns used on Add/Edit Todo pages that e2e tests interact with.
