import { expect, test } from '@playwright/test';

/**
 * A tooltip opens on hover and on *keyboard* focus. The distinction only exists in a real
 * browser — jsdom answers `:focus-visible` for any focus, and no unit test can produce the
 * focus a closing dialog restores. Everything here is asserted on what is on screen after a
 * real pointer and a real dialog round trip.
 */
test.describe('tooltip ↔ overlay hand-off', () => {
  test('a tooltip does not come back when the dialog it opened restores focus', async ({
    page,
  }) => {
    await page.goto('/components/tooltip');
    const trigger = page.getByRole('button', { name: 'Delete row' });

    await trigger.hover();
    await expect(page.getByRole('tooltip')).toHaveText('Remove this row');

    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // The pointer moves on while the dialog is up, so `mouseleave` is spent: nothing else is
    // coming to take a tooltip down after this point.
    await page.mouse.move(0, 0);
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toHaveCount(0);

    // Focus returns to the control that opened the dialog — required for keyboard users — and
    // no tooltip rides back with it. A stuck one would sit over the neighbouring action and
    // swallow its clicks.
    await expect(trigger).toBeFocused();
    await expect(page.getByRole('tooltip')).toHaveCount(0);
  });

  test('a keyboard user still gets the tooltip', async ({ page }) => {
    await page.goto('/components/tooltip');
    const trigger = page.getByRole('button', { name: 'Edit row' });

    await page.getByRole('button', { name: 'Hover me' }).first().focus();
    for (let tabs = 0; tabs < 40; tabs++) {
      await page.keyboard.press('Tab');
      if (await trigger.evaluate((element) => element === document.activeElement)) {
        break;
      }
    }
    await expect(trigger).toBeFocused();
    await expect(page.getByRole('tooltip')).toHaveText('Rename this row');
  });
});
