# Cursor Prompts for Scaffolding

Copy-paste these prompts into Cursor when scaffolding a new app from this blueprint. Replace placeholders **`<APP_NAME>`**, **`<APP_TITLE>`**, **`<DOMAIN>`**, **`<DOMAIN_PASCAL>`**, **`<domain>`**, and **`<domain>`** with your values (e.g. `my-app`, `My App`, `item`, `Item`, `items`). Run prompts in the order given for minimal back-and-forth.

---

## Phase 1: Rename application (always)

### 1.1 Package and Wrangler

```
Rename this application from "todos-admin" to "<APP_NAME>" (e.g. my-app). Update package.json "name" and wrangler.jsonc "name" to <APP_NAME>. Do not change any Todo-related code or routes. Remove any DATABASE_URL or secrets from wrangler.jsonc (config only; secrets go in env or Cloudflare).
```

### 1.2 README and docs titles

```
Update README.md and docs/prd.md so the application title is "<APP_TITLE>" instead of "Todos Admin". Keep the rest of the structure and tech stack description. Do not change Todo domain or code.
```

### 1.3 CI workflow

```
In .github/workflows/ci.yml, set the Postgres database name for CI to a value derived from the app name "<APP_NAME>", e.g. <APP_NAME> with hyphens replaced by underscores plus "_test" (e.g. my_app_test). Update the DATABASE_URL in the E2E step to use that database name. Keep the rest of the workflow unchanged.
```

---

## Phase 2: Replace Todo domain (only if adding a new domain)

### 2.1 Database schema

```
Replace the Todo domain with "<DOMAIN>" in the database layer. In src/db/schema.ts, rename the table from "todos" to "<domain>s" (e.g. items) and rename columns to match (e.g. todo_type → <domain>_type). Keep id, title, summary, description, type enum, completed, createdAt, updatedAt pattern unless I specified otherwise. Do not change src/lib/schema.ts or server/hooks yet. After editing, run pnpm db:generate and pnpm db:push.
```

### 2.2 App types (lib/schema)

```
In src/lib/schema.ts, rename all Todo types and schemas to <DOMAIN_PASCAL> (e.g. Item): TodoTypeSchema → <DOMAIN_PASCAL>TypeSchema, TodoSchema → <DOMAIN_PASCAL>Schema, Todo → <DOMAIN_PASCAL>, TodoType → <DOMAIN_PASCAL>Type. Keep the same validation rules and structure as the current Todo schema, unless I specified changes. Ensure no remaining references to Todo in this file.
```

### 2.3 Server functions

```
Rename src/server/fn/todos.ts to src/server/fn/<domain>.ts (e.g. items.ts). Replace all Todo server functions with <DOMAIN> equivalents: getTodos → get<DOMAIN_PASCAL>s, createTodo → create<DOMAIN_PASCAL>, updateTodo → update<DOMAIN_PASCAL>, deleteTodo → delete<DOMAIN_PASCAL>. Use the table and types from src/db/schema.ts and src/lib/schema.ts. Keep the same CRUD behavior and inputValidator pattern. Update all imports.
```

### 2.4 Query options

```
Rename src/queries/todos.tsx to src/queries/<domain>.tsx. Rename query options and keys: todosQueryOptions → <domain>QueryOptions, queryKey ['todos'] → ['<domain>s'], and mutation options to match the new domain. Use the new server functions from src/server/fn/<domain>.ts. Update all imports.
```

### 2.5 Hooks

```
Rename src/hooks/useTodos.ts to src/hooks/use<DOMAIN_PASCAL>s.ts. Rename all hooks to the new domain: useTodos → use<DOMAIN_PASCAL>s, useCreateTodo → useCreate<DOMAIN_PASCAL>, useUpdateTodo → useUpdate<DOMAIN_PASCAL>, useDeleteTodo → useDelete<DOMAIN_PASCAL>. Use the new query options and server functions. Keep query key invalidation and Sonner toasts. Update all imports and usages across the codebase.
```

### 2.6 Components and routes

```
Replace the Todo feature with <DOMAIN_PASCAL>. (1) Rename src/components/todos/ to src/components/<domain>/ and all component names (Todos, Todo, AddTodo, EditTodo, TodoForm, etc.) to <DOMAIN_PASCAL> equivalents; use the new hooks and types. (2) Rename src/routes/todos/ to src/routes/<domain>/ and update route files to render the new components; update __root.tsx and index.tsx so navigation links use /<domain>s, /<domain>s/add, /<domain>s/:id/edit. (3) Update Header and any sidebar links. Do not edit routeTree.gen.ts. Run pnpm build to verify.
```

---

## Phase 3: E2E and unit tests (when domain was replaced)

### 3.1 E2E specs

```
Update E2E tests for the new domain. Rename e2e specs (todos.spec.ts → <domain>.spec.ts, add-todo.spec.ts → add-<domain>.spec.ts, edit-todo.spec.ts → edit-<domain>.spec.ts) and update all URLs (/todos → /<domain>s), headings and link text ("Todos" → "<DOMAIN_PASCAL>s", "Add Todo" → "Add <DOMAIN_PASCAL>", etc.). Update e2e/fixtures.ts if it references todo routes. Keep the same test structure and assertions. Run pnpm run test:e2e to verify.
```

### 3.2 Unit tests

```
Update unit and integration tests to use the new domain (<DOMAIN_PASCAL>). Replace Todo types, server functions, and hook names in test files. Ensure pnpm test passes.
```

---

## Phase 4: Documentation and Storybook (when domain was replaced)

### 4.1 Docs

```
In the docs/ folder, replace "Todos Admin" with "<APP_TITLE>" and "Todo" (as the example entity) with "<DOMAIN_PASCAL>" in architecture.md, deployment.md, e2e-testing.md, prd.md, and ux docs. Keep the same structure and technical content; only update app and domain names and examples.
```

### 4.2 Storybook

```
Update Storybook stories and config so they do not reference Todo or todos-admin. Use the new domain "<DOMAIN_PASCAL>" where an example entity is needed, or keep stories generic. Ensure pnpm storybook runs.
```

---

## Phase 5: Environment and verification (always)

### 5.1 .env.example

```
Ensure .env.example exists with all required database variables (DATABASE_URL or DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME) and brief comments. No real secrets. If it already exists, confirm it matches our stack (Postgres, Drizzle).
```

### 5.2 Final verification (no prompt — run locally)

Run in order and fix any failures:

1. `pnpm install`
2. Copy `.env.example` to `.env`, set DB vars, run `pnpm db:push`
3. `pnpm build`
4. `pnpm lint`
5. `pnpm test`
6. `pnpm run test:e2e`
7. `pnpm dev` — manual check of list/add/edit/delete and theme

---

## Placeholder reference

| Placeholder | Example | Use for |
|-------------|---------|---------|
| **APP_NAME** | `my-app` | package name, Worker name, CI DB slug |
| **APP_TITLE** | `My App` | README and docs title |
| **DOMAIN** | `item` | entity name (singular, lowercase) |
| **DOMAIN_PASCAL** | `Item` | PascalCase entity name |
| **&lt;domain&gt;** | `item` / `items` | file names, URL segments (e.g. `items.ts`, `/items`) |

Use **&lt;domain&gt;s** for plural (e.g. `items`) in routes and query keys.
