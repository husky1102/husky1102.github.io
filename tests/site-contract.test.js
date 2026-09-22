const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const output = path.join(__dirname, '../_site');
const pages = {
  'index.html': ['克苏鲁微糖', 'Embodied AI', 'Agent Memory'],
  'about/index.html': ['研究关注', '持续学习'],
  'cv/index.html': ['Education', 'Research Interests'],
  'cv_zh/index.html': ['教育经历', '研究兴趣'],
  'blog_embed/index.html': ['blog-frame', '返回主页'],
  'terms/index.html': ['浏览器本地设置', '博客与外部链接'],
  'sitemap/index.html': ['sitemap.xml'],
  '404.html': ['页面走丢了', '回到首页'],
};

for (const [file, expected] of Object.entries(pages)) {
  test(`published content contract: ${file}`, () => {
    const html = fs.readFileSync(path.join(output, file), 'utf8');
    for (const text of expected) assert.ok(html.includes(text), `${file}: ${text}`);
    assert.equal((html.match(/\bid="main"/g) || []).length, 1);
    assert.match(html, /href="#main"/);
    for (const [, resource] of html.matchAll(/(?:src|href)="([^"]+\.(?:css|js|webp|png|woff2))(?:\?[^"]*)?"/g)) {
      const url = new URL(resource, 'https://husky1102.github.io');
      if (url.origin === 'https://husky1102.github.io') {
        assert.ok(fs.existsSync(path.join(output, decodeURIComponent(url.pathname))), `${file}: missing ${resource}`);
      }
    }
  });
}

test('historical personal entry points still resolve to their current pages', () => {
  for (const [file, target] of [['about.html', '/about/'], ['resume.html', '/cv/'], ['resume_zh.html', '/cv_zh/']]) {
    const html = fs.readFileSync(path.join(output, file), 'utf8');
    assert.ok(html.includes(`https://husky1102.github.io${target}`), file);
  }
});
