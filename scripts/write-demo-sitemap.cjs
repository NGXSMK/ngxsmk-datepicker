const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const output = path.join(__dirname, '../dist/demo-app');
const browser = path.join(output, 'browser');
const { routes } = JSON.parse(fs.readFileSync(path.join(output, 'prerendered-routes.json'), 'utf8'));
const index = fs.readFileSync(path.join(browser, 'index.html'), 'utf8');
const canonicalPattern = /<link rel="canonical" href="([^"]+)">/g;
const homeCanonical = [...index.matchAll(canonicalPattern)];
assert.equal(homeCanonical.length, 1, 'Expected exactly one canonical URL on the prerendered homepage');

const home = new URL(homeCanonical[0][1]);
const homeRoute = home.pathname.replace(/\/$/, '');
assert(Object.hasOwn(routes, homeRoute), 'The prerender manifest is missing the homepage');

const titles = new Set();
const descriptions = new Set();
const urls = Object.keys(routes)
  .sort()
  .map((route) => {
    assert(route === homeRoute || route.startsWith(home.pathname), `Unexpected demo route: ${route}`);
    const relativeRoute = route === homeRoute ? '' : route.slice(home.pathname.length);
    const html = fs.readFileSync(path.join(browser, relativeRoute, 'index.html'), 'utf8');
    const canonical = [...html.matchAll(canonicalPattern)].map(([, url]) => url);
    const expectedUrl = new URL(`${route}/`, home.origin).href;
    assert.deepEqual(canonical, [expectedUrl], `Unexpected canonical URL for ${route}`);
    assert.match(html, /<h1[\s>][^>]*>\s*\S/, `Missing prerendered heading for ${route}`);

    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1];
    assert(title && !titles.has(title), `Missing or duplicate title for ${route}`);
    assert(description && !descriptions.has(description), `Missing or duplicate description for ${route}`);
    titles.add(title);
    descriptions.add(description);
    return expectedUrl;
  });

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => `  <url><loc>${url.replaceAll('&', '&amp;')}</loc></url>`),
  '</urlset>',
  '',
].join('\n');
fs.writeFileSync(path.join(browser, 'sitemap.xml'), sitemap);
console.log(`Wrote sitemap for ${urls.length} verified demo pages.`);
