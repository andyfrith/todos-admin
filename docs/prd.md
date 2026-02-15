# Todos Admin

This PRD defines a **production‑ready starter template** built with TanStack Start and modern TypeScript tooling. It is optimized for **AI‑assisted code generation** (e.g. Cursor, Claude) and deterministic implementation.

---

## How to use this PRD with an LLM (Cursor / Claude)

- **Read the entire document** before generating code. Use sections 2 (Scope), 4 (Data Model), 6 (Flows), 7 (Requirements), 8 (API), and 17 (Implementation order) as primary references.
- **Follow the implementation order** in section 17 so that schema, server functions, hooks, and UI are built in dependency order.
- **Respect in-scope vs out-of-scope** (section 2). Do not add auth, roles, or multi-tenancy unless the user explicitly requests them.
- **Use linked documentation** when implementing: `docs/technical/architecture.md` for layer boundaries and file layout; `docs/deployment.md` for Cloudflare Workers deploy and env config; `docs/ux/forms-react-hook-form-shadcn.md` for form patterns; `docs/e2e-testing.md` for E2E test setup and conventions.
- **Verify against the acceptance checklist** in section 16 (AI Implementation Notes) before considering the task complete.
- **Prefer existing patterns** in the codebase over introducing new libraries or patterns not listed in this PRD.

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
- Theme support: light, dark, system (OS preference), and sunshine (warm color scheme)
- ESLint configured and passing
- Storybook for UI component development
- Unit/integration tests (Vitest); E2E tests (Playwright) for routes and navigation
- Form validation with React Hook Form + Zod; Shadcn form primitives
- Clean project structure and documentation (see `docs/technical/architecture.md`)

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
- **E2E testing:** Playwright (see `docs/e2e-testing.md`); Vitest for unit/integration
- **Package manager:** pnpm (use for install, scripts, and adding Shadcn: `pnpm dlx shadcn@latest add <component>`)
- **Formatting:** Prettier (run with project check script if present)

## Key package scripts (reference)

- `pnpm install` — install dependencies
- `pnpm dev` — start dev server (e.g. port 3000)
- `pnpm build` — production build
- `pnpm preview` — preview production build (Workers runtime)
- `pnpm deploy` — build and deploy to Cloudflare Workers (see `docs/deployment.md`)
- `pnpm cf-typegen` — generate Wrangler types for bindings
- `pnpm lint` — run ESLint
- `pnpm test` — run unit/integration tests (Vitest)
- `pnpm run test:e2e` — run E2E tests (Playwright); `pnpm run test:e2e:ui` for UI mode
- `pnpm db:generate` — generate Drizzle migrations
- `pnpm db:push` — push schema to DB (dev); or `pnpm db:migrate` for migration files
- `pnpm db:studio` — open Drizzle Studio
- `pnpm storybook` — start Storybook (e.g. port 6006)

## Environments

- Local development (e.g. `pnpm dev`, port 3000)
- Production build and deploy (Cloudflare Workers; `pnpm build`, `pnpm preview`, `pnpm deploy` — see `docs/deployment.md`)

## Project structure (key paths for implementation)

Implement and place code in these locations so the app stays consistent with the modular architecture (see `docs/technical/architecture.md`):

| Purpose                | Path                            | Notes                                                                                                               |
| ---------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| DB schema              | `src/db/schema.ts`              | Drizzle table definitions. Single source of truth for DB.                                                           |
| DB connection          | `src/db/index.ts`               | Drizzle client; reads env for connection URL.                                                                       |
| Migrations             | `drizzle.config.ts`, `drizzle/` | Config and migration outputs. Use `pnpm db:generate`, `pnpm db:push` or `pnpm db:migrate`.                          |
| App types & validation | `src/lib/schema.ts`             | Zod schemas and inferred types (e.g. `Todo`, `TodoSchema`). Use for forms and server I/O.                           |
| Server API             | `src/server/fn/todos.ts`        | Server functions per domain (e.g. `getTodos`, `createTodo`, `updateTodo`, `deleteTodo`).                            |
| Query options          | `src/queries/todos.tsx`         | TanStack Query `queryOptions` / `mutationOptions` (queryKey, queryFn).                                              |
| Data hooks             | `src/hooks/useTodos.ts`         | React hooks that call server functions and use query options; handle cache invalidation and toasts.                 |
| Feature UI             | `src/components/todos/`         | List, item, add form, edit form, shared form component.                                                             |
| Shared UI              | `src/components/ui/`            | Shadcn primitives (button, input, checkbox, select, field, etc.).                                                   |
| Routes                 | `src/routes/`                   | File-based: `__root.tsx`, `index.tsx`, `todos/route.tsx`, `todos/index.tsx`, `todos/add.tsx`, `todos/$id/edit.tsx`. |
| Router                 | `src/router.tsx`                | Uses `routeTree` and TanStack Query context; do not call from app code.                                             |
| Styles                 | `src/styles.css`                | Tailwind + theme variables.                                                                                         |

