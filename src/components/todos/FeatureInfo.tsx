export default function FeatureInfo() {
  return (
    <div
      className="mt-8 p-6 rounded-lg border"
      style={{
        background: 'rgba(93, 103, 227, 0.05)',
        borderColor: 'rgba(93, 103, 227, 0.2)',
      }}
    >
      <h3 className="text-lg font-semibold mb-2 text-indigo-200">
        Powered by Drizzle ORM
      </h3>
      <p className="text-sm text-indigo-300/80 mb-4">
        Next-generation ORM for Node.js & TypeScript with PostgreSQL
      </p>
      <div className="space-y-2 text-sm">
        <p className="text-indigo-200 font-medium">Key Components:</p>
        <ol className="list-decimal list-inside space-y-2 text-indigo-300/80">
          <li>
            Configure your{' '}
            <code className="px-2 py-1 rounded bg-black/30 text-purple-300">
              DATABASE_URL
            </code>{' '}
            in .env.local
          </li>
          <li>
            Run:{' '}
            <code className="px-2 py-1 rounded bg-black/30 text-purple-300">
              npx drizzle-kit generate
            </code>
          </li>
          <li>
            Run:{' '}
            <code className="px-2 py-1 rounded bg-black/30 text-purple-300">
              npx drizzle-kit migrate
            </code>
          </li>
          <li>
            Optional:{' '}
            <code className="px-2 py-1 rounded bg-black/30 text-purple-300">
              npx drizzle-kit studio
            </code>
          </li>
        </ol>
      </div>
    </div>
  );
}
