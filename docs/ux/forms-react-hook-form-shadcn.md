# Form Patterns Documentation

This document outlines the form implementation patterns used in this application, based on the Todo Admin add/edit form implementation.

## Core Dependencies

```typescript
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import type { Todo } from '@/lib/schema';
import { TodoSchema, TodoTypeSchema } from '@/lib/schema';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
```

## Schema Definition Pattern

Forms use Zod for validation schemas with TypeScript inference. Shared schema lives in `~/lib/schema.ts`:

```typescript
export const TodoTypeSchema = z.enum([
  'ACTIVE',
  'CULTURAL',
  'RESTORATIVE',
  'PLANNING',
]);

export type TodoType = z.infer<typeof TodoTypeSchema>;

export const TodoSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters.')
    .max(32, 'Title must be at most 32 characters.'),
  summary: z
    .string()
    .min(5, 'Summary must be at least 5 characters.')
    .max(250, 'Summary must be at most 250 characters.')
    .optional(),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters.')
    .max(250, 'Description must be at most 250 characters.')
    .optional(),
  todoType: TodoTypeSchema.optional(),
  completed: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Todo = z.infer<typeof TodoSchema>;
```

## Form Setup Pattern

Forms are initialized with react-hook-form and Zod resolver. Default values match the Todo shape; in edit mode they are pre-filled from the existing todo:

```typescript
const form = useForm<Todo>({
  resolver: zodResolver(TodoSchema as never),
  defaultValues: todo ?? {
    title: '',
    summary: '',
    description: '',
    todoType: 'ACTIVE',
    completed: false,
  },
});
```

## State Management Pattern

Loading state is supplied by the parent (e.g. TanStack Query mutation). The form disables submit when pending or when there are validation errors:

```typescript
// Parent (e.g. AddTodo) passes mutation state
<TodoForm
  onFormSubmit={(data: Todo) => createTodoMutation.mutate(data)}
  isPending={createTodoMutation.isPending}
/>

// Form disables submit when pending or invalid
disabled={isPending || Object.keys(form.formState.errors).length > 0}
```

## Submit Handler Pattern

Submit passes values to a parent callback; in add mode the form resets on success; in edit mode the parent may navigate or show toast:

```typescript
const onSubmit: SubmitHandler<Todo> = (data: Todo) => {
  onFormSubmit({ ...todo, ...data } as Todo);
  // Add-only form may reset after submit:
  // form.reset();
};
```

## Form Structure Pattern

Forms use custom Field components with react-hook-form: `register` for simple inputs, `Controller` for Select and Checkbox. Layout uses `FieldGroup` and semantic `FieldSet` for grouped controls:

```typescript
<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
  <FieldGroup>
    {/* Title: Controller with Input (or register for plain input) */}
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
            placeholder="Add a new todo..."
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />

    {/* Summary: optional text field */}
    {/* Description: optional text field */}

    {/* Type: Select — see Select Field Pattern */}
    {/* Status: FieldSet + Checkbox — see Checkbox Field Pattern */}

    <Button type="submit" disabled={isPending || hasErrors}>
      {isPending ? 'Adding...' : 'Add Todo'}
    </Button>
  </FieldGroup>
</form>
```

## Select Field Pattern

Select fields use `Controller` and shadcn `Select`; options are driven by the schema enum:

```typescript
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
      {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
      )}
    </Field>
  )}
/>
```

## Checkbox Field Pattern

Checkbox fields use `Controller` with `FieldSet`, `FieldLegend`, and horizontal `Field` for label + checkbox:

```typescript
<FieldSet>
  <FieldContent>
    <FieldLegend>Status</FieldLegend>
    <FieldDescription>Have you completed this todo?</FieldDescription>
  </FieldContent>
  <FieldGroup>
    <Controller
      control={form.control}
      name="completed"
      render={({ field: { onChange, value, ...field }, fieldState }) => (
        <Field data-invalid={fieldState.invalid} orientation="horizontal">
          <Checkbox
            {...field}
            id={field.name}
            checked={value}
            onCheckedChange={onChange}
            aria-invalid={fieldState.invalid}
          />
          <FieldContent>
            <FieldLabel htmlFor={field.name}>Completed</FieldLabel>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </FieldContent>
        </Field>
      )}
    />
  </FieldGroup>
</FieldSet>
```

## Input Attributes Pattern

Standard input attributes for Todo fields:

```typescript
// Title (text)
type="text"
placeholder="Add a new todo..." // or "Edit todo..." in edit mode
id={field.name}
aria-invalid={fieldState.invalid}

// Summary (optional)
placeholder="Brief summary (optional)"
id={field.name}
aria-invalid={fieldState.invalid}

// Description (optional)
placeholder="Description (optional)"
id={field.name}
aria-invalid={fieldState.invalid}

// Select (todoType)
aria-invalid={fieldState.invalid}
onBlur from Controller for touch/blur tracking

// Checkbox (completed)
checked={value}
onCheckedChange={onChange}
aria-invalid={fieldState.invalid}
```

## Error Display Pattern

Field-level errors are shown via `FieldError` next to each controlled field. A summary of all current validation errors is shown below the form:

```typescript
{Object.keys(form.formState.errors).length > 0 && (
  <div className="mt-8 p-6 rounded-lg border" style={{ ... }}>
    <h3 className="text-lg font-semibold mb-2 text-indigo-200">Errors</h3>
    <ul className="list-disc list-inside space-y-2 text-indigo-300/80">
      {Object.keys(form.formState.errors).map((key) => (
        <li key={key}>
          {form.formState.errors[key as keyof FieldErrors<Todo>]?.message}
        </li>
      ))}
    </ul>
  </div>
)}
```

## Loading States Pattern

Submit button reflects pending state from the parent and disables when there are validation errors:

```typescript
<Button
  type="submit"
  disabled={isPending || Object.keys(form.formState.errors).length > 0}
>
  {isPending ? 'Adding...' : 'Add Todo'}
</Button>
```

In the shared TodoForm (add + edit), labels switch by mode: "Add Todo" / "Adding..." vs "Update Todo" / "Updating...".

## Key Conventions

1. **Schema first**: Define Zod schema in `~/lib/schema.ts` and export type via `z.infer<typeof TodoSchema>`.
2. **Type safety**: Use `Todo` (or `z.infer<typeof TodoSchema>`) for form types and submit handlers.
3. **Controlled vs register**: Use `Controller` for Select and Checkbox; use `register` or `Controller` for text inputs.
4. **Loading from parent**: `isPending` is passed in from the parent (e.g. mutation) so the form stays presentational.
5. **Error handling**: Field-level errors via `FieldError`; optional summary block for all errors below the form.
6. **Accessibility**: `aria-invalid`, `htmlFor`/`id`, and semantic `FieldSet`/`FieldLegend` where appropriate.
7. **Shared form**: One TodoForm supports both add (no `todo`) and edit (`todo` provided); default values and submit labels vary by mode.
8. **Consistent styling**: Use `~/components/ui/field`, shadcn Select/Checkbox/Button, and shared border/background styles for Todo Admin.
