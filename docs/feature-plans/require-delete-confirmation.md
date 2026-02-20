# Require Delete Confirmation

## Development Progress

- **Implementation**: Complete. Delete button opens an AlertDialog; Cancel closes without deleting, Confirm runs the delete mutation.
- **Feature branch**: Create from main/develop, e.g. `feature/require-delete-confirmation`.
- **Tests**: E2e tests added in `e2e/todos.spec.ts` (delete opens dialog, cancel closes without deleting). Unit tests: no new unit tests; existing `pnpm test` passes.
- **Linting**: No errors; `pnpm run lint` passes.

## Feature Implementation Checklist

- [x] Requirements documented
- [x] User stories written
- [x] Technical approach planned
- [x] Document containing plan is created
- [x] Plan reviewed and clarified
- [ ] Feature branch prepared (optional; create when merging)
- [x] Implementation of feature
- [x] Plan updated
- [x] Tests updated
- [x] Quality guaranteed

---

## Overview

Require user confirmation before deleting a todo. Clicking the delete (trash) button on a todo opens a confirmation dialog; the todo is only deleted when the user confirms. Cancelling closes the dialog with no change.

## Requirements

**Scope**: Prevent accidental deletion of todos by requiring an explicit confirmation step before the delete mutation runs.

**Behavior**:

- Clicking the delete (trash) button on a todo **does not** delete immediately.
- A confirmation dialog opens with a clear message (e.g. “Are you sure you want to delete this todo?”) and the todo title when helpful.
- Dialog offers **Cancel** (dismiss, no delete) and **Delete** / **Confirm** (proceed with delete).
- Only when the user confirms does the app call the existing delete mutation and show the success toast.
- Accessible: dialog is focus-trapped, has correct roles and labels, and can be dismissed via Cancel or Escape.

## User Stories

- **As a** user managing todos, **I want** to confirm before a todo is deleted **so that** I don’t accidentally remove one by misclicking.
- **As a** user, **I want** to cancel the delete from the confirmation dialog **so that** I can change my mind without any change to data.

## Acceptance Criteria

- [x] Delete button opens a confirmation dialog (no immediate delete).
- [x] Dialog shows a clear confirmation message; optionally includes the todo title.
- [x] Cancel (or Escape) closes the dialog without deleting.
- [x] Confirm/Delete in the dialog triggers the existing delete mutation and success toast.
- [x] Dialog is accessible (focus trap, roles, labels).
- [x] No lint errors; existing and new tests pass.

## Technical Approach

### Current Flow

- `Todo.tsx`: delete button calls `handleDelete(todo.id)`.
- `Todos.tsx`: `handleDelete(todoId)` calls `deleteTodoMutation.mutate(todoId)` immediately.
- `useTodos.ts`: `useDeleteTodo()` runs `deleteTodo` server fn and invalidates `['todos']` on success.

### Planned Flow

- Delete button still calls `handleDelete(todo.id)` (or we pass the whole `todo` for title in the dialog).
- `Todos.tsx` (or a small wrapper) keeps state: `todoToDelete: { id: number; title?: string } | null`.
- When user clicks delete: set `todoToDelete` and open the confirmation dialog (controlled by this state).
- Dialog content: message + optional todo title; Cancel sets `todoToDelete = null` and closes; Confirm calls `deleteTodoMutation.mutate(todoToDelete.id)`, then clears `todoToDelete` and closes. On mutation success, existing toast and invalidation apply.
- Use a confirmation-style dialog component (e.g. shadcn **AlertDialog**) for semantics and accessibility.

### Data / API

- No backend or schema changes. Delete API and `useDeleteTodo()` remain unchanged; only the UI adds a confirmation step before calling the mutation.

### UI Components

- Add **AlertDialog** from shadcn (if not already present) for the confirmation modal.
- Implement a small **DeleteTodoConfirmation** (or inline in `Todos.tsx`) that receives:
  - `open: boolean`
  - `onOpenChange: (open: boolean) => void`
  - `todo: { id: number; title?: string } | null`
  - `onConfirm: (id: number) => void`
  - `isDeleting: boolean` (from `deleteTodoMutation.isPending`) to disable the confirm button and show loading if desired.

### Testing Strategy

- **Manual**: Click delete → dialog appears; Cancel → dialog closes, todo still there; Confirm → todo deleted, toast, list updates.
- **E2E**: Add a test that opens the dialog on delete click and optionally tests Cancel and Confirm paths.
- **Storybook** (optional): Story for the confirmation dialog in isolation.

## Dependencies

- **shadcn/ui**: Add `alert-dialog` component (Radix AlertDialog).
- No new npm packages beyond what shadcn adds.
- Existing: `useDeleteTodo`, `Todo` with `handleDelete`, server `deleteTodo`.

## Implementation Notes

- Keep `Todo.tsx` API unchanged: it still receives `handleDelete: (id: number) => void`. The parent decides whether that opens a dialog or mutates; the parent will open the dialog and then mutate on confirm.
- Optional: pass `todo` to the dialog to show “Delete ‘Buy milk’?” for better UX.
