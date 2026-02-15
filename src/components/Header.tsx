import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Home, ListTodo, Menu, X } from 'lucide-react';
import ThemeSelector from '@/components/ThemeSelector';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-border bg-background p-4 text-foreground shadow-sm">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 transition-colors hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <ThemeSelector />
      </header>

      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-80 flex-col bg-sidebar text-sidebar-foreground shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-sidebar-border p-4">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 transition-colors hover:bg-sidebar-accent"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="mb-2 flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-sidebar-accent"
            activeProps={{
              className:
                'mb-2 flex items-center gap-3 rounded-lg bg-sidebar-primary p-3 text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary/90',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            to="/todos"
            onClick={() => setIsOpen(false)}
            className="mb-2 flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-sidebar-accent"
            activeProps={{
              className:
                'mb-2 flex items-center gap-3 rounded-lg bg-sidebar-primary p-3 text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary/90',
            }}
          >
            <ListTodo size={20} />
            <span className="font-medium">Todos</span>
          </Link>

          <Link
            to="/todos/add"
            onClick={() => setIsOpen(false)}
            className="mb-2 flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-sidebar-accent"
            activeProps={{
              className:
                'mb-2 flex items-center gap-3 rounded-lg bg-sidebar-primary p-3 text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary/90',
            }}
          >
            <ListTodo size={20} />
            <span className="font-medium">Add Todo</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
