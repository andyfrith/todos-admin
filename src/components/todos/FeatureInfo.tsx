export default function FeatureInfo() {
  return (
    <div className="mt-8 rounded-lg border border-border bg-muted/50 p-6 dark:border-[rgba(93,103,227,0.2)] dark:bg-[rgba(93,103,227,0.05)]">
      <h3 className="mb-2 text-lg font-semibold text-foreground dark:text-indigo-200">
        Powered by Drizzle ORM
      </h3>
      <p className="mb-4 text-sm text-muted-foreground dark:text-indigo-300/80">
        Next-generation ORM for Node.js & TypeScript with PostgreSQL
      </p>
      <div className="space-y-2 text-sm">
        <p className="font-medium text-foreground dark:text-indigo-200">Key Components:</p>
        <ol className="list-inside list-decimal space-y-2 text-muted-foreground dark:text-indigo-300/80">
          <li>
            Configure your{' '}
            <code className="rounded bg-muted px-2 py-1 text-foreground dark:bg-black/30 dark:text-purple-300">
              DATABASE_URL
            </code>{' '}
            in .env.local
          </li>
          <li>
            Run:{' '}
            <code className="rounded bg-muted px-2 py-1 text-foreground dark:bg-black/30 dark:text-purple-300">
              npx drizzle-kit generate
            </code>
          </li>
          <li>
            Run:{' '}
            <code className="rounded bg-muted px-2 py-1 text-foreground dark:bg-black/30 dark:text-purple-300">
              npx drizzle-kit migrate
            </code>
          </li>
          <li>
            Optional:{' '}
            <code className="rounded bg-muted px-2 py-1 text-foreground dark:bg-black/30 dark:text-purple-300">
              npx drizzle-kit studio
            </code>
          </li>
        </ol>
      </div>
    </div>
  );
}
