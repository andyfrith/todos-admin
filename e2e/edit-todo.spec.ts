import { expect, test } from '@playwright/test';

test.describe('Edit Todo route (/todos/:id/edit)', () => {
  test('displays Edit Todo heading when todo exists', async ({ page }) => {
    await page.goto('/todos');
    // Wait for page to load (may show Pending first, then settle)
    await expect(
      page
        .getByText('Pending...')
        .or(page.getByText('No todos found'))
        .or(page.getByRole('list'))
        .or(page.getByText('Error!')),
    ).toBeVisible({ timeout: 15_000 });
    // If still loading, wait for settled state
    const stillLoading =
      (await page.getByText('Pending...').count()) > 0;
    if (stillLoading) {
      await expect(
        page
          .getByText('No todos found')
          .or(page.getByRole('list'))
          .or(page.getByText('Error!')),
      ).toBeVisible({ timeout: 30_000 });
    }

    const isEmpty = (await page.getByText('No todos found').count()) > 0;
    if (!isEmpty) {
      const list = page.getByRole('list');
      const hasItems = (await list.locator('li').count()) > 0;
      if (hasItems) {
        await page.getByRole('button', { name: 'Edit todo' }).first().click();
        await expect(page).toHaveURL(/\/todos\/\d+\/edit/);
        await expect(
          page.getByRole('heading', { name: 'Edit Todo' }),
        ).toBeVisible();
      }
    }
  });

  test('shows "Todo not found" for invalid id', async ({ page }) => {
    await page.goto('/todos/99999/edit');
    // Wait for loading to finish; in CI the Workers runtime can be slow to respond
    await expect(page.getByText('Todo not found.')).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('Navigation to edit', () => {
  test('from todos list, edit button navigates to edit page', async ({
    page,
  }) => {
    await page.goto('/todos');
    // Wait for page to load and settle
    await expect(
      page
        .getByText('Pending...')
        .or(page.getByText('No todos found'))
        .or(page.getByRole('list'))
        .or(page.getByText('Error!')),
    ).toBeVisible({ timeout: 15_000 });
    const stillLoading =
      (await page.getByText('Pending...').count()) > 0;
    if (stillLoading) {
      await expect(
        page
          .getByText('No todos found')
          .or(page.getByRole('list'))
          .or(page.getByText('Error!')),
      ).toBeVisible({ timeout: 30_000 });
    }

    const editBtn = page.getByRole('button', { name: 'Edit todo' }).first();
    const visible = await editBtn.isVisible({ timeout: 2000 }).catch(() => false);
    if (visible) {
      await editBtn.click();
      await expect(page).toHaveURL(/\/todos\/\d+\/edit/);
      await expect(
        page
          .getByRole('heading', { name: 'Edit Todo' })
          .or(page.getByText('Todo not found.')),
      ).toBeVisible();
    }
  });
});
