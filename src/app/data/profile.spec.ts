import { monthIndex } from '../core/dates';
import { CAPABILITIES, ERAS, PROFILE, PROJECTS, RECOMMENDATIONS, ROLES, SKILLS } from './profile';

/** Content guard-rails: catch typos in profile.ts before they reach the live site. */
describe('profile content', () => {
  it('has well-formed role dates, newest first, without overlaps', () => {
    const ym = /^\d{4}-(0[1-9]|1[0-2])$/;
    ROLES.forEach(r => {
      expect(r.start).withContext(r.company).toMatch(ym);
      if (r.end) {
        expect(r.end).withContext(r.company).toMatch(ym);
        expect(monthIndex(r.end)).withContext(r.company).toBeGreaterThanOrEqual(monthIndex(r.start));
      }
    });
    for (let i = 1; i < ROLES.length; i++) {
      const newer = ROLES[i - 1];
      const older = ROLES[i];
      expect(monthIndex(older.end!)).withContext(`${older.company} vs ${newer.company}`).toBeLessThan(monthIndex(newer.start));
    }
  });

  it('has exactly one current role', () => {
    expect(ROLES.filter(r => !r.end).length).toBe(1);
  });

  it('lists each skill once', () => {
    const all = Object.values(SKILLS).flat().map(s => s.replace(/\*$/, '').toLowerCase());
    expect(new Set(all).size).toBe(all.length);
  });

  it('uses unique ids and titles', () => {
    expect(new Set(ERAS.map(e => e.id)).size).toBe(ERAS.length);
    expect(new Set(CAPABILITIES.map(c => c.title)).size).toBe(CAPABILITIES.length);
    expect(new Set(PROJECTS.map(p => p.title)).size).toBe(PROJECTS.length);
  });

  it('only links to https URLs', () => {
    const urls = [PROFILE.linkedin, PROFILE.github, PROFILE.sourceUrl, ...PROJECTS.map(p => p.link ?? '')].filter(Boolean);
    urls.forEach(u => expect(u).toMatch(/^https:\/\//));
  });

  it('has complete case studies and recommendations when present', () => {
    const incompleteProjects = PROJECTS.filter(p => !(p.impact.length && p.problem && p.approach && p.summary)).map(p => p.title);
    const incompleteRecs = RECOMMENDATIONS.filter(r => !(r.quote && r.name && r.role)).map(r => r.name || '(unnamed)');
    expect(incompleteProjects).toEqual([]);
    expect(incompleteRecs).toEqual([]);
  });
});
