import { VITALS, formatVital, rate } from './web-vitals';

describe('web vitals', () => {
  const lcp = VITALS.find(v => v.id === 'LCP')!;
  const cls = VITALS.find(v => v.id === 'CLS')!;

  it('rates values against Core Web Vitals thresholds (inclusive)', () => {
    expect(rate(2500, lcp.thresholds)).toBe('good');
    expect(rate(2501, lcp.thresholds)).toBe('needs-improvement');
    expect(rate(4001, lcp.thresholds)).toBe('poor');
    expect(rate(0.1, cls.thresholds)).toBe('good');
    expect(rate(0.3, cls.thresholds)).toBe('poor');
  });

  it('formats milliseconds and unitless scores', () => {
    expect(formatVital(1234.6, 'ms')).toBe('1235 ms');
    expect(formatVital(0.04567, '')).toBe('0.046');
  });
});
