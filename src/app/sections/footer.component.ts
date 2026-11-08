import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiService } from '../core/ui.service';
import { PROFILE } from '../data/profile';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-inspect': '<app-footer>' },
  template: `
    <footer>
      <div class="wrap">
        <p class="sign" aria-hidden="true">{{ p.name }}<span>.</span></p>
        <div class="row">
          <p>© {{ year }} {{ p.name }}</p>
          <p class="colophon">
            Built with Angular 19: standalone components, signals, zoneless change detection, static prerendering.
            <a routerLink="/how-its-built">How it's built</a>
            @if (p.sourceUrl) { <a [href]="p.sourceUrl" target="_blank" rel="noopener">View source</a> }
          </p>
          <p class="tips">
            <button type="button" (click)="ui.paletteOpen.set(true)">Command menu</button>
            <span aria-hidden="true">·</span>
            <button type="button" (click)="ui.toggleInspect()">Inspect components</button>
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: `
    footer { padding: clamp(80px, 12vw, 160px) 0 40px; overflow: hidden; }
    .sign { font-weight: 600; font-size: clamp(64px, 17vw, 240px); line-height: .82; letter-spacing: -.065em; color: var(--ink); white-space: nowrap; margin-left: -.04em; }
    .sign span { color: var(--signal); }
    .row { display: grid; grid-template-columns: auto 1fr auto; gap: 12px 32px; margin-top: 28px; padding-top: 18px; border-top: 1px solid var(--ink); font: 500 12.5px var(--f-mono); color: var(--ink-3); }
    .colophon a { color: var(--ink); margin-left: 6px; }
    .tips { display: flex; gap: 8px; }
    .tips button { background: none; border: 0; cursor: pointer; font: inherit; color: var(--ink-2); text-decoration: underline; text-underline-offset: 3px; }
    .tips button:hover { color: var(--signal-text); }
    @media (max-width: 900px) { .row { grid-template-columns: 1fr; } }
  `,
})
export class FooterComponent {
  readonly p = PROFILE;
  readonly ui = inject(UiService);
  readonly year = new Date().getFullYear();
}
