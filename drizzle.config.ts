import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: ['.env.local', '.env'] });

/** Build DB URL from DATABASE_URL or from individual env vars (dotenv does not expand ${VAR} in values). */
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (url && !url.includes('${')) return url;
  const user = process.env.DB_USER ?? 'postgres';
  const password = process.env.DB_PASSWORD ?? '';
  const host = process.env.DB_HOST ?? 'localhost';
  const port = process.env.DB_PORT ?? '5432';
  const name = process.env.DB_NAME ?? 'postgres';
  return `postgres://${user}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});
