# Generate Storybook Command

## Usage

```bash
# Generate Storybook for a component
generate-storybook <component-path>

# Examples:
generate-storybook apps/web/components/ui/accordion.tsx
generate-storybook apps/web/components/calendar-picker.tsx
```

## Command Behavior

### Step 1: Validate Input

- Ensure a component path argument is provided
- Verify the component file exists
- Convert relative path to absolute if needed
- Extract component directory and filename

### Step 2: Read Component Implementation

Read the target component file to understand:

- Component name and export structure
- Props interface and types
- Variant props (if using `cva` or similar)
- Available variants (e.g., variant, size, color options)
- Default props
- Whether it's a TypeScript component
- Any special prop types (boolean flags, enums, etc.)

### Step 3: Analyze Component API

Extract key information:

- **Component name**: From the export (default or named)
- **Variant props**: If using `class-variance-authority` (cva), extract:
  - Variant names (e.g., `variant`, `size`, `color`)
  - Variant options (e.g., `primary`, `secondary`, `destructive`)
  - Default variants
- **Boolean props**: Props like `disabled`, `loading`, `open`, etc.
- **Required props**: Props without default values or optional markers
- **Children prop**: Whether component accepts children

### Step 4: Generate Storybook File Structure

Create a Storybook file with the following structure:

```typescript
import { fn } from 'storybook/test';

import { Button } from './button';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Form/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate stories for each variant
```

### Step 5: Generate argTypes

Based on the component analysis:

- **Variant props**: Create `select` controls with available options
  ```typescript
  variant: {
    control: 'select',
    options: ['primary', 'secondary', 'destructive'],
  }
  ```
- **Boolean props**: Create `boolean` controls
  ```typescript
  disabled: {
    control: 'boolean',
  }
  ```
- **String props**: Create `text` controls (if appropriate)
- **Number props**: Create `number` controls (if appropriate)

### Step 6: Generate Stories

Create stories for common use cases:

1. **Default/Primary story**: Using default props
2. **Variant stories**: One story per major variant option
3. **Size stories**: If component has size variants
4. **State stories**: Disabled, loading, error states, etc.
5. **Icon variants**: If component has icon-related size props

### Step 7: Determine Story Category

Auto-detect the Storybook category based on file location:

- `src/components/ui/*` → `'UI/ComponentName'`
- `src/components/*` → `'Components/ComponentName'`
- Custom path → `'ComponentName'` (or ask user for category)

### Step 8: Handle Special Cases

**For components with children:**

- Use appropriate example children (text, icons, nested components)

**For icon components:**

- Use an icon or emoji as example content

**For form components:**

- Include realistic form-related props and examples

**For layout components:**

- Include example nested content to demonstrate layout behavior

### Step 9: Write Storybook File

- Generate file at same location as component: `[component-name].stories.tsx`
- Use proper TypeScript types
- Match project code style (single quotes, formatting)
- Include all necessary imports

### Step 10: Format and Validate

```bash
# Format the generated file
# cd apps/web
# volta run pnpm format

# Optional: Run Storybook to verify
# volta run pnpm storybook
```

## Output

Provide summary including:

- Generated Storybook file location
- Number of stories created
- List of story names
- argTypes configuration
- Any special considerations or manual adjustments needed

## Example Output

```
Generated Storybook file: apps/web/components/ui/button.stories.tsx

Stories created (7):
- Primary
- Destructive
- Secondary
- Success
- Ghost
- Link
- Disabled

argTypes:
- variant: select (primary, destructive, secondary, success, ghost, link)
- size: select (default, icon, icon-sm, icon-lg)
- disabled: boolean

Note: All stories use realistic example content. Review and adjust if needed.
```

## Error Handling

- If component file doesn't exist, show clear error message
- If component has no exports, warn and ask for clarification
- If component structure is too complex, generate basic template and note manual adjustments needed
- If path is invalid, suggest correct format

## Notes

- The command analyzes the component implementation to generate accurate stories
- It respects the actual variants and props defined in the component
- Generated stories are starting points and may need manual refinement
- For complex components, additional stories might be needed for edge cases
