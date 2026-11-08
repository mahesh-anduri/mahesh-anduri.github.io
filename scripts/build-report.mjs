// Collects the results of this CI run into build-report.json, which the
// "How it's built" page reads at runtime. Every number on that page comes from here.
//
// Inputs (all optional; missing ones are simply left out):
//   unit-tests.log                 Karma output         → unit test counts
//   coverage/coverage-summary.json karma-coverage       → line coverage
//   test-results/e2e.json          Playwright JSON      → e2e counts + axe results
//   lhci-report/manifest.json      Lighthouse CI        → category scores per page
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const OUT = 'dist/mahesh-portfolio/browser';
const BUDGET_KB = 120; // compressed initial JS + CSS
const read = (f, parse = JSON.parse) => (existsSync(f) ? parse(readFileSync(f, 'utf8')) : undefined);
const env = process.env;

const report = {
  generatedAt: new Date().toISOString(),
  commit: env.GITHUB_SHA || 'local',
};
if (env.GITHUB_SHA && env.GITHUB_REPOSITORY) {
  const repo = `${env.GITHUB_SERVER_URL || 'https://github.com'}/${env.GITHUB_REPOSITORY}`;
  report.commitUrl = `${repo}/commit/${env.GITHUB_SHA}`;
  if (env.GITHUB_RUN_ID) report.runUrl = `${repo}/actions/runs/${env.GITHUB_RUN_ID}`;
}

// ── Unit tests (Karma) ─────────────────────────────────────────
const tests = {};
const unitLog = read('unit-tests.log', s => s.replace(/\x1b\[[0-9;]*m/g, ''));
if (unitLog) {
  const runs = [...unitLog.matchAll(/Executed (\d+) of (\d+)(?: \((\d+) FAILED\))?/g)];
  const last = runs[runs.length - 1];
  if (last) {
    const total = Number(last[2]);
    tests.unit = { passed: total - Number(last[3] || 0), total };
  }
  const cov = read('coverage/coverage-summary.json');
  if (cov && tests.unit) tests.unit.coverage = Math.round(cov.total.lines.pct);
}

// ── E2E + accessibility (Playwright) ───────────────────────────
const e2e = read('test-results/e2e.json');
if (e2e) {
  const { expected = 0, unexpected = 0, flaky = 0 } = e2e.stats;
  tests.e2e = { passed: expected + flaky, total: expected + flaky + unexpected };
  const specs = [];
  const walk = s => { (s.specs || []).forEach(sp => specs.push(sp)); (s.suites || []).forEach(walk); };
  e2e.suites.forEach(walk);
  const axe = specs.filter(sp => sp.title.includes('axe'));
  if (axe.length) {
    report.axe = {
      violations: axe.filter(sp => !sp.ok).length,
      pages: new Set(axe.map(sp => sp.title.replace(/ has no axe.*/, ''))).size,
    };
  }
}
if (Object.keys(tests).length) report.tests = tests;

// ── Lighthouse ─────────────────────────────────────────────────
const manifest = read('lhci-report/manifest.json');
if (manifest) {
  report.lighthouse = {};
  for (const run of manifest.filter(r => r.isRepresentativeRun)) {
    const path = new URL(run.url).pathname;
    const s = run.summary;
    report.lighthouse[path] = {
      performance: Math.round(s.performance * 100),
      accessibility: Math.round(s.accessibility * 100),
      bestPractices: Math.round(s['best-practices'] * 100),
      seo: Math.round(s.seo * 100),
    };
  }
}

// ── Bundle size: what the browser downloads before first render ──
const html = readFileSync(join(OUT, 'index.html'), 'utf8');
const initial = new Set([
  ...[...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map(m => m[1]),
  ...[...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+)"/g)].map(m => m[1]),
  ...[...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+\.css)"/g)].map(m => m[1]),
]);
let raw = 0;
let gz = 0;
for (const f of initial) {
  const file = join(OUT, f.replace(/^.*\//, ''));
  if (!existsSync(file)) continue;
  const buf = readFileSync(file);
  raw += buf.length;
  gz += gzipSync(buf, { level: 9 }).length;
}
report.bundle = { initialKB: Math.round(raw / 1024), transferKB: Math.round(gz / 1024), budgetKB: BUDGET_KB };

writeFileSync(join(OUT, 'build-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (gz / 1024 > BUDGET_KB) {
  console.error(`::error::Initial bundle ${Math.round(gz / 1024)} kB exceeds the ${BUDGET_KB} kB budget`);
  process.exit(1);
}
