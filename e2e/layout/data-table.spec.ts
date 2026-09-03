import { expect, test } from '@playwright/test';

/**
 * The toolbar row and the column-visibility menu, driven in a real browser: the row's presence
 * is a computed `display`, and a hidden column has to be *absent from the DOM* rather than
 * merely invisible — that is the whole point of filtering the columns rather than the CSS.
 */

const TABLE = '[data-slot="data-table"]';

test.describe('data table toolbar', () => {
  test('the toolbar row is on screen and carries the projected content', async ({ page }) => {
    await page.goto('/components/data-table');
    const toolbar = page.locator('[data-slot="data-table-toolbar"]');
    await expect(toolbar).toBeVisible();

    // The row itself, reached through the content it is carrying.
    const row = toolbar.locator('xpath=..');
    await expect(row).toHaveCSS('display', 'flex');
    await expect(row).toContainText('Export');
  });

  test('the first table draws no toolbar controls it was not given', async ({ page }) => {
    await page.goto('/components/data-table');
    const basic = page.locator(TABLE).first();
    await expect(basic.getByRole('button', { name: 'Columns' })).toHaveCount(0);
    await expect(basic.locator('select')).toHaveCount(0);
  });

  test('the page-size select re-pages the rows', async ({ page }) => {
    await page.goto('/components/data-table');
    const table = page.locator(TABLE).nth(1);
    await expect(table.locator('tbody tr')).toHaveCount(5);

    await table.locator('select').selectOption('10');
    await expect(table.locator('tbody tr')).toHaveCount(7); // every row the demo has
  });

  test('hiding a column removes its cells, and a non-hideable one stays', async ({ page }) => {
    await page.goto('/components/data-table');
    const table = page.locator(TABLE).nth(1);
    // Three columns plus the row-selection checkbox.
    await expect(table.locator('thead th')).toHaveCount(4);

    await table.getByRole('button', { name: 'Columns' }).click();
    const menu = page.getByRole('group', { name: 'Columns' });
    await expect(menu).toBeVisible();

    // `hideable: false` keeps Name out of the menu entirely — a row is unreadable without it.
    await expect(menu.getByRole('checkbox')).toHaveCount(2);
    await expect(menu).not.toContainText('Name');

    await menu.getByLabel('Email').uncheck();
    await expect(table.locator('thead th')).toHaveCount(3);
    await expect(table.locator('tbody')).not.toContainText('ada@example.com');
    await expect(table.locator('tbody')).toContainText('Ada Lovelace');

    // The menu closes on an outside press and the choice survives it.
    await page.mouse.click(5, 5);
    await expect(menu).toHaveCount(0);
    await expect(table.locator('thead th')).toHaveCount(3);
  });
});
