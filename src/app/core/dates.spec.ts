import { duration, formatMonth, monthIndex } from './dates';

describe('dates', () => {
  it('formats YYYY-MM as a short month and year', () => {
    expect(formatMonth('2019-08')).toBe('Aug 2019');
    expect(formatMonth('2025-12')).toBe('Dec 2025');
  });

  it('computes inclusive durations the way LinkedIn displays them', () => {
    expect(duration('2019-08', '2025-09')).toBe('6 yrs 2 mos');
    expect(duration('2018-11', '2019-07')).toBe('9 mos');
    expect(duration('2017-03', '2018-09')).toBe('1 yr 7 mos');
    expect(duration('2020-01', '2020-01')).toBe('1 mo');
  });

  it('counts an open-ended role up to "now"', () => {
    const now = new Date(2026, 10, 15); // Nov 2026
    expect(duration('2025-10', undefined, now)).toBe('1 yr 2 mos');
  });

  it('orders months correctly across year boundaries', () => {
    expect(monthIndex('2019-01') - monthIndex('2018-12')).toBe(1);
  });
});
