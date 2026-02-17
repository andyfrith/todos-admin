# Scaffolding Tasks — Execution Script

This document is the **single execution script** for creating a new application from this blueprint. Execute tasks in order. Each task includes an optional **Cursor prompt** (paste into Cursor when using AI) and a **verification** step. Design goal: **minimal human interaction** — gather inputs once at the start, then run through.

---

## Before You Start: Gather Inputs (once)

Fill these in and keep them handy; they are used in multiple tasks.

| Variable | Example | Description |
|----------|---------|-------------|
| **APP_NAME** | `my-app` | Short slug for package name, Worker name, and CI (e.g. `my-app`). |
| **APP_TITLE** | `My App` | Human-readable title for README and UI (e.g. `My App`). |
| **DOMAIN** | `item` | Domain entity name for the example CRUD (e.g. `item`, `post`, `task`). Use plural for lists: `items`, `posts`, `tasks`. |
| **DOMAIN_PASCAL** | `Item` | PascalCase for the same (e.g. `Item`, `Post`, `Task`). |

**Decision:** Will you **keep the Todo example** (only rename the app) or **replace Todo with a new domain**?

- **Keep Todo:** Do **Phase 1** only, then **Phase 5** (env + verify).
- **Replace domain:** Do **Phases 1–4**, then **Phase 5**.

---

## Phase 1: Rename application and config

**Goal:** Replace "todos-admin" / "Todos Admin" with your app name everywhere that identifies the project (not yet the Todo domain).

### Task 1.1 — Package and Wrangler

- In **`package.json`**: set `"name": "<APP_NAME>"` (e.g. `"my-app"`).
- In **`wrangler.jsonc`**: set `"name": "<APP_NAME>"`. Remove any `DATABASE_URL` or other secrets from the file (they belong in env or Cloudflare dashboard).
- **Verification:** `pnpm install` runs without errors.

**Cursor prompt (optional):**

```
Rename this application from "todos-admin" to "<APP_NAME>" (e.g. my-app). Update package.json "name" and wrangler.jsonc "name" to <APP_NAME>. Do not change any Todo-related code or routes. Remove any DATABASE_URL or secrets from wrangler.jsonc (config only; secrets go in env or Cloudflare).
```

### Task 1.2 — README and docs titles

- In **`README.md`**: replace the main title and any "Todos Admin" references with **APP_TITLE** (or "Todos Admin" → "<APP_TITLE>" in the first line and intro).
- In **`docs/prd.md`**: update the product name at the top to **APP_TITLE** (and one-sentence summary if you want).
- **Verification:** Grep for "todos-admin" in repo (excluding `.git`, `node_modules`, `dist`): only historical/docs references should remain if any.

**Cursor prompt (optional):**

```
Update README.md and docs/prd.md so the application title is "<APP_TITLE>" instead of "Todos Admin". Keep the rest of the structure and tech stack description. Do not change Todo domain or code.
```

### Task 1.3 — CI workflow

- In **`.github/workflows/ci.yml`**: set `POSTGRES_DB` to a safe name derived from **APP_NAME** (e.g. `my_app_test`). Keep `POSTGRES_USER` and `POSTGRES_HOST_AUTH_METHOD` as-is. Set `DATABASE_URL` in the E2E step to match (e.g. `postgres://postgres@localhost:5432/my_app_test`).
- **Verification:** YAML is valid (e.g. run a lint or deploy check if available).

**Cursor prompt (optional):**

```
In .github/workflows/ci.yml, set the Postgres database name for CI to a value derived from the app name "<APP_NAME>", e.g. <APP_NAME> with hyphens replaced by underscores plus "_test" (e.g. my_app_test). Update the DATABASE_URL in the E2E step to use that database name. Keep the rest of the workflow unchanged.
```

---

## Phase 2: Replace Todo domain with new domain (skip if keeping Todo)

**Goal:** Rename the example domain from Todo to **DOMAIN** (e.g. Item) across schema, server functions, queries, hooks, components, and routes. Follow the implementation order in `docs/prd.md` (DB → types → server → queries → hooks → UI → routes).

