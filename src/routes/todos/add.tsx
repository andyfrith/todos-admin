import { createFileRoute } from '@tanstack/react-router';
import AddTodo from '@/components/todos/AddTodo';

export const Route = createFileRoute('/todos/add')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AddTodo />;
}
