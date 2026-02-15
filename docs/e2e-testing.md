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
- **Database:** For routes that load data (e.g. `/todos`, `/todos/:id/edit`), a working database connection is required (same as for `pnpm run dev`). Tests are written to handle empty or loading states so they pass whether or not the database has data.

## Commands

| Command | Description |
|--------|-------------|
| `pnpm run test:e2e` | Run all e2e tests (headless). Starts dev server if needed. |
| `pnpm run test:e2e:ui` | Run Playwright UI mode for debugging and watching tests. |

## Configuration

- **Config file:** `playwright.config.ts`
- **Base URL:** `http://localhost:3000`
- **Test directory:** `e2e/`
- **Browser:** Chromium (Desktop Chrome)
- **Web server:** `pnpm run dev`; `reuseExistingServer: true` so an already-running dev server is reused
- **Viewport:** 1280×720 (consistent across runs)

## Test Structure

Tests are grouped by route or behavior:

| File | Coverage |
|------|----------|
| `e2e/home.spec.ts` | Home (`/`): branding, feature info, page title |
| `e2e/todos.spec.ts` | Todos list (`/todos`): heading, list/empty/loading/error states; navigation from home via sidebar |
| `e2e/add-todo.spec.ts` | Add Todo (`/todos/add`): heading, form (title field, placeholder); navigation via sidebar |
| `e2e/edit-todo.spec.ts` | Edit Todo (`/todos/:id/edit`): heading when todo exists; "Todo not found" for invalid id; edit button from list navigates to edit page |
| `e2e/theme.spec.ts` | Theme selector: visibility in header; all options (Light, Dark, System, Sunshine); selecting themes applies correct class on `html` |

Shared helpers live in `e2e/fixtures.ts`:

- **`openNav(page)`** – Opens the sidebar (hamburger menu) and waits for the "Navigation" heading so nav links are available.
- **`clickNavLink(page, name)`** – After opening the nav, finds the link by accessible name, asserts it is visible, then navigates via its `href` (avoids viewport issues with the fixed overlay).

## Writing New E2E Tests

1. **Prefer role and label:** Use `getByRole`, `getByLabel`, `getByPlaceholder` so tests align with accessibility and are resilient to class/ID changes.
2. **Route-first:** Add or extend a `*.spec.ts` file under `e2e/` that matches the route or feature (e.g. `e2e/todos.spec.ts` for `/todos`).
3. **Sidebar navigation:** When testing navigation from the sidebar, use `openNav(page)` then `clickNavLink(page, 'Link Name')` so the fixed overlay does not cause "element outside viewport" failures.
4. **Data-independent:** Where possible, assert on both populated and empty/loading states (e.g. "Todos" page shows either a list, "No todos found", or "Pending...") so tests pass regardless of DB state.
5. **Avoid hard-coded IDs:** For edit route, either derive the id from the list (e.g. click "Edit" on first todo) or test the "Todo not found" path with a known invalid id (e.g. `99999`).

## CI Considerations

- In CI, set `CI=true` (or ensure no server is running on the configured URL). Playwright will start the web server via `webServer.command` and wait for `webServer.url` before running tests.
- Ensure the database is available and migrated in CI if routes under test depend on it; tests are written to tolerate empty or loading states where applicable.
- To run only Chromium and avoid installing all browsers, the config already uses a single project; for faster CI you can restrict with `--project=chromium` (default in this project).

## Related Documentation

- **Architecture:** `docs/technical/architecture.md` – Testability and layer boundaries; e2e tests sit at the presentation layer (routes and UI).
- **Forms:** `docs/ux/forms-react-hook-form-shadcn.md` – Form patterns used on Add/Edit Todo pages that e2e tests interact with.
