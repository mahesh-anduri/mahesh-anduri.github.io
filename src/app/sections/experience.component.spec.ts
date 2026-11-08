import { TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../testing/providers';
import { ROLES } from '../data/profile';
import { ExperienceComponent } from './experience.component';

describe('ExperienceComponent', () => {
  it('renders every role and flags only the current one', async () => {
    await TestBed.configureTestingModule({ imports: [ExperienceComponent], providers: TEST_PROVIDERS }).compileComponents();
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.componentRef.setInput('index', '03');
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.role').length).toBe(ROLES.length);
    expect(el.querySelectorAll('.role.current').length).toBe(1);
    expect(el.querySelector('.role.current h3')!.textContent).toContain(ROLES.find(r => !r.end)!.title);
  });

  it('lays out timeline segments inside the track, in order, without overlap', () => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    const cmp = TestBed.runInInjectionContext(() => new ExperienceComponent());
    const segs = [...cmp.segments()].sort((a, b) => a.left - b.left);
    segs.forEach(s => {
      expect(s.left).toBeGreaterThanOrEqual(0);
      expect(s.left + s.width).toBeLessThanOrEqual(100.0001);
    });
    for (let i = 1; i < segs.length; i++) {
      expect(segs[i].left).toBeGreaterThanOrEqual(segs[i - 1].left + segs[i - 1].width - 0.0001);
    }
  });
});
