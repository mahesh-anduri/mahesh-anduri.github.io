import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from '../core/reveal.directive';

@Component({
  selector: 'app-section-head',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sec-head" appReveal>
      <p class="sec-label"><b>§ {{ index() }}</b><span>{{ label() }}</span></p>
      @if (aside()) { <p class="sec-aside">{{ aside() }}</p> }
      <h2 class="sec-title" [id]="titleId()"><ng-content /></h2>
    </header>
  `,
})
export class SectionHeadComponent {
  readonly index = input.required<string>();
  readonly label = input.required<string>();
  readonly titleId = input.required<string>();
  readonly aside = input('');
}
