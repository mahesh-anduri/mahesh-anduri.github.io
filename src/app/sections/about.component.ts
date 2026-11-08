import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from '../core/reveal.directive';
import { PROFILE } from '../data/profile';
import { SectionHeadComponent } from './section-head.component';

@Component({
  selector: 'app-about',
  imports: [SectionHeadComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-inspect': '<app-about>' },
  template: `
    <div class="wrap">
      <ul class="stats" aria-label="At a glance" appReveal>
        <li><b>{{ p.years }}<sup>+</sup></b><span>Years building for the web</span></li>
        <li><b>v2<span class="to">→</span>19</b><span>Angular versions shipped</span></li>
        <li><b>6<sup>+</sup></b><span>Years at Charter Communications</span></li>
        <li><b>WCAG</b><span>Accessibility built in, not bolted on</span></li>
      </ul>
    </div>

    <section class="section" id="about" aria-labelledby="about-title">
      <div class="wrap">
        <app-section-head [index]="index()" label="About" titleId="about-title" aside="Irving, TX - open to W2">
          Front‑end craft, <em>back‑end</em> depth.
        </app-section-head>

        <div class="grid">
          <div class="statement" appReveal>
            <p class="big">I specialise in building <mark>fast, accessible and modular</mark> applications with modern front-end frameworks and robust backend technologies.</p>
            <p>With a strong command of Angular (v2–19), Node.js and cloud-native architectures, I deliver scalable, secure and maintainable web solutions that align with both business and user goals - and I enjoy mentoring the developers around me along the way.</p>
          </div>

          <dl class="facts" appReveal="120">
            <div><dt>Role</dt><dd>{{ p.title }}</dd></div>
            <div><dt>Focus</dt><dd>{{ p.focus }}</dd></div>
            <div><dt>Currently</dt><dd>{{ p.current }}</dd></div>
            <div><dt>Based in</dt><dd>{{ p.location }}</dd></div>
            <div><dt>Experience</dt><dd>{{ p.years }}+ years</dd></div>
            <div><dt>Looking for</dt><dd><span class="dot" aria-hidden="true"></span>{{ p.openTo }}</dd></div>
          </dl>
        </div>
      </div>
    </section>
  `,
  styles: `
    .stats { list-style: none; display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--ink); border-bottom: 1px solid var(--line); }
    .stats li { padding: 26px 22px 24px; border-right: 1px solid var(--line); display: grid; gap: 4px; }
    .stats li:first-child { padding-left: 0; }
    .stats li:last-child { border-right: 0; }
    .stats b { font-weight: 600; font-size: clamp(34px, 4.4vw, 52px); letter-spacing: -.045em; line-height: 1.05; }
    .stats sup, .stats .to { color: var(--signal); font-size: .6em; vertical-align: .35em; margin-left: 2px; }
    .stats .to { vertical-align: .15em; margin: 0 4px; }
    .stats span:not(.to) { font-size: 14px; color: var(--ink-2); }
    @media (max-width: 800px) {
      .stats { grid-template-columns: 1fr 1fr; }
      .stats li { padding: 22px 16px; }
      .stats li:nth-child(odd) { padding-left: 0; }
      .stats li:nth-child(2n) { border-right: 0; }
      .stats li:nth-child(-n + 2) { border-bottom: 1px solid var(--line); }
    }

    .grid { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: clamp(32px, 6vw, 80px); align-items: start; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
    .statement p { color: var(--ink-2); font-size: 18px; max-width: 58ch; }
    .statement .big { color: var(--ink); font-size: clamp(22px, 2.6vw, 30px); line-height: 1.35; letter-spacing: -.02em; margin-bottom: 22px; max-width: 30ch; }
    mark { background: linear-gradient(transparent 60%, var(--signal-soft) 60%); color: inherit; }

    .facts { border-top: 1px solid var(--ink); }
    .facts div { display: flex; justify-content: space-between; gap: 18px; padding: 14px 0; border-bottom: 1px solid var(--line); }
    .facts dt { font: 500 12.5px var(--f-mono); color: var(--ink-3); text-transform: uppercase; letter-spacing: .05em; padding-top: 3px; }
    .facts dd { text-align: right; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; }
    .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ok); }
  `,
})
export class AboutComponent {
  readonly index = input.required<string>();
  readonly p = PROFILE;
}
