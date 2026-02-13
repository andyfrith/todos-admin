import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Opens the app's sidebar navigation (mobile menu) so nav links are visible.
 * Use before navigating via sidebar (e.g. get link href and goto).
 */
export async function openNav(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('heading', { name: 'Navigation' }).waitFor({ state: 'visible' });
}

/**
 * Clicks a sidebar link by href to avoid viewport issues with the fixed overlay.
 * Call after openNav(page). Verifies the link exists then navigates.
 */
export async function clickNavLink(page: Page, name: string): Promise<void> {
  const link = page.getByRole('link', { name }).first();
  await expect(link).toBeVisible();
  const href = await link.getAttribute('href');
  if (href) await page.goto(href);
}
