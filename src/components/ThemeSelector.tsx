import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import type { Theme } from '@/lib/theme';
import { THEMES, THEME_ICONS, THEME_LABELS } from '@/lib/theme';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Theme selector dropdown for switching between light, dark, system, and sunshine themes.
 * Aligns to the right when placed in a flex container with ml-auto.
 */
export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-9 w-24 rounded-md border border-input bg-transparent"
        aria-hidden
      />
    );
  }

  const currentTheme = (theme ?? 'system') as Theme;
  const Icon = THEME_ICONS[currentTheme];

  return (
    <Select
      value={currentTheme}
      onValueChange={(value) => setTheme(value as Theme)}
    >
      <SelectTrigger
        className="w-[130px] border-input bg-muted/50 hover:bg-muted"
        size="default"
        aria-label="Select theme"
      >
        <Icon className="size-4" />
        <SelectValue placeholder="Theme">{THEME_LABELS[currentTheme]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {THEMES.map((t) => {
          const ThemeIcon = THEME_ICONS[t];
          return (
            <SelectItem key={t} value={t}>
              <span className="flex items-center gap-2">
                <ThemeIcon className="size-4" />
                {THEME_LABELS[t]}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
