const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');

test('site layout and component directories contain only the maintained implementation', () => {
  const expected = {
    _layouts: ['paper.html','site.html'],
    _includes: ['paper-links.html','profile-card.html','resume.html','site-navigation.html'],
    _sass: ['_content.scss','_cursors.scss','_documents.scss','_foundation.scss','_home.scss'],
    'assets/css': ['site.scss'],
  };
  for (const [directory, names] of Object.entries(expected)) assert.deepEqual(fs.readdirSync(path.join(root,directory)).sort(),names.sort());
  assert.doesNotMatch(read('_config.yml'), /^(?:theme|remote_theme):/m);
});

test('runtime dependencies are explicit and library license notices are shipped', () => {
  assert.deepEqual(Object.keys(JSON.parse(read('package.json')).dependencies),['gsap']);
  const lock = read('Gemfile.lock');
  assert.doesNotMatch(lock, /^    jekyll-theme-/m);
  const js = read('assets/js/home-motion.min.js');
  assert.match(js, /@license Copyright 2026, GreenSock/);
  assert.match(js, /https:\/\/gsap.com\/standard-license/);
  for (const file of ['assets/licenses/GSAP-NOTICE.txt','assets/licenses/site-MIT.txt','assets/fonts/MapleMono-OFL.txt','assets/fonts/LXGWWenKai-OFL.txt']) assert.equal(read('_site/'+file),read(file));
  assert.equal(read('LICENSE'),read('assets/licenses/site-MIT.txt'));
});
