# Todo Complete Checkbox in List Display

## Development Progress

- **Implementation**: Complete. Checkbox added to Todo.tsx; handleToggleComplete wired in Todos.tsx.
- **Feature branch**: `feature/todo-complete-checkbox`
- **Tests**: Unit tests pass; Storybook story added (`Todo.stories.tsx`) with Incomplete, Completed, and Minimal variants.
- **Linting**: No errors.

## Feature Implementation Checklist

- [x] Plan reviewed and clarified
- [x] Feature branch prepared
- [x] Implementation complete
- [x] Plan updated
- [x] Tests updated (Storybook story)
- [x] Quality guaranteed (lint clean)

---

## Overview

Add a checkbox to the left of the edit (pencil) icon in each todo list item, allowing users to toggle the completed status directly from the list. Selecting or deselecting the checkbox will persist the change via the existing update API.

## Requirements

**Scope**: Allow users to update the `completed` status of a todo from the list display without navigating to the edit page.

**Behavior**:

- Checkbox appears to the left of the edit (pencil) icon on each todo row
- Checkbox checked state reflects `todo.completed` (default `false` if undefined)
- Selecting/deselecting the checkbox calls the update API and persists the change
- List refreshes to reflect the new status (via TanStack Query invalidation)

## Existing Infrastructure (No Backend Changes)

The following already support `completed`:

- **src/lib/schema.ts**: `TodoSchema` has `completed: z.boolean().optional()`
- **src/server/fn/todos.ts**: `updateTodo` accepts and persists `completed`
- **src/hooks/useTodos.ts**: `useUpdateTodo()` mutation accepts `completed` and invalidates the todos query on success
- **Checkbox component**: `@/components/ui/checkbox` exists and is used in `TodoForm` and `TodoShadcnForm`

## Architecture

- User clicks checkbox → `handleToggleComplete(todo)` → `updateTodo` mutation with `id`, `title`, `completed`
- `updateTodo` server fn updates DB and returns success
- `onSuccess` invalidates `['todos']` query → list refetches and shows updated state
- Toast "Todo updated successfully" (existing behavior in `useUpdateTodo`)

## Implementation

### Todo.tsx

- Added `handleToggleComplete: (todo: Todo) => void` to the component props
- Imported `Checkbox` from `@/components/ui/checkbox`
- Inserted `Checkbox` to the left of the edit button within the actions div
- Wrapped the actions in `flex items-center gap-2` for alignment

### Todos.tsx

- Imported `useUpdateTodo` from `@/hooks/useTodos`
- Defined `handleToggleComplete(todo)` that calls the mutation with `id`, `title`, and toggled `completed`
- Passed `handleToggleComplete` to each `TodoComponent`

## Testing Strategy

- **Manual**: Toggle checkbox, verify list updates and change persists on refresh
- **Optional**: Unit test for `handleToggleComplete`; Storybook story for Todo with checkbox in checked/unchecked states

## Dependencies

- No new packages; uses existing `Checkbox` (Radix) and `useUpdateTodo`
- No schema or API changes