### Task 2.1 — Database schema and migrations

- **`src/db/schema.ts`**: Rename table and columns from todo(s) to your domain (e.g. `items` table, `item_type`, etc.). Keep the same structure (id, title, summary, description, type, completed, createdAt, updatedAt) or adjust to your domain model.
- Run **`pnpm db:generate`** then **`pnpm db:push`** (or migrate) so the DB matches.
- **Verification:** `pnpm db:studio` opens and shows the new table(s).

**Cursor prompt (optional):**

```
Replace the Todo domain with "<DOMAIN>" in the database layer. In src/db/schema.ts, rename the table from "todos" to "<DOMAIN_PLURAL>" (e.g. items) and rename columns to match (e.g. todo_type → <domain>_type). Keep id, title, summary, description, type enum, completed, createdAt, updatedAt pattern unless I specified otherwise. Do not change src/lib/schema.ts or server/hooks yet. After editing, run pnpm db:generate and pnpm db:push.
```

### Task 2.2 — App types and validation (lib/schema)

- **`src/lib/schema.ts`**: Rename `TodoTypeSchema` / `TodoSchema` / `Todo` / `TodoType` to **DOMAIN** equivalents (e.g. `ItemTypeSchema`, `ItemSchema`, `Item`, `ItemType`). Update enum values and field rules to match your domain.
- **Verification:** TypeScript build passes: `pnpm build`.

**Cursor prompt (optional):**

```
In src/lib/schema.ts, rename all Todo types and schemas to <DOMAIN_PASCAL> (e.g. Item): TodoTypeSchema → <DOMAIN_PASCAL>TypeSchema, TodoSchema → <DOMAIN_PASCAL>Schema, Todo → <DOMAIN_PASCAL>, TodoType → <DOMAIN_PASCAL>Type. Keep the same validation rules and structure as the current Todo schema, unless I specified changes. Ensure no remaining references to Todo in this file.
```

### Task 2.3 — Server functions

- **`src/server/fn/todos.ts`**: Rename file to **`<domain>.ts`** (e.g. `items.ts`). Inside, rename `getTodos` → `get<DOMAIN_PASCAL>s`, `createTodo` → `create<DOMAIN_PASCAL>`, etc. Use the new table and types from `src/db/schema.ts` and `src/lib/schema.ts`. Update imports and handler logic.
- **Verification:** `pnpm build` succeeds.

**Cursor prompt (optional):**

```
Rename src/server/fn/todos.ts to src/server/fn/<domain>.ts (e.g. items.ts). Replace all Todo server functions with <DOMAIN> equivalents: getTodos → get<DOMAIN_PASCAL>s, createTodo → create<DOMAIN_PASCAL>, updateTodo → update<DOMAIN_PASCAL>, deleteTodo → delete<DOMAIN_PASCAL>. Use the table and types from src/db/schema.ts and src/lib/schema.ts. Keep the same CRUD behavior and inputValidator pattern. Update all imports.
```

### Task 2.4 — Query options

- **`src/queries/todos.tsx`**: Rename file to **`<domain>.tsx`**. Rename `todosQueryOptions` → `<domain>QueryOptions`, `todosDeleteMutationOptions` → `<domain>DeleteMutationOptions`, and query keys from `['todos']` to `['<domain>s']`. Call the new server functions.
- **Verification:** `pnpm build` succeeds.

**Cursor prompt (optional):**

```
Rename src/queries/todos.tsx to src/queries/<domain>.tsx. Rename query options and keys: todosQueryOptions → <domain>QueryOptions, queryKey ['todos'] → ['<domain>s'], and mutation options to match the new domain. Use the new server functions from src/server/fn/<domain>.ts. Update all imports.
```

### Task 2.5 — Hooks

