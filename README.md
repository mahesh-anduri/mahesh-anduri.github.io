# Mahesh A - Portfolio

[![Verify & deploy](https://github.com/OWNER/REPO/actions/workflows/deploy.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/deploy.yml)
![Angular 19](https://img.shields.io/badge/Angular-19-dd0031?logo=angular&logoColor=white)
![Zoneless](https://img.shields.io/badge/change%20detection-zoneless-121211)
![WCAG 2.2 AA](https://img.shields.io/badge/a11y-WCAG%202.2%20AA%20·%20axe%20in%20CI-17773f)
![Lighthouse](https://img.shields.io/badge/Lighthouse-checked%20every%20deploy-f4b400?logo=lighthouse&logoColor=white)

Personal portfolio of a senior UI & full-stack developer, built as a production-grade Angular 19 app.
**Live scores, test counts and bundle size for the current deploy are on the site's "How it's built" page**, written there by CI on every release.

## Quality gates

Every push and pull request runs the full pipeline. A failure in gates 1–2 blocks the release; the live site keeps the last good version.

| Gate | Tool | What it checks | Blocks deploy |
| --- | --- | --- | --- |
| 1. Unit tests | Karma + Jasmine | Components, keyboard patterns, content integrity, utilities (+ coverage) | ✅ |
| 2. End-to-end | Playwright (desktop + mobile) | Real user flows, no console errors, works without JavaScript, no horizontal overflow | ✅ |
| 2. Accessibility | axe-core | WCAG 2.2 AA on every page, light + dark theme | ✅ |
| 3. Performance | Lighthouse CI | Performance, accessibility, best practices, SEO (3 runs, median) | warns only |
| 4. Bundle budget | `scripts/build-report.mjs` | Initial JS + CSS ≤ 120 kB compressed | ✅ |

Test, coverage and Lighthouse reports are attached to each run as the `quality-reports` artifact.

## Highlights

- **Angular 19, modern APIs only:** standalone components, signals / `computed` / `effect`, `input()`, built-in control flow, `afterNextRender`, zoneless change detection
- **Static prerendering + hydration with event replay:** every route ships as real HTML and works with JavaScript disabled
- **Accessibility by construction:** landmarks, skip link, visible focus, WAI-ARIA dialog / combobox / tabs patterns with full keyboard support, reduced-motion support, contrast checked in both themes
- **View Transitions API:** circular theme reveal and route cross-fades, with a graceful fallback
- **Live Web Vitals:** measured in the visitor's browser with `PerformanceObserver`; nothing is sent anywhere
- **No UI library and no third-party requests:** design tokens in CSS, self-hosted fonts, WebP images
- **Content as data:** one typed file drives the whole site, and sections appear when their data exists

## Edit the content

Everything shown on the site lives in **`src/app/data/profile.ts`**:

| What | Where |
| --- | --- |
| Email, GitHub, résumé | `PROFILE` (buttons appear automatically) |
| Achievements per job | `ROLES[n].highlights` and `ROLES[n].stack` |
| Case studies | `PROJECTS` ("Selected work" appears once it has an entry) |
| Recommendations | `RECOMMENDATIONS` (paste real ones from LinkedIn only) |
| Capabilities, skills, education, eras | `CAPABILITIES`, `SKILLS`, `EDUCATION`, `ERAS` |

Unit tests guard the content: bad dates, overlapping roles, duplicate skills or non-https links fail CI before they reach the live site.

For a résumé download, put `resume.pdf` in `public/` and set `resumeUrl: 'resume.pdf'`.

## Run locally

```bash
npm ci
npm start            # dev server → http://localhost:4200
npm test             # unit tests (watch)
npm run build        # production build → dist/mahesh-portfolio/browser
npm run e2e          # Playwright e2e + axe (run after build; first time: npx playwright install chromium)
npm run verify       # everything CI blocks on
```

Requires Node 22 (see `.nvmrc`).

## Deploy to GitHub Pages

1. Create a GitHub repo named **`<username>.github.io`** to get `https://<username>.github.io/`. Any other name is served from `/<repo>/`, and the pipeline handles both.
2. Point the badges and the "View source" link at your repo, then push:
   ```bash
   node scripts/set-repo.mjs <username>/<repo>
   git init && git add . && git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Watch the **Actions** tab. When the run is green, the site is live.

## Structure

```
src/app/
  data/profile.ts            ← all content (+ profile.spec.ts content checks)
  pages/                     ← home, how-its-built (lazy-loaded)
  sections/                  ← one standalone component per section
  core/                      ← UI state (signals), reveal directive, web vitals, highlighter, dates
e2e/                         ← Playwright flows + axe accessibility audit
scripts/                     ← GitHub Pages-style server, CI build report, repo setup
.github/workflows/deploy.yml ← verify → deploy pipeline
```
