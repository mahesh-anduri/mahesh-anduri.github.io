// One-time setup after creating the GitHub repo:
//   node scripts/set-repo.mjs <owner>/<repo>
// Points the README badges and the site's "View source" link at your repo.
import { readFileSync, writeFileSync } from 'node:fs';

const slug = process.argv[2];
if (!/^[\w.-]+\/[\w.-]+$/.test(slug || '')) {
  console.error('Usage: node scripts/set-repo.mjs <owner>/<repo>');
  process.exit(1);
}
const url = `https://github.com/${slug}`;

const readme = readFileSync('README.md', 'utf8').replaceAll('OWNER/REPO', slug);
writeFileSync('README.md', readme);

const profile = readFileSync('src/app/data/profile.ts', 'utf8')
  .replace(/sourceUrl: '[^']*'/, `sourceUrl: '${url}'`);
writeFileSync('src/app/data/profile.ts', profile);

console.log(`✔ README badges and sourceUrl now point to ${url}`);
