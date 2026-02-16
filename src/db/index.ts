import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema.ts';

/** Load .env.local / .env so DB_* and DATABASE_URL are available at runtime. */
config({ path: ['.env.local', '.env'] });

/**
 * Build database URL from DATABASE_URL or from DB_* env vars (same as drizzle.config).
 * Use this so the app connects to the same database as migrations.
 * On Cloudflare Workers, set these via dashboard (Variables and Secrets) or `wrangler secret put`.
 */
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (url && !url.includes('${')) return url;
  const user = process.env.DB_USER ?? 'postgres';
  const password = process.env.DB_PASSWORD ?? '';
  const host = process.env.DB_HOST ?? 'localhost';
  const port = process.env.DB_PORT ?? '5432';
  const name = process.env.DB_NAME ?? 'postgres';
  const built = `postgres://${user}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
  if (!password && host === 'localhost') {
    throw new Error(
      'Database not configured: set DATABASE_URL or DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME. ' +
        'On Cloudflare, use Workers & Pages → Settings → Variables and Secrets or: wrangler secret put DATABASE_URL'
    );
  }
  return built;
}

export const db = drizzle(getDatabaseUrl(), { schema });