- **`src/hooks/useTodos.ts`**: Rename file to **`use<DOMAIN_PASCAL>s.ts`** (e.g. `useItems.ts`). Rename hooks: `useTodos` → `use<DOMAIN_PASCAL>s`, `useCreateTodo` → `useCreate<DOMAIN_PASCAL>`, etc. Use the new query options and server functions. Keep cache invalidation and toasts.
- **Verification:** `pnpm build` succeeds.

**Cursor prompt (optional):**

```
Rename src/hooks/useTodos.ts to src/hooks/use<DOMAIN_PASCAL>s.ts. Rename all hooks to the new domain: useTodos → use<DOMAIN_PASCAL>s, useCreateTodo → useCreate<DOMAIN_PASCAL>, useUpdateTodo → useUpdate<DOMAIN_PASCAL>, useDeleteTodo → useDelete<DOMAIN_PASCAL>. Use the new query options and server functions. Keep query key invalidation and Sonner toasts. Update all imports and usages across the codebase.
```

### Task 2.6 — Feature components and routes

- **Components:** Rename **`src/components/todos/`** to **`src/components/<domain>/`**. Rename files and components (Todos → <DOMAIN_PASCAL>s, Todo → <DOMAIN_PASCAL>, AddTodo → Add<DOMAIN_PASCAL>, EditTodo → Edit<DOMAIN_PASCAL>, TodoForm → <DOMAIN_PASCAL>Form, etc.). Update to use the new hooks and types. Update **`src/components/Header.tsx`** nav links and labels if they reference "Todos".
- **Routes:** Rename **`src/routes/todos/`** to **`src/routes/<domain>/`**: `todos/route.tsx` → `<domain>/route.tsx`, `todos/index.tsx` → `<domain>/index.tsx`, `todos/add.tsx` → `<domain>/add.tsx`, `todos/$id/edit.tsx` → `<domain>/$id/edit.tsx`. Update route file contents to import and render the new components. Update **`src/routes/__root.tsx`** and **`src/routes/index.tsx`** so links point to the new paths (e.g. `/items`, `/items/add`, `/items/:id/edit`).
- **Verification:** `pnpm build` succeeds. `pnpm dev` and manual click-through: list, add, edit, delete work.

**Cursor prompt (optional):**

```
Replace the Todo feature with <DOMAIN_PASCAL>. (1) Rename src/components/todos/ to src/components/<domain>/ and all component names (Todos, Todo, AddTodo, EditTodo, TodoForm, etc.) to <DOMAIN_PASCAL> equivalents; use the new hooks and types. (2) Rename src/routes/todos/ to src/routes/<domain>/ and update route files to render the new components; update __root.tsx and index.tsx so navigation links use /<domain>s, /<domain>s/add, /<domain>s/:id/edit. (3) Update Header and any sidebar links. Do not edit routeTree.gen.ts. Run pnpm build to verify.
```

---

## Phase 3: E2E and tests (when domain was replaced)

**Goal:** E2E and unit tests use the new domain and routes; no references to "todo" in test expectations or URLs.

### Task 3.1 — E2E specs and fixtures

- In **`e2e/`**: Rename or update spec files (e.g. `todos.spec.ts` → `<domain>.spec.ts`, `add-todo.spec.ts` → `add-<domain>.spec.ts`, `edit-todo.spec.ts` → `edit-<domain>.spec.ts`). Update URLs (`/todos` → `/<domain>s`), text expectations ("Todos" → "<DOMAIN_PASCAL>s", "Add Todo" → "Add <DOMAIN_PASCAL>", etc.), and **`e2e/fixtures.ts`** if it references todo routes.
- **Verification:** `pnpm run test:e2e` passes (with DB and dev server as per docs/e2e-testing.md).

**Cursor prompt (optional):**

```
Update E2E tests for the new domain. Rename e2e specs (todos.spec.ts → <domain>.spec.ts, add-todo.spec.ts → add-<domain>.spec.ts, edit-todo.spec.ts → edit-<domain>.spec.ts) and update all URLs (/todos → /<domain>s), headings and link text ("Todos" → "<DOMAIN_PASCAL>s", "Add Todo" → "Add <DOMAIN_PASCAL>", etc.). Update e2e/fixtures.ts if it references todo routes. Keep the same test structure and assertions. Run pnpm run test:e2e to verify.
```

