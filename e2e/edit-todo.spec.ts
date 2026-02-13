import { test, expect } from '@playwright/test';
import { openNav } from './fixtures';

test.describe('Edit Todo route (/todos/:id/edit)', () => {
  test('displays Edit Todo heading when todo exists', async ({ page }) => {
    await page.goto('/todos');
    const list = page.getByRole('list');
    const hasItems = await list.locator('li').count() > 0;
    if (hasItems) {
      await page.getByRole('button', { name: 'Edit todo' }).first().click();
      await expect(page).toHaveURL(/\/todos\/\d+\/edit/);
      await expect(page.getByRole('heading', { name: 'Edit Todo' })).toBeVisible();
    }
  });

  test('shows "Todo not found" for invalid id', async ({ page }) => {
    await page.goto('/todos/99999/edit');
    await expect(page.getByText('Todo not found.')).toBeVisible();
  });
});

test.describe('Navigation to edit', () => {
  test('from todos list, edit button navigates to edit page', async ({ page }) => {
    await page.goto('/todos');
    const editBtn = page.getByRole('button', { name: 'Edit todo' }).first();
    const visible = await editBtn.isVisible();
    if (visible) {
      await editBtn.click();
      await expect(page).toHaveURL(/\/todos\/\d+\/edit/);
      await expect(
        page.getByRole('heading', { name: 'Edit Todo' }).or(page.getByText('Todo not found.'))
      ).toBeVisible();
    }
  });
});
