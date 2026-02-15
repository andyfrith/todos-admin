import { useNavigate } from '@tanstack/react-router';
import { useDeleteTodo, useTodos } from '@/hooks/useTodos';
import TodoComponent from '@/components/todos/Todo';

export default function Todos() {
  const navigate = useNavigate();
  const { data: todos, isPending, isError } = useTodos();
  const deleteTodoMutation = useDeleteTodo();

  const handleDelete = (todoId: number) => {
    deleteTodoMutation.mutate(todoId);
  };

  const handleEdit = (id: number) => {
    navigate({ to: '/todos/$id/edit', params: { id: String(id) } });
  };

  if (isPending)
    return (
      <div className="text-muted-foreground dark:text-indigo-300/80">
        Pending...
      </div>
    );
  if (isError) return <div className="text-destructive">Error!</div>;
  if (todos.length === 0)
    return (
      <div className="text-muted-foreground dark:text-indigo-300/80">
        No todos found
      </div>
    );
  return (
    <>
      <h2 className="mb-4 text-2xl font-bold text-foreground dark:text-indigo-200">
        Todos
      </h2>

      <ul className="mb-6 space-y-3">
        {todos.map((todo) => (
          <TodoComponent
            key={todo.id}
            todo={todo}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
        {todos.length === 0 && (
          <li className="py-8 text-center text-muted-foreground dark:text-indigo-300/70">
            No todos yet. Create one below!
          </li>
        )}
      </ul>
    </>
  );
}
