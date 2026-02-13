import { createFileRoute } from '@tanstack/react-router';
import EditTodo from '@/components/todos/EditTodo';

export const Route = createFileRoute('/todos/$id/edit')({
  component: EditTodo,
});
