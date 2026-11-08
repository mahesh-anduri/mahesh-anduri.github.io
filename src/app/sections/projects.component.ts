import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from '../core/reveal.directive';
import { PROJECTS } from '../data/profile';
import { SectionHeadComponent } from './section-head.component';

/** Case studies. Rendered only when PROJECTS has entries (see data/profile.ts). */
@Component({
  selector: 'app-projects',
  imports: [SectionHeadComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-inspect': '<app-projects>' },
  template: `
    <section class="section" id="work" aria-labelledby="work-title">
      <div class="wrap">
        <app-section-head [index]="index()" label="Selected work" titleId="work-title" [aside]="items.length + ' case studies'">
          Problems, <em>solved</em>.
        </app-section-head>

        <div class="list">
          @for (p of items; track p.title; let i = $index) {
            <article class="case" appReveal>
              <header>
                <span class="n">{{ (i + 1).toString().padStart(2, '0') }}</span>
                <div>
                  <p class="ctx">{{ p.context }}</p>
                  <h3>{{ p.title }}</h3>
                  <p class="sum">{{ p.summary }}</p>
                </div>
              </header>
              <dl class="body">
                <div><dt>Problem</dt><dd>{{ p.problem }}</dd></div>
                <div><dt>Approach</dt><dd>{{ p.approach }}</dd></div>
                <div>
                  <dt>Impact</dt>
                  <dd><ul class="impact">@for (m of p.impact; track m) { <li>{{ m }}</li> }</ul></dd>
                </div>
              </dl>
              <footer>
                <ul class="stack" aria-label="Stack">@for (t of p.stack; track t) { <li class="tag">{{ t }}</li> }</ul>
                @if (p.link) { <a class="btn" [href]="p.link" target="_blank" rel="noopener">View project</a> }
              </footer>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .list { display: grid; gap: 20px; }
    .case { border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); padding: clamp(22px, 4vw, 40px); transition: border-color .3s; }
    .case:hover { border-color: var(--ink); }
    header { display: grid; grid-template-columns: 56px 1fr; gap: 16px; }
    .n { font: 500 13px var(--f-mono); color: var(--signal-text); padding-top: 4px; }
    .ctx { font: 500 12.5px var(--f-mono); color: var(--ink-3); }
    h3 { font-weight: 600; font-size: clamp(24px, 3vw, 34px); letter-spacing: -.035em; line-height: 1.15; margin: 4px 0 8px; }
    .sum { color: var(--ink-2); max-width: 60ch; }
    .body { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin: 28px 0 0 72px; padding-top: 22px; border-top: 1px solid var(--line); }
    dt { font: 500 12px var(--f-mono); text-transform: uppercase; letter-spacing: .06em; color: var(--blue); margin-bottom: 6px; }
    dd { color: var(--ink-2); font-size: 15.5px; }
    .impact { list-style: none; display: grid; gap: 6px; }
    .impact li { color: var(--ink); font-weight: 600; }
    footer { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px; margin: 24px 0 0 72px; }
    .stack { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; }
    @media (max-width: 760px) { header { grid-template-columns: 1fr; gap: 6px; } .body { grid-template-columns: 1fr; margin-left: 0; } footer { margin-left: 0; } }
  `,
})
export class ProjectsComponent {
  readonly index = input.required<string>();
  readonly items = PROJECTS;
}
