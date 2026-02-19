import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import Header from './Header';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { THEMES } from '@/lib/theme';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <main className="p-4 text-muted-foreground">Main content area</main>
  ),
});

const todosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/todos',
  component: () => (
    <main className="p-4 text-muted-foreground">Todos list</main>
  ),
});

const addRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/todos/add',
  component: () => <main className="p-4 text-muted-foreground">Add todo</main>,
});

const routeTree = rootRoute.addChildren([indexRoute, todosRoute, addRoute]);
const router = createRouter({ routeTree });

function HeaderWithProviders() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={[...THEMES]}
      storageKey="theme"
    >
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

const meta = {
  title: 'Components/Header',
  component: HeaderWithProviders,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeaderWithProviders>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * App header with menu toggle, theme selector, and slide-out navigation
 * (Home, Todos, Add Todo). Wrapped with router and theme for Storybook.
 */
export const Default: Story = {};
