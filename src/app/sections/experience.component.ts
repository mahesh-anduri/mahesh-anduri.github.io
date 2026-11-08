import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RevealDirective } from '../core/reveal.directive';
import { duration, formatMonth, monthIndex, nowMonthIndex } from '../core/dates';
import { ROLES } from '../data/profile';
import { SectionHeadComponent } from './section-head.component';

@Component({
  selector: 'app-experience',
  imports: [SectionHeadComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-inspect': '<app-experience>' },
  template: `
    <section class="section" id="experience" aria-labelledby="exp-title">
      <div class="wrap">
        <app-section-head [index]="index()" label="Experience" titleId="exp-title" [aside]="span().from + ' - today'">
          A decade of <em>shipping</em>.
        </app-section-head>

        <figure class="career" appReveal>
          <figcaption class="sr-only">Career timeline: {{ srSummary() }}</figcaption>
          <div class="axis" aria-hidden="true">
            @for (y of span().years; track y.label) {
              <span [style.left.%]="y.left">{{ y.label }}</span>
            }
          </div>
          <div class="track" aria-hidden="true">
            @for (s of segments(); track s.company) {
              <span class="seg" [class.now]="s.current" [style.left.%]="s.left" [style.width.%]="s.width" [style.--c]="s.color">
                <b>{{ s.company }}</b>
              </span>
            }
          </div>
        </figure>

        <ol class="roles">
          @for (r of rows(); track r.company + r.start; let i = $index) {
            <li class="role" [class.current]="!r.end" appReveal>
              <div class="when">
                <span>{{ r.from }} - {{ r.to }}</span>
                <span class="dur">{{ r.dur }}</span>
              </div>
              <div class="what">
                <h3>
                  {{ r.title }}
                  @if (!r.end) { <span class="now"><i aria-hidden="true"></i>Current</span> }
                </h3>
                <p class="co">
                  <span class="mark" [style.background]="r.color" aria-hidden="true">{{ r.short }}</span>
                  {{ r.company }}
                </p>
                @if (r.highlights.length) {
                  <ul class="hl">
                    @for (h of r.highlights; track h) { <li>{{ h }}</li> }
                  </ul>
                }
                @if (r.stack.length) {
                  <ul class="stack" aria-label="Stack">
                    @for (t of r.stack; track t) { <li class="tag">{{ t }}</li> }
                  </ul>
                }
              </div>
              <ul class="meta" aria-label="Details">
                <li>{{ r.type }}</li>
                <li>{{ r.location }}</li>
                @if (r.mode) { <li>{{ r.mode }}</li> }
              </ul>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    .career { margin: 0 0 clamp(36px, 5vw, 56px); }
    .axis { position: relative; height: 22px; font: 500 11.5px var(--f-mono); color: var(--ink-3); }
    .axis span { position: absolute; transform: translateX(-50%); }
    .axis span:first-child { transform: none; }
    .track { position: relative; height: 46px; border-radius: 8px; background: var(--sunken); overflow: hidden; }
    html.js .track { clip-path: inset(0 100% 0 0); transition: clip-path 1.6s cubic-bezier(.65, 0, .35, 1) .15s; }
    html.js .career.in .track { clip-path: inset(0 0 0 0); }
    .seg { position: absolute; top: 0; bottom: 0; background: var(--c); border-right: 2px solid var(--paper); display: flex; align-items: center; padding: 0 10px; overflow: hidden; }
    .seg b { font: 500 12px var(--f-mono); color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .seg.now { background: var(--signal); }
    .seg.now b { color: #121211; }
    .seg.now::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent); animation: sweep 2.8s ease-in-out infinite; }
    @keyframes sweep { from { transform: translateX(-100%); } to { transform: translateX(100%); } }

    .roles { list-style: none; border-top: 1px solid var(--ink); }
    .role { display: grid; grid-template-columns: 200px minmax(0, 1fr) 190px; gap: 10px 32px; padding: 30px 0; border-bottom: 1px solid var(--line); }
    .when { display: grid; gap: 8px; align-content: start; font: 500 13px var(--f-mono); color: var(--ink-2); padding-top: 5px; }
    .dur { justify-self: start; padding: 2px 9px; border-radius: 6px; background: var(--sunken); color: var(--ink); font-size: 12px; }
    .role.current .dur { background: var(--signal-soft); color: var(--signal-text); }
    h3 { font-weight: 600; font-size: clamp(21px, 2.4vw, 28px); letter-spacing: -.03em; line-height: 1.2; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; }
    .now { display: inline-flex; align-items: center; gap: 6px; font: 500 11.5px var(--f-mono); color: var(--ok); padding: 3px 9px; border: 1px solid currentColor; border-radius: 999px; letter-spacing: 0; }
    .now i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
    .co { display: flex; align-items: center; gap: 10px; margin-top: 10px; font-weight: 500; color: var(--ink-2); }
    .mark { width: 26px; height: 26px; border-radius: 7px; display: grid; place-items: center; color: #fff; font: 600 11px var(--f-sans); letter-spacing: -.02em; }
    .hl { margin: 16px 0 0 18px; color: var(--ink-2); display: grid; gap: 6px; }
    .hl li::marker { color: var(--signal); }
    .stack { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
    .meta { list-style: none; font: 500 12.5px var(--f-mono); color: var(--ink-3); text-align: right; display: grid; gap: 4px; align-content: start; padding-top: 5px; }
    @media (max-width: 900px) {
      .role { grid-template-columns: 1fr; gap: 12px; padding: 26px 0; }
      .when { grid-auto-flow: column; justify-content: start; align-items: center; gap: 12px; padding: 0; }
      .meta { text-align: left; grid-auto-flow: column; justify-content: start; gap: 14px; padding: 0; }
      .meta li + li::before { content: '·'; margin-right: 14px; }
    }
    @media (max-width: 600px) { .seg b { display: none; } .track { height: 28px; } }
  `,
})
export class ExperienceComponent {
  readonly index = input.required<string>();
  private readonly roles = ROLES;

  readonly rows = computed(() => this.roles.map(r => ({
    ...r,
    from: formatMonth(r.start),
    to: r.end ? formatMonth(r.end) : 'Present',
    dur: duration(r.start, r.end),
  })));

  /** Timeline bounds: from the first role's January to now. */
  readonly span = computed(() => {
    const firstYear = Math.min(...this.roles.map(r => +r.start.slice(0, 4)));
    const start = firstYear * 12;
    const end = nowMonthIndex() + 1;
    const total = end - start;
    const lastYear = new Date().getFullYear();
    const years = [];
    for (let y = firstYear; y <= lastYear; y += (lastYear - firstYear > 6 ? 2 : 1)) {
      years.push({ label: String(y), left: ((y * 12 - start) / total) * 100 });
    }
    return { start, total, from: String(firstYear), years };
  });

  readonly segments = computed(() => {
    const { start, total } = this.span();
    return this.roles.map(r => {
      const s = monthIndex(r.start);
      const e = (r.end ? monthIndex(r.end) : nowMonthIndex()) + 1;
      return { company: r.company, color: r.color, current: !r.end, left: ((s - start) / total) * 100, width: ((e - s) / total) * 100 };
    });
  });

  readonly srSummary = computed(() => [...this.rows()].reverse().map(r => `${r.company} ${r.from} to ${r.to}`).join('; '));
}
