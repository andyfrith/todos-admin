import { useDeleteTodo, useTodos } from '@/hooks/useTodos';
import TodoComponent from '@/components/todos/Todo';

export default function Todos() {
  const { data: todos, isPending, isError } = useTodos();
  const deleteTodoMutation = useDeleteTodo();

  const handleDelete = (todoId: string) => {
    deleteTodoMutation.mutate(todoId);
  };

  if (isPending) return <div>Pending...</div>;
  if (isError) return <div>Error!</div>;
  if (todos.length === 0) return <div>No todos found</div>;
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-indigo-200">Todos</h2>

      <ul className="space-y-3 mb-6">
        {todos.map((todo) => (
          <TodoComponent
            key={todo.id}
            todo={todo}
            handleDelete={handleDelete}
          />
        ))}
        {todos.length === 0 && (
          <li className="text-center py-8 text-indigo-300/70">
            No todos yet. Create one below!
          </li>
        )}
      </ul>
    </>
  );
}
