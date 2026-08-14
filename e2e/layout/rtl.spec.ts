import { expect, test } from '@playwright/test';

/**
 * The registry is written in logical properties, so `dir="rtl"` has to mirror padding,
 * margins, borders and text alignment without a single physical override. Asserted on
 * computed styles: the class names are exactly what a markup test would have believed.
 */

/** Flip the document, then let Angular settle. */
async function rtl(page: import('@playwright/test').Page, path: string): Promise<void> {
  await page.goto(path);
  await page.evaluate(() => {
    document.documentElement.dir = 'rtl';
  });
}

test('blockquote indentation and rule flip', async ({ page }) => {
  await rtl(page, '/components/typography');
  const quote = page.locator('blockquote').first();
  await expect(quote).toBeVisible();

  const box = await quote.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
      borderLeftWidth: style.borderLeftWidth,
      borderRightWidth: style.borderRightWidth,
    };
  });
  expect(box.paddingRight).not.toBe('0px');
  expect(box.paddingLeft).toBe('0px');
  expect(box.borderRightWidth).not.toBe('0px');
  expect(box.borderLeftWidth).toBe('0px');
});

test('table headers align to the start of the line, not to the left', async ({ page }) => {
  await rtl(page, '/components/table');
  const header = page.locator('[data-slot="table-head"]').first();
  await expect(header).toBeVisible();

  // `text-align: start` is reported as-specified, so the class name proves nothing on its
  // own — measure where the glyphs actually landed instead.
  const gaps = await header.evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const text = range.getBoundingClientRect();
    const cell = el.getBoundingClientRect();
    return { start: cell.right - text.right, end: text.left - cell.left };
  });
  expect(gaps.start).toBeLessThan(gaps.end);
});

test('a directional chevron mirrors', async ({ page }) => {
  await rtl(page, '/components/breadcrumb');
  const separator = page.locator('[data-slot="breadcrumb-separator"] svg').first();
  await expect(separator).toBeVisible();
  // .blat-rtl-flip → scaleX(-1): the chevron points the way the text runs.
  expect(await separator.evaluate((el) => getComputedStyle(el).transform)).toBe(
    'matrix(-1, 0, 0, 1, 0, 0)',
  );
});
