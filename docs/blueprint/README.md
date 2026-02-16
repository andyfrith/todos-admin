# Blueprint: Application Template

This repository is a **blueprint** for new applications. Its structure, architecture, tooling, and documentation are intended to be reused when scaffolding a new project. Use the materials in this folder to clone or derive new apps with minimal human interaction.

---

## What This Blueprint Contains

| Area | Description |
|------|-------------|
| **Stack** | TanStack Start (React + Vite + Cloudflare Workers), TanStack Router & Query, Drizzle ORM, PostgreSQL, Shadcn UI, Tailwind v4, Zod, React Hook Form |
| **Architecture** | Layered: presentation → hooks → server functions → database. See `docs/technical/architecture.md`. |
| **Example domain** | Todo CRUD (list, add, edit, delete) as a reference implementation of the full data flow. |
| **Quality** | ESLint, Prettier, Vitest (unit/integration), Playwright (E2E), Storybook. |
| **Deployment** | Cloudflare Workers; GitHub Actions CI (lint + tests on PR to `development` / `master`). |
| **Documentation** | PRD, architecture, deployment, E2E testing, forms, theming—all written for both humans and AI-assisted development. |

---

## Blueprint Documents (this folder)

| Document | Purpose |
|----------|---------|
| **[README.md](README.md)** (this file) | Overview of the blueprint and how to use it. |
| **[SCAFFOLDING_TASKS.md](SCAFFOLDING_TASKS.md)** | Single execution script: ordered tasks with prompts and verification. Use this for a linear, minimal-feedback clone flow. |
| **[scaffolding-guide.md](scaffolding-guide.md)** | Detailed step-by-step guide: clone, rename, strip example domain, add new domain, env, CI. |
| **[cursor-prompts.md](cursor-prompts.md)** | Copy-paste prompts to give to Cursor (or similar) for each phase of scaffolding. |

---

## How to Use This Blueprint

### Option A: Run the task script (recommended for minimal interaction)

1. Open **[SCAFFOLDING_TASKS.md](SCAFFOLDING_TASKS.md)**.
2. Follow the tasks in order. Each task has:
   - What to do
   - Optional Cursor prompt (copy into Cursor when using AI)
   - Verification step
3. Complete verification at the end before considering the new app “scaffolded.”

### Option B: Use the detailed guide + Cursor prompts

1. Read **[scaffolding-guide.md](scaffolding-guide.md)** for the full process.
2. Use **[cursor-prompts.md](cursor-prompts.md)** to paste prompts into Cursor for each phase (rename, replace domain, env, CI, etc.).
3. Run the verification checklist from the guide or from **SCAFFOLDING_TASKS.md**.

### Option C: Keep Todo as the example and only rename

If the new app is still “Todo”-oriented (e.g. a different product name but same domain):

1. Clone the repo.
2. Run only **Phase 1** (rename app and config) from **SCAFFOLDING_TASKS.md** or **cursor-prompts.md**.
3. Set env (e.g. from `.env.example`), run `pnpm db:push`, then verify build and tests.

---

## Key Paths to Touch When Scaffolding

When creating a new app from this blueprint, these are the main places that need changes:

| Purpose | Path(s) |
|---------|--------|
| App name / Worker name | `package.json` (name), `wrangler.jsonc` (name), README title |
| Database schema | `src/db/schema.ts`, then `pnpm db:generate` / `pnpm db:push` |
| App types & validation | `src/lib/schema.ts` |
| Server API | `src/server/fn/` (per-domain files) |
| Query options | `src/queries/` |
| Hooks | `src/hooks/` |
| Feature UI | `src/components/<domain>/` |
| Routes | `src/routes/` (file-based; do not edit `routeTree.gen.ts`) |
| CI DB name | `.github/workflows/ci.yml` (e.g. `POSTGRES_DB`) |
| Env template | `.env.example` |

Layer rule: **Presentation → hooks → server functions → database.** Server and DB must not import from routes or components.

---

## Related Documentation (in repo root and docs/)

- **Architecture:** `docs/technical/architecture.md` — layers, directory layout, data flow, naming.
- **PRD:** `docs/prd.md` — scope, data model, flows, API, implementation order for LLMs.
- **Deployment:** `docs/deployment.md` — Cloudflare Workers, env, CI, custom domains.
- **E2E testing:** `docs/e2e-testing.md` — Playwright setup and conventions.
- **Forms:** `docs/ux/forms-react-hook-form-shadcn.md` — React Hook Form + Zod + Shadcn.
- **Theming:** `docs/ux/Theming.md` — theme options and CSS variables.

When scaffolding, keep these docs in the new repo and update only app-specific names and examples (e.g. replace “Todos Admin” with the new app name, and swap Todo for the new domain where relevant).
