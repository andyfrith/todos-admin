# Theming Documentation

This document describes the theming system used in the Todos Admin application. Users can select from Light, Dark, System (follows OS preference), and Sunshine (a warm color scheme).

## Overview

The application uses [next-themes](https://github.com/pacocoursey/next-themes) for theme management and persistence. Themes are applied via CSS classes on the root `html` element, and all components use semantic CSS variables so they automatically adapt to the active theme.

## Available Themes

| Theme   | Description                                  |
|---------|----------------------------------------------|
| Light   | Default light color palette                  |
| Dark    | Dark mode with inverted colors               |
| System  | Follows the user's OS light/dark preference  |
| Sunshine| Warm yellows, golden tones, and cream colors |

## Architecture

### Theme Configuration

Theme types and labels live in `src/lib/theme.ts`:

```typescript
export const THEMES = ['light', 'dark', 'system', 'sunshine'] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  sunshine: 'Sunshine',
};
```

### Theme Provider

The `ThemeProvider` from next-themes wraps the app in `src/routes/__root.tsx`:

```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  themes={THEMES}
  storageKey="theme"
>
  {/* App content */}
</ThemeProvider>
```

- **attribute="class"**: Applies theme as a class on the `html` element (e.g., `class="dark"`, `class="sunshine"`)
- **defaultTheme="system"**: New users get the OS preference by default
- **storageKey="theme"**: Persists the user's choice in `localStorage` under the key `theme`

### Theme Selector

The `ThemeSelector` component (`src/components/ThemeSelector.tsx`) renders a dropdown in the Header, aligned to the right. It uses the Shadcn `Select` component and `useTheme` from next-themes.

## Styling Approach

### CSS Variables

All theme colors are defined as CSS custom properties in `src/styles.css`. The base palette lives in `:root` (light theme). Dark and sunshine themes override these variables in `.dark` and `.sunshine` selectors:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  /* ... other variables */
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  /* ... */
}

.sunshine {
  --background: oklch(0.98 0.025 95);
  --foreground: oklch(0.25 0.06 65);
  /* Warm palette ... */
}
```

### Custom Variants

Tailwind custom variants allow theme-specific overrides when needed:

```css
@custom-variant dark (&:is(.dark *));
@custom-variant sunshine (&:is(.sunshine *));
```

These can be used in components: `dark:bg-muted`, `sunshine:ring-amber-200`, etc.

### Component Styling

Components should use semantic color classes so they adapt to all themes:

- **Backgrounds**: `bg-background`, `bg-card`, `bg-primary`, `bg-muted`, `bg-sidebar`
- **Text**: `text-foreground`, `text-muted-foreground`, `text-primary-foreground`
- **Borders**: `border-border`, `border-input`
- **Accents**: `bg-accent`, `text-accent-foreground`

Avoid hardcoded colors (e.g., `bg-gray-800`, `text-white`) so components work across themes.

## Adding a New Color Scheme

To add a new theme (e.g., "midnight"):

1. **Add to theme config** in `src/lib/theme.ts`:

   ```typescript
   export const THEMES = ['light', 'dark', 'system', 'sunshine', 'midnight'] as const;
   export const THEME_LABELS = { /* ... */ midnight: 'Midnight' };
   export const THEME_ICONS = { /* ... */ midnight: Moon };  // LucideIcon
   ```

2. **Add CSS variables** in `src/styles.css`:

   ```css
   @custom-variant midnight (&:is(.midnight *));

   .midnight {
     --background: oklch(0.1 0.02 270);
     --foreground: oklch(0.95 0.01 270);
     /* ... full palette */
   }
   ```

3. **ThemeSelector** auto-includes the new option by iterating over `THEMES` and `THEME_ICONS` from `lib/theme.ts`.

4. **Update docs** and PRD if applicable.

## Toast / Sonner

The Sonner toaster only supports `light`, `dark`, and `system`. Custom themes (e.g., sunshine) are mapped to the closest supported theme in `src/components/ui/sonner.tsx`:

```typescript
const sonnerTheme =
  resolvedTheme === 'sunshine' ? 'light' : (resolvedTheme as ToasterProps['theme']);
```

## Key Conventions

1. **Semantic colors**: Use Tailwind semantic tokens (`bg-background`, `text-foreground`) instead of raw colors.
2. **No hardcoded grays**: Replace `bg-gray-800`, `text-white` with theme-aware classes.
3. **Header and sidebar**: Use `bg-primary`, `text-primary-foreground` or `bg-sidebar`, `text-sidebar-foreground` so they adapt to each theme.
4. **Theme persistence**: next-themes handles localStorage; no custom logic is needed.
5. **Hydration**: The root `html` element uses `suppressHydrationWarning` to avoid flash when the theme is applied on the client.
