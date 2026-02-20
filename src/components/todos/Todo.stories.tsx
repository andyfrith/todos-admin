import { fn } from 'storybook/test';

import TodoComponent from './Todo';
import type { Todo } from '@/lib/schema';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Todos/Todo',
  component: TodoComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    handleDelete: fn(),
    handleEdit: fn(),
    handleToggleComplete: fn(),
  },
} satisfies Meta<typeof TodoComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseTodo: Todo = {
  id: 1,
  title: 'Sample todo item',
  summary: 'A brief summary of the todo',
  description: 'A longer description of what needs to be done',
};

/**
 * Default todo in incomplete state with checkbox unchecked.
 */
export const Incomplete: Story = {
  args: {
    todo: { ...baseTodo, completed: false },
  },
};

/**
 * Todo in completed state with checkbox checked.
 */
export const Completed: Story = {
  args: {
    todo: { ...baseTodo, completed: true },
  },
};

/**
 * Todo with minimal fields (no summary or description).
 */
export const Minimal: Story = {
  args: {
    todo: {
      id: 2,
      title: 'Quick task',
      completed: false,
    },
  },
};
