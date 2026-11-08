/**
 * ─────────────────────────────────────────────────────────────
 *  ALL SITE CONTENT LIVES IN THIS FILE.
 *  Edit here — no component code needs to change.
 * ─────────────────────────────────────────────────────────────
 */

export interface Role {
  title: string;
  company: string;
  /** 1–2 letters shown in the company mark */
  short: string;
  /** brand-ish colour for the company mark */
  color: string;
  type: 'Full-time' | 'Contract';
  location: string;
  mode?: 'On-site' | 'Hybrid' | 'Remote';
  /** 'YYYY-MM' */
  start: string;
  /** 'YYYY-MM' — leave undefined for the current role */
  end?: string;
  /**
   * 2–4 achievement bullets. Lead with the outcome, include a number when possible.
   * e.g. 'Migrated 40+ screens from AngularJS to Angular 15, cutting load time 35%'
   */
  highlights: string[];
  /** tech used in this role, e.g. ['Angular 17', 'NgRx', 'Node.js'] */
  stack: string[];
}

export interface Project {
  title: string;
  /** e.g. 'Charter Communications · 2023' */
  context: string;
  /** one-sentence summary */
  summary: string;
  problem: string;
  approach: string;
  /** measurable results, e.g. ['Lighthouse 62 → 98', '−40% bundle size'] */
  impact: string[];
  stack: string[];
  link?: string;
}

export const PROFILE = {
  name: 'Mahesh A',
  firstName: 'Mahesh',
  title: 'Senior Full-Stack Developer',
  focus: 'UI Engineering · Angular · Micro Frontends',
  location: 'Irving, Texas',
  timeZone: 'America/Chicago',
  current: 'Randstad USA',
  years: 10,
  openTo: 'W2 full-time roles',
  linkedin: 'https://www.linkedin.com/in/mahesh-a-893a3116a',
  /** Optional — buttons appear automatically when these are filled in */
  email: '',
  github: '',
  /** e.g. '/resume.pdf' after dropping resume.pdf into /public */
  resumeUrl: '',
  /** link to this site's GitHub repo, shown in the footer */
  sourceUrl: '',
};

export const ROLES: Role[] = [
  {
    title: 'Senior Full-Stack Developer',
    company: 'Randstad USA',
    short: 'R',
    color: '#2175d9',
    type: 'Full-time',
    location: 'Plano, Texas',
    mode: 'Hybrid',
    start: '2025-10',
    highlights: [],
    stack: [],
  },
  {
    title: 'Senior Angular / Node Developer',
    company: 'Charter Communications',
    short: 'Ch',
    color: '#0b3c7d',
    type: 'Contract',
    location: 'Dallas, Texas',
    start: '2019-08',
    end: '2025-09',
    highlights: [],
    stack: [],
  },
  {
    title: 'UI Developer',
    company: 'MD State',
    short: 'MD',
    color: '#5b6b82',
    type: 'Contract',
    location: 'Baltimore, Maryland',
    mode: 'On-site',
    start: '2018-11',
    end: '2019-07',
    highlights: [],
    stack: [],
  },
  {
    title: 'UI Developer',
    company: 'TIAA',
    short: 'T',
    color: '#0d2a5c',
    type: 'Contract',
    location: 'Charlotte Metro',
    mode: 'On-site',
    start: '2017-03',
    end: '2018-09',
    highlights: [],
    stack: [],
  },
];

/**
 * Case studies. The "Selected work" section appears automatically
 * as soon as this array has at least one entry.
 */
export const PROJECTS: Project[] = [];

export const CAPABILITIES = [
  {
    title: 'Enterprise Angular & micro frontends',
    body: 'Leading and building complex, enterprise-grade Angular applications and micro-frontend architectures - from Angular 2 through 19.',
    tags: ['Angular', 'Micro Frontends', 'NgRx', 'RxJS'],
  },
  {
    title: 'Secure auth & real-time data',
    body: 'Integrating Auth0, GraphQL and JWT for secure, token-based authentication and real-time data access.',
    tags: ['Auth0', 'GraphQL', 'JWT'],
  },
  {
    title: 'Accessible, performant interfaces',
    body: 'WCAG-compliant, performance-optimised UIs built with Angular Material, SCSS and a close Figma-to-code workflow.',
    tags: ['WCAG', 'Angular Material', 'SCSS', 'Figma'],
  },
  {
    title: 'Quality & delivery automation',
    body: 'CI/CD pipelines with Jenkins and GitHub Actions, and end-to-end automation with Playwright and Cypress.',
    tags: ['Jenkins', 'Playwright', 'Cypress', 'CI/CD'],
  },
  {
    title: 'Full-stack services',
    body: 'Node.js, Express and Java Spring Boot services backed by MongoDB, Oracle, SQL Server and MySQL, deployed on AWS.',
    tags: ['Node.js', 'Spring Boot', 'AWS', 'SQL'],
  },
  {
    title: 'Leadership & mentoring',
    body: 'Collaborative leadership in agile teams, cross-functional coordination and mentoring junior developers.',
    tags: ['Agile', 'Mentoring', 'Code review'],
  },
];

