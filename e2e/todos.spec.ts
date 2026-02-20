import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
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
  /** Wait for /todos to finish loading (list, empty state, or error). */
  async function waitForTodosSettled(page: Page) {
    await expect(page.getByRole('heading', { name: 'Todos' })).toBeVisible();
    await Promise.race([
      page.getByRole('list').waitFor({ state: 'visible', timeout: 15_000 }),
      page.getByText('No todos found').waitFor({ state: 'visible', timeout: 15_000 }),
      page.getByText('Error!').waitFor({ state: 'visible', timeout: 15_000 }),
    ]);
  }

  test('clicking delete opens confirmation dialog', async ({ page }) => {
    await page.goto('/todos');
    await waitForTodosSettled(page);
    const deleteButtons = page.getByRole('button', { name: 'Delete todo' });
    if ((await deleteButtons.count()) === 0) test.skip();
    await deleteButtons.first().click();
    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Delete todo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
  });

  test('cancel closes dialog without deleting', async ({ page }) => {
    await page.goto('/todos');
    await waitForTodosSettled(page);
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
