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

## CI/CD (e.g. GitHub Actions)

To deploy from CI:

1. Authenticate Wrangler using a **Cloudflare API token** or **OAuth** (e.g. [Wrangler GitHub Action](https://github.com/cloudflare/wrangler-action)).
2. Run `pnpm install`, then `pnpm deploy` (or `pnpm build` and `wrangler deploy`).
3. Set any required secrets as repository or environment secrets and pass them into the job (e.g. `CF_API_TOKEN` for the Wrangler action).

Example (conceptual):

```yaml
- run: pnpm install --frozen-lockfile
- run: pnpm deploy
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

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
