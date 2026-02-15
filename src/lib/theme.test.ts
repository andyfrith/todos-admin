import { describe, expect, it } from 'vitest';
import { THEMES, THEME_ICONS, THEME_LABELS } from './theme';
import type { Theme } from './theme';

describe('theme config', () => {
  it('includes light, dark, system, and sunshine themes', () => {
    expect(THEMES).toContain('light');
    expect(THEMES).toContain('dark');
    expect(THEMES).toContain('system');
    expect(THEMES).toContain('sunshine');
    expect(THEMES).toHaveLength(4);
  });

  it('has labels for all themes', () => {
    for (const theme of THEMES as Array<Theme>) {
      expect(THEME_LABELS[theme]).toBeDefined();
      expect(typeof THEME_LABELS[theme]).toBe('string');
      expect(THEME_LABELS[theme].length).toBeGreaterThan(0);
    }
  });

  it('has icons for all themes', () => {
    for (const theme of THEMES as Array<Theme>) {
      expect(THEME_ICONS[theme]).toBeDefined();
      expect(THEME_ICONS[theme]).not.toBeNull();
    }
  });
});
