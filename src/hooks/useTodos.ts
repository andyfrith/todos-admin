import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { todosQueryOptions } from '@/queries/todos';
import { createTodo, deleteTodo, updateTodo } from '@/server/fn/todos';

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
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      title,
      todoType,
      completed,
    }: {
      id: number;
      title: string;
      todoType?: string;
      completed?: boolean;
    }) => updateTodo({ data: { id, title, todoType, completed } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo updated successfully', { position: 'top-center' });
    },
    onError: (error) => {
      console.error('Failed to update todo', error);
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTodo({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo deleted successfully', { position: 'top-center' });
    },
    onError: (error) => {
      console.error('Failed to delete todo', error);
    },
  });
}
