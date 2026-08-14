import { defineConfig, devices } from '@playwright/test';

const PORT = 4300;

/**
 * Browser config. Runs the demo app and drives it in a real Chromium:
 *   e2e/visual  — screenshots against a committed baseline.
 *   e2e/layout  — baseline-free invariants (nothing off-screen, nothing clipped, RTL
 *                 mirrored), asserted on computed state. This is the layer that catches
 *                 *looks broken* rather than *looks different*, and the one a markup
 *                 test is blind to.
 * (Storybook will become the per-component visual surface once it supports Angular 22.)
 */
export default defineConfig({
  testDir: './e2e',
  // Pinned rather than derived from {testDir}: widening testDir to ./e2e would otherwise
  // move every baseline, and a missing baseline is written on the spot — so the visual
  // suite would have gone green against snapshots it had just taken of itself.
  snapshotPathTemplate: './e2e/visual/__screenshots__/{testFileName}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'html',
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    },
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: `npx ng serve demo --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
