import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TEST_PROVIDERS } from '../../testing/providers';
import { UiService } from '../core/ui.service';
import { CommandPaletteComponent } from './command-palette.component';

describe('CommandPaletteComponent', () => {
  let fixture: ComponentFixture<CommandPaletteComponent>;
  let ui: UiService;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CommandPaletteComponent], providers: TEST_PROVIDERS }).compileComponents();
    fixture = TestBed.createComponent(CommandPaletteComponent);
    ui = TestBed.inject(UiService);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  const press = (key: string, extra: KeyboardEventInit = {}) =>
    document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...extra }));

  it('opens with Ctrl/⌘+K and closes with Escape', async () => {
    press('k', { ctrlKey: true });
    await fixture.whenStable();
    expect(el.querySelector('[role=dialog]')).not.toBeNull();
    press('Escape');
    await fixture.whenStable();
    expect(el.querySelector('[role=dialog]')).toBeNull();
  });

  it('filters commands as you type and shows an empty state', async () => {
    ui.paletteOpen.set(true);
    await fixture.whenStable();
    const input = el.querySelector('input')!;
    input.value = 'theme';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    const options = el.querySelectorAll('[role=option]');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('theme');
    expect(input.getAttribute('aria-activedescendant')).toBe('cmd-0');

    input.value = 'zzzz';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(el.querySelector('.empty')).not.toBeNull();
  });

  it('moves the active option with arrows and runs it with Enter', async () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    ui.paletteOpen.set(true);
    await fixture.whenStable();
    const input = el.querySelector('input')!;
    input.value = 'how';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalledWith(['/how-its-built']);
    expect(ui.paletteOpen()).toBeFalse();
  });
});
