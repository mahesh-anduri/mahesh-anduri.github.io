import { test as base, expect } from '@playwright/test';

/** Fails a test on any console error, uncaught exception or failed request. */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => {
      if (m.type() === 'error') errors.push(m.text());
    });
    page.on('response', r => {
      if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
    });
    await use(errors);
    expect(errors, 'console errors / failed requests').toEqual([]);
  }, { auto: true }],
});

export { expect };
