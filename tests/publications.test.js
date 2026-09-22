const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');

test('a publication produces a detail page and bilingual resume entries with only available resources', () => {
  // Resolve macOS /var -> /private/var before Jekyll safe-mode path checks.
  const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'husky-paper-')));
  try {
    for (const name of ['_layouts', '_includes', '_data', '_config.yml']) fs.cpSync(path.join(root, name), path.join(temp, name), {recursive:true});
    fs.mkdirSync(path.join(temp, '_pages'));
    for (const name of ['cv.md','cv_zh.md']) fs.copyFileSync(path.join(root, '_pages', name), path.join(temp, '_pages', name));
    fs.mkdirSync(path.join(temp, '_publications'));
    fs.writeFileSync(path.join(temp, '_publications', 'sample.md'), `---
title: Example study
date: 2026-09-01
venue: Example venue
citation: Author, Example study, 2026.
paperurl: https://example.com/paper.pdf
codeurl: https://example.com/code
---
A publication abstract.
`);
    const output = path.join(temp, 'output');
    const build = spawnSync('bundle', ['exec','jekyll','build','--safe','--source',temp,'--destination',output], {cwd:root,encoding:'utf8'});
    assert.equal(build.status, 0, build.stdout + build.stderr);
    const detail = fs.readFileSync(path.join(output,'publications/sample/index.html'),'utf8');
    for (const text of ['Example study','Example venue','Author, Example study, 2026.','A publication abstract.','https://example.com/paper.pdf','https://example.com/code']) assert.ok(detail.includes(text), text);
    assert.equal((detail.match(/<h1\b/g)||[]).length,1);
    for (const route of ['cv','cv_zh']) {
      const cv = fs.readFileSync(path.join(output,route,'index.html'),'utf8');
      assert.ok(cv.includes('/publications/sample/'));
      assert.ok(cv.includes('https://example.com/paper.pdf'));
      assert.doesNotMatch(cv, /href=""/);
    }
  } finally { fs.rmSync(temp, {recursive:true,force:true}); }
});
