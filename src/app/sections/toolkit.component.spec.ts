import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../testing/providers';
import { SKILLS } from '../data/profile';
import { ToolkitComponent } from './toolkit.component';

describe('ToolkitComponent', () => {
  let fixture: ComponentFixture<ToolkitComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ToolkitComponent], providers: TEST_PROVIDERS }).compileComponents();
    fixture = TestBed.createComponent(ToolkitComponent);
    fixture.componentRef.setInput('index', '05');
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  const chips = () => [...el.querySelectorAll<HTMLElement>('.chips li')];
  const buttons = () => [...el.querySelectorAll<HTMLButtonElement>('.filters button')];

  it('shows every skill under "All", core skills first', () => {
    const total = Object.values(SKILLS).flat().length;
    expect(chips().length).toBe(total);
    const firstPlain = chips().findIndex(c => !c.classList.contains('core'));
    expect(chips().slice(firstPlain).some(c => c.classList.contains('core'))).toBeFalse();
  });

  it('filters by category and updates aria-pressed', async () => {
    const backend = buttons().find(b => b.textContent!.includes('Backend'))!;
    backend.click();
    await fixture.whenStable();
    expect(chips().length).toBe(SKILLS['Backend'].length);
    expect(backend.getAttribute('aria-pressed')).toBe('true');
    expect(buttons().filter(b => b.getAttribute('aria-pressed') === 'true').length).toBe(1);
  });

  it('labels core skills for screen readers', () => {
    const core = chips().find(c => c.classList.contains('core'))!;
    expect(core.querySelector('.sr-only')?.textContent).toContain('core skill');
  });
});
