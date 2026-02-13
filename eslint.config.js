//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  ...tanstackConfig,
  {
    ignores: ['.storybook/**', 'eslint.config.js', 'prettier.config.js'],
  },
];
