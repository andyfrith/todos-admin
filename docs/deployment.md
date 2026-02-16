# Deployment (Cloudflare Workers)

This application is configured to build and deploy to **Cloudflare Workers** using the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/) with TanStack Start’s SSR entrypoint.

---

## Prerequisites

- **Cloudflare account** — [Sign up](https://dash.cloudflare.com/sign-up) if needed.
- **Wrangler CLI** — Installed as a dev dependency; no global install required.
- **Logged-in Wrangler** — Run `pnpm wrangler login` (or `npx wrangler login`) once to authenticate with Cloudflare.

---

## Commands

| Command           | Description                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| `pnpm build`      | Production build (client + SSR Worker). Output: `dist/client` and `dist/server`.                   |
| `pnpm preview`    | Preview the production build locally in the Workers runtime.                                       |
| `pnpm deploy`     | Build and deploy to Cloudflare Workers (uses `dist/server/wrangler.json` generated at build time). |
| `pnpm cf-typegen` | Generate TypeScript types for Wrangler config and bindings (`wrangler types`).                     |

---

## First-time deploy

1. **Log in to Cloudflare** (one-time):

   ```bash
   pnpm wrangler login
   ```

2. **Build and deploy**:

   ```bash
   pnpm deploy
   ```

   This runs `pnpm build` then `wrangler deploy`. After a successful deploy, Wrangler prints the Worker URL (e.g. `https://todos-admin.<subdomain>.workers.dev`).

---

## Configuration

### Wrangler (`wrangler.jsonc`)

The root **`wrangler.jsonc`** is the source configuration. The Cloudflare Vite plugin generates **`dist/server/wrangler.json`** during `pnpm build` with the correct `main` entry and asset paths; Wrangler uses that generated file when you run `pnpm deploy`.

Key fields in `wrangler.jsonc`:

| Field                   | Purpose                                                                        |
| ----------------------- | ------------------------------------------------------------------------------ |
| `name`                  | Worker name (e.g. `todos-admin`); also used for the `*.workers.dev` subdomain. |
| `compatibility_date`    | Workers runtime compatibility date.                                            |
| `compatibility_flags`   | e.g. `["nodejs_compat"]` for Node-compatible APIs.                             |
| `main`                  | Server entrypoint: `@tanstack/react-start/server-entry`.                       |
| `observability.enabled` | Enables Cloudflare observability for the Worker.                               |

To add [bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/) (KV, R2, D1, env vars, etc.), add them to `wrangler.jsonc`. They will be merged into the generated config at build time.

### Vite

The Cloudflare plugin is configured in **`vite.config.ts`** with the SSR environment:

```ts
cloudflare({ viteEnvironment: { name: 'ssr' } });
```

This ensures the TanStack Start server runs in the Workers runtime during dev and production.

---

## Environment variables and secrets

- **Local development** — Use `.env` or `.env.local`. Do not commit secrets; `.env.local` is typically in `.gitignore`.
- **Local preview** (`pnpm preview`) — For Workers runtime preview, put secrets in **`.dev.vars`** (same format as `.env`). Add `.dev.vars` to `.gitignore`; it is already ignored in this project.
- **Production** — Set variables and secrets in the [Cloudflare dashboard](https://dash.cloudflare.com) under **Workers & Pages** → your Worker (**todos-admin**) → **Settings** → **Variables and Secrets**, or via CLI:
  - **Plain text:** `pnpm wrangler secret put <NAME>`
  - **Bulk:** use the dashboard or [Wrangler config](https://developers.cloudflare.com/workers/wrangler/configuration/#vars) `vars` (non-sensitive only).

If the app uses a database (e.g. `DATABASE_URL`), configure the same variable in production so server functions can connect.

---

## Custom domain

To use your own domain instead of `*.workers.dev`:

1. In the [Cloudflare dashboard](https://dash.cloudflare.com), go to **Workers & Pages** → **todos-admin** → **Settings** → **Domains & Routes**.
2. Add a custom domain and follow the DNS instructions.

See [Cloudflare Workers custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

---

## CI (lint and tests before merge)

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs **lint** and **all tests** (unit + E2E) on every pull request targeting **`development`** or **`master`**. Merges into those branches should only be allowed when this check passes.

- **Trigger:** Pull requests to `development` or `master`.
- **Steps:** Lint → unit tests (Vitest) → E2E tests (Playwright with Postgres). The Postgres service uses `POSTGRES_HOST_AUTH_METHOD=trust` for the ephemeral CI container only (no repository secret required).

**Require the check before merging:** In GitHub go to **Settings → Code and automation → Branches**. For both **`development`** and **`master`**, add or edit a branch protection rule, enable **Require status checks to pass before merging**, and select **Lint & test**. Only when that check is green can PRs into those branches be merged.

---

## Deployment (Cloudflare + GitHub)

Deployment uses **Cloudflare's built-in GitHub integration**. Connect your repository in the Cloudflare dashboard (Workers & Pages → your project → Settings → Builds & deployments → Connect to Git). Cloudflare builds and deploys automatically when you push or merge to the branch you configure (e.g. `master`).

Build settings in Cloudflare should match your local setup (e.g. **Build command:** `pnpm run build`, **Build output directory:** use the Worker build output as per the [Cloudflare Workers + Vite](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/) guide). Environment variables and secrets are configured in the Cloudflare dashboard for the Worker.

---

## Troubleshooting

- **Build fails** — Ensure `pnpm install` has been run and that `vite.config.ts` includes `cloudflare({ viteEnvironment: { name: 'ssr' } })` and `tanstackStart()`.
- **Deploy fails: not logged in** — Run `pnpm wrangler login` and complete the browser flow.
- **Worker runs but app/database errors** — Check that production environment variables (e.g. `DATABASE_URL`) are set in the Cloudflare dashboard or via `wrangler secret put`.
- **Types for bindings** — After changing `wrangler.jsonc` (e.g. adding bindings), run `pnpm cf-typegen` to update generated types.

---

## References

- [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/)
- [TanStack Start on Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/)
- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Workers bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/)