**Layer rule:** Presentation (routes, components) → hooks → server functions → database. Server and DB must not import from routes or components.

## Environment variables

- **Database:** `DATABASE_URL` (full URL) **or** `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`. Load from `.env` or `.env.local` (e.g. via `dotenv` in `src/db/index.ts` and `drizzle.config.ts`).
- Document required env vars in a `.env.example` (without secrets) so new projects know what to set.

---

# 4. Data Model (Source of Truth)

The **database schema** is the source of truth for persistence (Drizzle in `src/db/schema.ts`). The **application/API contract** uses Zod schemas and inferred types in `src/lib/schema.ts` (validation rules and shared types for forms and server function I/O).

## Entity: Todo

| Field       | Type      | Constraints                                                                 |
| ----------- | --------- | --------------------------------------------------------------------------- |
| id          | integer   | Primary key, auto-generated (e.g. `generatedAlwaysAsIdentity()` in Drizzle) |
| title       | string    | Required. Min 5, max 32 characters.                                         |
| summary     | string    | Optional. Min 5, max 250 characters when provided.                          |
| description | string    | Optional. Min 5, max 250 characters when provided.                          |
| todoType    | TodoType  | Optional; default `ACTIVE`.                                                 |
| completed   | boolean   | Default `false`.                                                            |
| createdAt   | timestamp | Default now.                                                                |
| updatedAt   | timestamp | Default now; update on edit.                                                |

**Validation (Zod in `lib/schema.ts`):** Title must be 5–32 characters. Summary and description, when provided, must be 5–250 characters with clear error messages. Use the same schema for client forms and server input validation where applicable.

## Entity: TodoType

Enum: `ACTIVE`, `CULTURAL`, `RESTORATIVE`, `PLANNING`. Stored as text in DB; validated via Zod enum in app.

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

1. User navigates to `/` (home) or `/todos` (list).
2. System fetches todos via TanStack Query (e.g. `getTodos` server function).
3. Loading state shown while fetching.
4. List of todos rendered (e.g. ordered by `createdAt` desc).
5. Empty state shown if no todos exist.

## Flow: Create Todo

1. User enters text in title input field (optionally summary and description)
2. User selects todo type option from select component
3. User submits form.
4. Client validates title (min 5, max 32 chars), and optionally summary/description (min 5, max 250 chars when provided) via Zod + React Hook Form.
5. Mutation sent to server (e.g. `createTodo` server function).
6. Database record created.
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

1. User modifies text in title, summary, description, or selects alternate todo type option in select component.
2. User submits form.
3. Client validates title (min 5, max 32 chars), and optionally summary/description (min 5, max 250 chars when provided) via Zod + React Hook Form.
4. Mutation sent to server (e.g. `updateTodo` server function).
5. Database record updated
6. Query cache invalidated/refetched
7. Updated todo continues to appear in the list

---

# 7. Functional Requirements (Atomic)

## Routing

- **File-based routes** under `src/routes/` (TanStack Router). Root layout in `__root.tsx`; child routes per path.
- **Required routes:** `/` (index), `/todos` (list), `/todos/add` (create form), `/todos/$id/edit` (edit form). List and forms may live under a common `/todos` layout with an `<Outlet />`.
- Do not edit `src/routeTree.gen.ts`; it is generated from the file-based structure.

## Todo CRUD

- System must allow create, read, update, delete of Todo via server functions and TanStack Query (queries + mutations).
- All mutations and queries must be **type-safe** (TypeScript); validate input with Zod on client and optionally on server (e.g. `inputValidator`).
- **Errors** must surface in UI (e.g. mutation `onError`, error state in components, toasts for failures).

## Theming

- Must support **light**, **dark**, **system** (follows OS preference), and **sunshine** (warm color scheme) themes
- Theme persisted in local storage (via next-themes)
- Theme selector available in UI (aligned right in Header)
- Components use semantic color variables (e.g. `bg-background`, `text-foreground`) to reflect all themes
- Styling must follow Shadcn conventions; see `docs/ux/Theming.md`

## UI System

