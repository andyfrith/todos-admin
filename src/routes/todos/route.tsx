import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/todos')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 text-white"
      style={{
        background:
          'linear-gradient(135deg, #0c1a2b 0%, #1a2332 50%, #16202e 100%)',
      }}
    >
      <div
        className="w-full max-w-2xl p-8 rounded-xl shadow-2xl border border-white/10"
        style={{
          background:
            'linear-gradient(135deg, rgba(22, 32, 46, 0.95) 0%, rgba(12, 26, 43, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          className="flex items-center justify-center gap-4 mb-8 p-4 rounded-lg"
          style={{
            background:
              'linear-gradient(90deg, rgba(93, 103, 227, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(93, 103, 227, 0.2)',
          }}
        >
          <div className="relative group">
            <div className="absolute -inset-2 bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-lg blur-lg opacity-60 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-linear-to-br from-indigo-600 to-purple-600 p-3 rounded-lg">
              <img
                src="/drizzle.svg"
                alt="Drizzle Logo"
                className="w-8 h-8 transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-300 via-purple-300 to-indigo-300 text-transparent bg-clip-text">
            Todos Admin
          </h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
