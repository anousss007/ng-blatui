import { expect, test } from '@playwright/test';

/**
 * Layout invariants, asserted on computed state in a real browser. These are the shapes
 * markup tests cannot see: a panel wider than the viewport, a region that clips the
 * content it was supposed to scroll.
 */

const NARROW = { width: 320, height: 640 };

test.describe('no sideways page scroll on the narrowest phone', () => {
  test.use({ viewport: NARROW });

  for (const [slug, role] of [
    ['mini-cart', 'dialog'],
    ['notification-center', 'region'],
  ]) {
    test(`${slug} panel stays inside a 320px viewport`, async ({ page }) => {
      await page.goto(`/components/${slug}`);
      // Both examples render with the panel already open, portalled into the CDK overlay.
      const panel = page.locator(`.cdk-overlay-container [role="${role}"]`).first();
      await expect(panel).toBeVisible();

      // The panel is `w-80` — exactly 320px — and anchored to the end edge, so uncapped it
      // hangs off the *start* edge of the phone rather than widening the page: no scrollbar
      // appears, the content is simply unreachable. Assert the box, then the page.
      const box = (await panel.boundingBox())!;
      const viewport = page.viewportSize()!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    });
  }
});

test('the sidebar scrolls instead of clipping an overflowing menu', async ({ page }) => {
  await page.goto('/components/sidebar');
  const sidebar = page.locator('[data-slot="sidebar"]').first();
  await expect(sidebar).toBeVisible();

  const axes = await sidebar.evaluate((el) => {
    const style = getComputedStyle(el);
    return { x: style.overflowX, y: style.overflowY };
  });
  expect(axes.x).toBe('hidden');
  expect(['auto', 'scroll']).toContain(axes.y);

  // Give it more items than it has room for, the way a real app's nav does.
  const reachable = await sidebar.evaluate((el) => {
    for (let index = 0; index < 30; index++) {
      const item = document.createElement('a');
      item.textContent = `Item ${index}`;
      item.className = 'block shrink-0 py-2';
      el.append(item);
    }
    const overflowing = el.scrollHeight > el.clientHeight;
    el.scrollTop = el.scrollHeight;
    return { overflowing, scrolled: el.scrollTop > 0 };
  });
  expect(reachable.overflowing).toBe(true);
  expect(reachable.scrolled).toBe(true);
});
