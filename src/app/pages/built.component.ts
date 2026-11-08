import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../core/reveal.directive';
import { UiService } from '../core/ui.service';
import { VITALS, Vital, formatVital, observeVitals, rate } from '../core/web-vitals';
import { PROFILE } from '../data/profile';

/** Shape of build-report.json, written by CI on every deploy (scripts/build-report.mjs). */
export interface BuildReport {
  /** placeholder shipped in /public until CI writes the real report */
  pending?: boolean;
  generatedAt: string;
  commit: string;
  commitUrl?: string;
  runUrl?: string;
  lighthouse?: Record<string, Record<'performance' | 'accessibility' | 'bestPractices' | 'seo', number>>;
  axe?: { violations: number; pages: number };
  tests?: { unit?: { passed: number; total: number; coverage?: number }; e2e?: { passed: number; total: number } };
  bundle?: { initialKB: number; transferKB: number; budgetKB: number };
}

@Component({
  selector: 'app-built',
  imports: [RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-inspect': '<app-built>' },
  template: `
    <article class="wrap page">
      <header class="head">
        <p class="crumb mono"><a routerLink="/">Home</a> <span aria-hidden="true">/</span> How it's built</p>
        <h1>How this site is <em>built</em>.</h1>
        <p class="lede">
          A portfolio is a code sample. This one is held to the same bar as production work:
          measured, tested and accessible - with the evidence on this page.
        </p>
      </header>

      <!-- ── Live vitals ───────────────────────────── -->
      <section aria-labelledby="vitals-title" class="block">
        <div class="block-head">
          <h2 id="vitals-title"><span class="n mono">01</span>Measured in your browser, right now</h2>
          <p class="note">Core Web Vitals for this visit, collected with <code>PerformanceObserver</code>: no analytics, nothing sent anywhere.</p>
        </div>
        <ul class="vitals" aria-live="polite">
          @for (v of vitals(); track v.id) {
            <li [attr.data-rating]="v.rating">
              <span class="id mono">{{ v.id }}</span>
              <b>{{ v.display }}</b>
              <span class="lbl">{{ v.label }}</span>
              <span class="status mono">
                @if (v.rating) { <i aria-hidden="true"></i>{{ v.rating === 'needs-improvement' ? 'needs work' : v.rating }} }
                @else { {{ v.hint }} }
              </span>
            </li>
          }
        </ul>
      </section>

      <!-- ── CI report ─────────────────────────────── -->
      <section aria-labelledby="ci-title" class="block">
        <div class="block-head">
          <h2 id="ci-title"><span class="n mono">02</span>Verified on every deploy</h2>
          <p class="note">Each push runs unit tests, end-to-end tests, an automated accessibility audit and Lighthouse. A failing check blocks the release.</p>
        </div>

        @if (report(); as r) {
          <div class="ci">
            @for (s of scores(); track s.key) {
              <div class="gauge" [style.--v]="s.value" [attr.data-rating]="s.value >= 90 ? 'good' : s.value >= 50 ? 'needs-improvement' : 'poor'">
                <svg viewBox="0 0 36 36" aria-hidden="true"><circle class="bg" cx="18" cy="18" r="15.9"/><circle class="fg" cx="18" cy="18" r="15.9" pathLength="100"/></svg>
                <b>{{ s.value }}</b>
                <span>{{ s.label }}</span>
              </div>
            }
          </div>
          <dl class="facts">
            @if (r.tests?.unit; as u) { <div><dt>Unit tests</dt><dd>{{ u.passed }} / {{ u.total }} passing@if (u.coverage) { · {{ u.coverage }}% line coverage }</dd></div> }
            @if (r.tests?.e2e; as e) { <div><dt>End-to-end tests</dt><dd>{{ e.passed }} / {{ e.total }} passing</dd></div> }
            @if (r.axe; as a) { <div><dt>Accessibility audit (axe)</dt><dd>{{ a.violations }} violations · {{ a.pages }} pages × 2 themes</dd></div> }
            @if (r.bundle; as b) { <div><dt>Initial JS + CSS</dt><dd>{{ b.transferKB }} kB compressed · budget {{ b.budgetKB }} kB</dd></div> }
            <div>
              <dt>Last verified</dt>
              <dd>
                {{ r.generatedAt.slice(0, 10) }} ·
                @if (r.commitUrl) { <a [href]="r.commitUrl" target="_blank" rel="noopener" class="mono">{{ r.commit.slice(0, 7) }}</a> }
                @else { <span class="mono">{{ r.commit.slice(0, 7) }}</span> }
                @if (r.runUrl) { · <a [href]="r.runUrl" target="_blank" rel="noopener">CI run ↗</a> }
              </dd>
            </div>
          </dl>
        } @else {
          <div class="pending">
            <p class="mono">{{ reportState() === 'loading' ? 'Loading build report…' : 'No CI report yet (local build)' }}</p>
            <p>Scores appear here automatically after the first GitHub Actions deploy.</p>
          </div>
        }
      </section>

      <!-- ── Decisions ─────────────────────────────── -->
      <section aria-labelledby="dec-title" class="block">
        <div class="block-head">
          <h2 id="dec-title"><span class="n mono">03</span>Architecture decisions</h2>
          <p class="note">The trade-offs behind the code, the way I'd write them up for a team.</p>
        </div>
        <ol class="decisions">
          @for (d of decisions; track d.title; let i = $index) {
            <li appReveal>
              <h3>{{ d.title }}</h3>
              <p><span class="k mono">Why</span>{{ d.why }}</p>
              <p><span class="k mono">Trade-off</span>{{ d.tradeoff }}</p>
            </li>
          }
        </ol>
      </section>

      <!-- ── Practices ─────────────────────────────── -->
      <section aria-labelledby="a11y-title" class="block">
        <div class="block-head">
          <h2 id="a11y-title"><span class="n mono">04</span>Accessibility checklist</h2>
          <p class="note">Built in from the first component, then verified automatically.</p>
        </div>
        <ul class="checks">
          @for (c of checks; track c) { <li><i aria-hidden="true">✓</i>{{ c }}</li> }
        </ul>
      </section>

      <section aria-labelledby="try-title" class="block try">
        <h2 id="try-title" class="sr-only">Try it</h2>
        <p>Poke at it yourself:</p>
        <div class="ctas">
          <button type="button" class="btn" (click)="ui.toggleInspect()">{{ ui.inspect() ? 'Hide' : 'Show' }} component outlines</button>
          <button type="button" class="btn" (click)="ui.paletteOpen.set(true)">Open command menu</button>
          @if (p.sourceUrl) { <a class="btn primary" [href]="p.sourceUrl" target="_blank" rel="noopener">Read the source ↗</a> }
          @else { <a class="btn primary" routerLink="/">Back to portfolio</a> }
        </div>
      </section>
    </article>
  `,
  styles: `
    .page { padding-top: clamp(48px, 8vw, 96px); }
    .crumb { font-size: 13px; color: var(--ink-3); }
    .crumb a { color: var(--ink-2); }
    h1 { font-weight: 600; font-size: clamp(44px, 7.4vw, 92px); line-height: .98; letter-spacing: -.05em; margin: 18px 0 22px; max-width: 14ch; }
    h1 em { color: var(--signal); }
    .lede { font-size: clamp(18px, 1.9vw, 21px); color: var(--ink-2); max-width: 54ch; }

    .block { margin-top: clamp(64px, 9vw, 112px); }
    .block-head { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px 40px; align-items: end; padding-bottom: 16px; border-bottom: 1px solid var(--ink); margin-bottom: 26px; }
    h2 { font-weight: 600; font-size: clamp(24px, 3vw, 34px); letter-spacing: -.035em; line-height: 1.15; display: flex; gap: 14px; align-items: baseline; }
    h2 .n { font-size: 13px; color: var(--signal-text); font-weight: 500; letter-spacing: 0; }
    .note { color: var(--ink-2); font-size: 15.5px; }
    code { font: 500 .9em var(--f-mono); background: var(--sunken); padding: 1px 6px; border-radius: 5px; }
    @media (max-width: 760px) { .block-head { grid-template-columns: 1fr; } }

    .vitals { list-style: none; display: grid; grid-template-columns: repeat(5, 1fr); border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); overflow: hidden; }
    .vitals li { padding: 20px 18px; border-right: 1px solid var(--line); display: grid; gap: 4px; align-content: start; }
    .vitals li:last-child { border-right: 0; }
    .vitals .id { font-size: 12px; color: var(--ink-3); }
    .vitals b { font-weight: 600; font-size: clamp(24px, 2.6vw, 32px); letter-spacing: -.04em; }
    .vitals .lbl { font-size: 13.5px; color: var(--ink-2); }
    .status { font-size: 11.5px; color: var(--ink-3); display: inline-flex; gap: 6px; align-items: center; margin-top: 6px; text-transform: capitalize; }
    .status i { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
    [data-rating='good'] .status { color: var(--ok); }
    [data-rating='needs-improvement'] .status { color: var(--warn); }
    [data-rating='poor'] .status { color: var(--signal-text); }
    @media (max-width: 900px) {
      .vitals { grid-template-columns: 1fr 1fr; }
      .vitals li { border-bottom: 1px solid var(--line); }
      .vitals li:nth-child(2n) { border-right: 0; }
      .vitals li:last-child { grid-column: 1 / -1; border-bottom: 0; }
    }

    .ci { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .gauge { position: relative; display: grid; justify-items: center; gap: 10px; padding: 22px 12px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); }
    .gauge svg { width: 88px; height: 88px; transform: rotate(-90deg); }
    .gauge circle { fill: none; stroke-width: 2.6; }
    .gauge .bg { stroke: var(--sunken); }
    .gauge .fg { stroke: var(--ok); stroke-linecap: round; stroke-dasharray: calc(var(--v) * 1px) 100px; }
    [data-rating='needs-improvement'] .fg { stroke: var(--warn); }
    [data-rating='poor'] .fg { stroke: var(--signal); }
    .gauge b { position: absolute; top: 22px; height: 88px; display: grid; place-items: center; font-weight: 600; font-size: 26px; letter-spacing: -.04em; }
    .gauge span { font-size: 14px; color: var(--ink-2); }
    @media (max-width: 760px) { .ci { grid-template-columns: 1fr 1fr; } }
    .facts { margin-top: 18px; border-top: 1px solid var(--line); }
    .facts div { display: flex; justify-content: space-between; gap: 18px; padding: 13px 0; border-bottom: 1px solid var(--line); flex-wrap: wrap; }
    .facts dt { color: var(--ink-2); }
    .facts dd { font-weight: 500; }
    .pending { border: 1px dashed var(--line-strong); border-radius: var(--radius); padding: 28px; color: var(--ink-2); display: grid; gap: 6px; }
    .pending .mono { font-size: 13px; color: var(--ink-3); }

    .decisions { list-style: none; display: grid; grid-template-columns: repeat(2, 1fr); gap: 0 40px; counter-reset: d; }
    .decisions li { padding: 22px 0; border-bottom: 1px solid var(--line); }
    .decisions h3 { font-weight: 600; font-size: 19px; letter-spacing: -.02em; margin-bottom: 8px; }
    .decisions p { color: var(--ink-2); font-size: 15.5px; margin-top: 6px; }
    .k { display: inline-block; min-width: 82px; font-size: 11.5px; text-transform: uppercase; letter-spacing: .05em; color: var(--blue); }
    @media (max-width: 860px) { .decisions { grid-template-columns: 1fr; } }

    .checks { list-style: none; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 40px; }
    .checks li { display: flex; gap: 12px; align-items: baseline; padding: 10px 0; border-bottom: 1px solid var(--line); }
    .checks i { color: var(--ok); font-style: normal; font-weight: 600; }
    @media (max-width: 760px) { .checks { grid-template-columns: 1fr; } }

    .try { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 18px; padding: 28px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); }
    .try p { font-size: 18px; font-weight: 500; }
    .ctas { display: flex; flex-wrap: wrap; gap: 10px; }
  `,
})
export class BuiltComponent {
  readonly ui = inject(UiService);
  readonly p = PROFILE;
  private readonly doc = inject(DOCUMENT);

  private readonly values = signal<Partial<Record<Vital['id'], number>>>({});
  readonly vitals = computed(() => VITALS.map(v => {
    const value = this.values()[v.id];
    return {
      ...v,
      display: value === undefined ? '-' : formatVital(value, v.unit),
      rating: value === undefined ? null : rate(value, v.thresholds),
    };
  }));

  readonly report = signal<BuildReport | null>(null);
  readonly reportState = signal<'loading' | 'missing' | 'ok'>('loading');
  readonly scores = computed(() => {
    const lh = this.report()?.lighthouse;
    if (!lh) return [];
    const pages = Object.values(lh);
    const min = (k: 'performance' | 'accessibility' | 'bestPractices' | 'seo') => Math.min(...pages.map(p => p[k]));
    return [
      { key: 'perf', label: 'Performance', value: min('performance') },
      { key: 'a11y', label: 'Accessibility', value: min('accessibility') },
      { key: 'bp', label: 'Best practices', value: min('bestPractices') },
      { key: 'seo', label: 'SEO', value: min('seo') },
    ];
  });

  readonly decisions = [
    {
      title: 'Standalone components + signals',
      why: 'Each section declares its own dependencies; state is plain signals and computed values, so data flow reads top-to-bottom.',
      tradeoff: 'Signals replace RxJS for local UI state; RxJS stays where streams genuinely help (router events).',
    },
    {
      title: 'Zoneless change detection',
      why: 'No zone.js in the bundle and no monkey-patched browser APIs. Signals tell Angular exactly what changed.',
      tradeoff: 'Every component must be OnPush-safe: enforced here by using signals for all mutable state.',
    },
    {
      title: 'Static prerendering + hydration',
      why: 'Every route ships as real HTML: fast first paint, crawlable, readable with JavaScript off. Hydration reuses the DOM instead of re-rendering.',
      tradeoff: 'Browser-only code (observers, timers) runs in afterNextRender, never during prerender.',
    },
    {
      title: 'Content as data',
      why: 'All copy lives in one typed file. Sections appear when their data exists, so updating the portfolio never touches component code.',
      tradeoff: 'A CMS would allow non-developer edits; not worth the moving parts for a personal site.',
    },
    {
      title: 'Design tokens, no UI library',
      why: 'A small set of CSS custom properties drives both themes. Component styles are encapsulated and stay under a 10 kB budget each.',
      tradeoff: 'More hand-written CSS than a component kit - in exchange for a distinctive look and a tiny bundle.',
    },
    {
      title: 'Progressive enhancement for motion',
      why: 'Animations only switch on when JavaScript runs and the visitor hasn’t asked for reduced motion. Content is never hidden behind them.',
      tradeoff: 'Slightly more CSS to cover both states.',
    },
  ];

  readonly checks = [
    'Semantic landmarks: header, nav, main, footer',
    'Skip link to main content',
    'Visible focus styles on every interactive element',
    'Full keyboard support, incl. ⌘K palette and arrow-key tabs',
    'WAI-ARIA patterns: dialog, combobox/listbox, tablist',
    'Text and UI contrast checked in both themes',
    'prefers-reduced-motion respected everywhere',
    'prefers-color-scheme respected, choice remembered',
    'Live regions announce toasts and filter results',
    'Automated axe audit in CI blocks regressions',
  ];

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const stop = observeVitals((id, value) => this.values.update(v => ({ ...v, [id]: value })));
      destroyRef.onDestroy(stop);

      fetch(new URL('build-report.json', this.doc.baseURI), { cache: 'no-cache' })
        .then(r => (r.ok ? r.json() : Promise.reject()))
        .then((r: BuildReport) => {
          if (r.pending) { this.reportState.set('missing'); return; }
          this.report.set(r);
          this.reportState.set('ok');
        })
        .catch(() => this.reportState.set('missing'));
    });
  }
}
