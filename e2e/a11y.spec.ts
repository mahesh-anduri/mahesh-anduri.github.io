import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

/** WCAG 2.2 AA automated audit on every page, in both themes. Any violation fails CI. */
const PAGES = [
  { name: 'home', path: './' },
  { name: 'how it\'s built', path: './how-its-built/' },
];

for (const theme of ['light', 'dark'] as const) {
  for (const p of PAGES) {
    test(`${p.name} has no axe violations (${theme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto(p.path);
      await page.waitForLoadState('networkidle');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();
      const summary = results.violations.map(v => `${v.id} (${v.impact}): ${v.nodes.length}× - ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')}`);
      expect(summary).toEqual([]);
    });
  }
}
