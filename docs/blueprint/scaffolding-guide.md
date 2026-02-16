# Scaffolding Guide — Step-by-Step

This guide walks through creating a new application from this blueprint in detail. For a single execution script with minimal interaction, use **[SCAFFOLDING_TASKS.md](SCAFFOLDING_TASKS.md)**. For copy-paste Cursor prompts only, use **[cursor-prompts.md](cursor-prompts.md)**.

---

## Prerequisites

- Git, Node.js (LTS), pnpm, PostgreSQL (local or Docker)
- Access to this repository (clone or copy)
- Decisions: **App name**, **App title**, and whether to **keep Todo** or **replace with a new domain** (e.g. Item, Post)

---

## Step 1: Clone or copy the repository

```bash
git clone <this-repo-url> <new-app-dir>
cd <new-app-dir>
```

Or copy the project folder (excluding `node_modules`, `dist`, `.git` if starting fresh) and run `pnpm install`.

---

## Step 2: Rename the application (Phase 1)

### 2.1 Package and Worker identity

- **`package.json`** — Set `"name": "<your-app-slug>"` (e.g. `my-app`).
- **`wrangler.jsonc`** — Set `"name": "<your-app-slug>"`. Remove any inline secrets (e.g. `DATABASE_URL`); use env or Cloudflare dashboard for production.

### 2.2 User-facing names

- **`README.md`** — Replace "Todos Admin" with your app title in the main heading and intro.
- **`docs/prd.md`** — Update product name and summary.

### 2.3 CI database name

- **`.github/workflows/ci.yml`** — Set `POSTGRES_DB` to a name like `<app_slug>_test` and the `DATABASE_URL` in the E2E step to `postgres://postgres@localhost:5432/<app_slug>_test`.

**Verification:** `pnpm install` and `pnpm build` succeed.

---

## Step 3: Replace the Todo domain (optional)

If you are keeping the Todo example, skip to **Step 4**. Otherwise, replace Todo with your domain (e.g. Item) in this order so dependencies are satisfied at each step.

### 3.1 Database

- Edit **`src/db/schema.ts`**: rename table `todos` → `<domain_plural>` (e.g. `items`), columns as needed (e.g. `todo_type` → `item_type`).
- Run: `pnpm db:generate` then `pnpm db:push` (or `pnpm db:migrate`).

### 3.2 Types and validation

- Edit **`src/lib/schema.ts`**: rename `TodoTypeSchema`, `TodoSchema`, `Todo`, `TodoType` to your domain (e.g. `ItemTypeSchema`, `ItemSchema`, `Item`, `ItemType`). Adjust enum values and validation rules if needed.

### 3.3 Server functions

- Rename **`src/server/fn/todos.ts`** → **`src/server/fn/<domain>.ts`** (e.g. `items.ts`).
- Rename and implement: `getTodos` → `get<Domain>s`, `createTodo` → `create<Domain>`, `updateTodo` → `update<Domain>`, `deleteTodo` → `delete<Domain>`. Use the new table and types.

### 3.4 Query options

- Rename **`src/queries/todos.tsx`** → **`src/queries/<domain>.tsx`**.
- Rename options and query keys (e.g. `['todos']` → `['items']`). Wire to the new server functions.

### 3.5 Hooks

- Rename **`src/hooks/useTodos.ts`** → **`src/hooks/use<Domain>s.ts`** (e.g. `useItems.ts`).
- Rename hooks and wire to new query options and server functions. Keep cache invalidation and toasts.

### 3.6 Components and routes

- Rename **`src/components/todos/`** → **`src/components/<domain>/`** and all component names (Todos → Items, Todo → Item, AddTodo → AddItem, EditTodo → EditItem, TodoForm → ItemForm, etc.). Use the new hooks and types.
- Rename **`src/routes/todos/`** → **`src/routes/<domain>/`** and update route files to render the new components. Update **`__root.tsx`** and **`index.tsx`** so links point to `/<domain>s`, `/<domain>s/add`, `/<domain>s/:id/edit`.
- Update **Header** (and any nav) to use the new labels and paths.

**Verification:** `pnpm build` and manual run of `pnpm dev` with list/add/edit/delete working.

---

## Step 4: Tests and docs (when domain was replaced)

### 4.1 E2E tests

- Rename/update files in **`e2e/`**: e.g. `todos.spec.ts` → `<domain>.spec.ts`, `add-todo.spec.ts` → `add-<domain>.spec.ts`, `edit-todo.spec.ts` → `edit-<domain>.spec.ts`.
- Replace URLs (`/todos` → `/<domain>s`) and visible text expectations ("Todos", "Add Todo", etc.).
- Update **`e2e/fixtures.ts`** if it references todo routes.

### 4.2 Unit tests

- Update any Vitest tests that reference Todo types, server functions, or hooks to the new domain.

### 4.3 Documentation

- In **`docs/`**, replace "Todos Admin" with your app title and "Todo" (as example entity) with your domain name in architecture, deployment, e2e-testing, PRD, and UX docs. Keep structure and technical content.

### 4.4 Storybook

- Update or remove Todo-specific stories; use the new domain in examples if needed. Ensure **`pnpm storybook`** runs.

**Verification:** `pnpm test`, `pnpm run test:e2e`, and `pnpm storybook` succeed as appropriate.

---

## Step 5: Environment and final checks

### 5.1 Environment template

- Ensure **`.env.example`** exists with `DATABASE_URL` or `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` and short comments. No real secrets.

### 5.2 Local run

1. Copy `.env.example` to `.env` (or `.env.local`).
2. Set database URL or DB_* variables.
3. Run `pnpm db:push`.
4. Run `pnpm dev` and confirm the app loads and CRUD works.

### 5.3 Full verification

- `pnpm install`
- `pnpm build` (no TypeScript errors)
- `pnpm lint`
- `pnpm test`
- `pnpm run test:e2e` (with DB and dev server)
- Optional: `pnpm storybook`

When all pass, scaffolding is complete.

---

## Quick reference: files to touch

| Purpose | Paths |
|--------|--------|
| App name | `package.json`, `wrangler.jsonc`, README, docs |
| CI DB | `.github/workflows/ci.yml` |
| DB schema | `src/db/schema.ts` |
| App types | `src/lib/schema.ts` |
| Server API | `src/server/fn/<domain>.ts` |
| Queries | `src/queries/<domain>.tsx` |
| Hooks | `src/hooks/use<Domain>s.ts` |
| Feature UI | `src/components/<domain>/`, `Header.tsx` |
| Routes | `src/routes/<domain>/`, `__root.tsx`, `index.tsx` |
| E2E | `e2e/*.spec.ts`, `e2e/fixtures.ts` |
| Env | `.env.example` |

Do not edit **`src/routeTree.gen.ts`** — it is generated from the file-based routes.
