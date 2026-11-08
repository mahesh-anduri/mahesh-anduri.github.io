import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from '../core/reveal.directive';
import { PROFILE, RECOMMENDATIONS } from '../data/profile';
import { SectionHeadComponent } from './section-head.component';

/** Real LinkedIn recommendations. Rendered only when RECOMMENDATIONS has entries. */
@Component({
  selector: 'app-recommendations',
  imports: [SectionHeadComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-inspect': '<app-recommendations>' },
  template: `
    <section class="section" id="recommendations" aria-labelledby="rec-title">
      <div class="wrap">
        <app-section-head [index]="index()" label="Recommendations" titleId="rec-title" aside="From LinkedIn">
          In <em>their</em> words.
        </app-section-head>
        <div class="grid">
          @for (r of items; track r.name) {
            <figure appReveal>
              <blockquote>{{ r.quote }}</blockquote>
              <figcaption>
                <b>{{ r.name }}</b>
                <span>{{ r.role }}</span>
                @if (r.relationship) { <span class="rel">{{ r.relationship }}</span> }
              </figcaption>
            </figure>
          }
        </div>
        <p class="src"><a [href]="linkedin" target="_blank" rel="noopener">See all recommendations on LinkedIn ↗</a></p>
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap: 18px; }
    figure { margin: 0; padding: 28px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); display: flex; flex-direction: column; justify-content: space-between; gap: 22px; }
    blockquote { font-family: var(--f-serif); font-style: italic; font-size: clamp(20px, 2vw, 24px); line-height: 1.4; }
    blockquote::before { content: '“'; color: var(--signal); }
    blockquote::after { content: '”'; color: var(--signal); }
    figcaption { display: grid; gap: 2px; font-size: 14.5px; color: var(--ink-2); }
    figcaption b { color: var(--ink); font-weight: 600; font-size: 15.5px; }
    .rel { font: 500 12px var(--f-mono); color: var(--ink-3); margin-top: 4px; }
    .src { margin-top: 18px; font: 500 13px var(--f-mono); }
  `,
})
export class RecommendationsComponent {
  readonly index = input.required<string>();
  readonly items = RECOMMENDATIONS;
  readonly linkedin = PROFILE.linkedin + '/details/recommendations/';
}
