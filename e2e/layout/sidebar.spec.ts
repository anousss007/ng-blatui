import { expect, test } from '@playwright/test';

/**
 * The sidebar has produced most of the escapes upstream, all of them invisible to markup:
 * a rail that could not scroll, a tooltip that never opened. Drive it for real.
 */

test('the icon rail labels its buttons on hover, and only while collapsed', async ({ page }) => {
  await page.goto('/components/sidebar');
  const rail = page.locator('bui-sidebar-provider bui-sidebar');
  await expect(rail).toBeVisible();
  const item = rail.locator('[data-slot="sidebar-menu-button"]').first();
  const tooltip = page.locator('.cdk-overlay-container [role="tooltip"]');

  // Expanded: the label sits next to the icon, so a tooltip would only repeat it.
  await item.hover();
  await expect(tooltip).toHaveCount(0);

  await page.locator('[data-slot="sidebar-trigger"]').click();
  await expect(rail).toHaveAttribute('data-state', 'collapsed');

  // Collapsed: nothing but an icon is visible, so the label has to come back on hover.
  await page.mouse.move(0, 0);
  await item.hover();
  await expect(tooltip).toHaveText('Inbox');
});

test('the AdminCN shell nav scrolls its own region', async ({ page }) => {
  await page.goto('/templates/admincn');
  const nav = page.locator('[data-slot="sidebar-content"]').first();
  await expect(nav).toBeVisible();

  const scrolling = await nav.evaluate((el) => {
    const style = getComputedStyle(el);
    el.scrollTop = el.scrollHeight;
    return { y: style.overflowY, overflowing: el.scrollHeight > el.clientHeight, at: el.scrollTop };
  });
  expect(scrolling.y).toBe('auto');
  if (scrolling.overflowing) {
    expect(scrolling.at).toBeGreaterThan(0);
  }
});
