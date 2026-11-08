import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROJECTS, RECOMMENDATIONS } from '../data/profile';
import { AboutComponent } from '../sections/about.component';
import { CapabilitiesComponent } from '../sections/capabilities.component';
import { ContactComponent } from '../sections/contact.component';
import { ErasComponent } from '../sections/eras.component';
import { ExperienceComponent } from '../sections/experience.component';
import { HeroComponent } from '../sections/hero.component';
import { ProjectsComponent } from '../sections/projects.component';
import { RecommendationsComponent } from '../sections/recommendations.component';
import { ToolkitComponent } from '../sections/toolkit.component';

/** Section order. Optional sections drop out (and numbering closes up) when their data is empty. */
export const HOME_SECTIONS = [
  'about',
  'capabilities',
  'experience',
  ...(PROJECTS.length ? ['work'] : []),
  'eras',
  'toolkit',
  ...(RECOMMENDATIONS.length ? ['recommendations'] : []),
  'contact',
] as const;

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent, AboutComponent, CapabilitiesComponent, ExperienceComponent, ProjectsComponent,
    ErasComponent, ToolkitComponent, RecommendationsComponent, ContactComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
    <app-about [index]="n('about')" />
    <app-capabilities [index]="n('capabilities')" />
    <app-experience [index]="n('experience')" />
    @if (hasProjects) { <app-projects [index]="n('work')" /> }
    <app-eras [index]="n('eras')" />
    <app-toolkit [index]="n('toolkit')" />
    @if (hasRecommendations) { <app-recommendations [index]="n('recommendations')" /> }
    <app-contact [index]="n('contact')" />
  `,
})
export class HomeComponent {
  readonly hasProjects = PROJECTS.length > 0;
  readonly hasRecommendations = RECOMMENDATIONS.length > 0;

  n(id: string): string {
    return String((HOME_SECTIONS as readonly string[]).indexOf(id) + 1).padStart(2, '0');
  }
}
