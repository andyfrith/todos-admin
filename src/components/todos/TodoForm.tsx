import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldErrors, SubmitHandler } from 'react-hook-form';
import type { Todo } from '@/lib/schema';
import { TodoSchema } from '@/lib/schema';

export default function TodoForm({
  onFormSubmit,
  isPending,
}: {
  onFormSubmit: (values: Todo) => void;
  isPending: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Todo>({
    // Zod 4 schema; @hookform/resolvers typings expect zod/v4/core - assert to satisfy (runtime is correct)
    resolver: zodResolver(TodoSchema as never),
  });
  const onSubmit: SubmitHandler<Todo> = (data: Todo) => {
    console.log('onSubmit', data);
    onFormSubmit(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <input
          type="text"
          {...register('title')}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-white placeholder-indigo-300/50"
          style={{
            background: 'rgba(93, 103, 227, 0.1)',
            borderColor: 'rgba(93, 103, 227, 0.3)',
            //   focusRing: 'rgba(93, 103, 227, 0.5)',
          }}
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap"
          style={{
            background: 'linear-gradient(135deg, #5d67e3 0%, #8b5cf6 100%)',
            color: 'white',
          }}
        >
          {isPending ? 'Adding...' : 'Add Todo'}
        </button>
      </form>
      {Object.keys(errors).length > 0 && (
        <div
          className="mt-8 p-6 rounded-lg border"
          style={{
            background: 'rgba(93, 103, 227, 0.05)',
            borderColor: 'rgba(93, 103, 227, 0.2)',
          }}
        >
          <h3 className="text-lg font-semibold mb-2 text-indigo-200">Errors</h3>
          <div className="space-y-2 text-sm">
            <ul className="list-disc list-inside space-y-2 text-indigo-300/80">
              {Object.keys(errors).map((key) => (
                <li key={key}>
                  {errors[key as keyof FieldErrors<Todo>]?.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
