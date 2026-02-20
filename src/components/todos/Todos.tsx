import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import type { Todo } from '@/lib/schema';
import type { TodoToDelete } from '@/components/todos/DeleteTodoConfirmation';
import { useDeleteTodo, useTodos, useUpdateTodo } from '@/hooks/useTodos';
import TodoComponent from '@/components/todos/Todo';
import { DeleteTodoConfirmation } from '@/components/todos/DeleteTodoConfirmation';

export default function Todos() {
  const navigate = useNavigate();
  const [todoToDelete, setTodoToDelete] = useState<TodoToDelete>(null);
  const { data: todos, isPending, isError } = useTodos();
  const deleteTodoMutation = useDeleteTodo();
  const updateTodoMutation = useUpdateTodo();

  const handleDeleteClick = (todo: Todo) => {
    setTodoToDelete(todo.id != null ? { id: todo.id, title: todo.title } : null);
  };

  const handleDeleteConfirm = (todoId: number) => {
    deleteTodoMutation.mutate(todoId);
    setTodoToDelete(null);
  };

  const handleEdit = (id: number) => {
    navigate({ to: '/todos/$id/edit', params: { id: String(id) } });
  };

  const handleToggleComplete = (todo: Todo) => {
    console.log('handleToggleComplete', todo);
    if (todo.id == null) return;
    updateTodoMutation.mutate({
      id: todo.id,
      title: todo.title,
      completed: !(todo.completed ?? false),
    });
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
      <DeleteTodoConfirmation
        open={todoToDelete != null}
        onOpenChange={(open) => !open && setTodoToDelete(null)}
        todo={todoToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteTodoMutation.isPending}
      />
      <h2 className="mb-4 text-2xl font-bold text-foreground dark:text-indigo-200">
        Todos
      </h2>

      <ul className="mb-6 space-y-3">
        {todos.map((todo) => (
          <TodoComponent
            key={todo.id}
            todo={todo}
            handleDelete={(id) => {
              const t = todos.find((x) => x.id === id);
              if (t) handleDeleteClick(t);
            }}
            handleEdit={handleEdit}
            handleToggleComplete={handleToggleComplete}
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
