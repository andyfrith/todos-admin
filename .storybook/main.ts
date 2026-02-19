import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-mcp'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { default: tailwindcss } = await import('@tailwindcss/vite');
    config.plugins = config.plugins || [];
    // Flatten plugin arrays (e.g. devtools() returns an array), then remove TanStack devtools to avoid port 42069 conflict
    const flatten = (arr: unknown[]): unknown[] =>
      arr.flatMap((p) => (Array.isArray(p) ? flatten(p as unknown[]) : [p]));
    const flattened = flatten([...config.plugins]);
    config.plugins = flattened.filter((plugin: unknown) => {
      const p = plugin as { name?: string } | null;
      if (p && typeof p === 'object' && p?.name) {
        return !String(p.name).startsWith('@tanstack/devtools');
      }
      return true;
    });
    config.plugins.push(tailwindcss());
    return config;
  },
};
export default config;
