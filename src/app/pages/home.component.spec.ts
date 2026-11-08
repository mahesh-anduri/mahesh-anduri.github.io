import { TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../testing/providers';
import { HOME_SECTIONS, HomeComponent } from './home.component';

describe('HomeComponent', () => {
  it('numbers sections sequentially in render order', async () => {
    await TestBed.configureTestingModule({ imports: [HomeComponent], providers: TEST_PROVIDERS }).compileComponents();
    const fixture = TestBed.createComponent(HomeComponent);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const ids = [...el.querySelectorAll('section[id]')].map(s => s.id).filter(id => id !== 'top');
    expect(ids).toEqual([...HOME_SECTIONS]);
    const labels = [...el.querySelectorAll('.sec-label b')].map(b => b.textContent!.trim());
    expect(labels).toEqual(HOME_SECTIONS.map((_, i) => `§ ${String(i + 1).padStart(2, '0')}`));
  });

  it('has exactly one h1', async () => {
    await TestBed.configureTestingModule({ imports: [HomeComponent], providers: TEST_PROVIDERS }).compileComponents();
    const fixture = TestBed.createComponent(HomeComponent);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('h1').length).toBe(1);
  });
});
