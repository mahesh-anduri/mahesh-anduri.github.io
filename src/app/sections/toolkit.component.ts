import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RevealDirective } from '../core/reveal.directive';
import { EDUCATION, SKILLS } from '../data/profile';
import { SectionHeadComponent } from './section-head.component';

interface Skill { name: string; category: string; core: boolean; }

@Component({
  selector: 'app-toolkit',
  imports: [SectionHeadComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-inspect': '<app-toolkit>' },
  template: `
    <section class="section" id="toolkit" aria-labelledby="tk-title">
      <div class="wrap">
        <app-section-head [index]="index()" label="Toolkit" titleId="tk-title" [aside]="all.length + ' technologies'">
          The stack, <em>end to end</em>.
        </app-section-head>

        <div class="filters" role="group" aria-label="Filter technologies by layer" appReveal>
          @for (c of categories; track c) {
            <button type="button" [attr.aria-pressed]="selected() === c" (click)="selected.set(c)">
              {{ c }}<span>{{ count(c) }}</span>
            </button>
          }
        </div>

        <ul class="chips" aria-live="polite" [attr.aria-label]="selected() + ' technologies'">
          @for (s of visible(); track s.name; let i = $index) {
            <li [class.core]="s.core" [style.animation-delay.ms]="i * 14">
              {{ s.name }}
              @if (s.core) { <span class="sr-only">(core skill)</span> }
            </li>
          }
        </ul>
        <p class="legend"><i aria-hidden="true"></i>Core skill</p>

        <div class="edu" aria-labelledby="edu-title">
          <h3 id="edu-title" class="edu-title" appReveal>Education</h3>
          <ul>
            @for (e of education; track e.degree) {
              <li appReveal>
                <span class="period">{{ e.period }}</span>
                <span class="deg">{{ e.degree }}</span>
                <span class="school">{{ e.school }}</span>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: `
    .filters { display: flex; flex-wrap: wrap; gap: 6px; padding: 5px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); width: fit-content; max-width: 100%; }
    .filters button { height: 38px; padding: 0 14px; border: 0; border-radius: 8px; background: transparent; color: var(--ink-2); font-size: 14.5px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: background .2s, color .2s; }
    .filters button span { font: 500 11px var(--f-mono); color: var(--ink-3); }
    .filters button:hover { color: var(--ink); }
    .filters button[aria-pressed='true'] { background: var(--ink); color: var(--paper); }
    .filters button[aria-pressed='true'] span { color: inherit; opacity: .6; }

    .chips { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 26px; min-height: 140px; align-content: flex-start; }
    .chips li { display: inline-flex; align-items: center; gap: 9px; height: 42px; padding: 0 16px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); font-size: 15px; font-weight: 500; animation: pop .4s var(--ease) both; }
    .chips li::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--line-strong); }
    .chips li.core { border-color: var(--ink); }
    .chips li.core::before { background: var(--signal); }
    @keyframes pop { from { opacity: 0; transform: translateY(6px); } }
    .legend { margin-top: 16px; font: 500 12px var(--f-mono); color: var(--ink-3); display: flex; align-items: center; gap: 8px; }
    .legend i { width: 6px; height: 6px; border-radius: 50%; background: var(--signal); }

    .edu { margin-top: clamp(56px, 8vw, 96px); }
    .edu-title { font: 500 12.5px var(--f-mono); text-transform: uppercase; letter-spacing: .06em; color: var(--ink-2); padding-bottom: 14px; border-bottom: 1px solid var(--ink); }
    .edu ul { list-style: none; }
    .edu li { display: grid; grid-template-columns: 200px minmax(0, 1fr) minmax(0, 1fr); gap: 6px 32px; padding: 22px 0; border-bottom: 1px solid var(--line); align-items: baseline; }
    .period { font: 500 13px var(--f-mono); color: var(--ink-2); }
    .deg { font-weight: 600; font-size: 19px; letter-spacing: -.02em; }
    .school { color: var(--ink-2); }
    @media (max-width: 900px) { .edu li { grid-template-columns: 1fr; } }
  `,
})
export class ToolkitComponent {
  readonly index = input.required<string>();
  readonly education = EDUCATION;
  readonly categories = ['All', ...Object.keys(SKILLS)];
  readonly all: Skill[] = Object.entries(SKILLS).flatMap(([category, list]) =>
    list.map(raw => ({ category, name: raw.replace(/\*$/, ''), core: raw.endsWith('*') })));

  readonly selected = signal('All');
  readonly visible = computed(() => {
    const c = this.selected();
    return c === 'All' ? [...this.all].sort((a, b) => Number(b.core) - Number(a.core)) : this.all.filter(s => s.category === c);
  });

  count(c: string): number {
    return c === 'All' ? this.all.length : SKILLS[c].length;
  }
}
