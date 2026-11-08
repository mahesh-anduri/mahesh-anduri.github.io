import { DOCUMENT, ViewportScroller, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PROFILE } from '../data/profile';

export type Theme = 'light' | 'dark';

/** Global UI state, all as signals. */
@Injectable({ providedIn: 'root' })
export class UiService {
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme = signal<Theme>('light');
  readonly inspect = signal(false);
  readonly paletteOpen = signal(false);
  readonly toast = signal<string | null>(null);
  private toastTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    // Keep fragment targets clear of the sticky nav.
    inject(ViewportScroller).setOffset([0, 84]);
    if (this.isBrowser) {
      const saved = this.doc.documentElement.getAttribute('data-theme') as Theme | null;
      this.theme.set(saved ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    }
    effect(() => this.doc.documentElement.classList.toggle('inspect', this.inspect()));
  }

  get reducedMotion(): boolean {
    return this.isBrowser && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Switch theme. Where the View Transitions API is available, the new theme
   * is revealed as a circle growing out of the element that triggered it.
   */
  toggleTheme(origin?: { x: number; y: number }): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    const apply = () => {
      this.theme.set(next);
      this.doc.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
    };

    const doc = this.doc as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };
    if (!this.isBrowser || !doc.startViewTransition || this.reducedMotion) {
      apply();
      return;
    }

    const root = this.doc.documentElement;
    const x = origin?.x ?? innerWidth - 40;
    const y = origin?.y ?? 34;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add('theme-vt');
    const t = doc.startViewTransition(apply);
    t.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' },
      );
    }).catch(() => { /* transition skipped */ });
    t.finished.finally(() => root.classList.remove('theme-vt'));
  }

  toggleInspect(): void {
    this.inspect.update(v => !v);
    this.notify(this.inspect() ? 'Inspect mode on: components outlined' : 'Inspect mode off');
  }

  notify(message: string): void {
    this.toast.set(message);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 2400);
  }

  /** Scroll to a home-page section, navigating home first if needed. */
  goToSection(id: string): void {
    if (this.router.url.split('#')[0].split('?')[0] === '/') {
      const el = this.doc.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: this.reducedMotion ? 'auto' : 'smooth' });
        return;
      }
    }
    this.router.navigate(['/'], { fragment: id === 'top' ? undefined : id });
  }

  async copyProfileLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(PROFILE.linkedin);
      this.notify('LinkedIn link copied');
    } catch {
      this.notify(PROFILE.linkedin);
    }
  }
}
