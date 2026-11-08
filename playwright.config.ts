import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end + accessibility tests against the production build,
 * served the way GitHub Pages serves it (optionally under a sub-path via BASE).
 */
const BASE = (process.env.BASE || '/').replace(/\/?$/, '/');
const PORT = Number(process.env.E2E_PORT || 4300);

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['json', { outputFile: 'test-results/e2e.json' }], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}${BASE}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `node scripts/serve.mjs ${PORT}`,
    url: `http://localhost:${PORT}${BASE}`,
    reuseExistingServer: !process.env.CI,
    env: { BASE },
  },
});
