const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const site = path.join(root, "_site");

const existsInSite = (relativePath) => fs.existsSync(path.join(site, relativePath));

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return path.relative(site, fullPath);
  });
};

test("publish boundary excludes source-only maintenance artifacts", () => {
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
  const leakedFiles = walk(site).filter((relativePath) => {
    const fileName = path.basename(relativePath);
    return fileName.endsWith(".ipynb") || fileName.endsWith("-lock.json");
  });

  assert.deepEqual(leakedFiles, [], `Unexpected public files: ${leakedFiles.join(", ")}`);
});
