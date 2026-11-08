import { expect, test } from './fixtures';

test.describe('home page', () => {
  test('renders the prerendered profile', async ({ page }) => {
    await page.goto('./');
    await expect(page).toHaveTitle(/Mahesh A/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('built to last');
    await expect(page.locator('#experience .role')).toHaveCount(4);
    await expect(page.locator('#experience .role.current')).toContainText('Randstad USA');
  });

  test('works with JavaScript disabled (prerendered HTML)', async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(baseURL!);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('#experience')).toContainText('Charter Communications');
    // Scroll-reveal must not hide content when JS is off.
    const opacity = await page.locator('#experience .role').first().evaluate(e => getComputedStyle(e).opacity);
    expect(opacity).toBe('1');
    await ctx.close();
  });

  test('has no horizontal overflow', async ({ page }) => {
    await page.goto('./');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('skip link is the first tab stop and moves focus to main', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard test');
    await page.goto('./');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });

  test('remembers the chosen theme across reloads', async ({ page }) => {
    await page.goto('./');
    const before = await page.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    await page.getByRole('button', { name: /Switch to (light|dark) theme/ }).click();
    const expected = before === 'dark' ? 'light' : 'dark';
    await expect(page.locator('html')).toHaveAttribute('data-theme', expected);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', expected);
  });

  test('skill filters narrow the list', async ({ page }) => {
    await page.goto('./');
    const chips = page.locator('#toolkit .chips li');
    const all = await chips.count();
    await page.getByRole('button', { name: /^Testing/ }).click();
    await expect(chips).toHaveCount(5);
    expect(all).toBeGreaterThan(5);
  });
});

test.describe('eras lab', () => {
  test('switches eras with the keyboard and runs the live counter', async ({ page, isMobile }) => {
    await page.goto('./#eras');
    const selected = page.locator('#eras [role=tab][aria-selected=true]');
    await expect(selected).toContainText('Zoneless');
    if (!isMobile) {
      await selected.focus();
      await page.keyboard.press('Home');
      await expect(page.locator('#eras [role=tab][aria-selected=true]')).toContainText('Server pages');
      await expect(page.locator('#eras pre')).toContainText("$('#inc')");
    }
    const demo = page.locator('#eras .demo');
    await demo.click();
    await demo.click();
    await expect(demo).toHaveText('2');
  });
});

test.describe('command palette', () => {
  test('opens with the keyboard and navigates', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard shortcut');
    await page.goto('./');
    await page.keyboard.press('Control+k');
    const dialog = page.getByRole('dialog', { name: 'Command menu' });
    await expect(dialog).toBeVisible();
    await page.keyboard.type('experience');
    await page.keyboard.press('Enter');
    await expect(dialog).toBeHidden();
    await expect(page.locator('#experience')).toBeInViewport();
  });

  test('menu button jumps to a section and returns focus', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('option', { name: 'Go to Toolkit & education' }).click();
    await expect(page.locator('#toolkit h2')).toBeInViewport();
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeFocused();
  });

  test('menu button opens it on touch devices', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Command menu' })).toBeVisible();
    await page.getByRole('option', { name: /How this site is built/ }).click();
    await expect(page).toHaveURL(/how-its-built/);
  });
});

test.describe('how it\'s built', () => {
  test('is reachable from the home page and shows live vitals', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('link', { name: "How it's built" }).last().click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('How this site is');
    await expect(page.locator('.vitals li').first()).not.toContainText('-');
  });

  test('deep links load directly', async ({ page }) => {
    await page.goto('./how-its-built/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('built');
    await expect(page.getByRole('heading', { name: 'Architecture decisions' })).toBeVisible();
  });
});