- Use Shadcn primitives only (no custom design system in v1). Add components via `pnpm dlx shadcn@latest add <component>`.
- Layout must be minimal and centered.
- Must include: Button, Input, Checkbox, Card/container, Select, and form primitives (e.g. Field, Label) as needed for add/edit Todo.

## Forms

- Use **React Hook Form** with **Zod** resolver (`zodResolver` from `@hookform/resolvers/zod`) and the shared schema from `lib/schema.ts`. Validate title length (5–32) and TodoType on client.
- Use Shadcn form components (Field, Input, Select, Checkbox) for consistent styling and accessibility. Follow patterns in `docs/ux/forms-react-hook-form-shadcn.md`.

## Code Quality

- ESLint must pass with no errors
- Strict TypeScript enabled
- No unused exports or dead code

---

# 8. API Specification

## Conventions

- **TanStack Start server functions** (`createServerFn`) are the primary API layer—not REST routes. They run on the server and are invoked from the client like local functions. Use `method: 'GET'` for reads and `method: 'POST'` for mutations.
- Request/response are **typed** (TypeScript); use Zod in `lib/schema.ts` for runtime validation. Optionally use `.inputValidator()` on server functions to validate payloads.
- **Shared types:** Define once in `lib/schema.ts` (Zod + inferred types); use for forms, server function I/O, and components. Do not duplicate type definitions.

## Server functions (examples)

- **getTodos** – GET. No input. Returns `Todo[]` (ordered by `createdAt` desc).
- **createTodo** – POST. Input: `{ title: string; summary?: string; description?: string }`. Validates title; inserts row; returns e.g. `{ success: true }`.
- **updateTodo** – POST. Input: `{ id: number; title: string; summary?: string; description?: string; todoType?: string; completed?: boolean }`. Updates row; returns e.g. `{ success: true }`.
- **deleteTodo** – POST. Input: `{ id: number }`. Deletes row; returns e.g. `{ success: true }`.

## Example: Create Todo (server function)

**Handler input (validated):** `{ title: string; summary?: string; description?: string }` (title 5–32 chars; summary and description 5–250 chars when provided).

**Handler behavior:** Insert into `todos` table via Drizzle; return `{ success: true }`.

**Client usage:** Call `createTodo({ data: { title, summary, description } })` from a mutation hook; invalidate query key `['todos']` on success and show success toast (e.g. Sonner).

---

# 9. UI Structure

## Screens

- **Home** (`/`) and **Todo list** (`/todos`) with navigation to add/edit.
- **Add Todo** (`/todos/add`) and **Edit Todo** (`/todos/:id/edit`) with form (title, summary, description, todo type, completed) and validation.
- **Storybook** for UI component explorer (separate dev server).

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

## Unit/Integration (e.g. Vitest)

- Core utilities and hooks covered where meaningful. Mock server functions in hook tests; test query options and validation logic in isolation where useful.

## Storybook

- All reusable UI components (especially in `components/ui/` and form components) should have stories so they can be developed and reviewed in isolation.

## E2E (e.g. Playwright, if in scope)

- Load homepage (or main list route) successfully.
- Create todo flow: navigate to add, submit valid form, see new todo in list.
- Toggle completion (if exposed in list): checkbox updates and persists.
- Delete todo: remove item from list and confirm list updates.
- Edit todo (optional): navigate to edit, change title/type, submit, see updated data.

If the project does not yet include Playwright, prioritize Vitest and Storybook; add E2E when requested or when scope explicitly includes it.

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

- ESLint clean; Prettier/format applied
- Storybook running; key components have stories
- Unit/integration tests (Vitest) passing; E2E (Playwright) passing if in scope

---

# 15. Open Questions

- Authentication will be implemented in future work (not part of v1 scope)
- Database is confirmed as Postgres for the starter template

---

# 16. AI Implementation Notes

## Do

