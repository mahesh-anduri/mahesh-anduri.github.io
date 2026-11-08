import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../testing/providers';
import { ERAS } from '../data/profile';
import { ErasComponent } from './eras.component';

describe('ErasComponent (WAI-ARIA tabs)', () => {
  let fixture: ComponentFixture<ErasComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ErasComponent], providers: TEST_PROVIDERS }).compileComponents();
    fixture = TestBed.createComponent(ErasComponent);
    fixture.componentRef.setInput('index', '04');
    el = fixture.nativeElement;
    document.body.appendChild(el);
    await fixture.whenStable();
  });

  afterEach(() => el.remove());

  const tabs = () => [...el.querySelectorAll<HTMLButtonElement>('[role=tab]')];
  const selected = () => tabs().findIndex(t => t.getAttribute('aria-selected') === 'true');
  const key = async (k: string) => {
    el.querySelector('[role=tablist]')!.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
    await fixture.whenStable();
  };

  it('starts on the latest era with a single tab stop', () => {
    expect(selected()).toBe(ERAS.length - 1);
    expect(tabs().filter(t => t.tabIndex === 0).length).toBe(1);
  });

  it('supports arrow keys with wrap-around, Home and End', async () => {
    await key('ArrowDown');
    expect(selected()).toBe(0);
    expect(document.activeElement).toBe(tabs()[0]);
    await key('ArrowUp');
    expect(selected()).toBe(ERAS.length - 1);
    await key('Home');
    expect(selected()).toBe(0);
    await key('End');
    expect(selected()).toBe(ERAS.length - 1);
  });

  it('renders the selected era code verbatim and links the panel to its tab', async () => {
    tabs()[1].click();
    await fixture.whenStable();
    expect(el.querySelector('pre')!.textContent).toBe(ERAS[1].code);
    expect(el.querySelector('[role=tabpanel]')!.getAttribute('aria-labelledby')).toBe(tabs()[1].id);
  });

  it('runs a live signal-powered counter', async () => {
    const demo = el.querySelector<HTMLButtonElement>('.demo')!;
    for (let i = 0; i < 10; i++) demo.click();
    await fixture.whenStable();
    expect(demo.textContent!.trim()).toBe('10');
    expect(el.querySelector('.dd')?.textContent).toContain('double digits');
  });
});
