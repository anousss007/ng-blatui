import { expect, type Page, test } from '@playwright/test';

/**
 * The docs site formats through `provideBuiLocale(() => inject(DemoLocale).locale)` in its own
 * `app.config.ts`, so this drives the real provider end to end: nothing on the page carries a
 * `locale` input, and switching the store's signal has to reformat what is already rendered.
 */

async function pick(page: Page, label: string): Promise<void> {
  await page.getByRole('combobox', { name: 'Locale for the live example' }).click();
  await page.getByRole('option', { name: label }).click();
}

test.describe('localization', () => {
  test('switching the provided locale reformats what is already on screen', async ({ page }) => {
    await page.goto('/docs/localization');
    const trigger = page.locator('[data-slot="date-picker"] button').first();
    await expect(trigger).toContainText('Jun 15, 2026');

    await pick(page, 'Français (Belgique) — fr-BE');
    await expect(trigger).toContainText('15 juin 2026');

    await pick(page, 'Deutsch — de-DE');
    await expect(trigger).toContainText('15. Juni 2026');
  });

  test("the calendar follows the locale's own week conventions", async ({ page }) => {
    await page.goto('/docs/localization');
    const weekdays = page.locator('[data-slot="calendar"] thead th');
    // en-US starts the week on Sunday; the first column is the week-number gutter.
    await expect(weekdays.nth(1)).toHaveText(/^\s*Sun/);

    await pick(page, 'Français (Belgique) — fr-BE');
    await expect(weekdays.nth(1)).toHaveText(/^\s*lun/);
  });

  test('leaving the page puts the site back to English', async ({ page }) => {
    await page.goto('/docs/localization');
    await pick(page, 'Français (Belgique) — fr-BE');
    await expect(page.locator('[data-slot="date-picker"] button').first()).toContainText('juin');

    await page.goto('/components/date-picker');
    await expect(page.locator('[data-slot="date-picker"] button').first()).not.toContainText(
      'juin',
    );
  });
});
