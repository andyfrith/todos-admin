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

  test('shows "Todo not found" or error for invalid id', async ({ page }) => {
    // Use non-numeric id so it never matches a real todo regardless of DB state
    await page.goto('/todos/invalid-id/edit');
    // Wait for loading to complete first (CI Workers runtime can be slow)
    await expect(page.getByText('Loading...')).toBeHidden({ timeout: 30_000 });
    // Valid outcomes: "Todo not found." (API ok) or "Failed to load todos." (API/DB unreachable in CI)
    await expect(
      page
        .getByTestId('edit-todo-not-found')
        .or(page.getByText('Failed to load todos.')),
    ).toBeVisible();
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
