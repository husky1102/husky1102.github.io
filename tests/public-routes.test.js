const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const site = path.join(root, "_site");

const assertBuiltSite = () => {
  assert.ok(fs.existsSync(path.join(site, "index.html")), "Run `bundle exec jekyll build` before public route tests.");
  assert.ok(fs.existsSync(path.join(site, "sitemap.xml")), "Generated sitemap.xml is required for public route tests.");
};
const existsInSite = (relativePath) => fs.existsSync(path.join(site, relativePath));
const readGenerated = (relativePath) => fs.readFileSync(path.join(site, relativePath), "utf8");

test("generated site exists before public route assertions", () => {
  assertBuiltSite();
});

test("primary pages expose non-empty description and Open Graph description metadata", () => {
  assertBuiltSite();

  const primaryPages = [
    "index.html",
    "about/index.html",
    "cv/index.html",
    "cv_zh/index.html",
    "blog_embed/index.html",
  ];

  for (const page of primaryPages) {
    const html = readGenerated(page);
    assert.match(
      html,
      /<meta property="og:description" name="description" content="[^"]+">/,
      `${page} should expose its resolved SEO description.`
    );
    assert.match(html, /<link rel="canonical" href="https:\/\/husky1102\.github\.io\//);
  }
});

test("homepage motion assets load only on the homepage", () => {
  assertBuiltSite();

  const home = readGenerated("index.html");
  const about = readGenerated("about/index.html");
  assert.match(home, /assets\/js\/main\.min\.js[\s\S]*assets\/js\/home-motion\.min\.js/);
  assert.doesNotMatch(about, /assets\/js\/home-motion\.min\.js/);
  assert.ok(existsInSite("assets/js/home-motion.min.js"));
  assert.ok(!existsInSite("assets/js/_home-motion.js"));
});

test("HTML sitemap links have titles and resolve to published pages", () => {
  assertBuiltSite();
  const sitemap = readGenerated("sitemap/index.html");
  const links = Array.from(
    sitemap.matchAll(/<h2 class="archive__item-title"[^>]*>\s*<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g),
    ([, href, title]) => ({ href, title: title.replace(/<[^>]+>/g, "").trim() })
  );
  assert.ok(links.length > 0, "The sitemap should list content pages.");
  assert.equal(new Set(links.map(link => link.href)).size, links.length);
  for (const { href, title } of links) {
    assert.ok(title, `Missing title for ${href}`);
    const url = new URL(href);
    assert.equal(url.origin, "https://husky1102.github.io");
    const relativePath = decodeURIComponent(url.pathname).replace(/^\//, "");
    const target = relativePath.endsWith("/") || !relativePath ? `${relativePath}index.html` : relativePath;
    assert.ok(existsInSite(target), `Sitemap destination does not exist: ${href}`);
    assert.doesNotMatch(target, /^(?:assets|images|docs|scripts|tests)\//);
  }
  for (const page of ["index.html", "about/index.html", "cv/index.html", "cv_zh/index.html", "blog_embed/index.html"]) {
    const canonical = readGenerated(page).match(/<link rel="canonical" href="([^"]+)"/)[1];
    assert.ok(links.some(link => link.href === canonical), `Missing sitemap entry for ${page}`);
  }
});

test("CV pages expose their document language and locale", () => {
  for (const [page, language, locale] of [["cv/index.html", "en", "en-US"], ["cv_zh/index.html", "zh", "zh-CN"]]) {
    const html = readGenerated(page);
    assert.match(html, new RegExp(`<html[^>]+lang="${language}"`));
    assert.match(html, new RegExp(`<meta property="og:locale" content="${locale}"`));
  }
});

test("Primary pages expose a single main landmark", () => {
  for (const page of ["index.html", "about/index.html", "cv/index.html", "cv_zh/index.html", "blog_embed/index.html"]) {
    assert.equal((readGenerated(page).match(/<(?:main\b|[^>]+\brole="main")/g) || []).length, 1, page);
  }
});

test("Blog iframe has an accessible name and an independent reading link", () => {
  const blog = readGenerated("blog_embed/index.html");
  const frame = blog.match(/<iframe\b[^>]*>/)?.[0];
  assert.ok(frame, "Blog page should provide an iframe.");
  assert.match(frame, /title="[^"]+"/);
  assert.match(frame, /src="https:\/\/www\.husky1102\.top\/"/);
  assert.match(blog, /href="https:\/\/www\.husky1102\.top\/" target="_blank" rel="noopener noreferrer"/);
});
