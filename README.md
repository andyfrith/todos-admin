# Todos Admin

A **production-ready full-stack starter** built with the TanStack ecosystem: type-safe routing, server functions, real-time data with React Query, and a PostgreSQL-backed Todo CRUD app. Use it as a template to ship features fast—or as a reference for modular architecture and modern React patterns.

---

## 🎯 Purpose

**Todos Admin** is a minimal but complete TanStack Start application. It gives you:

- A **ready-to-extend** stack: React 19, TypeScript, TanStack Router & Query, Drizzle ORM, and Shadcn UI.
- A **working Todo example** (list, add, edit, delete) so you see data flow from DB → server functions → hooks → UI.
- **Documentation and structure** designed for both humans and AI-assisted development (e.g. Cursor, Claude).

Clone it, point it at a Postgres database, and start building—no boilerplate archaeology required.

---

## 📸 Screenshots

![Todos Admin – Todo list view](screenshot1.png)

_Todo list view_

![Todos Admin – Add / Edit flow](screenshot2.png)

_Add / Edit flow_

---

## ✨ Features

| Feature                        | Description                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------------- |
| **Full Todo CRUD**             | List, create, edit, and delete todos with validation (title, summary, description, todo type). |
| **Type-safe server functions** | TanStack Start server functions with Zod validation and Drizzle for persistence.               |
| **TanStack Query**             | Caching, invalidation, and loading/error states out of the box.                                |
| **File-based routing**         | TanStack Router with layouts; routes like `/`, `/todos`, `/todos/add`, `/todos/:id/edit`.      |
| **Forms**                      | React Hook Form + Zod + Shadcn (Field, Input, Select, Checkbox) with a shared schema.          |
| **Theming**                    | Light, dark, system, and Sunshine themes with next-themes and CSS variables (see [Theming](docs/ux/Theming.md)). |
| **Toasts**                     | Sonner for success and error feedback on mutations.                                            |
| **Storybook**                  | Isolated development and documentation for UI components and routes (see [Storybook](#-storybook) below). |
| **Testing**                    | Vitest for unit/integration; Playwright for E2E (critical flows).                              |
| **Dev experience**             | ESLint, Prettier, TanStack Router/Query devtools, Drizzle Studio.                              |

---

## 🛠️ Tech Stack

| Layer                  | Technology                                                                        |
| ---------------------- | --------------------------------------------------------------------------------- |
| **Framework**          | [TanStack Start](https://tanstack.com/start) (React + Vite + Cloudflare Workers)  |
| **Routing**            | [TanStack Router](https://tanstack.com/router) (file-based)                       |
| **Data & cache**       | [TanStack Query](https://tanstack.com/query) (React Query)                        |
| **Database**           | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/)                             |
| **Validation & types** | [Zod](https://zod.dev/) + TypeScript                                              |
| **Styling**            | [Tailwind CSS](https://tailwindcss.com/) v4 + [Shadcn UI](https://ui.shadcn.com/) |
| **Forms**              | [React Hook Form](https://react-hook-form.com/) + `@hookform/resolvers` (Zod)     |
| **Notifications**      | [Sonner](https://sonner.emilkowal.ski/)                                           |
| **Testing**            | [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/)              |
| **Package manager**    | pnpm                                                                              |

---

## 📁 Project Structure

The codebase follows a **modular (layered) architecture**: presentation → hooks → server functions → database. Each layer has a clear home.

```
src/
├── router.tsx              # Router + TanStack Query context (do not call from app code)
├── routeTree.gen.ts        # Generated routes (do not edit)
├── styles.css              # Tailwind + theme variables
├── components/
│   ├── todos/              # Feature: list, item, add/edit forms + *.stories.tsx
│   ├── ui/                 # Shadcn primitives (button, input, select, field, etc.)
│   ├── storybook/          # Shadcn/UI stories (button, input, dialog, etc.)
│   └── Header.tsx          # Layout + Header.stories.tsx
├── routes/                 # File-based: __root, index, todos/, …; -*.stories.tsx for route stories
├── hooks/                  # useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo
├── queries/                # TanStack Query options (e.g. todosQueryOptions)
├── server/fn/              # Server functions: getTodos, createTodo, updateTodo, deleteTodo
├── db/
│   ├── schema.ts           # Drizzle table definitions (source of truth for DB)
│   └── index.ts            # Drizzle client + connection
├── lib/
│   ├── schema.ts           # Zod schemas + inferred types (Todo, TodoSchema) for forms & API
│   └── utils.ts            # cn() and other shared helpers
├── integrations/           # TanStack Query provider + devtools
└── data/                   # Static/demo data (e.g. demo server functions)
```

**Rule of thumb:** Routes and components use **hooks**; hooks use **server functions** and **query options**; server functions use **Drizzle** and **`lib/schema`**. No UI or routes in server/db code.

---

## 🏗️ Architecture Patterns

- **Server functions as API** — All Todo operations are TanStack Start server functions (`createServerFn`). No REST route files for CRUD; the client calls functions like `createTodo({ data: { title } })`.
- **Single source of truth for types** — DB shape in `src/db/schema.ts`; app and validation in `src/lib/schema.ts` (Zod + inferred types). Forms and server I/O share the same schemas.
- **Query options + hooks** — Query keys and `queryFn`s live in `src/queries/`; hooks in `src/hooks/` wrap mutations, invalidate cache (e.g. `['todos']`), and show toasts.
- **Layered dependencies** — Presentation (routes, components) → hooks → server functions → database. Keeps the app testable and easy to change.

For full detail (data flow, examples, best practices), see **[docs/technical/architecture.md](docs/technical/architecture.md)**.

---

## 📚 Documentation

| Document                                                     | Description                                                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| **[Blueprint: scaffold new apps](docs/blueprint/README.md)**  | Use this repo as a template: scaffolding tasks, Cursor prompts, and step-by-step guide.         |
| **[Product requirements (PRD)](docs/prd.md)**                | Scope, data model, user flows, requirements, API contract, and implementation order for LLMs.    |
| **[Technical architecture](docs/technical/architecture.md)** | Modular layers, directory layout, server functions, DB, hooks, queries, routes, and conventions. |
| **[Deployment](docs/deployment.md)**                         | Cloudflare Workers: build, deploy (via Cloudflare + GitHub), env vars, custom domains.            |
| **[Form patterns](docs/ux/forms-react-hook-form-shadcn.md)** | React Hook Form + Zod + Shadcn patterns used for Todo add/edit.                                  |
| **[Theming](docs/ux/Theming.md)**                             | Theme options (light, dark, system, Sunshine), CSS variables, and adding new themes.             |
| **[E2E testing](docs/e2e-testing.md)**                        | Playwright setup and conventions for end-to-end tests.                                            |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS)
- pnpm (`npm install -g pnpm`)
- PostgreSQL (local or Docker)

### Setup

1. **Clone and install**

   ```bash
   pnpm install
   ```

2. **Configure the database**

   Copy `.env.example` to `.env` or `.env.local` and set either:
   - `DATABASE_URL=postgres://user:password@host:port/dbname`  
     or
   - `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`

   Then create the schema:

   ```bash
   pnpm db:push
   # or: pnpm db:generate && pnpm db:migrate
   ```

3. **Run the app**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000). You should see the app and be able to list, add, edit, and delete todos.

### Other commands

| Command                | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `pnpm build`           | Production build                                   |
| `pnpm preview`         | Preview production build locally (Workers runtime) |
| `pnpm deploy`          | Build and deploy to Cloudflare Workers             |
| `pnpm cf-typegen`      | Generate Wrangler types for bindings               |
| `pnpm test`            | Run Vitest unit/integration tests                  |
| `pnpm run test:e2e`    | Run Playwright E2E tests                           |
| `pnpm run test:e2e:ui` | Playwright E2E in UI mode                          |
| `pnpm lint`            | Run ESLint                                         |
| `pnpm check`           | Prettier + ESLint (format and fix)                 |
| `pnpm db:studio`       | Open Drizzle Studio                                |
| `pnpm storybook`       | Start Storybook (default port 6006)                |
| `pnpm build-storybook` | Build static Storybook for deployment              |

### Deployment

The app deploys to **Cloudflare Workers** via the Cloudflare Vite plugin. To deploy:

1. Log in once: `pnpm wrangler login`
2. Deploy: `pnpm deploy`

For deployment (Cloudflare + GitHub), environment variables, and custom domains, see **[docs/deployment.md](docs/deployment.md)**.

### Branching

Feature work is done on branches created from **`development`**:

```bash
git checkout development
git pull origin development
git checkout -b feature/your-feature-name
```

Open pull requests against **`development`**. Merge to `master` when releasing. The **Lint & test** CI check must pass before merging into `development` or `master`. Deployment is handled by Cloudflare’s GitHub integration (see [Deployment](docs/deployment.md)).

### Adding Shadcn components

Use the latest Shadcn CLI:

```bash
pnpm dlx shadcn@latest add button
```

### Storybook

Stories live under `src/components/` (e.g. `Header.stories.tsx`, `todos/FeatureInfo.stories.tsx`, `storybook/*.stories.*`) and `src/routes/`. For route files, **prefix the story filename with `-`** (e.g. `-index.stories.tsx`) so the TanStack Router plugin does not treat it as a route. Run `pnpm storybook` to open the UI; use `pnpm build-storybook` for a static build.

---

## 🔗 Learn more

- [TanStack](https://tanstack.com) — Router, Query, Start, and more
- [Drizzle ORM](https://orm.drizzle.team/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📫 Let's Connect

- **Portfolio:** [andyfrith.com](https://andyfrith.com)
- **LinkedIn:** [linkedin.com/in/goodapplemedia](https://linkedin.com/in/goodapplemedia)
- **GitHub:** [@andyfrith](https://github.com/andyfrith)
