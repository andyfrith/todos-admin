import { useNavigate, useParams } from '@tanstack/react-router';
import type { Todo } from '@/lib/schema';
import { useTodos, useUpdateTodo } from '@/hooks/useTodos';
import TodoForm from '@/components/todos/TodoForm';

/**
 * Edit todo page: resolves todo by route id and renders TodoForm in edit mode.
 */
export default function EditTodo() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: todos, isPending: todosPending, isError } = useTodos();
  const updateTodoMutation = useUpdateTodo();

  const todoId = id != null ? parseInt(id, 10) : NaN;
  const todo: Todo | undefined = todos?.find((t) => t.id === todoId);

  const handleSubmit = (values: Todo) => {
    if (!values.id) return;
    updateTodoMutation.mutate(
      {
        id: values.id,
        title: values.title,
        summary: values.summary,
        description: values.description,
        todoType: values.todoType,
        completed: values.completed,
      },
      {
        onSuccess: () => {
          navigate({ to: '/todos' });
        },
      },
    );
  };

  if (todosPending) return <div className="text-indigo-200">Loading...</div>;
  if (isError) return <div className="text-red-400">Failed to load todos.</div>;
  if (todo == null)
    return (
      <div className="text-indigo-200" data-testid="edit-todo-not-found">
        Todo not found.
      </div>
    );

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-indigo-200">Edit Todo</h2>
      <TodoForm
        todo={todo}
        onFormSubmit={handleSubmit}
        isPending={updateTodoMutation.isPending}
        placeholder="Edit todo..."
      />
    </>
  );
}
