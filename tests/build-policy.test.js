const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const jobSection = (workflow, jobName, nextJobName) => {
  const startMarker = `  ${jobName}:`;
  const start = workflow.indexOf(startMarker);
  assert.notEqual(start, -1, `Missing ${jobName} job.`);

  if (!nextJobName) return workflow.slice(start);

  const end = workflow.indexOf(`  ${nextJobName}:`, start + startMarker.length);
  assert.notEqual(end, -1, `Missing ${nextJobName} job after ${jobName}.`);
  return workflow.slice(start, end);
};

test("GitHub workflows grant deployment credentials only to the deploy job", () => {
  const pages = read(".github/workflows/pages.yml");
  const siteCheck = read(".github/workflows/site-check.yml");
  const buildJob = jobSection(pages, "build", "deploy");
  const deployJob = jobSection(pages, "deploy");

  assert.match(pages, /^permissions:\n  contents: read\n/m);
  assert.doesNotMatch(pages, /^permissions:\n(?:  .*\n)*  pages: write\n/m);
  assert.doesNotMatch(pages, /^permissions:\n(?:  .*\n)*  id-token: write\n/m);
  assert.doesNotMatch(buildJob, /\n    permissions:\n(?:      .*\n)*(?:      pages: write|      id-token: write)/);
  assert.match(
    deployJob,
    /\n    permissions:\n      contents: read\n      pages: write\n      id-token: write\n/
  );
  assert.match(siteCheck, /^permissions:\n  contents: read\n/m);
});

test("Node builds use the committed lockfile and the supported runtime", () => {
  const pages = read(".github/workflows/pages.yml");
  const siteCheck = read(".github/workflows/site-check.yml");
  const packageJson = JSON.parse(read("package.json"));
  const packageLock = JSON.parse(read("package-lock.json"));
  const gitignore = read(".gitignore");

  for (const workflow of [pages, siteCheck]) {
    assert.match(workflow, /node-version: "22"/);
    assert.match(workflow, /run: npm ci/);
    assert.doesNotMatch(workflow, /run: npm install/);
  }

  assert.equal(packageJson.engines.node, ">=22");
  assert.equal(packageLock.packages[""].engines.node, ">=22");
  assert.doesNotMatch(gitignore, /^package-lock\.json$/m);
});

test("Ruby builds use a committed cross-platform dependency lock", () => {
  const gemfileLock = read("Gemfile.lock");
  const gitignore = read(".gitignore");
  const contributing = read("CONTRIBUTING.md");

  assert.doesNotMatch(gitignore, /^Gemfile\.lock$/m);
  assert.doesNotMatch(contributing, /does not commit `Gemfile\.lock`/);
  assert.match(gemfileLock, /PLATFORMS\n(?: {2}.+\n)* {2}ruby\n(?: {2}.+\n)* {2}x86_64-linux\n/);
  assert.match(gemfileLock, /BUNDLED WITH\n {3}2\.4\.22\n/);
});
