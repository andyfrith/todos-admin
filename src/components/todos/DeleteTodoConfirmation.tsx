import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';

export type TodoToDelete = { id: number; title?: string | null } | null;

export interface DeleteTodoConfirmationProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when open state should change (e.g. close on cancel) */
  onOpenChange: (open: boolean) => void;
  /** The todo to delete, or null when closed */
  todo: TodoToDelete;
  /** Called when user confirms delete; caller should run the delete mutation */
  onConfirm: (id: number) => void;
  /** True while the delete mutation is pending (e.g. disable confirm button) */
  isDeleting?: boolean;
}

/**
 * Confirmation dialog shown before deleting a todo. Requires the user to confirm
 * or cancel; on confirm, calls onConfirm with the todo id.
 */
export function DeleteTodoConfirmation({
  open,
  onOpenChange,
  todo,
  onConfirm,
  isDeleting = false,
}: DeleteTodoConfirmationProps) {
  const title = todo?.title?.trim();
  const description = title
    ? `Are you sure you want to delete "${title}"? This cannot be undone.`
    : 'Are you sure you want to delete this todo? This cannot be undone.';

  const handleConfirm = () => {
    if (todo?.id != null) {
      onConfirm(todo.id);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete todo</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
