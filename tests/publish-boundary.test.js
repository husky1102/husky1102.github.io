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
const existsInRoot = (relativePath) => fs.existsSync(path.join(root, relativePath));

const walk = (dir) => {
  assert.ok(fs.existsSync(dir), "Generated _site directory is required for publish boundary tests.");

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return path.relative(site, fullPath);
  });
};

test("generated site exists before publish boundary assertions", () => {
  assertBuiltSite();
});

test("publish boundary excludes source-only maintenance artifacts", () => {
  assertBuiltSite();

  const forbiddenPaths = [
    "scripts",
    "markdown_generator",
    "review",
    ".agents",
    ".cowork",
    "CONTRIBUTING.md",
    "talkmap.ipynb",
    "talkmap_out.ipynb",
    "talkmap.py",
    "package-lock.json",
    "skills-lock.json",
    "docker-compose.yaml",
  ];

  const leakedPaths = forbiddenPaths.filter(existsInSite);
  assert.deepEqual(leakedPaths, [], `Unexpected public artifacts: ${leakedPaths.join(", ")}`);
});

test("publish boundary excludes notebooks and lockfile-style generated metadata", () => {
  assertBuiltSite();

  const leakedFiles = walk(site).filter((relativePath) => {
    const fileName = path.basename(relativePath);
    return fileName.endsWith(".ipynb") || fileName.endsWith("-lock.json");
  });

  assert.deepEqual(leakedFiles, [], `Unexpected public files: ${leakedFiles.join(", ")}`);
});

test("template publication sample files are absent from source and generated site", () => {
  assertBuiltSite();

  const samplePublicationFiles = [
    "files/bibtex1.bib",
    "files/paper1.pdf",
    "files/paper2.pdf",
    "files/paper3.pdf",
    "files/slides1.pdf",
    "files/slides2.pdf",
    "files/slides3.pdf",
  ];

  const remainingSourceFiles = samplePublicationFiles.filter(existsInRoot);
  assert.deepEqual(remainingSourceFiles, [], `Unexpected template files in source: ${remainingSourceFiles.join(", ")}`);

  const leakedGeneratedFiles = samplePublicationFiles.filter(existsInSite);
  assert.deepEqual(leakedGeneratedFiles, [], `Unexpected template files in _site: ${leakedGeneratedFiles.join(", ")}`);

  const sitemap = fs.readFileSync(path.join(site, "sitemap.xml"), "utf8");
  for (const file of samplePublicationFiles) {
    assert.doesNotMatch(sitemap, new RegExp(file.replaceAll("/", "\\/").replaceAll(".", "\\.")));
  }
});

test("removed JSON CV path does not leave source artifacts or sample output", () => {
  assertBuiltSite();

  const deletedSourcePaths = [
    "_data/cv.json",
    "_includes/cv-template.html",
    "scripts/cv_markdown_to_json.py",
    "scripts/update_cv_json.sh",
  ];
  const remainingSourcePaths = deletedSourcePaths.filter(existsInRoot);
  assert.deepEqual(remainingSourcePaths, [], `Unexpected JSON CV artifacts: ${remainingSourcePaths.join(", ")}`);

  const generatedText = walk(site)
    .filter((relativePath) => [".html", ".json", ".xml"].includes(path.extname(relativePath)))
    .map((relativePath) => fs.readFileSync(path.join(site, relativePath), "utf8"))
    .join("\n");

  assert.doesNotMatch(generatedText, /Your Sidebar Name/);
  assert.doesNotMatch(generatedText, /Red Brick University/);
});
