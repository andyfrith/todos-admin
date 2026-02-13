import { Pencil, TrashIcon } from 'lucide-react';
import type { Todo } from '@/lib/schema';

export default function Todo({
  todo,
  handleDelete,
}: {
  todo: Todo;
  handleDelete: (id: string) => void;
}) {
  return (
    <li
      key={todo.id}
      className="rounded-lg p-4 shadow-md border transition-all hover:scale-[1.02] cursor-pointer group"
      style={{
        background:
          'linear-gradient(135deg, rgba(93, 103, 227, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
        borderColor: 'rgba(93, 103, 227, 0.3)',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium text-white group-hover:text-indigo-200 transition-colors">
          {todo.title}
        </span>
        <div>
          {/* <span className="text-xs text-indigo-300/70">#{todo.id}</span> */}
          <button
            className="mr-3"
            onClick={() => handleDelete(todo.id?.toString() ?? '')}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(todo.id?.toString() ?? '')}>
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
