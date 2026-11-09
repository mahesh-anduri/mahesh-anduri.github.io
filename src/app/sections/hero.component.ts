import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROFILE } from '../data/profile';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-inspect': '<app-hero>' },
  template: `
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="wrap grid">
        <div class="copy">
          <p class="status"><span class="pulse" aria-hidden="true"></span>Open to {{ p.openTo }}</p>
          <h1 id="hero-title">Interfaces that are <em>fast</em>, <em>accessible</em> &amp;&nbsp;built&nbsp;to&nbsp;last.</h1>
          <p class="lede">
            I'm {{ p.firstName }} - a senior UI &amp; full-stack developer with <strong>{{ p.years }}+ years</strong>
            shipping enterprise Angular applications, micro-frontend platforms and backend services in
            <strong>Java, Spring Boot &amp; JDBC</strong> and Node.js.
          </p>
          <div class="ctas">
            <a class="btn primary" routerLink="/" fragment="experience">
              See my experience
              <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
            <a class="btn" [href]="p.linkedin" target="_blank" rel="noopener">
              LinkedIn
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>
            </a>
          </div>
        </div>

        <figure class="spec" aria-label="Profile summary">
          <div class="tag-line" aria-hidden="true">&lt;<span>app-profile</span> <i>[status]</i>=<b>"available"</b>&gt;</div>

          <div class="frame">
            <span class="dim" aria-hidden="true"><i></i>360 × 360 · radius 50%<i></i></span>
            <span class="crop tl" aria-hidden="true"></span><span class="crop tr" aria-hidden="true"></span>
            <span class="crop bl" aria-hidden="true"></span><span class="crop br" aria-hidden="true"></span>
            <img
              src="img/mahesh-640.webp"
              srcset="img/mahesh-360.webp 360w, img/mahesh-640.webp 640w"
              sizes="(max-width: 900px) 80vw, 360px"
              width="640" height="640"
              alt="Portrait of Mahesh A in a navy blazer"
              fetchpriority="high" decoding="async" />
          </div>

          <dl class="props">
            <div><dt>name</dt><dd>'{{ p.name }}'</dd></div>
            <div><dt>role</dt><dd>'{{ p.title }}'</dd></div>
            <div><dt>experience</dt><dd class="num">{{ p.years }}+ yrs</dd></div>
            <div><dt>based</dt><dd>'{{ p.location }}'</dd></div>
            <div><dt>localTime</dt><dd class="num">{{ time() || '-' }}<span class="caret" aria-hidden="true"></span></dd></div>
          </dl>

          <div class="tag-line end" aria-hidden="true">&lt;/<span>app-profile</span>&gt;</div>
        </figure>
      </div>
    </section>
  `,
  styles: `
    .hero { padding: clamp(48px, 8vw, 96px) 0 clamp(56px, 8vw, 96px); position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; inset: 0; pointer-events: none;
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 56px 56px; opacity: .45;
      -webkit-mask-image: radial-gradient(ellipse 70% 60% at 70% 30%, #000, transparent 75%); mask-image: radial-gradient(ellipse 70% 60% at 70% 30%, #000, transparent 75%); }
    .grid { position: relative; display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, .85fr); gap: clamp(40px, 6vw, 88px); align-items: center; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }

    .status { display: inline-flex; align-items: center; gap: 10px; padding: 6px 14px 6px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); font: 500 13px var(--f-mono); color: var(--ink-2); }
    .pulse { position: relative; width: 8px; height: 8px; border-radius: 50%; background: var(--ok); }
    .pulse::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: var(--ok); animation: ping 1.8s cubic-bezier(0, 0, .2, 1) infinite; }
    @keyframes ping { 75%, 100% { transform: scale(2.6); opacity: 0; } }

    h1 { font-weight: 600; font-size: clamp(44px, 7.6vw, 98px); line-height: .96; letter-spacing: -.05em; margin: 26px 0 26px; }
    h1 em { color: var(--signal); padding-right: .04em; }
    .lede { font-size: clamp(17px, 1.7vw, 20px); color: var(--ink-2); max-width: 46ch; }
    .lede strong { color: var(--ink); font-weight: 600; }
    .ctas { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 34px; }

    /* Spec card */
    .spec { margin: 0; justify-self: center; width: min(100%, 400px); font-family: var(--f-mono); }
    .tag-line { font-size: 13px; color: var(--ink-3); padding: 0 2px 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tag-line span { color: var(--signal-text); }
    .tag-line i { color: var(--blue); font-style: normal; }
    .tag-line b { color: var(--ok); font-weight: 400; }
    .tag-line.end { padding: 12px 2px 0; }
    .frame { position: relative; margin: 0 20px; aspect-ratio: 1; }
    .frame img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
    .frame::before { content: ''; position: absolute; inset: 0; border-radius: 50%; border: 1px dashed var(--blue); opacity: .5; transform: scale(1.04); }
    .crop { position: absolute; width: 18px; height: 18px; border-color: var(--blue); border-style: solid; border-width: 0; }
    .crop.tl { top: -10px; left: -10px; border-top-width: 1.5px; border-left-width: 1.5px; }
    .crop.tr { top: -10px; right: -10px; border-top-width: 1.5px; border-right-width: 1.5px; }
    .crop.bl { bottom: -10px; left: -10px; border-bottom-width: 1.5px; border-left-width: 1.5px; }
    .crop.br { bottom: -10px; right: -10px; border-bottom-width: 1.5px; border-right-width: 1.5px; }
    .dim { position: absolute; left: 0; right: 0; top: -30px; display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--blue); }
    .dim i { flex: 1; height: 1px; background: var(--blue); position: relative; }
    .dim i:first-child::before, .dim i:last-child::after { content: ''; position: absolute; top: -4px; width: 1px; height: 9px; background: var(--blue); }
    .dim i:first-child::before { left: 0; } .dim i:last-child::after { right: 0; }
    .tag-line:first-child { margin-bottom: 26px; }

    .props { margin: 26px 20px 0; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); font-size: 13px; overflow: hidden; box-shadow: var(--shadow); }
    .props div { display: flex; justify-content: space-between; gap: 14px; padding: 9px 14px; border-bottom: 1px solid var(--line); }
    .props div:last-child { border-bottom: 0; }
    .props dt { color: var(--blue); }
    .props dd { color: var(--ok); text-align: right; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .props dd.num { color: var(--signal-text); }
    .caret { display: inline-block; width: 7px; height: 1.05em; margin-left: 4px; vertical-align: -2px; background: var(--signal); animation: blink 1s steps(1) infinite; }
    @keyframes blink { 50% { opacity: 0; } }
  `,
})
export class HeroComponent {
  readonly p = PROFILE;
  readonly time = signal('');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: PROFILE.timeZone, timeZoneName: 'short' });
      const tick = () => this.time.set(fmt.format(new Date()));
      tick();
      const id = setInterval(tick, 15_000);
      destroyRef.onDestroy(() => clearInterval(id));
    });
  }
}
