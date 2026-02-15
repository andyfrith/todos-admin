import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldErrors, SubmitHandler } from 'react-hook-form';
import type { Todo } from '@/lib/schema';
import { TodoSchema, TodoTypeSchema } from '@/lib/schema';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export interface TodoFormProps {
  /** Called with form values on submit. For add, id may be undefined; for update, id is set from todo. */
  onFormSubmit: (values: Todo) => void;
  isPending: boolean;
  /** When provided, form is in edit mode: fields are pre-filled from this todo and submit includes its id. */
  todo?: Todo | null;
  /** Submit button label when not pending. Defaults to "Update Todo" when todo is provided, else "Add Todo". */
  submitLabel?: string;
  /** Submit button label when pending. Defaults to "Updating..." when todo is provided, else "Adding...". */
  pendingLabel?: string;
  /** Placeholder for the title input. */
  placeholder?: string;
}

/**
 * Shared form for creating and updating a todo.
 * Pass a todo to pre-fill for edit mode; omit for add mode.
 */
export default function TodoForm({
  onFormSubmit,
  isPending,
  todo,
  submitLabel,
  pendingLabel,
  placeholder = 'Add a new todo...',
}: TodoFormProps) {
  const isEditMode = todo != null && todo.id;
  const effectiveSubmitLabel =
    submitLabel ?? (isEditMode ? 'Update Todo' : 'Add Todo');
  const effectivePendingLabel =
    pendingLabel ?? (isEditMode ? 'Updating...' : 'Adding...');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Todo>({
    resolver: zodResolver(TodoSchema as never),
    defaultValues: todo ?? {
      title: '',
      summary: '',
      description: '',
      todoType: 'ACTIVE',
      completed: false,
    },
  });

  const onSubmit: SubmitHandler<Todo> = (data: Todo) => {
    onFormSubmit({ ...todo, ...data } as Todo);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              {...register('title')}
              placeholder={placeholder}
              className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-white placeholder-indigo-300/50"
              style={{
                background: 'rgba(93, 103, 227, 0.1)',
                borderColor: 'rgba(93, 103, 227, 0.3)',
              }}
            />
          </div>
          <Field data-invalid={!!errors.summary}>
            <FieldLabel htmlFor="summary">Summary</FieldLabel>
            <Textarea
              {...register('summary')}
              id="summary"
              rows={3}
              placeholder="Brief summary (optional)"
              className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-white placeholder-indigo-300/50 resize-none"
              style={{
                background: 'rgba(93, 103, 227, 0.1)',
                borderColor: 'rgba(93, 103, 227, 0.3)',
              }}
            />
            {errors.summary && (
              <FieldError errors={[errors.summary]} />
            )}
          </Field>
          <Field data-invalid={!!errors.description}>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              {...register('description')}
              id="description"
              rows={6}
              placeholder="Description (optional)"
              className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-white placeholder-indigo-300/50 resize-none"
              style={{
                background: 'rgba(93, 103, 227, 0.1)',
                borderColor: 'rgba(93, 103, 227, 0.3)',
              }}
            />
            {errors.description && (
              <FieldError errors={[errors.description]} />
            )}
          </Field>
          <Controller
            control={control}
            name="todoType"
            render={({ field: { onChange, onBlur, ...field }, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                <Select
                  {...field}
                  value={field.value ?? undefined}
                  onValueChange={onChange}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    onBlur={onBlur}
                    className="flex-1 max-w-xs px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-white"
                    style={{
                      background: 'rgba(93, 103, 227, 0.1)',
                      borderColor: 'rgba(93, 103, 227, 0.3)',
                    }}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TodoTypeSchema.options.map((type) => (
                      <SelectItem key={type as string} value={type as string}>
                        {type as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="completed"
            render={({ field: { onChange, value, ...field }, fieldState }) => (
              <Field data-invalid={fieldState.invalid} orientation="horizontal">
                <Checkbox
                  {...field}
                  id="completed"
                  checked={value ?? false}
                  onCheckedChange={onChange}
                  aria-invalid={fieldState.invalid}
                />
                <FieldContent>
                  <FieldLabel htmlFor="completed">Completed</FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #5d67e3 0%, #8b5cf6 100%)',
                color: 'white',
              }}
            >
              {isPending ? effectivePendingLabel : effectiveSubmitLabel}
            </button>
          </div>
        </FieldGroup>
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
