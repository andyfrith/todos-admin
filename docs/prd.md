# Todos Admin

This PRD defines a **production‑ready starter template** built with TanStack Start and modern TypeScript tooling. It is optimized for **AI‑assisted code generation** and deterministic implementation.

---

# 1. Product Definition

**Product name:** Todos Admin
**One‑sentence summary:** A minimal, production‑ready TanStack Start application template with theming, Todo example, testing, and UI primitives.
**Problem statement:** Developers need a clean, modern, opinionated starting point for TanStack Start apps with routing, data fetching, database integration, UI system, and testing already configured.
**Target users:** TypeScript/React developers building full‑stack web apps with TanStack ecosystem.
**Primary user outcome (job to be done):** Quickly clone the template and begin building real features without spending time on boilerplate setup.

---

# 2. Scope Definition

## In Scope (v1)

- TanStack Start app scaffold
- TypeScript configured strictly
- TanStack Router + Query integration
- Postgres database via Drizzle ORM
- Minimal Todo application example (CRUD)
- Shadcn UI with Tailwind CSS v4
- Dark and light theme support
- ESLint configured and passing
- Storybook for UI component development
- Playwright end‑to‑end tests
- Clean project structure and documentation

## Out of Scope (v1)

- Authentication system
- Authorization/roles
- Multi‑tenant architecture
- Realtime collaboration
- Production deployment scripts for multiple clouds

---

# 3. System Overview

## Architecture

- **Framework:** TanStack Start (React + TypeScript)
- **Routing:** TanStack Router
- **Data fetching/cache:** TanStack Query
- **Database:** Postgres
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS v4
- **Component library:** Shadcn UI
- **Linting:** ESLint
- **Component dev:** Storybook
- **E2E testing:** Playwright
- **Package manager:** pnpm (default unless specified otherwise)

## Environments

- Local development
- Production build (Node runtime)

---

# 4. Data Model (Source of Truth)

## Entity: Todo

- id (uuid, primary key)
- title (string, required, max length 255)
- todoType (TodoType)
- completed (boolean, default false)
- created_at (timestamp, default now)
- updated_at (timestamp, auto‑updated)

## Entity: TodoType

ACTIVE, CULTURAL, RESTORATIVE, PLANNING

---

# 5. User Roles & Permissions

## Roles

- anonymous user only (v1)

## Permission Rules

- All users can perform CRUD on Todos
- No authentication required in starter template

---

# 6. Core User Flows (Deterministic)

## Flow: View Todo List

1. User navigates to `/`
2. System fetches todos via TanStack Query
3. Loading state shown while fetching
4. List of todos rendered
5. Empty state shown if none exist

## Flow: Create Todo

1. User enters text in input field
2. User selects todo type option from select component
3. User submits form
4. Client validates non‑empty title
5. Mutation sent to server
6. Database record created
7. Query cache invalidated/refetched
8. New todo appears in list

## Flow: Toggle Todo Complete

1. User clicks checkbox
2. Mutation updates `completed` field
3. Cache updates optimistically or via refetch

## Flow: Delete Todo

1. User clicks delete action
2. Mutation removes todo in database
3. List refreshes without deleted item

## Flow: Update Todo

1. User modifies text in input field or selects alternate todo type option in select component
2. User submits form
3. Client validates non‑empty title
4. Mutation sent to server
5. Database record updated
6. Query cache invalidated/refetched
7. Updated todo continues to appear in the list

---

# 7. Functional Requirements (Atomic)

## Routing

- Root route `/` displays Todo application
- Routes must be file‑based or TanStack‑standard structure

## Todo CRUD

- System must allow create, read, update, delete of Todo
- All mutations must be type‑safe via TypeScript
- Errors must surface in UI state

## Theming

- Must support **light** and **dark** themes
- Theme persisted in local storage or cookie
- Theme toggle available in UI
- Styling must follow Shadcn conventions

## UI System

- Use Shadcn primitives only (no custom design system in v1)
- Layout must be minimal and centered
- Must include:
  - Button
  - Input
  - Checkbox
  - Card/container
  - Select

## Code Quality

- ESLint must pass with no errors
- Strict TypeScript enabled
- No unused exports or dead code

---

# 8. API Specification

## Conventions

- Server functions or REST endpoints compatible with TanStack Start
- JSON request/response
- Typed responses shared between client and server

## Example: Create Todo

**POST /api/todos**

Request:

```json
{ "title": "string" }
```

Response:

```json
{
  "id": "uuid",
  "title": "string",
  "completed": false,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

---

# 9. UI Structure

## Screens

- Single page Todo app at root
- Storybook component explorer

## States Required

- Loading state
- Empty state
- Error state

## Layout Rules

- Max width container centered
- Adequate spacing using Tailwind scale
- Typography defaults from Shadcn

---

# 10. Non‑Functional Requirements

## Performance

- First render < 2s locally
- Todo mutations complete < 500ms locally

## Security

- Input validation on server
- SQL queries parameterized via Drizzle

## Reliability

- No uncaught promise rejections
- Graceful UI error handling

---

# 11. Observability & Analytics

## Logging

- Server errors logged to console (v1)

## Metrics (future)

- Not required for starter template

---

# 12. Testing Requirements

## Unit/Integration

- Core utilities covered where meaningful

## Storybook

- All reusable UI components must have stories

## Playwright E2E

- Load homepage successfully
- Create todo flow works
- Toggle completion works
- Delete todo works

---

# 13. Deployment

## Build

- Production build must succeed with zero type errors

## Runtime

- Node environment compatible

## Rollback

- Not required for template

---

# 14. Milestones

## Milestone 1 — Core Template

- TanStack Start configured
- Styling + Shadcn installed
- Database + Drizzle wired

## Milestone 2 — Todo Example

- Full CRUD working
- Queries + mutations wired
- Basic UI complete

## Milestone 3 — Quality Tooling

- ESLint clean
- Storybook running
- Playwright tests passing

---

# 15. Open Questions

- Authentication will be implemented in future work (not part of v1 scope)
- Database is confirmed as Postgres for the starter template

---

# 16. AI Implementation Notes

- Generate **database schema and migrations first**
- Keep components small and composable
- Prefer server actions aligned with TanStack Start patterns
- Avoid adding libraries beyond those listed in scope
- Ensure Playwright tests pass before completion

---

**End of PRD**
