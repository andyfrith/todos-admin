import { z } from 'zod';

export const TodoTypeSchema = z.enum([
  'ACTIVE',
  'CULTURAL',
  'RESTORATIVE',
  'PLANNING',
]);

export type TodoType = z.infer<typeof TodoTypeSchema>;

export const TodoSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters.')
    .max(32, 'Title must be at most 32 characters.'),
  todoType: TodoTypeSchema.optional(),
  completed: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Todo = z.infer<typeof TodoSchema>;
