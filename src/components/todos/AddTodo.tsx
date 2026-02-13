import { toast } from 'sonner';
import type { Todo } from '@/lib/schema';
import { useCreateTodo, useDeleteTodo, useTodos } from '@/hooks/useTodos';
import TodoComponent from '@/components/todos/Todo';
// import TodoForm from '@/components/todos/TodoForm';
import TodoForm from '@/components/todos/TodoShadcnForm';

export default function AddTodo() {
  const createTodoMutation = useCreateTodo();

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-indigo-200">Add Todo</h2>
      <TodoForm
        onFormSubmit={(data: Todo) => createTodoMutation.mutate(data.title)}
        isPending={createTodoMutation.isPending}
      />
    </>
  );
}
