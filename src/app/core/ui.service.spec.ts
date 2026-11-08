import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../testing/providers';
import { UiService } from './ui.service';

describe('UiService', () => {
  let ui: UiService;
  let root: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    ui = TestBed.inject(UiService);
    root = TestBed.inject(DOCUMENT).documentElement;
    spyOnProperty(ui, 'reducedMotion').and.returnValue(true); // apply theme synchronously
  });

  afterEach(() => {
    root.removeAttribute('data-theme');
    root.classList.remove('inspect');
    try { localStorage.removeItem('theme'); } catch { /* ignore */ }
  });

  it('toggles and persists the theme', () => {
    const start = ui.theme();
    ui.toggleTheme();
    const next = start === 'dark' ? 'light' : 'dark';
    expect(ui.theme()).toBe(next);
    expect(root.getAttribute('data-theme')).toBe(next);
    expect(localStorage.getItem('theme')).toBe(next);
  });

  it('reflects inspect mode on <html> and announces it', () => {
    ui.toggleInspect();
    TestBed.flushEffects();
    expect(root.classList.contains('inspect')).toBeTrue();
    expect(ui.toast()).toContain('Inspect mode on');
    ui.toggleInspect();
    TestBed.flushEffects();
    expect(root.classList.contains('inspect')).toBeFalse();
  });
});
