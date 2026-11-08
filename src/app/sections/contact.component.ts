import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RevealDirective } from '../core/reveal.directive';
import { UiService } from '../core/ui.service';
import { PROFILE } from '../data/profile';
import { SectionHeadComponent } from './section-head.component';

@Component({
  selector: 'app-contact',
  imports: [SectionHeadComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-inspect': '<app-contact>' },
  template: `
    <section class="section" id="contact" aria-labelledby="contact-title">
      <div class="wrap">
        <app-section-head [index]="index()" label="Contact" titleId="contact-title" [aside]="'Open to ' + p.openTo">
          Let's build something <em>that lasts</em>.
        </app-section-head>

        <div class="panel" appReveal>
          <p class="lead">I'm looking for a W2 full-time role where I can drive front-end architecture and full-stack delivery. The fastest way to reach me is LinkedIn.</p>
          <div class="ctas">
            <a class="btn primary" [href]="p.linkedin" target="_blank" rel="noopener">
              Message me on LinkedIn
              <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
            @if (p.email) { <a class="btn" [href]="'mailto:' + p.email">{{ p.email }}</a> }
            @if (p.resumeUrl) { <a class="btn" [href]="p.resumeUrl" download>Download résumé</a> }
            @if (p.github) { <a class="btn" [href]="p.github" target="_blank" rel="noopener">GitHub</a> }
            <button type="button" class="btn" (click)="ui.copyProfileLink()">Copy profile link</button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .panel { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 28px 48px; align-items: end; }
    .lead { font-size: clamp(19px, 2vw, 23px); line-height: 1.45; letter-spacing: -.015em; color: var(--ink-2); max-width: 44ch; }
    .ctas { display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; max-width: 520px; }
    @media (max-width: 900px) { .panel { grid-template-columns: 1fr; } .ctas { justify-content: flex-start; } }
  `,
})
export class ContactComponent {
  readonly index = input.required<string>();
  readonly p = PROFILE;
  readonly ui = inject(UiService);
}