### Task 3.2 — Unit/integration tests

- In **`src/`**: Update any Vitest tests that reference Todo (hooks, server, or components) to use the new domain types and names.
- **Verification:** `pnpm test` passes.

**Cursor prompt (optional):**

```
Update unit and integration tests to use the new domain (<DOMAIN_PASCAL>). Replace Todo types, server functions, and hook names in test files. Ensure pnpm test passes.
```

---

## Phase 4: Documentation and Storybook (when domain was replaced)

**Goal:** Docs and Storybook examples reference the new app and domain, not Todos Admin / Todo.

### Task 4.1 — Docs

- In **`docs/`**: Replace "Todos Admin" with **APP_TITLE** and "Todo" with **DOMAIN_PASCAL** in architecture, deployment, e2e-testing, PRD, and form/theming docs where they describe the example app. Keep the same structure and instructions; only names and examples change.
- **Verification:** No broken internal links; grep for "Todos Admin" / "Todo" in docs and update or leave only where intentionally kept.

**Cursor prompt (optional):**

```
In the docs/ folder, replace "Todos Admin" with "<APP_TITLE>" and "Todo" (as the example entity) with "<DOMAIN_PASCAL>" in architecture.md, deployment.md, e2e-testing.md, prd.md, and ux docs. Keep the same structure and technical content; only update app and domain names and examples.
```

### Task 4.2 — Storybook

- In **`src/components/storybook/`** and **`.storybook/`**: Update any stories that reference Todo or todos-admin to the new domain or remove if they were Todo-specific. Ensure Storybook still runs.
- **Verification:** `pnpm storybook` runs and relevant stories render.

**Cursor prompt (optional):**

```
Update Storybook stories and config so they do not reference Todo or todos-admin. Use the new domain "<DOMAIN_PASCAL>" where an example entity is needed, or keep stories generic. Ensure pnpm storybook runs.
```

---

## Phase 5: Environment and final verification

**Goal:** New app runs locally and in CI with correct env and no leftover template secrets.

### Task 5.1 — Environment template

- Ensure **`.env.example`** exists and lists all required variables (e.g. `DATABASE_URL` or `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`) with empty or placeholder values and short comments. Do not put real secrets in it.
- **Verification:** New clone can copy `.env.example` to `.env` and fill values.

**Cursor prompt (optional):**

```
Ensure .env.example exists with all required database variables (DATABASE_URL or DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME) and brief comments. No real secrets. If it already exists, just confirm it matches our stack (Postgres, Drizzle).
```

### Task 5.2 — Final verification checklist

Run in order:

1. **Install:** `pnpm install`
2. **Env:** Copy `.env.example` to `.env` (or `.env.local`), set DB vars, run `pnpm db:push`
3. **Build:** `pnpm build` (zero TypeScript errors)
4. **Lint:** `pnpm lint`
5. **Unit tests:** `pnpm test`
6. **E2E:** `pnpm run test:e2e` (dev server and DB as per docs)
7. **Manual:** `pnpm dev` — open app, navigate list/add/edit/delete, confirm theme and toasts

If any step fails, fix before considering scaffolding complete.

---

## Summary: Task order (minimal interaction)

| Phase | When | Tasks |
|-------|------|--------|
| **1** | Always | 1.1 Package & Wrangler → 1.2 README & docs titles → 1.3 CI workflow |
| **2** | When replacing domain | 2.1 DB schema → 2.2 lib/schema → 2.3 server fn → 2.4 queries → 2.5 hooks → 2.6 components & routes |
| **3** | When replacing domain | 3.1 E2E specs → 3.2 Unit tests |
| **4** | When replacing domain | 4.1 Docs → 4.2 Storybook |
| **5** | Always | 5.1 .env.example → 5.2 Final verification |

After Phase 5, the new application is scaffolded and ready for feature work.
