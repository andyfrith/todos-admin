import { Pencil, TrashIcon } from 'lucide-react';
import type { Todo } from '@/lib/schema';

export default function Todo({
  todo,
  handleDelete,
  handleEdit,
}: {
  todo: Todo;
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
}) {
  return (
    <li
      key={todo.id}
      className="group cursor-pointer rounded-lg border border-border bg-card p-4 text-card-foreground shadow-md transition-all hover:scale-[1.02] dark:border-[rgba(93,103,227,0.3)] dark:bg-transparent dark:[background:linear-gradient(135deg,rgba(93,103,227,0.15)_0%,rgba(139,92,246,0.15)_100%)]"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-foreground transition-colors group-hover:text-primary dark:text-white dark:group-hover:text-indigo-200">
            {todo.title}
          </span>
          <div>
            <button
              className="mr-3 text-muted-foreground hover:text-foreground dark:text-indigo-300/80 dark:hover:text-indigo-200"
              onClick={() => todo.id != null && handleEdit(todo.id)}
              aria-label="Edit todo"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              className="text-muted-foreground hover:text-destructive dark:text-indigo-300/80 dark:hover:text-indigo-200"
              onClick={() => todo.id != null && handleDelete(todo.id)}
              aria-label="Delete todo"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        {(todo.summary || todo.description) && (
          <div className="mt-1 space-y-0.5 text-sm text-muted-foreground dark:text-indigo-300/80">
            {todo.summary && <p className="line-clamp-2">{todo.summary}</p>}
            {todo.description && todo.description !== todo.summary && (
              <p className="line-clamp-2 dark:text-indigo-300/70">
                {todo.description}
              </p>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
