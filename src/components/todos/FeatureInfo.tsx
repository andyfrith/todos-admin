/**
 * Application summary card: name, purpose, key features, and tech stack
 * derived from README and project documentation.
 */
export default function FeatureInfo() {
  return (
    <div className="mt-8 rounded-lg border border-border bg-muted/50 p-6 dark:border-[rgba(93,103,227,0.2)] dark:bg-[rgba(93,103,227,0.05)]">
      <h3 className="mb-2 text-lg font-semibold text-foreground dark:text-indigo-200">
        About
      </h3>
      <p className="mb-4 text-sm text-muted-foreground dark:text-indigo-300/80">
        A production-ready full-stack starter with TanStack Start: type-safe
        routing, server functions, TanStack Query, and a PostgreSQL-backed Todo
        CRUD app. Clone it, point it at Postgres, and start building.
      </p>
      <div className="space-y-3 text-sm">
        <p className="font-medium text-foreground dark:text-indigo-200">
          Key features
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-muted-foreground dark:text-indigo-300/80">
          <li>
            Full Todo CRUD with validation (title, summary, description, type)
          </li>
          <li>
            Type-safe server functions (TanStack Start) with Zod + Drizzle
          </li>
          <li>
            TanStack Router (file-based) and TanStack Query (caching,
            invalidation)
          </li>
          <li>Forms: React Hook Form + Zod + Shadcn; toasts via Sonner</li>
          <li>Theming (light/dark), Storybook, Vitest + Playwright testing</li>
        </ul>
        <p className="pt-1 font-medium text-foreground dark:text-indigo-200">
          Stack
        </p>
        <p className="text-muted-foreground dark:text-indigo-300/80">
          TanStack Start · Router · Query · PostgreSQL + Drizzle ORM · Tailwind
          v4 + Shadcn UI · React Hook Form · pnpm
        </p>
      </div>
    </div>
  );
}
