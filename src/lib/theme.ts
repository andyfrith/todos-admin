import { Monitor, Moon, Sun, SunDim } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Theme configuration and types for the application.
 * Supports light, dark, system (follows OS preference), and sunshine color scheme.
 */
export const THEMES = ['light', 'dark', 'system', 'sunshine'] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  sunshine: 'Sunshine',
};

export const THEME_ICONS: Record<Theme, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
  sunshine: SunDim,
};
