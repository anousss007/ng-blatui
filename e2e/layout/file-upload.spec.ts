import { expect, type Page, test } from '@playwright/test';

/**
 * A drop and the `FileList` behind a file input are browser facts: jsdom has no `DataTransfer`
 * at all, so none of this can be asserted anywhere but here. Every check reads the *native
 * input*, which is what a plain `<form>` submits and what the next pick is diffed against.
 */

const ZONE = '[data-slot="file-upload"]';

/** The names the native input is actually holding, in order. */
const held = (page: Page, index = 0) =>
  page
    .locator(`${ZONE} input[type="file"]`)
    .nth(index)
    .evaluate((element: HTMLInputElement) => [...(element.files ?? [])].map((file) => file.name));

test.describe('file upload', () => {
  test('takes a dropped file, and the native input holds it', async ({ page }) => {
    await page.goto('/components/file-upload');
    const upload = page.locator(ZONE).first();
    const zone = upload.locator('label');

    const dataTransfer = await page.evaluateHandle(() => {
      const transfer = new DataTransfer();
      transfer.items.add(new File(['hello'], 'dropped.txt', { type: 'text/plain' }));
      return transfer;
    });
    await zone.dispatchEvent('dragover', { dataTransfer });
    await zone.dispatchEvent('drop', { dataTransfer });

    await expect(upload.getByText('dropped.txt')).toBeVisible();
    // The zone said "drag & drop" for its whole life while dropping did nothing but navigate
    // the browser to the file.
    expect(await held(page)).toEqual(['dropped.txt']);
  });

  test('removing a row takes the file off the input too', async ({ page }) => {
    await page.goto('/components/file-upload');
    const upload = page.locator(ZONE).first();

    await upload.locator('input[type="file"]').setInputFiles({
      name: 'notes.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(upload.getByText('notes.txt')).toBeVisible();
    expect(await held(page)).toEqual(['notes.txt']);

    await upload.getByRole('button', { name: 'Remove file' }).click();
    await expect(upload.locator('li')).toHaveCount(0);
    // Leave it on the input and the form still submits a file the user removed on screen.
    expect(await held(page)).toEqual([]);
  });

  test('a single-file field replaces its selection rather than stacking', async ({ page }) => {
    await page.goto('/components/file-upload');
    const upload = page.locator(ZONE).first();
    const input = upload.locator('input[type="file"]');

    await input.setInputFiles({
      name: 'first.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('1'),
    });
    await input.setInputFiles({
      name: 'second.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('2'),
    });

    await expect(upload.locator('li')).toHaveCount(1);
    expect(await held(page)).toEqual(['second.txt']);
  });

  test('a stored file renders as an ordinary row, thumbnail and all', async ({ page }) => {
    await page.goto('/components/file-upload');
    const stored = page.locator(ZONE).nth(3);
    const rows = stored.locator('li');
    await expect(rows).toHaveCount(2);

    await expect(rows.first()).toContainText('avatar.webp');
    await expect(rows.first()).toContainText('41.2 KB');
    // Really rendered, not merely an <img> tag in the markup.
    const thumbnail = rows.first().locator('img');
    await expect(thumbnail).toBeVisible();
    expect(
      await thumbnail.evaluate((element: HTMLImageElement) => element.naturalWidth),
    ).toBeGreaterThan(0);

    // The second is a PDF: the generic icon, no thumbnail.
    await expect(rows.nth(1)).toContainText('contract-2026.pdf');
    await expect(rows.nth(1).locator('img')).toHaveCount(0);

    // Removing a stored row is reported to the page, which owns the record and drops it.
    await rows.first().getByRole('button', { name: 'Remove file' }).click();
    await expect(stored.locator('li')).toHaveCount(1);
    await expect(stored.locator('li')).toContainText('contract-2026.pdf');
  });
});
