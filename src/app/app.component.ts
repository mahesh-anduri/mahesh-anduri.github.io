import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiService } from './core/ui.service';
import { CommandPaletteComponent } from './sections/command-palette.component';
import { FooterComponent } from './sections/footer.component';
import { NavComponent } from './sections/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, FooterComponent, CommandPaletteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip" href="#main">Skip to content</a>
    <app-nav />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
    <app-command-palette />
    <div class="toast" role="status" aria-live="polite" [class.show]="ui.toast()">{{ ui.toast() }}</div>
  `,
  styles: `
    main:focus { outline: none; }
    .toast { position: fixed; left: 50%; bottom: 24px; z-index: 250; transform: translate(-50%, 16px); opacity: 0; pointer-events: none;
      background: var(--ink); color: var(--paper); padding: 11px 18px; border-radius: 999px; font: 500 13.5px var(--f-mono); transition: opacity .3s, transform .3s; white-space: nowrap; }
    .toast.show { opacity: 1; transform: translate(-50%, 0); }
  `,
})
export class AppComponent {
  readonly ui = inject(UiService);
}
