import type { Todo } from '@/lib/schema';
import { useCreateTodo } from '@/hooks/useTodos';
import TodoForm from '@/components/todos/TodoShadcnForm';

export default function AddTodo() {
  const createTodoMutation = useCreateTodo();

  return (
    <>
      <h2 className="mb-4 text-2xl font-bold text-foreground">Add Todo</h2>
      <TodoForm
        onFormSubmit={(data: Todo) =>
          createTodoMutation.mutate({
            title: data.title,
            summary: data.summary,
            description: data.description,
          })
        }
        isPending={createTodoMutation.isPending}
      />
    </>
  );
}
