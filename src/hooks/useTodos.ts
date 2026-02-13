import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { todosQueryOptions } from '@/queries/todos';
import { createTodo, deleteTodo } from '@/server/fn/todos';

export function useTodos(enabled = true) {
  return useQuery({
    ...todosQueryOptions(),
    enabled,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => createTodo({ data: { title } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo created successfully', { position: 'top-center' });
      toast.success('Todo deleted successfully', { position: 'top-center' });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTodo({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo deleted successfully', { position: 'top-center' });
    },
    onError: (error) => {
      console.log('Failed to delete todo', error);
    },
  });
}
