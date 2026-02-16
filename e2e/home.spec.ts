import { expect, test } from '@playwright/test';

test.describe('Home route (/)', () => {
  test('displays Todos Admin branding and feature info', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Todos Admin' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'About' }),
    ).toBeVisible();
  });

  test('page title is set', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Todos Admin');
  });
});
