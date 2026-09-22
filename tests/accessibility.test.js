const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

test('page navigation has named native controls and a stable menu target', () => {
  const html = read('_site/index.html');
  assert.match(html, /<button[^>]+class="menu-toggle"[^>]+aria-controls="site-links"/);
  assert.match(html, /id="site-links"/);
  assert.match(html, /<button[^>]+id="theme-toggle"[^>]+aria-label="[^"]+"/);
  assert.match(html, /class="skip-link" href="#main"/);
  assert.match(html, /<main id="main" tabindex="-1"/);
});

test('profile links use native keyboard accessible disclosure', () => {
  assert.match(read('_site/terms/index.html'), /<details class="profile-links"><summary>[^<]+<\/summary><ul>/);
});

test('document styles support focus indicators and horizontally scrolling tables', () => {
  const css = read('_sass/_foundation.scss');
  assert.match(css, /:focus-visible \{ outline: 2px solid var\(--accent\)/);
  assert.match(css, /table \{[^}]+overflow-x: auto/);
});
