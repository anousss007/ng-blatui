import { expect, test } from '@playwright/test';

/**
 * Smoke visual-regression baseline against the demo app. Real per-component
 * stories (states × light/dark) land here as components are ported from BlatUI.
 */
test.describe('visual regression', () => {
  test('demo home — light', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('home-light.png', { fullPage: true });
  });

  test('demo home — dark', async ({ page }) => {
    await page.goto('/');
    // BlatUI dark mode is class-based: `@custom-variant dark (&:is(.dark *))`
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await expect(page).toHaveScreenshot('home-dark.png', { fullPage: true });
  });
});
