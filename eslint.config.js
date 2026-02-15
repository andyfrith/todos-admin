//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  ...tanstackConfig,
  {
    ignores: [
      '.storybook/**',
      '.output/**',
      'playwright-report/**',
      'eslint.config.js',
      'prettier.config.js',
    ],
  },
];
