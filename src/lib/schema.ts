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
  summary: z
    .string()
    .min(5, 'Summary must be at least 5 characters.')
    .max(250, 'Summary must be at most 250 characters.')
    .optional(),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters.')
    .max(250, 'Description must be at most 250 characters.')
    .optional(),
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
