import { createFileRoute } from '@tanstack/react-router';
import Todos from '@/components/todos/Todos';

export const Route = createFileRoute('/todos/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Todos />;
}
