import { createServerFn } from '@tanstack/react-start';
import { desc, eq } from 'drizzle-orm';
import type { Todo } from '@/lib/schema';
import { db } from '@/db/index';
import { todos } from '@/db/schema';

export const getTodos = createServerFn({
  method: 'GET',
}).handler(async () => {
  return (await db.query.todos.findMany({
    orderBy: [desc(todos.createdAt)],
  })) as Array<Todo>;
});

export const createTodo = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: { title: string; summary?: string; description?: string }) => data,
  )
  .handler(async ({ data }) => {
    await db.insert(todos).values({
      title: data.title,
      ...(data.summary != null && { summary: data.summary }),
      ...(data.description != null && { description: data.description }),
    });
    return { success: true };
  });

export const updateTodo = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: {
      id: number;
      title: string;
      summary?: string;
      description?: string;
      todoType?: string;
      completed?: boolean;
    }) => data,
  )
  .handler(async ({ data }) => {
    await db
      .update(todos)
      .set({
        title: data.title,
        ...(data.summary != null && { summary: data.summary }),
        ...(data.description != null && { description: data.description }),
        ...(data.todoType != null && { todoType: data.todoType }),
        ...(data.completed != null && { completed: data.completed }),
        updatedAt: new Date(),
      })
      .where(eq(todos.id, data.id));
    return { success: true };
  });

export const deleteTodo = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(todos).where(eq(todos.id, data.id));
    return { success: true };
  });
