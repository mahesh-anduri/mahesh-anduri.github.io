import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { Token, highlight } from '../core/highlight';
import { RevealDirective } from '../core/reveal.directive';
import { ERAS } from '../data/profile';
import { SectionHeadComponent } from './section-head.component';

/**
 * "Every era of the front end": an accessible tablist (WAI-ARIA tabs pattern)
 * showing the same counter written the way each generation of the platform would.
 */
@Component({
  selector: 'app-eras',
  imports: [SectionHeadComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-inspect': '<app-eras>' },
  template: `
    <section class="section" id="eras" aria-labelledby="eras-title">
      <div class="wrap">
        <app-section-head [index]="index()" label="Through the eras" titleId="eras-title" [aside]="eras.length + ' generations'">
          Every era of the <em>front end</em>.
        </app-section-head>

        <p class="intro" appReveal>
          Ten years means shipping through every major shift in how the web is built. Here's the same tiny counter,
          written the way each generation would - pick an era.
        </p>

        <div class="lab" appReveal>
          <div class="tabs" role="tablist" aria-label="Front-end eras" aria-orientation="vertical" (keydown)="onKey($event)">
            @for (e of eras; track e.id; let i = $index) {
              <button type="button" role="tab" [id]="'era-tab-' + e.id"
                [attr.aria-selected]="i === active()" [attr.aria-controls]="'era-panel'"
                [tabindex]="i === active() ? 0 : -1" (click)="select(i)">
                <span class="i">{{ (i + 1).toString().padStart(2, '0') }}</span>
                <span class="t">{{ e.title }}<small>{{ e.period }}</small></span>
              </button>
            }
          </div>

          <div class="panel" id="era-panel" role="tabpanel" [attr.aria-labelledby]="'era-tab-' + era().id" tabindex="0">
            <div class="panel-head">
              <div>
                <p class="period">{{ era().period }}</p>
                <h3>{{ era().title }}</h3>
              </div>
              <p class="progress mono" aria-hidden="true">{{ active() + 1 }} / {{ eras.length }}</p>
            </div>
            <p class="body">{{ era().body }}</p>

            <div class="editor">
              <div class="bar" aria-hidden="true">
                <span class="dots"><i></i><i></i><i></i></span>
                <span class="file">counter.{{ era().lang }}</span>
              </div>
              <pre tabindex="0" aria-label="Code sample"><code>@for (t of tokens(); track $index) {<span [class]="'t-' + t.kind">{{ t.text }}</span>}</code></pre>
              <div class="out">
                <span class="mono">output</span>
                <button type="button" class="demo" (click)="increment()"
                  [attr.aria-label]="'Live demo counter, value ' + clicks()">{{ clicks() }}</button>
                @if (clicks() > 9) { <span class="dd">double digits</span> }
                <span class="note mono">powered by a real signal()</span>
              </div>
            </div>

            <ul class="skills" aria-label="Skills from this era">
              @for (s of era().skills; track $index) { <li class="tag">{{ s }}</li> }
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .intro { font-size: clamp(18px, 1.9vw, 21px); color: var(--ink-2); max-width: 60ch; margin-bottom: 32px; }
    .lab { display: grid; grid-template-columns: minmax(0, 330px) minmax(0, 1fr); border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); overflow: hidden; }

    .tabs { display: flex; flex-direction: column; border-right: 1px solid var(--line); padding: 8px; gap: 2px; }
    [role='tab'] { display: grid; grid-template-columns: 30px 1fr; gap: 10px; align-items: start; text-align: left; padding: 12px 12px; border: 0; border-radius: 9px; background: transparent; cursor: pointer; color: var(--ink-2); transition: background .2s, color .2s; position: relative; }
    [role='tab']:hover { background: var(--sunken); color: var(--ink); }
    [role='tab'][aria-selected='true'] { background: var(--ink); color: var(--paper); }
    .i { font: 500 12px var(--f-mono); padding-top: 3px; color: var(--ink-3); }
    [role='tab'][aria-selected='true'] .i { color: color-mix(in srgb, var(--paper) 75%, var(--ink)); }
    [role='tab'][aria-selected='true']::before { content: ''; position: absolute; left: 0; top: 12px; bottom: 12px; width: 3px; border-radius: 3px; background: var(--signal); }
    .t { display: grid; font-weight: 500; font-size: 15px; line-height: 1.3; }
    .t small { font: 500 11.5px var(--f-mono); color: var(--ink-3); margin-top: 3px; }
    [role='tab'][aria-selected='true'] small { color: color-mix(in srgb, var(--paper) 75%, var(--ink)); }

    .panel { padding: clamp(20px, 3vw, 34px); min-width: 0; }
    .panel:focus-visible { outline-offset: -4px; }
    .panel-head { display: flex; justify-content: space-between; gap: 16px; align-items: start; }
    .period { font: 500 12.5px var(--f-mono); color: var(--signal-text); }
    h3 { font-weight: 600; font-size: clamp(24px, 2.8vw, 32px); letter-spacing: -.035em; line-height: 1.15; margin-top: 4px; }
    .progress { font-size: 12.5px; color: var(--ink-3); padding-top: 4px; white-space: nowrap; }
    .body { color: var(--ink-2); margin: 12px 0 22px; max-width: 62ch; }

    .editor { border-radius: 12px; overflow: hidden; background: #141413; color: #e9e6df; border: 1px solid #2a2926; }
    .bar { display: flex; align-items: center; gap: 14px; padding: 10px 14px; border-bottom: 1px solid #2a2926; background: #1a1a18; }
    .dots { display: flex; gap: 6px; }
    .dots i { width: 9px; height: 9px; border-radius: 50%; background: #3d3b37; }
    .file { font: 500 12px var(--f-mono); color: #aaa69d; }
    pre { margin: 0; padding: 18px 18px; overflow-x: auto; font: 400 13.5px/1.75 var(--f-mono); tab-size: 2; min-height: 228px; }
    .t-kw { color: #ff8a64; } .t-str { color: #9fd89a; } .t-com { color: #9a968d; font-style: italic; }
    .t-dec { color: #ffcf6b; } .t-num { color: #ffcf6b; } .t-fn { color: #8fb0ff; } .t-tag { color: #ff8a64; }
    .out { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 12px 14px; border-top: 1px dashed #2a2926; background: #1a1a18; }
    .out > .mono { font-size: 11.5px; color: #9a968d; text-transform: uppercase; letter-spacing: .06em; }
    .demo { min-width: 54px; height: 36px; padding: 0 14px; border-radius: 8px; border: 1px solid #3d3b37; background: #232321; color: #fff; font: 600 15px var(--f-mono); cursor: pointer; transition: background .15s, transform .1s; }
    .demo:hover { background: #2c2b28; }
    .demo:active { transform: scale(.96); }
    .dd { font: 500 12.5px var(--f-mono); color: #9fd89a; }
    .note { margin-left: auto; font-size: 11.5px; color: #9a968d; }
    .skills { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; margin-top: 18px; }

    @media (max-width: 860px) {
      .lab { grid-template-columns: 1fr; }
      .tabs { flex-direction: row; overflow-x: auto; border-right: 0; border-bottom: 1px solid var(--line); scrollbar-width: none; }
      [role='tab'] { flex: none; grid-template-columns: auto; }
      .i { display: none; }
      .t small { display: none; }
      pre { font-size: 12.5px; min-height: 0; }
      .note { margin-left: 0; width: 100%; }
    }
  `,
})
export class ErasComponent {
  readonly index = input.required<string>();
  readonly eras = ERAS;
  readonly active = signal(ERAS.length - 1);
  readonly era = computed(() => this.eras[this.active()]);
  readonly tokens = computed<Token[]>(() => highlight(this.era().code));
  readonly clicks = signal(0);

  increment(): void {
    this.clicks.update(n => n + 1);
  }

  select(i: number): void {
    this.active.set(i);
  }

  /** Roving tabindex: arrows move between tabs, Home/End jump to ends. */
  onKey(e: KeyboardEvent): void {
    const n = this.eras.length;
    const map: Record<string, number> = {
      ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1,
    };
    let next: number | null = null;
    if (e.key in map) next = (this.active() + map[e.key] + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next === null) return;
    e.preventDefault();
    this.active.set(next);
    (e.currentTarget as HTMLElement).querySelector<HTMLElement>(`#era-tab-${this.eras[next].id}`)?.focus();
  }
}
