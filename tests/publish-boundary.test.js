const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const site = path.join(root, "_site");

const assertBuiltSite = () => {
  assert.ok(fs.existsSync(path.join(site, "index.html")), "Run `bundle exec jekyll build` before publish boundary tests.");
  assert.ok(fs.existsSync(path.join(site, "sitemap.xml")), "Generated sitemap.xml is required for publish boundary tests.");
};
const existsInSite = (relativePath) => fs.existsSync(path.join(site, relativePath));

const walk = (dir) => {
  assert.ok(fs.existsSync(dir), "Generated _site directory is required for publish boundary tests.");

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return path.relative(site, fullPath);
  });
};

test("Publish output excludes development files and local tool state", () => {
  assertBuiltSite();
  const forbiddenPaths = [
    "scripts", "tests", "docs", ".git", ".github", ".agents", ".codex", ".cowork",
    ".claude", ".impeccable", ".devcontainer", ".fonttools-local", ".bundle",
    "node_modules", "vendor", "CONTRIBUTING.md", "README.md", "Gemfile", "Gemfile.lock",
    "package.json", "package-lock.json", "requirements-assets.txt", "skills-lock.json",
    "Dockerfile", "docker-compose.yaml",
  ];
  assert.deepEqual(forbiddenPaths.filter(existsInSite), []);
});

test("Publish output excludes notebooks, caches and dependency metadata", () => {
  assertBuiltSite();
  const leakedFiles = walk(site).filter((relativePath) => {
    const fileName = path.basename(relativePath);
    return fileName.endsWith(".ipynb") || fileName.endsWith("-lock.json") ||
      fileName.endsWith(".pyc") || fileName === ".DS_Store" || relativePath.split(path.sep).includes("__pycache__");
  });
  assert.deepEqual(leakedFiles, [], `Unexpected public files: ${leakedFiles.join(", ")}`);
});

test("privacy page describes only the integrations that are actually active", () => {
  assertBuiltSite();

  const terms = fs.readFileSync(path.join(site, "terms", "index.html"), "utf8");

  assert.doesNotMatch(terms, /Disqus|Third-party advertisers|Google Analytics/);
  assert.match(terms, /GitHub Pages/);
  assert.match(terms, /本地存储/);
  assert.match(terms, /博客原站/);
});
