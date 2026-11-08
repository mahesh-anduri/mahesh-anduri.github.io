export type Rating = 'good' | 'needs-improvement' | 'poor';

export interface Vital {
  id: 'TTFB' | 'FCP' | 'LCP' | 'CLS' | 'INP';
  label: string;
  value: number | null;
  unit: 'ms' | '';
  /** [good ≤, poor >] — Core Web Vitals thresholds */
  thresholds: [number, number];
  hint: string;
}

export const VITALS: Omit<Vital, 'value'>[] = [
  { id: 'TTFB', label: 'Time to first byte', unit: 'ms', thresholds: [800, 1800], hint: 'Server / CDN response' },
  { id: 'FCP', label: 'First contentful paint', unit: 'ms', thresholds: [1800, 3000], hint: 'First pixels of content' },
  { id: 'LCP', label: 'Largest contentful paint', unit: 'ms', thresholds: [2500, 4000], hint: 'Main content visible' },
  { id: 'CLS', label: 'Cumulative layout shift', unit: '', thresholds: [0.1, 0.25], hint: 'Visual stability' },
  { id: 'INP', label: 'Interaction to next paint', unit: 'ms', thresholds: [200, 500], hint: 'Click / tap something' },
];

export function rate(value: number, [good, poor]: [number, number]): Rating {
  return value <= good ? 'good' : value <= poor ? 'needs-improvement' : 'poor';
}

export function formatVital(value: number, unit: Vital['unit']): string {
  return unit === 'ms' ? `${Math.round(value)} ms` : value.toFixed(3);
}

/**
 * Minimal, dependency-free Web Vitals collection with PerformanceObserver.
 * Reports values for the current page load as they become available.
 */
export function observeVitals(report: (id: Vital['id'], value: number) => void): () => void {
  const observers: PerformanceObserver[] = [];
  const watch = (type: string, cb: (list: PerformanceObserverEntryList) => void, opts: Record<string, unknown> = {}) => {
    try {
      const po = new PerformanceObserver(cb);
      po.observe({ type, buffered: true, ...opts } as PerformanceObserverInit);
      observers.push(po);
    } catch { /* entry type not supported in this browser */ }
  };

  const nav = performance.getEntriesByType('navigation')[0] as (PerformanceNavigationTiming & { activationStart?: number }) | undefined;
  if (nav) report('TTFB', Math.max(nav.responseStart - (nav.activationStart ?? 0), 0));

  watch('paint', list => {
    const fcp = list.getEntriesByName('first-contentful-paint')[0];
    if (fcp) report('FCP', fcp.startTime);
  });

  watch('largest-contentful-paint', list => {
    const entries = list.getEntries();
    const last = entries[entries.length - 1];
    if (last) report('LCP', last.startTime);
  });

  let cls = 0;
  report('CLS', 0);
  watch('layout-shift', list => {
    for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
      if (!e.hadRecentInput) cls += e.value;
    }
    report('CLS', cls);
  });

  let inp = 0;
  watch('event', list => {
    for (const e of list.getEntries() as (PerformanceEntry & { interactionId?: number })[]) {
      if (e.interactionId && e.duration > inp) {
        inp = e.duration;
        report('INP', inp);
      }
    }
  }, { durationThreshold: 16 });

  return () => observers.forEach(o => o.disconnect());
}