/** A trailing * marks a core skill (highlighted). */
export const SKILLS: Record<string, string[]> = {
  Frontend: ['Angular (v2–19)*', 'TypeScript*', 'JavaScript (ES6+)*', 'RxJS*', 'NgRx', 'ReactJS', 'React Native', 'AngularJS', 'Redux', 'Angular Material', 'HTML5', 'CSS3', 'SCSS', 'Tailwind CSS', 'Bootstrap', 'Ionic', 'D3.js', 'jQuery', 'Ext JS'],
  Backend: ['Node.js*', 'Java*', 'Spring Boot*', 'GraphQL*', 'Express.js', 'RESTful APIs', 'Microservices', 'Server-Side Rendering', 'JSP', 'Apache Tomcat'],
  Data: ['SQL*', 'MongoDB', 'Oracle', 'SQL Server', 'MySQL'],
  'Cloud & DevOps': ['AWS Lambda', 'AWS SNS / SQS', 'AWS S3', 'CloudFormation', 'Docker', 'Jenkins', 'Git', 'GitHub Actions'],
  Testing: ['Cypress', 'Playwright', 'Jest', 'Mocha', 'Jasmine'],
  'Architecture & UX': ['Micro Frontends*', 'Accessibility (WCAG)*', 'Auth0', 'JWT', 'Responsive Design', 'Figma', 'Adobe Experience Manager'],
};

export const EDUCATION = [
  { degree: "Master's in Computer Science", school: 'University of the Cumberlands', period: '2015 - 2016' },
  { degree: 'B.Tech, Electrical & Electronics Engineering', school: 'Annamacharya Institute of Technology & Sciences, Rajampet', period: '2010 - 2014' },
];

export interface Recommendation {
  quote: string;
  name: string;
  /** e.g. 'Engineering Manager, Charter Communications' */
  role: string;
  /** e.g. 'Managed Mahesh directly' — as shown on LinkedIn */
  relationship?: string;
}

/**
 * Paste REAL recommendations from LinkedIn (with the author's permission).
 * Never write these yourself. The section appears once this has an entry.
 */
export const RECOMMENDATIONS: Recommendation[] = [];

export interface Era {
  id: string;
  /** when the platform shift happened (not when Mahesh used it) */
  period: string;
  title: string;
  body: string;
  /** skills from Mahesh's own profile that belong to this era */
  skills: string[];
  lang: 'js' | 'ts' | 'tsx';
  code: string;
}

/**
 * "Every era of the front end": the same tiny counter written the way each
 * platform generation would have written it. Dates are when each shift happened.
 */
export const ERAS: Era[] = [
  {
    id: 'jquery',
    period: 'jQuery era',
    title: 'Server pages, enhanced',
    body: 'Server-rendered JSP pages progressively enhanced with jQuery and AJAX, with Ext JS for data-heavy enterprise screens. The DOM was the state.',
    skills: ['jQuery', 'AJAX', 'JSP', 'Ext JS', 'Apache Tomcat'],
    lang: 'js',
    code: `var count = 0;

$('#inc').on('click', function () {
  count++;
  $('#count').text(count); // you update the DOM yourself
});`,
  },
  {
    id: 'angularjs',
    period: 'AngularJS 1.x',
    title: 'The first SPA wave',
    body: 'Two-way binding, controllers and $scope. Declarative templates arrived - along with digest cycles to reason about.',
    skills: ['AngularJS', 'JavaScript'],
    lang: 'js',
    code: `angular.module('app', [])
  .controller('CounterCtrl', function ($scope) {
    $scope.count = 0;
    $scope.inc = function () { $scope.count++; };
  });

// <button ng-click="inc()">{{ count }}</button>`,
  },
  {
    id: 'angular2',
    period: 'Angular 2+ · 2016',
    title: 'TypeScript, components, RxJS',
    body: 'A full rewrite: typed components, dependency injection, NgModules and reactive streams. State management with NgRx for large apps.',
    skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx'],
    lang: 'ts',
    code: `@Component({
  selector: 'app-counter',
  template: \`<button (click)="inc$.next()">{{ count$ | async }}</button>\`,
})
export class CounterComponent {
  inc$ = new Subject<void>();
  count$ = this.inc$.pipe(scan(n => n + 1, 0), startWith(0));
}
// …and declared in an NgModule`,
  },
  {
    id: 'react',
    period: 'React, alongside',
    title: 'Components as functions',
    body: 'Hooks, one-way data flow and Redux - plus React Native for mobile. Knowing both ecosystems sharpens decisions in each.',
    skills: ['ReactJS', 'Redux', 'React Native'],
    lang: 'tsx',
    code: `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>{count}</button>
  );
}`,
  },
  {
    id: 'standalone',
    period: 'Angular 14–15 · 2022',
    title: 'Standalone components',
    body: 'NgModules become optional. Components declare their own dependencies: simpler mental model, better tree-shaking, easier lazy loading.',
    skills: ['Angular', 'Micro Frontends'],
    lang: 'ts',
    code: `@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [AsyncPipe],
  template: \`<button (click)="inc$.next()">{{ count$ | async }}</button>\`,
})
export class CounterComponent { /* … */ }

bootstrapApplication(CounterComponent); // no AppModule`,
  },
  {
    id: 'signals',
    period: 'Angular 16–17 · 2023',
    title: 'Signals & built-in control flow',
    body: 'Fine-grained reactivity with signal(), computed() and effect(), and @if / @for in templates. Less RxJS for local state, faster rendering.',
    skills: ['Angular', 'TypeScript'],
    lang: 'ts',
    code: `@Component({
  selector: 'app-counter',
  template: \`
    <button (click)="count.update(n => n + 1)">{{ count() }}</button>
    @if (count() > 9) { <span>double digits</span> }
  \`,
})
export class CounterComponent {
  count = signal(0);
}`,
  },
  {
    id: 'zoneless',
    period: 'Angular 18–19 · 2024',
    title: 'Zoneless & hydration',
    body: 'No zone.js: signals tell Angular exactly what changed. Prerendered HTML hydrates in place, replaying early clicks. This site runs this way.',
    skills: ['Angular', 'Server-Side Rendering'],
    lang: 'ts',
    code: `bootstrapApplication(App, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
  ],
});
// ← this exact setup powers the page you're reading`,
  },
];
