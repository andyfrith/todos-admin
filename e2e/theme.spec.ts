import { expect, test } from '@playwright/test';

test.describe('Theme selector', () => {
  test('theme selector is visible in header', async ({ page }) => {
    await page.goto('/');
    const themeSelector = page.getByRole('combobox', { name: 'Select theme' });
    await expect(themeSelector).toBeVisible();
  });

  test('theme selector shows all theme options', async ({ page }) => {
    await page.goto('/');
    const themeSelector = page.getByRole('combobox', { name: 'Select theme' });
    await themeSelector.click();

    await expect(page.getByRole('option', { name: 'Light' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Dark' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'System' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Sunshine' })).toBeVisible();
  });

  test('selecting Light applies light theme', async ({ page }) => {
    await page.goto('/');
    const themeSelector = page.getByRole('combobox', { name: 'Select theme' });
    await themeSelector.click();
    await page.getByRole('option', { name: 'Light' }).click();

    await expect(page.locator('html')).toHaveClass(/light/);
  });

  test('selecting Dark applies dark theme', async ({ page }) => {
    await page.goto('/');
    const themeSelector = page.getByRole('combobox', { name: 'Select theme' });
    await themeSelector.click();
    await page.getByRole('option', { name: 'Dark' }).click();

    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('selecting Sunshine applies sunshine theme', async ({ page }) => {
    await page.goto('/');
    const themeSelector = page.getByRole('combobox', { name: 'Select theme' });
    await themeSelector.click();
    await page.getByRole('option', { name: 'Sunshine' }).click();

    await expect(page.locator('html')).toHaveClass(/sunshine/);
  });
});
