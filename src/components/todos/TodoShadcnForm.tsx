import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type { FieldErrors, SubmitHandler } from 'react-hook-form';
import type { Todo } from '@/lib/schema';
import { TodoSchema, TodoTypeSchema } from '@/lib/schema';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function TodoShadcnForm({
  onFormSubmit,
  isPending,
}: {
  onFormSubmit: (values: Todo) => void;
  isPending: boolean;
}) {
  const form = useForm<Todo>({
    resolver: zodResolver(TodoSchema as never),
    defaultValues: {
      title: '',
      summary: '',
      description: '',
      todoType: 'ACTIVE',
      completed: false,
    },
  });
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<Todo>({
  //   // Zod 4 schema; @hookform/resolvers typings expect zod/v4/core - assert to satisfy (runtime is correct)
  //   resolver: zodResolver(TodoSchema as never),
  // });
  const onSubmit: SubmitHandler<Todo> = (data: Todo) => {
    onFormSubmit(data);
    form.reset();
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FieldGroup>
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  className="flex-1 dark:border-[rgba(93,103,227,0.3)] dark:bg-[rgba(93,103,227,0.1)] dark:text-white dark:placeholder:text-indigo-300/50"
                  placeholder="Add a new todo..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]}></FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="summary"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Summary</FieldLabel>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  rows={3}
                  className="flex-1 resize-none dark:border-[rgba(93,103,227,0.3)] dark:bg-[rgba(93,103,227,0.1)] dark:text-white dark:placeholder:text-indigo-300/50"
                  placeholder="Brief summary (optional)"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]}></FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  rows={6}
                  className="flex-1 resize-none dark:border-[rgba(93,103,227,0.3)] dark:bg-[rgba(93,103,227,0.1)] dark:text-white dark:placeholder:text-indigo-300/50"
                  placeholder="Description (optional)"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]}></FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="todoType"
            render={({ field: { onChange, onBlur, ...field }, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                <Select {...field} onValueChange={onChange}>
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    onBlur={onBlur}
                    className="flex-1 dark:border-[rgba(93,103,227,0.3)] dark:bg-[rgba(93,103,227,0.1)] dark:text-white dark:placeholder:text-indigo-300/50"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TodoTypeSchema.options.map((type) => (
                      <SelectItem key={type as string} value={type as string}>
                        {type as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-white placeholder-indigo-300/50"
                  style={{
                    background: 'rgba(93, 103, 227, 0.1)',
                    borderColor: 'rgba(93, 103, 227, 0.3)',
                    //   focusRing: 'rgba(93, 103, 227, 0.5)',
                  }}
                  placeholder="Add a new todo..."
                /> */}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]}></FieldError>
                )}
              </Field>
            )}
          />
          <FieldSet>
            <FieldContent>
              <FieldLegend>Status</FieldLegend>
              <FieldDescription>Have you completed this todo?</FieldDescription>
            </FieldContent>
            <FieldGroup>
              <Controller
                control={form.control}
                name="completed"
                render={({
                  field: { onChange, value, ...field },
                  fieldState,
                }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation={'horizontal'}
                  >
                    <Checkbox
                      {...field}
                      id={field.name}
                      checked={value}
                      onCheckedChange={onChange}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Yes</FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]}></FieldError>
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
          <Button
            className="whitespace-nowrap px-6 py-3 font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 dark:bg-[linear-gradient(135deg,#5d67e3_0%,#8b5cf6_100%)] dark:text-white"
            disabled={
              isPending || Object.keys(form.formState.errors).length > 0
            }
          >
            {isPending ? 'Adding...' : 'Add Todo'}
          </Button>
        </FieldGroup>
      </form>
      {Object.keys(form.formState.errors).length > 0 && (
        <div className="mt-8 rounded-lg border border-border bg-muted/50 p-6 dark:border-[rgba(93,103,227,0.2)] dark:bg-[rgba(93,103,227,0.05)]">
          <h3 className="mb-2 text-lg font-semibold text-foreground dark:text-indigo-200">
            Errors
          </h3>
          <div className="space-y-2 text-sm">
            <ul className="list-inside list-disc space-y-2 text-muted-foreground dark:text-indigo-300/80">
              {Object.keys(form.formState.errors).map((key) => (
                <li key={key}>
                  {
                    form.formState.errors[key as keyof FieldErrors<Todo>]
                      ?.message
                  }
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
