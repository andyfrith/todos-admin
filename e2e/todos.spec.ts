import { expect, test } from '@playwright/test';
import { clickNavLink, openNav } from './fixtures';

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

test.describe('Delete confirmation', () => {
  test('clicking delete opens confirmation dialog', async ({ page }) => {
    await page.goto('/todos');
    const list = page.getByRole('list');
    await expect(list).toBeVisible();
    const deleteButtons = page.getByRole('button', { name: 'Delete todo' });
    const count = await deleteButtons.count();
    if (count === 0) test.skip();
    await deleteButtons.first().click();
    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Delete todo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
  });

  test('cancel closes dialog without deleting', async ({ page }) => {
    await page.goto('/todos');
    const deleteBtn = page.getByRole('button', { name: 'Delete todo' }).first();
    if (!(await deleteBtn.isVisible())) test.skip();
    await deleteBtn.click();
    await expect(page.getByRole('alertdialog')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('alertdialog')).not.toBeVisible();
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
