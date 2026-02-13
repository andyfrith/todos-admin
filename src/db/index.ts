import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema.ts'

/** Load .env.local / .env so DB_* and DATABASE_URL are available at runtime. */
config({ path: ['.env.local', '.env'] })

/**
 * Build database URL from DATABASE_URL or from DB_* env vars (same as drizzle.config).
 * Use this so the app connects to the same database as migrations.
 */
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
  if (url && !url.includes('${')) return url
  const user = process.env.DB_USER ?? 'postgres'
  const password = process.env.DB_PASSWORD ?? ''
  const host = process.env.DB_HOST ?? 'localhost'
  const port = process.env.DB_PORT ?? '5432'
  const name = process.env.DB_NAME ?? 'postgres'
  return `postgres://${user}:${encodeURIComponent(password)}@${host}:${port}/${name}`
}

export const db = drizzle(getDatabaseUrl(), { schema })
