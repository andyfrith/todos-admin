import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/todos')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground dark:text-white dark:[background:linear-gradient(135deg,#0c1a2b_0%,#1a2332_50%,#16202e_100%)]">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-8 text-card-foreground shadow-2xl dark:border-white/10 dark:bg-transparent dark:[background:linear-gradient(135deg,rgba(22,32,46,0.95)_0%,rgba(12,26,43,0.95)_100%)] dark:[backdrop-filter:blur(10px)]">
        <div className="mb-8 flex items-center justify-center gap-4 rounded-lg border border-border bg-muted/50 p-4 dark:border-[rgba(93,103,227,0.2)] dark:bg-transparent dark:[background:linear-gradient(90deg,rgba(93,103,227,0.1)_0%,rgba(139,92,246,0.1)_100%)]">
          <div className="relative group">
            <div className="absolute -inset-2 rounded-lg bg-primary/30 blur-lg opacity-60 transition duration-500 group-hover:opacity-100 dark:bg-linear-to-r dark:from-indigo-500 dark:via-purple-500 dark:to-indigo-500"></div>
            <div className="relative rounded-lg bg-primary p-3 dark:bg-linear-to-br dark:from-indigo-600 dark:to-purple-600">
              <img
                src="/drizzle.svg"
                alt="Drizzle Logo"
                className="w-8 h-8 transform transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground dark:bg-linear-to-r dark:from-indigo-300 dark:via-purple-300 dark:to-indigo-300 dark:bg-clip-text dark:text-transparent">
            Todos Admin
          </h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