- Generate **database schema and migrations first** (`src/db/schema.ts`, then `pnpm db:generate` / `pnpm db:push`).
- Define **Zod schemas and types in `src/lib/schema.ts`** for validation and shared types; use in forms (React Hook Form + zodResolver) and optionally in server `.inputValidator()`.
- Use **TanStack Start server functions** (`createServerFn`) for all server-side Todo operations; do not create REST route files for Todo CRUD.
- Keep **components small and composable**; have them consume **hooks** (e.g. `useTodos`, `useCreateTodo`) rather than calling server functions or DB directly.
- Use **TanStack Query** for fetching and mutations: query options in `src/queries/`, hooks in `src/hooks/` that invalidate cache (e.g. `queryKey: ['todos']`) and show toasts on success/error.
- Follow **naming:** server functions `verbNoun` (e.g. `getTodos`, `createTodo`); hooks `useNoun` / `useVerbNoun` (e.g. `useTodos`, `useCreateTodo`).
- Install **Shadcn components** via CLI: `pnpm dlx shadcn@latest add <component>` (per project rules).
- Add **form patterns** per `docs/ux/forms-react-hook-form-shadcn.md` (React Hook Form, Zod resolver, Shadcn Field/Input/Select/Checkbox).
- Run **ESLint** and fix any errors; ensure **strict TypeScript** with no type errors on build.
- If E2E is in scope, add Playwright (or agreed tool) and ensure critical flows pass; otherwise ensure unit/integration tests (e.g. Vitest) cover key logic.

## Do not

- **Do not** add authentication, roles, or multi-tenant logic unless explicitly requested.
- **Do not** add libraries beyond the stack in section 3 and scope (e.g. no extra ORM, no duplicate validation lib).
- **Do not** put business or DB logic in route or UI components; keep it in server function handlers and `db/`.
- **Do not** edit `src/routeTree.gen.ts`; it is generated from file-based routes.
- **Do not** duplicate type definitions; use `lib/schema.ts` and inferred types.

## Verification checklist (before marking task complete)

- [ ] `pnpm install` and `pnpm dev` run without errors.
- [ ] `pnpm build` succeeds with zero TypeScript errors.
- [ ] ESLint passes (`pnpm lint` or project check script).
- [ ] DB: schema exists, migrations applied or pushed, env vars set; can create/read/update/delete a todo.
- [ ] All four Todo routes work: list, add, edit, delete (and list updates after mutations).
- [ ] Loading, empty, and error states are handled in the UI.
- [ ] Theme (light/dark/system/sunshine) works; theme selector present in Header.
- [ ] Storybook runs and required components have stories (if in scope).
- [ ] Tests (unit/integration or E2E per scope) pass.

---

# 17. Implementation order (for LLMs)

Implement in this order so dependencies exist before use:

1. **Database:** `src/db/schema.ts` (todos table), `src/db/index.ts` (connection). Run `pnpm db:generate` and `pnpm db:push` (or migrate). Ensure `.env` / `.env.example` has DB vars.
2. **Types and validation:** `src/lib/schema.ts` — Zod `TodoTypeSchema`, `TodoSchema`, inferred `Todo` type (title 5–32 chars, etc.).
3. **Server functions:** `src/server/fn/todos.ts` — `getTodos`, `createTodo`, `updateTodo`, `deleteTodo` using Drizzle and optional `inputValidator` with Zod.
4. **Query options:** `src/queries/todos.tsx` — e.g. `todosQueryOptions()` (key `['todos']`, queryFn calling `getTodos`); mutation options if needed.
5. **Hooks:** `src/hooks/useTodos.ts` — `useTodos()`, `useCreateTodo()`, `useUpdateTodo()`, `useDeleteTodo()`; invalidate `['todos']` on mutation success; optional toasts (e.g. Sonner).
6. **Shared UI:** Ensure Shadcn components used by forms exist (button, input, label, checkbox, select, field); add via `pnpm dlx shadcn@latest add <component>`.
7. **Feature components:** `src/components/todos/` — list component (uses `useTodos`, `useDeleteTodo`), todo item, add form (uses `useCreateTodo`), edit form (uses `useTodos`, `useUpdateTodo`), shared form component (React Hook Form + Zod + Shadcn). See `docs/ux/forms-react-hook-form-shadcn.md`.
8. **Routes:** `src/routes/__root.tsx`, `index.tsx`, `todos/route.tsx`, `todos/index.tsx`, `todos/add.tsx`, `todos/$id/edit.tsx` rendering the components above.
9. **Tests and polish:** Unit/integration tests for hooks or server logic; Storybook stories for UI components; E2E for critical flows if in scope. Run lint and build.

---

# 18. Related documentation

- **Architecture:** `docs/technical/architecture.md` — modular layers, directory layout, data flow, server functions, DB, hooks, queries, routes. Reference when adding or moving code.
- **Forms:** `docs/ux/forms-react-hook-form-shadcn.md` — React Hook Form, Zod resolver, Shadcn field components, and form patterns for add/edit Todo.
- **Theming:** `docs/ux/Theming.md` — theme options (light, dark, system, sunshine), CSS variables, and adding new color schemes.

---

**End of PRD**
