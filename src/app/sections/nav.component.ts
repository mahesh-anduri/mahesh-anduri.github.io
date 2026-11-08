import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { UiService } from '../core/ui.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-inspect': '<app-nav>' },
  template: `
    <header class="bar">
      <div class="wrap row">
        <a routerLink="/" class="logo">
          <span class="mark" aria-hidden="true">M<i></i></span>
          <span class="name">Mahesh A<small>UI &amp; Full-Stack</small></span>
        </a>

        <nav aria-label="Primary">
          <ul>
            @for (l of links; track l.id) {
              <li>
                <a routerLink="/" [fragment]="l.id" [class.active]="active() === l.id"
                   [attr.aria-current]="active() === l.id ? 'location' : null">{{ l.label }}</a>
              </li>
            }
            <li class="sep" aria-hidden="true"></li>
            <li>
              <a routerLink="/how-its-built" [class.active]="active() === 'built'"
                 [attr.aria-current]="active() === 'built' ? 'page' : null">How it's built</a>
            </li>
          </ul>
        </nav>

        <div class="actions">
          <button type="button" class="icon" (click)="ui.toggleInspect()" [attr.aria-pressed]="ui.inspect()" aria-label="Inspect mode: outline components" title="Inspect mode">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4H5a1 1 0 0 0-1 1v3M16 4h3a1 1 0 0 1 1 1v3M8 20H5a1 1 0 0 1-1-1v-3M16 20h3a1 1 0 0 0 1-1v-3"/><path d="m10 9 5 3-5 3z"/></svg>
          </button>
          <button type="button" class="icon" (click)="toggleTheme($event)" [attr.aria-label]="ui.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'">
            @if (ui.theme() === 'dark') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
            }
          </button>
          <button type="button" class="menu" (click)="ui.paletteOpen.set(true)" aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K">
            <span>Menu</span><kbd aria-hidden="true">{{ shortcut() }}</kbd>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: `
    :host { position: sticky; top: 0; z-index: 60; }
    .bar { background: color-mix(in srgb, var(--paper) 82%, transparent); backdrop-filter: blur(14px) saturate(1.3); -webkit-backdrop-filter: blur(14px) saturate(1.3); border-bottom: 1px solid var(--line); view-transition-name: site-nav; }
    .row { display: flex; align-items: center; justify-content: space-between; gap: 16px; height: 68px; }
    .logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
    .mark { position: relative; width: 36px; height: 36px; border-radius: 10px; background: var(--ink); color: var(--paper); display: grid; place-items: center; font: 600 17px var(--f-sans); letter-spacing: -.04em; }
    .mark i { position: absolute; right: 6px; bottom: 6px; width: 5px; height: 5px; border-radius: 50%; background: var(--signal); }
    .name { display: grid; line-height: 1.15; font-weight: 600; font-size: 15.5px; letter-spacing: -.01em; }
    .name small { font: 500 11px var(--f-mono); color: var(--ink-3); letter-spacing: .02em; }
    ul { display: flex; align-items: center; list-style: none; gap: 2px; }
    ul a { display: block; padding: 8px 11px; border-radius: 8px; text-decoration: none; font-size: 14.5px; color: var(--ink-2); transition: color .2s, background .2s; white-space: nowrap; }
    ul a:hover { color: var(--ink); }
    ul a.active { color: var(--ink); background: var(--sunken); }
    .sep { width: 1px; height: 18px; background: var(--line-strong); margin: 0 6px; }
    .actions { display: flex; gap: 6px; align-items: center; }
    .icon, .menu { height: 38px; border-radius: 10px; border: 1px solid var(--line); background: var(--surface); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: border-color .2s, background .2s, color .2s; }
    .icon { width: 38px; }
    .icon svg { width: 18px; height: 18px; }
    .icon:hover, .menu:hover { border-color: var(--ink); }
    .icon[aria-pressed='true'] { background: var(--blue); border-color: var(--blue); color: #fff; }
    .menu { gap: 8px; padding: 0 8px 0 12px; font-size: 14px; font-weight: 500; }
    kbd { font: 500 11px var(--f-mono); padding: 2px 6px; border-radius: 5px; border: 1px solid var(--line); background: var(--sunken); color: var(--ink-2); }
    @media (max-width: 1040px) { nav { display: none; } }
    @media (max-width: 420px) { .name small { display: none; } kbd { display: none; } .menu { padding: 0 12px; } }
  `,
})
export class NavComponent {
  readonly ui = inject(UiService);
  private readonly router = inject(Router);
  readonly links = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'eras', label: 'Eras' },
    { id: 'toolkit', label: 'Toolkit' },
    { id: 'contact', label: 'Contact' },
  ];
  readonly active = signal('');
  readonly shortcut = signal('⌘K');
  private io?: IntersectionObserver;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (!/Mac|iPhone|iPad/.test(navigator.userAgent)) this.shortcut.set('Ctrl K');
      this.io = new IntersectionObserver(entries => {
        for (const e of entries) if (e.isIntersecting) this.active.set(e.target.id);
      }, { rootMargin: '-45% 0px -50% 0px' });
      this.observe();
      const sub = this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.observe());
      destroyRef.onDestroy(() => { this.io?.disconnect(); sub.unsubscribe(); });
    });
  }

  toggleTheme(e: MouseEvent): void {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.ui.toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }

  /** Re-attach the scroll-spy after each navigation (sections only exist on the home page). */
  private observe(): void {
    this.io?.disconnect();
    if (this.router.url.startsWith('/how-its-built')) {
      this.active.set('built');
      return;
    }
    this.active.set('');
    // Wait a frame so the routed view is in the DOM.
    requestAnimationFrame(() => document.querySelectorAll('main section[id]').forEach(s => this.io?.observe(s)));
  }
}
