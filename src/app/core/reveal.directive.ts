import { Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/** Fades an element in when it scrolls into view. Content stays visible without JS. */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal', '[style.--reveal-delay]': 'delay() + "ms"' },
})
export class RevealDirective {
  readonly delay = input(0, { alias: 'appReveal', transform: (v: unknown) => Number(v) || 0 });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        node.classList.add('in');
        return;
      }
      const io = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) {
          node.classList.add('in');
          io.disconnect();
        }
      }, { rootMargin: '0px 0px -8% 0px' });
      io.observe(node);
    });
  }
}
