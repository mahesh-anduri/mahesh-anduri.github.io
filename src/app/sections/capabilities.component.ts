import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from '../core/reveal.directive';
import { CAPABILITIES } from '../data/profile';
import { SectionHeadComponent } from './section-head.component';

@Component({
  selector: 'app-capabilities',
  imports: [SectionHeadComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-inspect': '<app-capabilities>' },
  template: `
    <section class="section" id="capabilities" aria-labelledby="cap-title">
      <div class="wrap">
        <app-section-head [index]="index()" label="Capabilities" titleId="cap-title" [aside]="items.length + ' areas'">
          What I bring to <em>a team</em>.
        </app-section-head>

        <ol class="list">
          @for (c of items; track c.title; let i = $index) {
            <li class="row" appReveal>
              <span class="n">{{ (i + 1).toString().padStart(2, '0') }}</span>
              <h3>{{ c.title }}</h3>
              <p>{{ c.body }}</p>
              <ul class="tags" aria-label="Related skills">
                @for (t of c.tags; track t) { <li class="tag">{{ t }}</li> }
              </ul>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    .list { list-style: none; }
    .row {
      display: grid; grid-template-columns: 64px minmax(0, 1fr) minmax(0, 1.15fr); gap: 8px 32px; align-items: start;
      padding: 28px 0; border-bottom: 1px solid var(--line); position: relative;
    }
    .row::before { content: ''; position: absolute; left: 0; right: 0; top: -1px; height: 1px; background: var(--signal); transform: scaleX(0); transform-origin: left; transition: transform .6s var(--ease); }
    .row:hover::before { transform: scaleX(1); }
    .n { font: 500 13px var(--f-mono); color: var(--signal-text); padding-top: 6px; }
    h3 { font-weight: 600; font-size: clamp(20px, 2.3vw, 26px); letter-spacing: -.025em; line-height: 1.2; transition: transform .4s var(--ease); }
    .row:hover h3 { transform: translateX(6px); }
    p { color: var(--ink-2); grid-column: 3; grid-row: 1; }
    .tags { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; grid-column: 3; margin-top: 6px; }
    @media (max-width: 760px) {
      .row { grid-template-columns: 44px minmax(0, 1fr); padding: 24px 0; }
      p, .tags { grid-column: 2; grid-row: auto; }
      .n { padding-top: 4px; }
    }
  `,
})
export class CapabilitiesComponent {
  readonly index = input.required<string>();
  readonly items = CAPABILITIES;
}
