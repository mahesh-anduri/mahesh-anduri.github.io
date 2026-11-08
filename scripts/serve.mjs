// Minimal static server that mimics GitHub Pages, including serving under a sub-path.
// Usage: node scripts/serve.mjs [port]   (env BASE=/repo/ to serve under a sub-path)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = new URL('../dist/mahesh-portfolio/browser/', import.meta.url).pathname;
const BASE = (process.env.BASE || '/').replace(/\/?$/, '/');
const PORT = Number(process.argv[2] || process.env.PORT || 4300);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain',
};

async function resolve(path) {
  const file = normalize(join(ROOT, path));
  if (!file.startsWith(ROOT)) return null;
  try {
    const s = await stat(file);
    if (s.isDirectory()) return resolve(join(path, 'index.html'));
    return file;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  let path = decodeURIComponent(url.pathname);
  if (!path.startsWith(BASE)) {
    if (path === BASE.slice(0, -1)) { res.writeHead(301, { Location: BASE }).end(); return; }
    res.writeHead(404).end('Not under base path');
    return;
  }
  path = path.slice(BASE.length);
  const file = await resolve(path);
  if (file) {
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
    return;
  }
  const fallback = (await resolve('404.html')) || (await resolve('index.html'));
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fallback ? await readFile(fallback) : 'Not found');
}).listen(PORT, () => console.log(`Serving ${ROOT} at http://localhost:${PORT}${BASE}`));
