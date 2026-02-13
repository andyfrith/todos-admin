import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { deleteTodo, getTodos } from '@/server/fn/todos';

export const todosQueryOptions = () =>
  queryOptions({
    queryKey: ['todos'],
    queryFn: () => getTodos(),
  });

export const todosDeleteMutationOptions = (todoId: string) =>
  mutationOptions({
    mutationKey: ['todos', 'delete', todoId],
    mutationFn: () => deleteTodo({ data: { id: todoId } }),
  });
