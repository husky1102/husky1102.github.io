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

const walk = (dir) => {
  assert.ok(fs.existsSync(dir), "Generated _site directory is required for public route tests.");

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return fullPath;
  });
};

test("generated site exists before public route assertions", () => {
  assertBuiltSite();
});

test("template-only and talkmap routes are not generated", () => {
  assertBuiltSite();

  const absentRoutes = [
    "talkmap.html",
    "talkmap",
    "markdown",
    "markdown.html",
    "md",
    "page-archive",
    "collection-archive",
    "portfolio",
    "publications",
    "teaching",
    "talks",
  ];

  const leakedRoutes = absentRoutes.filter(existsInSite);
  assert.deepEqual(leakedRoutes, [], `Unexpected public routes: ${leakedRoutes.join(", ")}`);
});

test("sitemap omits template-only and talkmap routes", () => {
  assertBuiltSite();

  const sitemap = readGenerated("sitemap.xml");
  const forbiddenUrls = [
    "/talkmap.html",
    "/talkmap/",
    "/markdown/",
    "/page-archive/",
    "/collection-archive/",
    "/portfolio/",
    "/publications/",
    "/teaching/",
    "/talks/",
  ];

  for (const url of forbiddenUrls) {
    assert.doesNotMatch(sitemap, new RegExp(url.replaceAll("/", "\\/")));
  }
});

test("sample talk content is absent from generated text assets", () => {
  assertBuiltSite();

  const textExtensions = new Set([".css", ".html", ".js", ".json", ".txt", ".xml"]);
  const generatedText = walk(site)
    .filter((file) => textExtensions.has(path.extname(file)))
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n");

  for (const sampleText of [
    "UC San Francisco",
    "UC-Berkeley Institute",
    "London School of Testing",
    "Testing Institute of America",
    "Talk 1 on Relevant Topic",
  ]) {
    assert.doesNotMatch(generatedText, new RegExp(sampleText));
  }
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

test("HTML sitemap lists only titled, user-facing content pages", () => {
  assertBuiltSite();

  const sitemap = readGenerated("sitemap/index.html");
  const listedPages = Array.from(
    sitemap.matchAll(/<h2 class="archive__item-title"[^>]*>\s*<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g),
    ([, href, title]) => ({ href, title: title.replace(/<[^>]+>/g, "").trim() })
  );

  assert.deepEqual(
    listedPages,
    [
      { href: "https://husky1102.github.io/about/", title: "About" },
      { href: "https://husky1102.github.io/blog_embed/", title: "个人博客" },
      { href: "https://husky1102.github.io/categories/", title: "Posts by Category" },
      { href: "https://husky1102.github.io/cv/", title: "CV" },
      { href: "https://husky1102.github.io/cv_zh/", title: "简历" },
      { href: "https://husky1102.github.io/", title: "Husky1102" },
      { href: "https://husky1102.github.io/tags/", title: "Posts by Tags" },
      { href: "https://husky1102.github.io/terms/", title: "隐私说明" },
      { href: "https://husky1102.github.io/year-archive/", title: "Blog posts" },
    ]
  );
});
