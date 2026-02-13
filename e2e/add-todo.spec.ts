import { test, expect } from '@playwright/test';
import { openNav, clickNavLink } from './fixtures';

test.describe('Add Todo route (/todos/add)', () => {
  test('displays Add Todo heading and form', async ({ page }) => {
    await page.goto('/todos/add');
    await expect(page.getByRole('heading', { name: 'Add Todo' })).toBeVisible();
    await expect(page.getByLabel('Title')).toBeVisible();
    await expect(page.getByPlaceholder('Add a new todo...')).toBeVisible();
  });

  test('navigates from home via sidebar', async ({ page }) => {
    await page.goto('/');
    await openNav(page);
    await clickNavLink(page, 'Add Todo');
    await expect(page).toHaveURL('/todos/add');
    await expect(page.getByRole('heading', { name: 'Add Todo' })).toBeVisible();
  });
});
