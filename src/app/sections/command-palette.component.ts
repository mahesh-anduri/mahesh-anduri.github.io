import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from '../core/ui.service';
import { PROFILE, PROJECTS, RECOMMENDATIONS } from '../data/profile';

interface Command { label: string; hint: string; run: () => void; }

@Component({
  selector: 'app-command-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown)': 'onGlobalKey($event)' },
  template: `
    @if (ui.paletteOpen()) {
      <div class="backdrop" (click)="close()"></div>
      <div class="panel" role="dialog" aria-modal="true" aria-label="Command menu">
        <div class="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input #field type="text" placeholder="Jump to a section or run a command…" autocomplete="off" spellcheck="false"
            role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-autocomplete="list"
            [attr.aria-activedescendant]="results().length ? 'cmd-' + active() : null"
            [value]="query()" (input)="onInput($event)" (keydown)="onKey($event)" />
          <button type="button" class="esc" (click)="close()" aria-label="Close">esc</button>
        </div>
        <ul id="cmd-list" role="listbox" aria-label="Commands">
          @for (c of results(); track c.label; let i = $index) {
            <li [id]="'cmd-' + i" role="option" [attr.aria-selected]="i === active()" (mousemove)="active.set(i)" (click)="c.run()">
              <span>{{ c.label }}</span><small>{{ c.hint }}</small>
            </li>
          } @empty {
            <li class="empty">No matches</li>
          }
        </ul>
        <p class="foot">↑ ↓ navigate · ↵ select · esc close</p>
      </div>
    }
  `,
  styles: `
    :host { position: fixed; inset: 0; z-index: 200; pointer-events: none; }
    .backdrop { position: absolute; inset: 0; background: rgba(8, 8, 7, .5); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); pointer-events: auto; animation: fade .2s; }
    .panel { position: relative; pointer-events: auto; margin: 12vh auto 0; width: calc(100% - 32px); max-width: 560px; background: var(--surface); border: 1px solid var(--line-strong); border-radius: 16px; box-shadow: 0 40px 100px -24px rgba(0, 0, 0, .55); overflow: hidden; animation: rise .25s var(--ease); }
    .search { display: flex; align-items: center; gap: 12px; padding: 0 12px 0 18px; border-bottom: 1px solid var(--line); }
    .search svg { width: 18px; height: 18px; color: var(--ink-3); flex: none; }
    input { flex: 1; min-width: 0; height: 58px; border: 0; background: transparent; color: var(--ink); font: 500 16px var(--f-sans); outline: none; }
    .esc { font: 500 11px var(--f-mono); padding: 4px 8px; border-radius: 6px; border: 1px solid var(--line); background: var(--sunken); color: var(--ink-2); cursor: pointer; }
    ul { list-style: none; max-height: min(360px, 50vh); overflow-y: auto; padding: 8px; }
    li { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 10px; cursor: pointer; font-size: 15px; }
    li small { font: 500 11.5px var(--f-mono); color: var(--ink-3); }
    li[aria-selected='true'] { background: var(--sunken); }
    li[aria-selected='true'] span::before { content: '→ '; color: var(--signal); }
    .empty { color: var(--ink-3); justify-content: center; cursor: default; }
    .foot { padding: 10px 18px; border-top: 1px solid var(--line); font: 500 11.5px var(--f-mono); color: var(--ink-3); }
    @keyframes fade { from { opacity: 0; } }
    @keyframes rise { from { opacity: 0; transform: translateY(-8px) scale(.98); } }
  `,
})
export class CommandPaletteComponent {
  readonly ui = inject(UiService);
  private readonly router = inject(Router);
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');
  private lastFocus: HTMLElement | null = null;

  readonly query = signal('');
  readonly active = signal(0);

  private readonly commands: Command[] = [
    ...[
      ['top', 'Top'], ['about', 'About'], ['capabilities', 'Capabilities'], ['experience', 'Experience'],
      ...(PROJECTS.length ? [['work', 'Selected work']] : []), ['eras', 'Eras of front-end'], ['toolkit', 'Toolkit & education'],
      ...(RECOMMENDATIONS.length ? [['recommendations', 'Recommendations']] : []), ['contact', 'Contact'],
    ].map(([id, label]) => ({ label: `Go to ${label}`, hint: 'section', run: () => this.go(id) })),
    { label: "How this site is built", hint: 'page', run: () => { this.close(); this.router.navigate(['/how-its-built']); } },
    { label: 'Toggle light / dark theme', hint: 'action', run: () => { this.ui.toggleTheme(); this.close(); } },
    { label: 'Toggle inspect mode', hint: 'action', run: () => { this.close(); this.ui.toggleInspect(); } },
    { label: 'Open LinkedIn profile', hint: 'link', run: () => { this.close(); window.open(PROFILE.linkedin, '_blank', 'noopener'); } },
    { label: 'Copy LinkedIn link', hint: 'action', run: () => { this.close(); this.ui.copyProfileLink(); } },
  ];

  readonly results = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q ? this.commands.filter(c => c.label.toLowerCase().includes(q)) : this.commands;
  });

  constructor() {
    effect(() => {
      if (this.ui.paletteOpen()) {
        this.lastFocus = document.activeElement as HTMLElement | null;
        this.query.set('');
        this.active.set(0);
        queueMicrotask(() => this.field()?.nativeElement.focus());
      }
    });
  }

  onInput(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
    this.active.set(0);
  }

  onKey(e: KeyboardEvent): void {
    const n = this.results().length;
    if (e.key === 'ArrowDown' && n) { e.preventDefault(); this.active.update(i => (i + 1) % n); this.scrollActive(); }
    else if (e.key === 'ArrowUp' && n) { e.preventDefault(); this.active.update(i => (i - 1 + n) % n); this.scrollActive(); }
    else if (e.key === 'Enter') { e.preventDefault(); this.results()[this.active()]?.run(); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  }

  onGlobalKey(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.ui.paletteOpen() ? this.close() : this.ui.paletteOpen.set(true);
    } else if (e.key === 'Escape' && this.ui.paletteOpen()) {
      this.close();
    }
  }

  close(): void {
    if (!this.ui.paletteOpen()) return;
    this.ui.paletteOpen.set(false);
    // Return focus to the trigger without moving the page.
    this.lastFocus?.focus?.({ preventScroll: true });
  }

  private go(id: string): void {
    this.close();
    this.ui.goToSection(id);
  }

  private scrollActive(): void {
    queueMicrotask(() => document.getElementById('cmd-' + this.active())?.scrollIntoView({ block: 'nearest' }));
  }
}
