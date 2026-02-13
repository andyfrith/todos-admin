import { test, expect } from '@playwright/test';
import { openNav, clickNavLink } from './fixtures';

test.describe('Todos list route (/todos)', () => {
  test('displays Todos heading', async ({ page }) => {
    await page.goto('/todos');
    await expect(page.getByRole('heading', { name: 'Todos' })).toBeVisible();
  });

  test('shows either list, empty state, or loading', async ({ page }) => {
    await page.goto('/todos');
    await expect(page.getByRole('heading', { name: 'Todos' })).toBeVisible();
    const hasContent =
      (await page.getByText('No todos found').isVisible()) ||
      (await page.getByText('Pending...').isVisible()) ||
      (await page.getByText('Error!').isVisible()) ||
      (await page.getByRole('list').isVisible());
    expect(hasContent).toBeTruthy();
  });
});

test.describe('Navigation to todos', () => {
  test('navigates from home to todos via sidebar', async ({ page }) => {
    await page.goto('/');
    await openNav(page);
    await clickNavLink(page, 'Todos');
    await expect(page).toHaveURL(/\/todos$/);
    await expect(page.getByRole('heading', { name: 'Todos' })).toBeVisible();
  });
});
